import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { clone as cloneSkinned } from "three/addons/utils/SkeletonUtils.js";

const pasture = document.querySelector("#pasture");

if (pasture && window.WebGLRenderingContext) {
  const host = document.createElement("div");
  host.className = "dolly-3d";
  host.setAttribute("aria-hidden", "true");
  pasture.append(host);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  host.append(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-3, 3, 2.4, -2.4, .01, 100);
  scene.add(new THREE.HemisphereLight(0xfff7dc, 0x4f7049, 2.8));
  const sun = new THREE.DirectionalLight(0xffe2a4, 3.2);
  sun.position.set(-4, 7, 8);
  scene.add(sun);

  // The canvas covers the whole pasture. Dolly's "home" spot is described as fractions of the
  // pasture so the layout can differ per breakpoint while the scene keeps the same look.
  const STAGE = {
    desktop: { x: .49, box: .79, bottom: .07, friend: { x: -2.4, y: .3, s: .86 } },
    phone: { x: .38, box: .64, bottom: .08, friend: { x: -1.3, y: .55, s: .78 } },
  };
  const MARGIN = .28;                                  // world units under the hooves inside the "box"
  const BARN = { x: .06, doorPx: 52.5, bottom: .24 };  // matches .barn / .barn i in styles.css
  const FACE_FRONT = -Math.PI / 2, FACE_SIDE = 0;
  const WALK_SECONDS = 3.2;
  const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  // A cow that can walk between two stage points {x, y, s} (s = scale, fakes depth) while
  // facing the way it is going, then turn toward a target heading when it stands still.
  class Walker {
    constructor(rig, walkAction) {
      this.rig = rig; this.walk = walkAction;
      this.moving = false; this.baseY = 0;
      this.heading = FACE_FRONT; this.headingTarget = FACE_FRONT;
      this.onDone = null;
    }
    go(from, to, seconds, onDone) {
      this.from = from; this.to = to; this.seconds = seconds; this.t = 0; this.onDone = onDone;
      this.moving = true; this.rig.visible = true;
      // Forward is +x in model space; growing scale = coming toward the camera.
      const dz = (to.s - from.s) * 2.4;
      this.heading = this.headingTarget = -Math.atan2(dz, to.x - from.x);
      this.walk?.reset().setEffectiveTimeScale(1.15).fadeIn(.2).play();
    }
    update(delta) {
      if (this.moving) {
        this.t = Math.min(1, this.t + delta / this.seconds);
        const k = ease(this.t), a = this.from, b = this.to;
        this.rig.position.x = a.x + (b.x - a.x) * k;
        this.baseY = a.y + (b.y - a.y) * k;
        this.rig.scale.setScalar(a.s + (b.s - a.s) * k);
        if (this.t >= 1) { this.moving = false; this.walk?.fadeOut(.35); this.onDone?.(); }
      }
      let diff = this.headingTarget - this.heading;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      this.heading += diff * Math.min(1, delta * 5.5);
      this.rig.rotation.y = this.heading;
    }
  }

  const rig = new THREE.Group();
  scene.add(rig);
  let model, mixer, eat, walkClip, udder, eyes = [], head, headRest, dolly;
  let size = null, frameHalf = 2.75, frameCenterY = 1.4, frameCenterX = 0, aspect = 1;
  let door = { x: -3, y: 1, s: .5 }, home = { x: 0, y: 0, s: 1 }, friendHome = { x: -2.4, y: .3, s: .86 };
  const clock = new THREE.Clock();

  // ---- Dolly's state ----------------------------------------------------------
  let state = "waiting";        // waiting → walking → front | side | leaving | inside
  let entered = false;          // "enter" was requested before the model finished loading
  let pendingEat = false, mood = null;   // mood: null | "sad" | "thirsty"
  let wantFront = true;                  // orientation the current step asked for (applied on arrival)
  let actionUntil = 0, badUntil = 0, happyUntil = 0, blinkAt = 2.5, blinkT = 1;
  let celebrateAt = 0, celebrating = false;
  let udderFull = false;        // evening milking: the udder swells until she is milked
  const CELEBRATE_MS = 3200;

  // ---- The friend cow ----------------------------------------------------------
  let friend = null;            // { rig, model, mixer, walker, state }

  function stageFor() {
    return innerWidth <= 800 ? STAGE.phone : STAGE.desktop;
  }

  function resize() {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    aspect = width / height;
    if (size) {
      const st = stageFor();
      const boxWorld = size.y + MARGIN * 2;            // the old framing box, in world units
      const cowFrac = st.box * size.y / boxWorld;      // cow height as a fraction of the pasture
      frameHalf = size.y / cowFrac / 2;
      // Never let her overflow the pasture horizontally on narrow screens.
      const widthFrac = size.x / (frameHalf * 2 * aspect);
      if (widthFrac > .92) frameHalf *= widthFrac / .92;
      const hoovesFrac = st.bottom + st.box * MARGIN / boxWorld;
      const yBottom = -hoovesFrac * frameHalf * 2;
      frameCenterY = yBottom + frameHalf;
      frameCenterX = (.5 - st.x) * frameHalf * 2 * aspect;
      const pxToWorld = frameHalf * 2 / height;
      const doorFrac = BARN.x + BARN.doorPx / width;
      door = { x: (doorFrac - st.x) * width * pxToWorld, y: (BARN.bottom - hoovesFrac) * height * pxToWorld, s: .5 };
      home = { x: 0, y: 0, s: 1 };
      friendHome = { ...st.friend };
    }
    camera.position.set(frameCenterX, frameCenterY + .8, 9);
    camera.lookAt(frameCenterX, frameCenterY, 0);
    camera.left = -frameHalf * aspect;
    camera.right = frameHalf * aspect;
    camera.top = frameHalf;
    camera.bottom = -frameHalf;
    camera.updateProjectionMatrix();
  }

  new GLTFLoader().load("assets/3d/dolly-eating.glb", (gltf) => {
    model = gltf.scene;
    model.scale.setScalar(1.24);
    model.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    size = box.getSize(new THREE.Vector3());
    model.position.set(-center.x, -box.min.y, -center.z); // hooves on the rig origin
    rig.add(model);

    udder = model.getObjectByName("Farm__udder");
    head = model.getObjectByName("head");
    headRest = head ? head.rotation.clone() : null;
    eyes = ["Farm__inset_eye_1", "Farm__inset_eye_-1"].map(n => model.getObjectByName(n)).filter(Boolean);
    eyes.forEach(eye => eye.userData.scaleY = eye.scale.y);

    mixer = new THREE.AnimationMixer(model);
    const eatClip = gltf.animations.find(item => item.name === "Eat");
    walkClip = gltf.animations.find(item => item.name === "Walk");
    if (eatClip) {
      eat = mixer.clipAction(eatClip);
      eat.setLoop(THREE.LoopOnce, 1);
      eat.clampWhenFinished = true;
    }
    const walk = walkClip ? mixer.clipAction(walkClip) : null;
    walk?.setLoop(THREE.LoopRepeat, Infinity);
    dolly = new Walker(rig, walk);

    rig.visible = false;
    if (new URLSearchParams(location.search).has("debug3d")) window.__dolly = { head, headRest, rig, model };
    pasture.classList.add("dolly-3d-ready");
    resize();
    if (entered || new URLSearchParams(location.search).has("previeweat")) beginEntrance();
  }, undefined, error => console.warn("Dolly 3D could not load; keeping the 2D fallback.", error));

  function beginEntrance() {
    if (!dolly || !(state === "waiting" || state === "inside")) return;
    state = "walking";
    mood = null;
    dolly.go(door, home, WALK_SECONDS, () => {
      state = wantFront ? "front" : "side";
      dolly.headingTarget = wantFront ? FACE_FRONT : FACE_SIDE;
      if (pendingEat) { pendingEat = false; turnAndEat(); }
    });
  }

  function goInside() {
    if (!dolly || state === "leaving" || state === "inside") return;
    state = "leaving";
    mood = null;
    if (eat) { eat.stop(); actionUntil = 0; }
    dolly.go(home, door, WALK_SECONDS * .9, () => { state = "inside"; rig.visible = false; });
  }

  function playEat() {
    if (!eat) return;
    eat.reset().setLoop(THREE.LoopOnce, 1).fadeIn(.12).play();
    actionUntil = performance.now() + 3000;
  }

  function turnAndEat() {
    if (state === "side") { playEat(); return; }
    if (state === "walking") { pendingEat = true; return; }
    if (state !== "front") return;
    state = "side";
    dolly.headingTarget = FACE_SIDE;
    setTimeout(playEat, 550);
  }

  function makeFriend() {
    if (friend || !model) return;
    const fModel = cloneSkinned(model);
    // A lighter, creamier coat so she reads as a different cow.
    fModel.traverse(obj => {
      if (!obj.isMesh || /eye|catchlight|horn|hoof/i.test(obj.name)) return;
      obj.material = obj.material.clone();
      if (obj.material.color) obj.material.color.lerp(new THREE.Color(0xf6e7c9), .42);
    });
    const fRig = new THREE.Group();
    fRig.position.z = -1.6;                 // stands a little behind Dolly
    fRig.add(fModel);
    scene.add(fRig);
    const fMixer = new THREE.AnimationMixer(fModel);
    const fWalk = walkClip ? fMixer.clipAction(walkClip) : null;
    fWalk?.setLoop(THREE.LoopRepeat, Infinity);
    friend = { rig: fRig, model: fModel, mixer: fMixer, walker: new Walker(fRig, fWalk), state: "inside" };
    fRig.visible = false;
  }

  function friendArrive() {
    makeFriend();
    if (!friend || friend.state !== "inside") return;
    friend.state = "walking";
    friend.walker.go({ ...door, y: door.y + .15 }, friendHome, WALK_SECONDS * 1.05, () => {
      friend.state = "here";
      friend.walker.headingTarget = FACE_SIDE;
      happyUntil = performance.now() + 700;
      window.dispatchEvent(new CustomEvent("dolly3d-event", { detail: "friend-arrived" }));
    });
  }

  function friendLeave() {
    if (!friend || friend.state === "inside") return;
    friend.state = "walking";
    friend.walker.go(friendHome, { ...door, y: door.y + .15 }, WALK_SECONDS, () => {
      friend.state = "inside";
      friend.rig.visible = false;
    });
  }

  window.addEventListener("dolly3d-action", event => {
    const what = event.detail;
    if (what === "enter") { entered = true; beginEntrance(); return; }
    if (!model) return;
    if (what === "return") beginEntrance();
    if (what === "shelter") goInside();
    if (what === "eat") turnAndEat();
    if (what === "front") { wantFront = true; mood = null; if (state === "side") { state = "front"; dolly.headingTarget = FACE_FRONT; } }
    if (what === "bad") badUntil = performance.now() + 900;
    if (what === "sad" || what === "thirsty") mood = what;
    if (what === "happy") { mood = null; if (!celebrating) happyUntil = performance.now() + 700; }
    if (what === "friend") friendArrive();
    if (what === "udder-full") udderFull = true;
    if (what === "udder-empty") udderFull = false;
    if (what === "friend-leave") friendLeave();
    if (what === "celebrate") {
      // Finale: face the camera, then a little dance (hops, sways and head tosses).
      if (eat) { eat.stop(); actionUntil = 0; }
      state = "front";
      mood = null;
      dolly.headingTarget = FACE_FRONT;
      celebrating = true;
      celebrateAt = performance.now() + 650; // wait for the turn before jumping
    }
    if (what === "idle") {
      // Care steps (cloth, iodine, milking) always work on her side.
      wantFront = false;
      if (state === "front") { state = "side"; dolly.headingTarget = FACE_SIDE; }
      if (eat) { eat.stop(); actionUntil = 0; }
      mood = null;
      rig.rotation.z = 0;
    }
  });

  // ---- udder tracking (CSS variables for the care targets) -----------------
  const udderBox = new THREE.Box3(), probe = new THREE.Vector3();
  let lastUdderKey = "";
  function publishUdder() {
    if (!udder || !rig.visible) return;
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    udderBox.setFromObject(udder);
    const toPx = (x, y, z) => {
      probe.set(x, y, z).project(camera);
      return [(probe.x + 1) / 2 * width + host.offsetLeft, (1 - probe.y) / 2 * height + host.offsetTop];
    };
    const cx = (udderBox.min.x + udderBox.max.x) / 2, cz = (udderBox.min.z + udderBox.max.z) / 2;
    const [x, bottom] = toPx(cx, udderBox.min.y, cz);
    const [, top] = toPx(cx, udderBox.max.y, cz);
    const [left] = toPx(udderBox.min.x, udderBox.min.y, cz);
    const [right] = toPx(udderBox.max.x, udderBox.min.y, cz);
    const w = right - left;
    const key = `${x | 0},${bottom | 0},${top | 0},${w | 0}`;
    if (key === lastUdderKey) return;
    lastUdderKey = key;
    pasture.style.setProperty("--udder-x", `${x.toFixed(1)}px`);
    pasture.style.setProperty("--udder-y", `${bottom.toFixed(1)}px`);
    pasture.style.setProperty("--udder-top", `${top.toFixed(1)}px`);
    pasture.style.setProperty("--udder-w", `${w.toFixed(1)}px`);
    // 1 = the size the targets were designed at (udder ~56px wide on desktop).
    pasture.style.setProperty("--cow-scale", (w / 56).toFixed(3));
    pasture.classList.add("udder-tracked");
  }

  // ---- frame loop -----------------------------------------------------------
  new ResizeObserver(resize).observe(host);

  function animate(now) {
    requestAnimationFrame(animate);
    const delta = Math.min(clock.getDelta(), .05);
    const t = now / 1000;
    mixer?.update(delta);
    friend?.mixer.update(delta);
    if (friend) {
      friend.walker.update(delta);
      friend.rig.position.y = friend.walker.baseY;
      friend.model.scale.set(1.24, 1.24 * (1 + Math.sin(t * 1.7 + 1) * .009), 1.24);
    }
    if (dolly && rig.visible) {
      if (now > actionUntil && eat?.isRunning()) eat.fadeOut(.2);
      dolly.update(delta);
      const walking = dolly.moving;
      if (!walking) {
        dolly.baseY = THREE.MathUtils.damp(dolly.baseY, home.y, 12, delta);
        rig.position.x = THREE.MathUtils.damp(rig.position.x, home.x, 6, delta);
        rig.scale.setScalar(THREE.MathUtils.damp(rig.scale.x, 1, 6, delta));
      }

      // Reactions.
      const bad = now < badUntil;
      const happy = Math.max(0, happyUntil - now) / 700;
      let hop = happy ? Math.sin(happy * Math.PI) * .35 : 0;
      let sway = 0, headToss = 0;
      if (celebrating) {
        const c = (now - celebrateAt) / CELEBRATE_MS;      // 0..1 over the dance
        if (c >= 0 && c < 1) {
          const fade = Math.sin(Math.min(1, c * 4) * Math.PI / 2) * (c > .8 ? (1 - c) / .2 : 1);
          hop += Math.abs(Math.sin(c * Math.PI * 4)) * .45 * fade;           // 4 hops
          sway = Math.sin(c * Math.PI * 4) * .12 * fade;                    // side-to-side lean
          headToss = Math.abs(Math.sin(c * Math.PI * 4 + .6)) * .35 * fade;  // head up on each hop
        } else if (c >= 1) celebrating = false;
      }
      rig.position.y = dolly.baseY + hop;
      rig.rotation.z = bad ? Math.sin(now * .035) * .055 : THREE.MathUtils.damp(rig.rotation.z, sway, 10, delta);

      // Idle life: breathing, a curious head and blinking. Moods drop the head.
      const idle = !walking && !(eat?.isRunning());
      const rate = mood === "thirsty" ? 4.2 : 2.1;
      const breathe = 1 + Math.sin(t * rate) * (mood === "thirsty" ? .012 : .009);
      model.scale.set(1.24, 1.24 * breathe, 1.24);
      if (head && headRest && idle) {
        const droop = mood === "sad" ? -.75 : mood === "thirsty" ? -.5 : 0;
        const lookX = mood ? Math.sin(t * .5) * .03 : Math.sin(t * .7) * .07 + Math.sin(t * 1.9) * .02;
        const lookY = mood ? 0 : Math.sin(t * .45 + 1) * .09;
        head.rotation.x = THREE.MathUtils.damp(head.rotation.x, headRest.x + lookX, 4, delta);
        head.rotation.y = THREE.MathUtils.damp(head.rotation.y, headRest.y + lookY, 4, delta);
        head.rotation.z = THREE.MathUtils.damp(head.rotation.z, headRest.z + headToss + droop, mood ? 3 : 12, delta);
      }
      if (udder) {
        const target = udderFull ? 1.32 : 1;
        const k = THREE.MathUtils.damp(udder.scale.x, target, 1.5, delta);
        udder.scale.setScalar(k);
      }
      if (eyes.length) {
        if (t > blinkAt) { blinkT = 0; blinkAt = t + (mood === "sad" ? 1.4 : 2.5) + Math.random() * 3; }
        blinkT = Math.min(1, blinkT + delta * 7);
        const open = blinkT < .5 ? 1 - blinkT * 2 : (blinkT - .5) * 2;
        const lid = mood === "sad" ? .7 : 1;
        eyes.forEach(eye => eye.scale.y = eye.userData.scaleY * (.12 + .88 * open) * lid);
      }
    }
    renderer.render(scene, camera);
    publishUdder();
  }
  requestAnimationFrame(animate);
}
