import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const container = document.querySelector("#scene");

if (container && typeof WebGLRenderingContext !== "undefined") {
  try {
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.className = "ruby-3d-canvas";
    renderer.domElement.setAttribute("aria-hidden", "true");
    container.append(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
    camera.position.set(0, 8, 210);
    camera.lookAt(0, 4, 0);

    scene.add(new THREE.HemisphereLight(0xfff8e7, 0x536349, 2.65));
    const key = new THREE.DirectionalLight(0xffe8bd, 3.15);
    key.position.set(-80, 125, 170);
    key.castShadow = true;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xd2e5ff, 1.05);
    rim.position.set(100, 40, 90);
    scene.add(rim);

    const material = (color, roughness = 0.76, metalness = 0) => new THREE.MeshStandardMaterial({ color, roughness, metalness });
    const mats = {
      coat: material(0xaa5634, 0.8), cream: material(0xf5e7c9, 0.88), dark: material(0x4b3026, 0.86),
      muzzle: material(0xe9a18c, 0.82), muzzleLight: material(0xf1b6a4, 0.86), horn: material(0xebd6a2, 0.72),
      eye: material(0x17130f, 0.3), hoof: material(0x2f2924, 0.94), gold: material(0xdca84b, 0.42, 0.18)
    };

    const ruby = new THREE.Group();
    ruby.rotation.x = -0.06;
    scene.add(ruby);

    const mesh = (geometry, mat, parent = ruby) => {
      const value = new THREE.Mesh(geometry, mat);
      value.castShadow = true;
      value.receiveShadow = true;
      parent.add(value);
      return value;
    };
    const ellipsoid = (scale, mat, position, parent = ruby, segments = 18) => {
      const value = mesh(new THREE.SphereGeometry(1, segments, Math.max(10, segments - 4)), mat, parent);
      value.scale.set(...scale);
      value.position.set(...position);
      return value;
    };
    const capsule = (radius, length, mat, position, rotation = [0, 0, 0], parent = ruby, segments = 10) => {
      const value = mesh(new THREE.CapsuleGeometry(radius, length, 5, segments), mat, parent);
      value.position.set(...position);
      value.rotation.set(...rotation);
      return value;
    };

    // Taller barrel, defined chest and hip: the silhouette stays clearly bovine.
    const body = ellipsoid([34, 18, 17], mats.coat, [-7, 10, 0], ruby, 20);
    body.rotation.z = -0.025;
    ellipsoid([17, 20, 17.3], mats.coat, [15, 10, 0], ruby, 18);
    ellipsoid([18, 19, 17.2], mats.coat, [-29, 10, 0], ruby, 18);
    ellipsoid([22, 5.2, 13], mats.cream, [-5, -4.5, 0], ruby, 16);

    const creamPatch = ellipsoid([9, 7, 1.05], mats.cream, [-20, 14, 17.05], ruby, 12);
    creamPatch.rotation.z = 0.24;
    const darkPatch = ellipsoid([7.5, 10, 1.08], mats.dark, [3, 12, 17.2], ruby, 12);
    darkPatch.rotation.z = -0.28;
    ellipsoid([5.4, 4.2, 1.05], mats.cream, [-32, 8, 16.3], ruby, 10).rotation.z = -0.2;

    const neck = new THREE.Group();
    neck.position.set(22, 12, 0);
    ruby.add(neck);
    capsule(9.2, 15, mats.coat, [1, 3, 0], [0, 0, -0.42], neck, 12);
    const headPivot = new THREE.Group();
    headPivot.position.set(10, 10, 0);
    neck.add(headPivot);
    const skull = ellipsoid([11.2, 15.2, 11.5], mats.cream, [0, 0, 0], headPivot, 18);
    skull.rotation.z = -0.12;
    ellipsoid([7, 5.4, 11.75], mats.coat, [-1.6, 9, 0], headPivot, 12).rotation.z = -0.18;
    ellipsoid([3.2, 4.7, 1.05], mats.coat, [4.3, 4.5, 11.4], headPivot, 10).rotation.z = -0.25;

    const muzzle = ellipsoid([10.3, 6.2, 12.7], mats.muzzle, [8.8, -6.4, 0], headPivot, 18);
    muzzle.rotation.z = -0.04;
    ellipsoid([7.8, 2.3, 12.85], mats.muzzleLight, [10, -8, 0], headPivot, 14);
    [-5.4, 5.4].forEach((z) => ellipsoid([1.15, .72, 1], mats.dark, [13.5, -5.9, z], headPivot, 8));

    const eyes = [];
    [-1, 1].forEach((side) => {
      const eye = ellipsoid([1.9, 2.7, 1.1], mats.eye, [5, 3.5, side * 10.75], headPivot, 12);
      ellipsoid([.56, .82, .4], mats.cream, [5.35, 4.35, side * 11.65], headPivot, 8);
      eyes.push(eye);
    });

    const ears = [];
    [-1, 1].forEach((side) => {
      const earPivot = new THREE.Group();
      earPivot.position.set(-2, 9.1, side * 9.2);
      headPivot.add(earPivot);
      const ear = ellipsoid([5.6, 2.15, 3.2], mats.coat, [-1.2, 0, side * 2.5], earPivot, 12);
      ear.rotation.x = side * 0.12;
      ears.push(earPivot);
      const horn = mesh(new THREE.ConeGeometry(1.65, 6.8, 10), mats.horn, headPivot);
      horn.position.set(-1.5, 14.2, side * 6.2);
      horn.rotation.z = -0.12;
    });

    const collar = mesh(new THREE.TorusGeometry(10.7, 1.05, 8, 24), mats.dark, neck);
    collar.position.set(4.2, -2.4, 0);
    collar.rotation.y = Math.PI / 2;
    const bellPivot = new THREE.Group();
    bellPivot.position.set(5, -12, 9.5);
    neck.add(bellPivot);
    const bell = mesh(new THREE.ConeGeometry(3.4, 5.6, 12), mats.gold, bellPivot);
    bell.rotation.z = Math.PI;

    const legs = [];
    [[-25, -2, 10], [-20, -2, -10], [15, -2, 10], [11, -2, -10]].forEach((position, index) => {
      const pivot = new THREE.Group();
      pivot.position.set(...position);
      ruby.add(pivot);
      capsule(3.2, 9.5, index === 1 ? mats.dark : mats.coat, [0, -6.5, 0], [0, 0, 0], pivot, 9);
      const knee = new THREE.Group();
      knee.position.y = -13;
      pivot.add(knee);
      ellipsoid([3, 2.8, 3.1], index === 1 ? mats.dark : mats.coat, [0, 0, 0], knee, 10);
      capsule(2.15, 9, mats.cream, [0.5, -6, 0], [0, 0, -0.06], knee, 9);
      const hoof = new THREE.Group();
      hoof.position.set(1.2, -12, 0);
      knee.add(hoof);
      [-1, 1].forEach((side) => {
        const toe = mesh(new THREE.BoxGeometry(3.1, 3.5, 3.25), mats.hoof, hoof);
        toe.position.set(1.1, 0, side * 1.85);
        toe.rotation.y = side * 0.09;
        toe.rotation.z = -0.1;
      });
      legs.push({ pivot, knee, hoof, phase: index === 0 || index === 3 ? 0 : Math.PI });
    });

    ellipsoid([8.2, 5, 7.2], mats.muzzle, [-5, -8.7, 0], ruby, 14);
    [-3.5, 3.5].forEach((x) => [-3.2, 3.2].forEach((z) => capsule(.72, 2.4, mats.muzzle, [x - 5, -14, z], [0, 0, 0], ruby, 7)));

    const tail = new THREE.Group();
    tail.position.set(-40, 16, 0);
    ruby.add(tail);
    capsule(1.15, 17, mats.coat, [-3.4, -8, 0], [0, 0, -.35], tail, 8);
    ellipsoid([3.3, 4.5, 3.3], mats.dark, [-7, -17.2, 0], tail, 10);

    const shadow = mesh(new THREE.CircleGeometry(35, 32), new THREE.MeshBasicMaterial({ color: 0x263526, transparent: true, opacity: .2, depthWrite: false }), ruby);
    shadow.scale.y = .22;
    shadow.position.set(-1, -29.8, -19);

    let importedModel = null;
    let importedMixer = null;
    let walkAction = null;
    let importedWalking = false;
    let commandedMoving = false;
    new GLTFLoader().load("assets/ruby.glb", (gltf) => {
      const model = gltf.scene;
      model.updateMatrixWorld(true);
      let bounds = new THREE.Box3().setFromObject(model);
      const size = bounds.getSize(new THREE.Vector3());
      model.scale.setScalar(98 / Math.max(size.x, .001));
      model.updateMatrixWorld(true);
      bounds = new THREE.Box3().setFromObject(model);
      const center = bounds.getCenter(new THREE.Vector3());
      model.position.x -= center.x;
      model.position.y += -29 - bounds.min.y;
      model.position.z -= center.z;
      model.traverse((child) => {
        if (!child.isMesh) return;
        child.castShadow = true;
        child.receiveShadow = true;
      });
      ruby.clear();
      ruby.add(model, shadow);
      ruby.rotation.x = 0;
      model.rotation.y = -Math.PI / 2;
      importedModel = model;
      importedMixer = new THREE.AnimationMixer(model);
      const walkClip = gltf.animations.find((clip) => clip.name === "Walk") || gltf.animations[0];
      if (walkClip) {
        walkAction = importedMixer.clipAction(walkClip);
        walkAction.setLoop(THREE.LoopRepeat, Infinity).play();
        walkAction.paused = true;
      }
    }, undefined, (error) => {
      console.warn("Ruby's production GLB could not load; using the procedural fallback.", error);
    });

    let width = 0, height = 0, currentX = 0, currentY = 0, targetX = 0, targetY = 0;
    let initialized = false, facing = 1, action = "idle", actionUntil = 0, lastTime = performance.now();

    function resize() {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, rect.width); height = Math.max(1, rect.height);
      renderer.setSize(width, height, false);
      camera.left = -width / 2; camera.right = width / 2; camera.top = height / 2; camera.bottom = -height / 2;
      camera.updateProjectionMatrix();
    }

    function readTarget() {
      const tile = container.querySelector(".tile.current");
      if (!tile) return;
      const sceneRect = container.getBoundingClientRect();
      const tileRect = tile.getBoundingClientRect();
      targetX = tileRect.left - sceneRect.left + tileRect.width / 2 - width / 2;
      targetX = THREE.MathUtils.clamp(targetX, -width / 2 + 62, width / 2 - 62);
      targetY = height / 2 - (tileRect.top - sceneRect.top + tileRect.height / 2) + 24;
      if (!initialized) { currentX = targetX; currentY = targetY; initialized = true; }
    }

    function setAction(next, duration = 1150) { action = next; actionUntil = performance.now() + duration; }
    function setMoving(value) { commandedMoving = Boolean(value); }
    window.Ruby3D = { setAction, setMoving };

    function animate(now) {
      requestAnimationFrame(animate);
      const delta = Math.min((now - lastTime) / 1000, .05); lastTime = now;
      readTarget();
      const dx = targetX - currentX, dy = targetY - currentY, distance = Math.hypot(dx, dy);
      const moving = distance > 1.2;
      if (Math.abs(dx) > 2) facing = dx > 0 ? 1 : -1;
      const ease = 1 - Math.pow(.032, delta);
      currentX += dx * ease; currentY += dy * ease;
      if (now > actionUntil) action = "idle";

      const activeMoving = moving || commandedMoving;
      const time = now / 1000, active = activeMoving ? "walk" : action;
      let bob = Math.sin(time * 1.65) * .7, jump = 0, pitch = 0, strideAmount = .035;
      if (active === "walk") { strideAmount = .62; bob = Math.abs(Math.sin(time * 7.3)) * 4.5; }
      else if (active === "celebrate" || active === "arrived") {
        const phase = Math.min(1, Math.max(0, 1 - (actionUntil - now) / 1150));
        jump = Math.abs(Math.sin(phase * Math.PI * 2)) * 26; pitch = Math.sin(phase * Math.PI * 2) * .08;
      } else if (active === "sad") pitch = -.1;

      if (importedModel) {
        const shouldWalk = activeMoving || ((active === "celebrate" || active === "arrived") && now < actionUntil);
        if (walkAction && shouldWalk !== importedWalking) {
          importedWalking = shouldWalk;
          walkAction.paused = !shouldWalk;
          if (!shouldWalk) walkAction.time = 0;
        }
        if (walkAction) walkAction.timeScale = activeMoving ? .56 : .7;
        importedMixer?.update(delta);
        const targetTurn = activeMoving ? 0 : -Math.PI / 2;
        importedModel.rotation.y = THREE.MathUtils.damp(importedModel.rotation.y, targetTurn, 7, delta);
        bob = 0;
        jump = 0;
        pitch = 0;
      }

      ruby.position.set(currentX, currentY + bob + jump, 0);
      ruby.scale.set(1.22 * facing, 1.22, 1.22);
      ruby.rotation.z = pitch;
      if (!importedModel) {
        legs.forEach((leg) => {
          const stride = Math.sin(time * (active === "walk" ? 7.3 : 1.65) + leg.phase) * strideAmount;
          leg.pivot.rotation.z = stride;
          leg.knee.rotation.z = active === "walk" ? Math.max(-.1, -stride * .72) : 0;
          leg.hoof.rotation.z = active === "walk" ? stride * .25 : 0;
        });
        tail.rotation.z = -.25 + Math.sin(time * 2.5) * .24;
        ears[0].rotation.x = Math.sin(time * 1.8) * .09;
        ears[1].rotation.x = -Math.sin(time * 1.8) * .09;
        neck.rotation.z = active === "sad" ? -.16 : Math.sin(time * 1.45) * .018;
        const blinkPhase = time % 4.7;
        const blink = blinkPhase < .16 ? Math.sin(blinkPhase / .16 * Math.PI) : 0;
        eyes.forEach((eye) => { eye.scale.y = 2.7 * (1 - blink * .9); });
        body.scale.y = 18 * (1 + Math.sin(time * 1.65) * .009);
        bellPivot.rotation.x = Math.sin(time * (active === "walk" ? 7.3 : 2)) * (active === "walk" ? .34 : .06);
      }
      shadow.material.opacity = .2 * Math.max(.25, 1 - jump / 40);
      shadow.scale.set(1 - jump / 90, .22 - jump / 320, 1);
      renderer.render(scene, camera);
    }

    resize();
    new ResizeObserver(resize).observe(container);
    container.classList.add("ruby-3d-ready");
    container.querySelector(":scope > .cow-token")?.remove();
    requestAnimationFrame(animate);
  } catch (error) {
    console.warn("Ruby 3D could not start; using the illustrated fallback.", error);
  }
}
