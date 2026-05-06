const ELECTROLYTES = [
  { id: "sodium", label: "Sodium" },
  { id: "potassium", label: "Potassium" },
  { id: "magnesium", label: "Magnesium" },
  { id: "calcium", label: "Calcium" },
];

const RETENTION_FACTORS = [0.18, 0.38, 0.58, 0.78, 0.96];
const LEAK_LEVELS = [1, 0.72, 0.45, 0.2, 0.02];
const SIP_POWER = [22, 30, 38, 46, 54];

const refs = {
  instruction: document.getElementById("instruction-text"),
  missionStatus: document.getElementById("mission-status"),
  bubble: document.getElementById("bubble-text"),
  hydrationLabel: document.getElementById("hydration-label"),
  hydrationFill: document.getElementById("hydration-fill"),
  retentionCopy: document.getElementById("retention-copy"),
  retentionValue: document.getElementById("retention-value"),
  leakValue: document.getElementById("leak-value"),
  rescueScore: document.getElementById("rescue-score"),
  arenaPhase: document.getElementById("arena-phase"),
  arenaRetention: document.getElementById("arena-retention"),
  electrolyteCount: document.getElementById("electrolyte-count"),
  bellyFill: document.getElementById("belly-fill"),
  puddle: document.getElementById("puddle"),
  scene: document.getElementById("scene"),
  character: document.getElementById("character"),
  sparkleLayer: document.getElementById("sparkle-layer"),
  actionToast: document.getElementById("action-toast"),
  victoryOverlay: document.getElementById("victory-overlay"),
  victoryScore: document.getElementById("victory-score"),
  victoryCopy: document.getElementById("victory-copy"),
  overlayReplayBtn: document.getElementById("overlay-replay-btn"),
  resetBtn: document.getElementById("reset-btn"),
  shortcutBtn: document.getElementById("shortcut-btn"),
  waterButtons: Array.from(document.querySelectorAll(".water-control")),
  electrolyteButtons: Array.from(document.querySelectorAll(".electrolyte-btn")),
  checklistItems: Array.from(document.querySelectorAll(".checklist-item")),
  missionSteps: Array.from(document.querySelectorAll(".mission-step")),
};

let state = createInitialState();
let hydrationFrame = 0;
let scheduledTimers = [];
let toastTimer = 0;
let audioContext = null;

function createInitialState() {
  return {
    hydration: 0,
    displayHydration: 0,
    activeElectrolytes: [],
    puddle: 0,
    isDrinking: false,
    rescued: false,
    instruction: "Stabilize hydration by pairing water with electrolytes.",
    message: "I'm so thirsty!",
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getElectrolyteCount() {
  return state.activeElectrolytes.length;
}

function hasAllElectrolytes() {
  return getElectrolyteCount() === ELECTROLYTES.length;
}

function getLeakLevel() {
  return LEAK_LEVELS[getElectrolyteCount()];
}

function getRetentionPercent() {
  return Math.round(RETENTION_FACTORS[getElectrolyteCount()] * 100);
}

function getLeakRiskLabel() {
  const count = getElectrolyteCount();
  if (count === 0) return "Critical";
  if (count === 1) return "High";
  if (count === 2) return "Moderate";
  if (count === 3) return "Low";
  return "Sealed";
}

function getMissionPhase() {
  if (state.rescued) return "Rescued";
  if (hasAllElectrolytes() && state.hydration >= 86) return "Stabilizing";
  if (hasAllElectrolytes()) return "Final sip";
  if (getElectrolyteCount() > 0) return "Build mix";
  if (state.puddle > 0 || state.hydration > 0) return "Add minerals";
  return "Stabilize";
}

function getRescueScore() {
  const hydrationScore = Math.round(state.hydration * 6);
  const electrolyteScore = getElectrolyteCount() * 95;
  const leakPenalty = Math.round(state.puddle * 1.8);
  const rescueBonus = state.rescued ? 160 : 0;
  return Math.max(0, hydrationScore + electrolyteScore + rescueBonus - leakPenalty);
}

function ensureAudioContext() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!audioContext || audioContext.state === "closed") {
    audioContext = new AudioCtx();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }
  return audioContext;
}

function playTone(type) {
  const ctx = ensureAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  const tones = {
    water: [420, 540],
    mineral: [660, 880],
    shortcut: [520, 720],
    victory: [523, 659],
  };
  const [startFrequency, endFrequency] = tones[type] || tones.water;
  const duration = type === "victory" ? 0.42 : 0.18;

  oscillator.type = type === "water" ? "sine" : "triangle";
  oscillator.frequency.setValueAtTime(startFrequency, now);
  oscillator.frequency.exponentialRampToValueAtTime(endFrequency, now + duration);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(2200, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(type === "victory" ? 0.13 : 0.08, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  oscillator.connect(filter).connect(gain).connect(ctx.destination);
  oscillator.start(now);
  oscillator.stop(now + duration + 0.04);
}

function getRetentionCopy() {
  const count = getElectrolyteCount();

  if (count === 0) return "Big leak. Almost everything becomes puddle.";
  if (count === 1) return "A little better. The leak is still pretty dramatic.";
  if (count === 2) return "Middle ground. More water is finally sticking around.";
  if (count === 3) return "Almost sealed up. Just a small leak remains.";
  return "Tiny or no leak. Water can actually stay put now.";
}

function getMood() {
  if (state.hydration >= 95 && hasAllElectrolytes()) return "thriving";
  if (state.hydration >= 55 || getElectrolyteCount() >= 3) return "happy";
  if (state.hydration >= 18 || getElectrolyteCount() >= 1) return "neutral";
  return "sad";
}

function animateHydration(target, duration = 700) {
  cancelAnimationFrame(hydrationFrame);

  const start = state.displayHydration;
  const delta = target - start;
  const startTime = performance.now();

  function step(now) {
    const progress = clamp((now - startTime) / duration, 0, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    state.displayHydration = start + delta * eased;
    render();

    if (progress < 1) {
      hydrationFrame = requestAnimationFrame(step);
      return;
    }

    state.displayHydration = target;
    render();
  }

  hydrationFrame = requestAnimationFrame(step);
}

function queue(callback, delay) {
  const timerId = window.setTimeout(() => {
    scheduledTimers = scheduledTimers.filter((entry) => entry !== timerId);
    callback();
  }, delay);

  scheduledTimers.push(timerId);
  return timerId;
}

function clearQueuedWork() {
  scheduledTimers.forEach((timerId) => clearTimeout(timerId));
  scheduledTimers = [];
  cancelAnimationFrame(hydrationFrame);
  if (toastTimer) {
    clearTimeout(toastTimer);
    toastTimer = 0;
  }
}

function showToast(message) {
  if (!refs.actionToast) return;
  refs.actionToast.textContent = message;
  refs.actionToast.classList.add("is-visible");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    refs.actionToast.classList.remove("is-visible");
    toastTimer = 0;
  }, 1700);
}

function burstSparkles(total = 14) {
  refs.sparkleLayer.innerHTML = "";

  for (let index = 0; index < total; index += 1) {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";
    sparkle.style.setProperty("--x", `${8 + Math.random() * 84}%`);
    sparkle.style.setProperty("--y", `${8 + Math.random() * 72}%`);
    sparkle.style.setProperty("--size", `${10 + Math.random() * 16}px`);
    sparkle.style.setProperty("--delay", `${Math.random() * 0.18}s`);
    sparkle.style.setProperty("--duration", `${0.9 + Math.random() * 0.45}s`);
    refs.sparkleLayer.appendChild(sparkle);
  }

  queue(() => {
    refs.sparkleLayer.innerHTML = "";
  }, 1600);
}

function pulseCharacter(className, duration) {
  refs.character.classList.add(className);
  queue(() => refs.character.classList.remove(className), duration);
}

function updateSceneClasses() {
  const leakLevel = getLeakLevel();

  refs.character.dataset.mood = getMood();
  refs.character.classList.toggle("is-energized", hasAllElectrolytes());
  refs.character.style.setProperty("--leak-opacity", String(0.22 + leakLevel * 0.78));
  refs.character.style.setProperty("--leak-scale", String(0.22 + leakLevel * 0.78));
  refs.character.style.setProperty("--leak-height", `${12 + leakLevel * 72}px`);
}

function renderChecklist() {
  refs.electrolyteButtons.forEach((button) => {
    const active = state.activeElectrolytes.includes(button.dataset.electrolyte);
    button.classList.toggle("is-active", active);
    button.disabled = active;
    button.setAttribute("aria-pressed", String(active));
  });

  refs.checklistItems.forEach((item) => {
    const active = state.activeElectrolytes.includes(item.dataset.check);
    item.classList.toggle("is-active", active);
  });

  refs.electrolyteCount.textContent = `${getElectrolyteCount()} / ${ELECTROLYTES.length}`;
}

function renderMissionState() {
  const score = getRescueScore();
  const phase = getMissionPhase();
  const retention = `${getRetentionPercent()}%`;

  refs.missionStatus.textContent = phase;
  refs.retentionValue.textContent = retention;
  refs.leakValue.textContent = getLeakRiskLabel();
  refs.rescueScore.textContent = `${score} pts`;
  refs.arenaPhase.textContent = phase;
  refs.arenaRetention.textContent = retention;

  refs.missionSteps.forEach((step) => {
    const stepName = step.dataset.step;
    const waterComplete = state.puddle > 0 || state.hydration > 0 || getElectrolyteCount() > 0;
    const electrolytesComplete = hasAllElectrolytes();
    const rescueComplete = state.rescued;

    step.classList.toggle(
      "is-complete",
      (stepName === "water" && waterComplete) ||
        (stepName === "electrolytes" && electrolytesComplete) ||
        (stepName === "rescue" && rescueComplete)
    );
    step.classList.toggle(
      "is-active",
      (stepName === "water" && !waterComplete) ||
        (stepName === "electrolytes" && waterComplete && !electrolytesComplete) ||
        (stepName === "rescue" && electrolytesComplete && !rescueComplete)
    );
  });
}

function renderHydrationVisuals() {
  const shownHydration = clamp(state.displayHydration, 0, 100);
  const puddleScaleX = 0.18 + state.puddle / 70;
  const puddleScaleY = 0.14 + state.puddle / 160;

  refs.hydrationFill.style.width = `${shownHydration}%`;
  refs.hydrationLabel.textContent = `${Math.round(shownHydration)}%`;
  refs.bellyFill.style.height = `${shownHydration}%`;
  refs.puddle.style.opacity = String(0.12 + state.puddle / 120);
  refs.puddle.style.transform = `translateX(-50%) scale(${puddleScaleX}, ${puddleScaleY})`;
}

function render() {
  refs.instruction.textContent = state.instruction;
  refs.bubble.textContent = state.message;
  refs.retentionCopy.textContent = getRetentionCopy();
  refs.shortcutBtn.disabled = state.rescued;

  updateSceneClasses();
  renderMissionState();
  renderChecklist();
  renderHydrationVisuals();
}

function settleAtFullHydration() {
  if (state.rescued) return;
  state.hydration = 100;
  state.rescued = true;
  state.instruction = "Rescue complete. Hydration is stabilized.";
  state.message = "Rescue complete!";
  animateHydration(100, 500);
  burstSparkles(18);
  pulseCharacter("is-celebrating", 900);
  showToast("Rescue complete: hydration stabilized.");
  playTone("victory");
  render();
  queue(showVictoryOverlay, 520);
}

function finishDrink() {
  state.isDrinking = false;
  refs.scene.classList.remove("is-drinking", "is-shortcut");

  if (hasAllElectrolytes() && state.hydration >= 86) {
    settleAtFullHydration();
    return;
  }

  if (hasAllElectrolytes()) {
    state.instruction = "All four electrolytes are active. One more sip will finish it.";
    state.message = "Almost there!";
  } else if (getElectrolyteCount() > 0) {
    state.instruction = "Try water again or add the next electrolyte.";
    state.message = "That sip stayed a little better.";
  }

  render();
}

// Each sip first spikes the bar, then settles back to the retained amount to
// visualize the water leaking out before the body hangs on to what it can.
function drinkWater(options = {}) {
  if (state.isDrinking || state.rescued) return;

  const count = options.forceCount ?? getElectrolyteCount();
  const leakLevel = LEAK_LEVELS[count];
  const retention = RETENTION_FACTORS[count];
  const sipPower = options.shortcut ? 120 : SIP_POWER[count];
  const netGain = Math.round(sipPower * (options.shortcut ? 1 : retention));
  const previewLoss = Math.round(leakLevel * 18) + 4;
  const previewHydration = clamp(state.hydration + netGain + previewLoss, 0, 100);
  const retainedHydration = clamp(state.hydration + netGain, 0, 100);
  const puddleDelta = options.shortcut ? -12 : Math.round(leakLevel * 26);

  state.isDrinking = true;
  refs.scene.classList.add("is-drinking");
  playTone(options.shortcut ? "shortcut" : "water");

  if (options.shortcut) {
    refs.scene.classList.add("is-shortcut");
    state.instruction = "Re-Lyte shortcut activated. All four electrolytes hit at once.";
    state.message = "All the key electrolytes, all at once.";
  } else if (count === 0) {
    state.instruction = "Water alone is slipping right through. Add electrolytes one by one.";
    state.message = "Water alone goes right through me!";
    showToast("Water added. Retention is low without electrolytes.");
  } else if (count === ELECTROLYTES.length) {
    state.instruction = "Now the leak is tiny. Watch that hydration climb.";
    state.message = "This is way better!";
    showToast("Full electrolyte mix active. Water retention boosted.");
  } else {
    state.instruction = "Leak reduced. Add more electrolytes or try another sip.";
    state.message = "Okay, that stayed in a little longer.";
    showToast(`${getRetentionPercent()}% retention active.`);
  }

  animateHydration(previewHydration, 520);
  render();

  queue(() => {
    state.hydration = retainedHydration;
    state.puddle = clamp(state.puddle + puddleDelta, 0, 100);
    animateHydration(retainedHydration, 860);
    render();
  }, 560);

  queue(finishDrink, 1450);
}

function addElectrolyte(id) {
  if (state.isDrinking || state.rescued || state.activeElectrolytes.includes(id)) return;

  const electrolyte = ELECTROLYTES.find((entry) => entry.id === id);
  state.activeElectrolytes = [...state.activeElectrolytes, id];
  pulseCharacter("is-popping", 420);
  playTone("mineral");

  if (hasAllElectrolytes()) {
    state.instruction = "All four electrolytes are active. Give him another drink.";
    state.message = "Ready for a real hydration win!";
    burstSparkles(12);
    showToast("Complete electrolyte profile unlocked.");
  } else {
    state.instruction = `${electrolyte.label} added. The leak will shrink on the next sip.`;
    state.message = `${electrolyte.label} is helping.`;
    burstSparkles(7);
    showToast(`${electrolyte.label} added. Leak risk reduced.`);
  }

  render();
}

// Re-Lyte is the shortcut: activate everything immediately, then trigger a
// strong drink so the player sees the final state without clicking four items.
function useShortcut() {
  if (state.isDrinking) return;

  if (state.rescued) {
    state.instruction = "Already fully hydrated. Hit replay to run it again.";
    state.message = "Fully hydrated!";
    burstSparkles(10);
    render();
    return;
  }

  state.activeElectrolytes = ELECTROLYTES.map(({ id }) => id);
  state.instruction = "Re-Lyte shortcut activated. All four electrolytes hit at once.";
  state.message = "All the key electrolytes, all at once.";
  refs.shortcutBtn.classList.add("is-firing");
  showToast("Re-Lyte shortcut: all electrolytes activated.");
  playTone("shortcut");
  burstSparkles(22);
  pulseCharacter("is-popping", 420);
  render();

  queue(() => refs.shortcutBtn.classList.remove("is-firing"), 900);
  queue(() => drinkWater({ shortcut: true, forceCount: ELECTROLYTES.length }), 170);
}

function resetGame() {
  clearQueuedWork();
  refs.scene.classList.remove("is-drinking", "is-shortcut");
  refs.character.classList.remove("is-popping", "is-celebrating");
  refs.shortcutBtn.classList.remove("is-firing");
  refs.sparkleLayer.innerHTML = "";
  hideVictoryOverlay();
  state = createInitialState();
  render();
}

function showVictoryOverlay() {
  if (!refs.victoryOverlay) return;
  refs.victoryScore.textContent = `${getRescueScore()} pts`;
  refs.victoryCopy.textContent =
    state.puddle > 45
      ? "You recovered the rescue after a leaky start. Re-Lyte delivered the key electrolytes and stabilized hydration."
      : "Clean rescue. The full electrolyte mix helped water stay where it belongs.";
  refs.victoryOverlay.classList.add("is-visible");
  refs.victoryOverlay.setAttribute("aria-hidden", "false");
}

function hideVictoryOverlay() {
  if (!refs.victoryOverlay) return;
  refs.victoryOverlay.classList.remove("is-visible");
  refs.victoryOverlay.setAttribute("aria-hidden", "true");
}

refs.waterButtons.forEach((button) => {
  button.addEventListener("click", () => drinkWater());
});

refs.electrolyteButtons.forEach((button) => {
  button.addEventListener("click", () => addElectrolyte(button.dataset.electrolyte));
});

refs.shortcutBtn.addEventListener("click", useShortcut);
refs.resetBtn.addEventListener("click", resetGame);
refs.overlayReplayBtn.addEventListener("click", resetGame);

render();
