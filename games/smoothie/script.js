const recipes = {
  "strawberry-flax": {
    name: "Strawberry Flax",
    completedColor: [255, 130, 170],
    ingredients: [
      { id: "milk", name: "Milk", measure: "6 oz", image: "assets/milk.png" },
      { id: "maple", name: "Maple Syrup", measure: "1.5 tbsp", image: "assets/maple-syrup.png" },
      { id: "flax", name: "Flax Seeds", measure: "2 tbsp", image: "assets/flax-seeds.png" },
      { id: "almond", name: "Almond Butter", measure: "2 tbsp", image: "assets/almond-butter.png" },
      { id: "strawberries", name: "Frozen Strawberries", measure: "3/4 cup", image: "assets/strawberries.png" },
      { id: "protein", name: "Protein Powder", measure: "1 scoop", image: "assets/protein-powder.png" },
      { id: "ice", name: "Ice", measure: "1/2 cup", image: "assets/ice.png" },
    ],
  },
  "tropical-ginger": {
    name: "Tropical Ginger",
    completedColor: [247, 175, 55],
    ingredients: [
      { id: "orange-juice", name: "Orange Juice", measure: "6 oz", image: "assets/orange-juice.png" },
      { id: "ginger", name: "Ginger", measure: "1 tbsp", image: "assets/ginger.png" },
      { id: "honey", name: "Honey", measure: "3 tbsp", image: "assets/honey.png" },
      { id: "mango", name: "Frozen Mango", measure: "1/2 cup", image: "assets/mango.png" },
      { id: "pineapple", name: "Frozen Pineapple", measure: "1/2 cup", image: "assets/pineapple.png" },
      { id: "ice", name: "Ice", measure: "3/4 cup", image: "assets/ice.png" },
    ],
  },
};

let activeRecipeId = "strawberry-flax";
let ingredients = recipes[activeRecipeId].ingredients;
let requiredIds = ingredients.map(({ id }) => id);
let correctOrder = [...requiredIds];

const LAYER_HEIGHT = 24;
const BLEND_DURATION_MS = 5000;
const blendContent = document.querySelector(".blend-content");
const dropzone = document.getElementById("dropzone");
const jarInner = document.querySelector(".jar-inner");
const dropText = document.querySelector(".drop-text");
const lid = document.querySelector(".lid");
const startBtn = document.getElementById("start-btn");
const carousel = document.getElementById("carousel");
const resetBtn = document.getElementById("reset-btn");
const prevBtn = document.querySelector(".carousel-btn.prev");
const nextBtn = document.querySelector(".carousel-btn.next");
const ingredientWarning = document.getElementById("ingredient-warning");
const warningCopy = ingredientWarning?.querySelector(".warning-copy");
const recipeTitle = document.getElementById("recipe-title");
const recipeButtons = document.querySelectorAll(".recipe-btn");
let isBlending = false;
let addedIngredients = [];
let audioCtx;
let blendTimeoutId = null;
let activeOscillator = null;
let floatingIngredients = [];
let isLidOpen = false;
let lidCloseTimeout = null;
let warningTimeoutId = null;
const ingredientColors = {
  almond: [210, 170, 120],
  maple: [230, 140, 70],
  flax: [185, 160, 90],
  strawberries: [255, 95, 130],
  milk: [245, 245, 255],
  ice: [200, 230, 255],
  protein: [235, 222, 194],
  "orange-juice": [255, 174, 45],
  ginger: [218, 180, 105],
  honey: [244, 173, 45],
  mango: [255, 184, 43],
  pineapple: [255, 217, 76],
};

function createIngredientCard({ id, name, measure, image }) {
  const card = document.createElement("div");
  card.className = "card";
  card.draggable = true;
  card.dataset.id = id;

  const photoFrame = document.createElement("div");
  photoFrame.className = "ingredient-photo-frame";

  const photo = document.createElement("img");
  photo.className = "ingredient-photo";
  photo.src = image;
  photo.alt = name;
  photo.draggable = false;
  photoFrame.append(photo);

  const title = document.createElement("h3");
  title.textContent = name;

  card.append(photoFrame, title);

  if (measure) {
    const measureEl = document.createElement("p");
    measureEl.textContent = measure;
    card.append(measureEl);
  }

  card.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.setData("image", image);
    e.dataTransfer.setData("label", name);
  });

  return card;
}

function renderIngredientCards() {
  carousel.innerHTML = "";
  ingredients.forEach((ingredient) => {
    const card = createIngredientCard(ingredient);
    carousel.appendChild(card);
  });
}

renderIngredientCards();

function selectRecipe(recipeId) {
  if (!recipes[recipeId] || recipeId === activeRecipeId) return;

  activeRecipeId = recipeId;
  ingredients = recipes[activeRecipeId].ingredients;
  requiredIds = ingredients.map(({ id }) => id);
  correctOrder = [...requiredIds];
  recipeTitle.textContent = recipes[activeRecipeId].name;

  recipeButtons.forEach((button) => {
    const isActive = button.dataset.recipe === activeRecipeId;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  resetGame();
  renderIngredientCards();
  carousel.scrollLeft = 0;
}

recipeButtons.forEach((button) => {
  button.addEventListener("click", () => selectRecipe(button.dataset.recipe));
});

function setLidOpen(open) {
  if (!lid) return;
  if (lidCloseTimeout) {
    clearTimeout(lidCloseTimeout);
    lidCloseTimeout = null;
  }

  isLidOpen = open;
  if (isLidOpen) {
    lid.classList.remove("lid-closing");
    dropzone.classList.add("lid-open");
    dropzone.classList.remove("lid-locked");
    lid.setAttribute("aria-pressed", "true");
  } else {
    lid.classList.add("lid-closing");
    lid.setAttribute("aria-pressed", "false");
    dropzone.classList.add("lid-locked");
    lidCloseTimeout = setTimeout(() => {
      lid.classList.remove("lid-closing");
      dropzone.classList.remove("lid-open");
      dropzone.classList.remove("lid-locked");
      lidCloseTimeout = null;
    }, 520);
  }
}

lid?.addEventListener("click", () => setLidOpen(!isLidOpen));
lid?.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    setLidOpen(!isLidOpen);
  }
});

function addLayer(id) {
  const layer = document.createElement("div");
  layer.className = `layer ${id}`;
  layer.style.height = "0px";
  blendContent.appendChild(layer);

  requestAnimationFrame(() => {
    layer.style.height = `${LAYER_HEIGHT}px`;
    layer.style.transform = `translateY(${Math.random() * 4}px) scaleX(${
      0.96 + Math.random() * 0.07
    })`;
  });
}

function addFloatingIngredient(image, name) {
  const float = document.createElement("img");
  float.classList.add("ingredient-inside");
  float.src = image;
  float.alt = "";
  float.setAttribute("aria-hidden", "true");
  float.title = name;

  float.style.left = `${12 + Math.random() * 72}%`;
  float.style.bottom = `${12 + Math.random() * 60}%`;

  blendContent.appendChild(float);
  floatingIngredients.push(float);
}

dropzone.addEventListener("dragover", (e) => {
  if (!isLidOpen) {
    dropzone.classList.add("lid-locked");
    dropText.textContent = "Lid closed: open it to add";
    return;
  }
  e.preventDefault();
  dropzone.classList.add("dragover");
});

dropzone.addEventListener("dragleave", () => {
  dropzone.classList.remove("dragover", "lid-locked");
});

dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.classList.remove("dragover");

  if (!isLidOpen) {
    dropzone.classList.add("lid-locked");
    setTimeout(() => dropzone.classList.remove("lid-locked"), 800);
    dropText.textContent = "Open the lid to add ingredients";
    alert("Please open the lid before adding ingredients.");
    return;
  }

  const ingredientId = e.dataTransfer.getData("text/plain");
  const ingredient = ingredients.find(({ id }) => id === ingredientId);

  if (!ingredient || addedIngredients.includes(ingredientId)) {
    alert("That ingredient is already inside or not valid.");
    return;
  }

  hideIngredientWarning();

  const card = document.querySelector(`[data-id="${ingredientId}"]`);
  card.classList.add("used");
  card.setAttribute("draggable", "false");

  flyToBlender(ingredient.image, e);
  addLayer(ingredientId);
  addFloatingIngredient(ingredient.image, ingredient.name);

  addedIngredients.push(ingredientId);

  const requiredCount = addedIngredients.filter((id) =>
    requiredIds.includes(id)
  ).length;
  if (requiredCount === requiredIds.length) {
    dropzone.classList.add("ready");
    dropText.textContent = "Tap the button to blend";
  } else {
    dropText.textContent = `Added ${requiredCount}/${requiredIds.length} required`;
  }
});

function flyToBlender(image, dropEvent) {
  const fly = document.createElement("img");
  fly.classList.add("fly-ingredient");
  fly.src = image;
  fly.alt = "";
  fly.setAttribute("aria-hidden", "true");
  document.body.appendChild(fly);

  const jarRect = jarInner.getBoundingClientRect();
  const startX = dropEvent.clientX || 0;
  const startY = dropEvent.clientY || 0;

  const tx = jarRect.left + jarRect.width / 2 - startX;
  const ty = jarRect.top + jarRect.height * 0.45 - startY;

  fly.style.left = `${startX}px`;
  fly.style.top = `${startY}px`;
  fly.style.setProperty("--tx", `${tx}px`);
  fly.style.setProperty("--ty", `${ty}px`);

  setTimeout(() => fly.remove(), 700);
}

function startBlend() {
  if (isBlending) return;
  if (isLidOpen) {
    dropText.textContent = "Close the lid to start";
    alert("Close the lid before turning on the blender.");
    return;
  }
  isBlending = true;
  const requiredComplete = requiredIds.every((id) =>
    addedIngredients.includes(id)
  );
  dropText.textContent = requiredComplete
    ? "Blending..."
    : "Blending (missing required ingredients)...";
  dropzone.classList.add("blending");
  playBlendSound(BLEND_DURATION_MS);
  renderSmoothieFill(false, { durationMs: BLEND_DURATION_MS, reveal: true });
  fadeOutFloatingIngredients();
  fadeOutLayers(BLEND_DURATION_MS);

  if (blendTimeoutId) clearTimeout(blendTimeoutId);
  blendTimeoutId = setTimeout(() => {
    dropzone.classList.remove("blending");
    const isCorrect = isSequenceCorrect();
    renderSmoothieFill(requiredComplete && isCorrect, {
      durationMs: 900,
      reveal: false,
    });

    if (requiredComplete && isCorrect) {
      dropText.textContent = "Smoothie completed!";
      launchConfetti();
    } else {
      let message = "Check: ";
      if (!requiredComplete) message += "required ingredients are missing. ";
      if (!isCorrect) message += "the order is incorrect.";
      const summary = message.trim();
      dropText.textContent = summary;
      alert(summary);
    }
    isBlending = false;
    blendTimeoutId = null;
  }, BLEND_DURATION_MS);
}

startBtn?.addEventListener("click", startBlend);
resetBtn.addEventListener("click", resetGame);

function scrollCarousel(direction) {
  const cardWidth = 170; // card width + gap
  carousel.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
}

prevBtn.addEventListener("click", () => scrollCarousel(-1));
nextBtn.addEventListener("click", () => scrollCarousel(1));

function isSequenceCorrect() {
  const orderMap = new Map();
  correctOrder.forEach((id, idx) => orderMap.set(id, idx));

  let lastIndex = -1;
  for (const id of addedIngredients) {
    const idx = orderMap.get(id);
    if (idx === undefined) return false;
    if (idx <= lastIndex) return false;
    lastIndex = idx;
  }

  return requiredIds.every((id) => addedIngredients.includes(id));
}

function playBlendSound(durationMs = 5000) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  if (!audioCtx) audioCtx = new AudioCtx();
  if (audioCtx.state === "suspended") audioCtx.resume();

  if (activeOscillator) {
    try {
      activeOscillator.stop();
    } catch {}
    activeOscillator = null;
  }

  const oscillator = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  oscillator.type = "sawtooth";
  oscillator.frequency.setValueAtTime(85, audioCtx.currentTime);

  gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.12, audioCtx.currentTime + 0.15);
  gain.gain.exponentialRampToValueAtTime(
    0.05,
    audioCtx.currentTime + durationMs / 1000 - 0.2
  );
  gain.gain.linearRampToValueAtTime(
    0.0001,
    audioCtx.currentTime + durationMs / 1000
  );

  oscillator.connect(gain).connect(audioCtx.destination);
  oscillator.start();
  oscillator.stop(audioCtx.currentTime + durationMs / 1000);

  activeOscillator = oscillator;
  oscillator.onended = () => {
    if (activeOscillator === oscillator) activeOscillator = null;
  };
}

function resetGame() {
  if (blendTimeoutId) {
    clearTimeout(blendTimeoutId);
    blendTimeoutId = null;
  }
  if (activeOscillator) {
    try {
      activeOscillator.stop();
    } catch {}
    activeOscillator = null;
  }

  isBlending = false;
  addedIngredients = [];
  dropzone.classList.remove("blending", "ready");
  dropText.textContent = "Drop here";
  hideIngredientWarning();
  blendContent.innerHTML = "";
  floatingIngredients = [];
  setLidOpen(false);

  document.querySelectorAll(".card").forEach((card) => {
    card.classList.remove("used");
    card.setAttribute("draggable", "true");
  });
}

function showIngredientWarning(message) {
  if (!ingredientWarning || !warningCopy) return;

  if (warningTimeoutId) {
    clearTimeout(warningTimeoutId);
    warningTimeoutId = null;
  }

  warningCopy.textContent = message;
  ingredientWarning.hidden = false;
  ingredientWarning.classList.remove("is-visible");
  dropzone.classList.add("ingredient-rejected");

  requestAnimationFrame(() => {
    ingredientWarning.classList.add("is-visible");
  });

  warningTimeoutId = setTimeout(() => {
    hideIngredientWarning();
  }, 3200);
}

function hideIngredientWarning() {
  if (warningTimeoutId) {
    clearTimeout(warningTimeoutId);
    warningTimeoutId = null;
  }
  if (!ingredientWarning) return;

  ingredientWarning.classList.remove("is-visible");
  dropzone.classList.remove("ingredient-rejected");
  ingredientWarning.hidden = true;
}

function fadeOutFloatingIngredients() {
  floatingIngredients.forEach((node, idx) => {
    const delay = idx * 120;
    setTimeout(() => node.classList.add("fade-out"), delay);
    setTimeout(() => node.remove(), delay + 1400);
  });
  floatingIngredients = [];
}

function renderSmoothieFill(
  isCompleted = false,
  { durationMs = 800, reveal = false } = {}
) {
  let fill = blendContent.querySelector(".smoothie-fill");
  if (!fill) {
    fill = document.createElement("div");
    fill.className = "smoothie-fill";
    blendContent.prepend(fill);
  }
  fill.classList.toggle("completed", isCompleted);

  let rgb = getBlendColor(addedIngredients);
  const recipeTone = recipes[activeRecipeId].completedColor;
  const targetTone = isCompleted ? recipeTone : blendTowards(recipeTone, [255, 255, 255], 0.18);
  rgb = blendTowards(rgb, targetTone, isCompleted ? 0.55 : 0.25);

  const top = adjustColor(rgb, 22);
  const bottom = adjustColor(rgb, -28);
  fill.style.setProperty("--smoothie-top", toRgba(top, 0.94));
  fill.style.setProperty("--smoothie-bottom", toRgba(bottom, 0.98));

  const totalForHeight = Math.max(requiredIds.length, addedIngredients.length);
  const maxFillHeight = Math.max(180, blendContent.clientHeight - 10);
  const targetHeight = Math.max(
    44,
    Math.min(
      maxFillHeight,
      (addedIngredients.length / totalForHeight) * maxFillHeight
    )
  );
  const heightDuration = Math.min(durationMs, 1200);
  fill.style.transition = `height ${heightDuration}ms ease, background 0.6s ease, opacity ${durationMs}ms ease`;

  if (reveal) {
    fill.style.opacity = "0";
    requestAnimationFrame(() => {
      fill.style.height = `${targetHeight}px`;
      fill.style.opacity = "1";
    });
  } else {
    fill.style.opacity = "1";
    requestAnimationFrame(() => {
      fill.style.height = `${targetHeight}px`;
    });
  }
}

function launchConfetti() {
  const colors = [
    "#f7b267",
    "#f25f5c",
    "#70c1b3",
    "#ffe066",
    "#247ba0",
    "#b5179e",
  ];
  const total = 220;
  const duration = 6 + Math.random() * 2;
  const words = ["Congrats!"];

  for (let i = 0; i < total; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti";
    const color = colors[i % colors.length];
    const left = Math.random() * 100;
    const delay = Math.random() * 0.3;
    const travel = (Math.random() - 0.5) * 60; // x drift
    const start = -8 - Math.random() * 70; // vh

    piece.style.background = color;
    piece.style.left = `${left}vw`;
    piece.style.setProperty("--duration", `${duration + Math.random()}s`);
    piece.style.setProperty("--x", `${travel}vw`);
    piece.style.setProperty("--start", `${start}vh`);
    piece.style.animationDelay = `${delay}s`;

    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), (duration + 3) * 1000);
  }

  words.forEach((text, idx) => {
    const word = document.createElement("div");
    word.className = "confetti-word";
    word.textContent = text;
    const left = 50;
    const wordDuration = duration + 1 + Math.random();
    const delay = idx * 0.1;
    const travel = 0;
    const start = -12 - Math.random() * 10;

    word.style.left = `${left}vw`;
    word.style.setProperty("--duration", `${wordDuration}s`);
    word.style.setProperty("--x", `${travel}vw`);
    word.style.setProperty("--start", `${start}vh`);
    word.style.animationDelay = `${delay}s`;

    document.body.appendChild(word);
    setTimeout(() => word.remove(), (wordDuration + 2) * 1000);
  });
}

function getBlendColor(ids) {
  if (!ids.length) return [248, 201, 212];
  const total = ids.reduce(
    (acc, id) => {
      const c = ingredientColors[id] || [220, 200, 200];
      acc[0] += c[0];
      acc[1] += c[1];
      acc[2] += c[2];
      return acc;
    },
    [0, 0, 0]
  );
  return total.map((v) => v / ids.length);
}

function adjustColor(rgb, delta) {
  return rgb.map((v) => Math.min(255, Math.max(0, v + delta)));
}

function toRgba(rgb, alpha = 1) {
  const [r, g, b] = rgb.map(Math.round);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function blendTowards(base, target, weight = 0.3) {
  const w = Math.min(1, Math.max(0, weight));
  return base.map((v, i) => v * (1 - w) + target[i] * w);
}

function fadeOutLayers(durationMs = 800) {
  const layers = Array.from(blendContent.querySelectorAll(".layer"));
  const trans = `opacity ${durationMs}ms ease, filter ${durationMs}ms ease`;
  layers.forEach((layer) => {
    layer.style.transition = trans;
    layer.classList.add("fade-out");
  });
  setTimeout(() => layers.forEach((layer) => layer.remove()), durationMs + 180);
}
