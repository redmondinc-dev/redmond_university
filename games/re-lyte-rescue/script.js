const ELECTROLYTES = [
  { id: "sodium", label: "Sodium", symbol: "Na", perScoop: 810 },
  { id: "potassium", label: "Potassium", symbol: "K", perScoop: 400 },
  { id: "magnesium", label: "Magnesium", symbol: "Mg", perScoop: 50 },
  { id: "calcium", label: "Calcium", symbol: "Ca", perScoop: 60 },
];
const TRAINING_PROFILES = [
  {
    name: "Jonny",
    context: "Soccer practice day",
    scoops: 1,
    message: "Practice day. I need one scoop.",
  },
  {
    name: "Jonny",
    context: "Long warehouse shift",
    scoops: 2,
    message: "Long shift. Count two scoops today.",
  },
  {
    name: "Jonny",
    context: "Hot trail afternoon",
    scoops: 3,
    message: "Big heat day. I need three scoops.",
  },
];

const SIP_POWER = [22, 30, 38, 46, 54];
const CHARACTER_STATES = [
  {
    id: "dehydrated",
    src: "../../assets/imgs/png/re-lyte-rescue/johnny-hydration-1.png",
    alt: "Dehydrated Johnny looking tired",
  },
  {
    id: "thirsty",
    src: "../../assets/imgs/png/re-lyte-rescue/johnny-hydration-2.png",
    alt: "Thirsty Johnny asking for water",
  },
  {
    id: "recovering",
    src: "../../assets/imgs/png/re-lyte-rescue/johnny-hydration-3.png",
    alt: "Johnny beginning to recover hydration",
  },
  {
    id: "retaining",
    src: "../../assets/imgs/png/re-lyte-rescue/johnny-hydration-4.png",
    alt: "Johnny retaining hydration and smiling",
  },
  {
    id: "hydrated",
    src: "../../assets/imgs/png/re-lyte-rescue/johnny-hydration-5.png",
    alt: "Fully hydrated Johnny celebrating",
  },
];
const reducedMotionQuery = window.matchMedia
  ? window.matchMedia("(prefers-reduced-motion: reduce)")
  : { matches: false };

const refs = {
  instruction: document.getElementById("instruction-text"),
  missionStatus: document.getElementById("mission-status"),
  bubble: document.getElementById("bubble-text"),
  profileIndex: document.getElementById("profile-index"),
  profileName: document.getElementById("profile-name"),
  profileContext: document.getElementById("profile-context"),
  targetScoops: document.getElementById("target-scoops"),
  targetMinerals: {
    sodium: document.getElementById("target-sodium"),
    potassium: document.getElementById("target-potassium"),
    magnesium: document.getElementById("target-magnesium"),
    calcium: document.getElementById("target-calcium"),
  },
  hydrationLabel: document.getElementById("hydration-label"),
  hydrationFill: document.getElementById("hydration-fill"),
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
  characterSprite: document.getElementById("character-sprite"),
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
  checklistAmounts: Array.from(document.querySelectorAll(".check-mg")),
  missionSteps: Array.from(document.querySelectorAll(".mission-step")),
};

let state = createInitialState();
let hydrationFrame = 0;
let scheduledTimers = [];
let toastTimer = 0;
let audioContext = null;

function createInitialState(profileIndex = 0) {
  const profile = TRAINING_PROFILES[profileIndex];
  return {
    profileIndex,
    scoops: 0,
    amounts: ELECTROLYTES.reduce((entries, electrolyte) => {
      entries[electrolyte.id] = 0;
      return entries;
    }, {}),
    hydration: 0,
    displayHydration: 0,
    puddle: 0,
    isDrinking: false,
    rescued: false,
    instruction: `Match ${profile.name}'s daily target: ${formatScoops(profile.scoops)} or the equivalent electrolyte mg.`,
    message: profile.message,
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatScoops(count) {
  return `${count} ${count === 1 ? "scoop" : "scoops"}`;
}

function formatMg(value) {
  return `${value}mg`;
}

function getCurrentProfile() {
  return TRAINING_PROFILES[state.profileIndex];
}

function getTargetAmount(id) {
  const electrolyte = ELECTROLYTES.find((entry) => entry.id === id);
  return electrolyte.perScoop * getCurrentProfile().scoops;
}

function getTotalTarget() {
  return ELECTROLYTES.reduce((total, electrolyte) => total + getTargetAmount(electrolyte.id), 0);
}

function getTotalAmount() {
  return ELECTROLYTES.reduce((total, electrolyte) => total + state.amounts[electrolyte.id], 0);
}

function getElectrolyteProgress(id) {
  return clamp(state.amounts[id] / getTargetAmount(id), 0, 1);
}

function getMixProgressPercent() {
  const progress =
    ELECTROLYTES.reduce((total, electrolyte) => total + getElectrolyteProgress(electrolyte.id), 0) /
    ELECTROLYTES.length;
  return Math.round(progress * 100);
}

function getMixAccuracy() {
  const totalError = ELECTROLYTES.reduce((total, electrolyte) => {
    const target = getTargetAmount(electrolyte.id);
    return total + Math.abs(target - state.amounts[electrolyte.id]);
  }, 0);
  return clamp(Math.round(100 - (totalError / getTotalTarget()) * 100), 0, 100);
}

function hasAnyElectrolytes() {
  return getTotalAmount() > 0;
}

function getElectrolyteCount() {
  return ELECTROLYTES.filter((electrolyte) => state.amounts[electrolyte.id] >= getTargetAmount(electrolyte.id))
    .length;
}

function hasAllElectrolytes() {
  return getElectrolyteCount() === ELECTROLYTES.length;
}

function getLeakLevel() {
  const progress = getMixProgressPercent() / 100;
  return clamp(1 - progress * 0.98, 0.02, 1);
}

function getRetentionPercent() {
  return Math.round(18 + (getMixProgressPercent() / 100) * 78);
}

function getLeakRiskLabel() {
  return `${getMixAccuracy()}%`;
}

function getMissionPhase() {
  if (state.rescued) return "Hydrated";
  if (hasAllElectrolytes()) return "Serve water";
  if (hasAnyElectrolytes()) return "Measure mix";
  return "Study target";
}

function getRescueScore() {
  const accuracyScore = getMixAccuracy() * 7;
  const scoopScore = Math.min(state.scoops, getCurrentProfile().scoops) * 75;
  const leakPenalty = Math.round(state.puddle * 1.8);
  const rescueBonus = state.rescued ? 160 : 0;
  return Math.max(0, accuracyScore + scoopScore + rescueBonus - leakPenalty);
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
  const progress = getMixProgressPercent();

  if (progress === 0) return "No mix measured yet.";
  if (progress < 50) return "Still missing most of the daily target.";
  if (progress < 100) return "Close. Finish the remaining scoop or mg targets.";
  return "Daily target matched. Serve water to complete the round.";
}

function getMood() {
  if (state.hydration >= 95 && hasAllElectrolytes()) return "thriving";
  if (state.hydration >= 55 || getElectrolyteCount() >= 3) return "happy";
  if (state.hydration >= 18 || getElectrolyteCount() >= 1) return "neutral";
  return "sad";
}

function getCharacterState() {
  const count = getElectrolyteCount();
  const hydration = state.displayHydration;

  if (state.rescued || (hydration >= 95 && hasAllElectrolytes())) return CHARACTER_STATES[4];
  if (count >= 3 || hydration >= 62) return CHARACTER_STATES[3];
  if (count >= 2 || hydration >= 34) return CHARACTER_STATES[2];
  if (count >= 1 || hydration > 0 || state.puddle > 0) return CHARACTER_STATES[1];
  return CHARACTER_STATES[0];
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

function setCharacterSpriteSource(src, alt, stateId) {
  if (!refs.characterSprite) return;
  if (refs.characterSprite.getAttribute("src") !== src) {
    refs.characterSprite.setAttribute("src", src);
  }
  refs.characterSprite.alt = alt;
  refs.characterSprite.dataset.state = stateId;
}

function updateSceneClasses() {
  const leakLevel = getLeakLevel();
  const characterState = getCharacterState();

  refs.character.dataset.mood = getMood();
  refs.character.dataset.state = characterState.id;
  refs.character.classList.toggle("is-rescued", state.rescued);
  refs.character.classList.toggle("is-energized", hasAllElectrolytes());
  refs.character.style.setProperty("--leak-opacity", String(0.22 + leakLevel * 0.78));
  refs.character.style.setProperty("--leak-scale", String(0.22 + leakLevel * 0.78));
  refs.character.style.setProperty("--leak-height", `${12 + leakLevel * 72}px`);

  if (refs.characterSprite && refs.characterSprite.dataset.state !== characterState.id) {
    setCharacterSpriteSource(characterState.src, characterState.alt, characterState.id);
  }
}

function renderProfile() {
  const profile = getCurrentProfile();
  refs.profileIndex.textContent = `${state.profileIndex + 1} / ${TRAINING_PROFILES.length}`;
  refs.profileName.textContent = profile.name;
  refs.profileContext.textContent = profile.context;
  refs.targetScoops.textContent = formatScoops(profile.scoops);

  ELECTROLYTES.forEach((electrolyte) => {
    refs.targetMinerals[electrolyte.id].textContent =
      `${electrolyte.symbol} ${formatMg(getTargetAmount(electrolyte.id))}`;
  });
}

function renderChecklist() {
  refs.electrolyteButtons.forEach((button) => {
    const id = button.dataset.electrolyte;
    const active = state.amounts[id] > 0;
    const complete = state.amounts[id] >= getTargetAmount(id);
    button.classList.toggle("is-active", active);
    button.classList.toggle("is-complete", complete);
    button.disabled = state.rescued || complete;
    button.setAttribute("aria-pressed", String(active));
  });

  refs.checklistItems.forEach((item) => {
    const id = item.dataset.check;
    const active = state.amounts[id] > 0;
    const complete = state.amounts[id] >= getTargetAmount(id);
    item.classList.toggle("is-active", active);
    item.classList.toggle("is-complete", complete);
  });

  refs.checklistAmounts.forEach((item) => {
    const id = item.dataset.mg;
    item.textContent = `${formatMg(state.amounts[id])} / ${formatMg(getTargetAmount(id))}`;
  });

  refs.electrolyteCount.textContent = `${getElectrolyteCount()} / ${ELECTROLYTES.length} met`;
}

function renderMissionState() {
  const score = getRescueScore();
  const phase = getMissionPhase();
  const profile = getCurrentProfile();

  refs.missionStatus.textContent = phase;
  refs.retentionValue.textContent = `${state.scoops} / ${profile.scoops}`;
  refs.leakValue.textContent = getLeakRiskLabel();
  refs.rescueScore.textContent = `${score} pts`;
  refs.arenaPhase.textContent = phase;
  refs.arenaRetention.textContent = formatScoops(profile.scoops);

  refs.missionSteps.forEach((step) => {
    const stepName = step.dataset.step;
    const targetRead = hasAnyElectrolytes() || state.hydration > 0 || state.rescued;
    const electrolytesComplete = hasAllElectrolytes();
    const rescueComplete = state.rescued;

    step.classList.toggle(
      "is-complete",
      (stepName === "water" && targetRead) ||
        (stepName === "electrolytes" && electrolytesComplete) ||
        (stepName === "rescue" && rescueComplete)
    );
    step.classList.toggle(
      "is-active",
      (stepName === "water" && !targetRead) ||
        (stepName === "electrolytes" && targetRead && !electrolytesComplete) ||
        (stepName === "rescue" && electrolytesComplete && !rescueComplete)
    );
  });
}

function renderHydrationVisuals() {
  const shownHydration = clamp(Math.max(state.displayHydration, getMixProgressPercent()), 0, 100);
  const puddleScaleX = 0.18 + state.puddle / 70;
  const puddleScaleY = 0.14 + state.puddle / 160;

  refs.hydrationFill.style.width = `${shownHydration}%`;
  refs.hydrationLabel.textContent = `${Math.round(shownHydration)}%`;
  if (refs.bellyFill) refs.bellyFill.style.height = `${shownHydration}%`;
  refs.puddle.style.opacity = String(0.12 + state.puddle / 120);
  refs.puddle.style.transform = `translateX(-50%) scale(${puddleScaleX}, ${puddleScaleY})`;
}

function render() {
  refs.instruction.textContent = state.instruction;
  refs.bubble.textContent = state.message;
  refs.shortcutBtn.disabled = state.rescued || hasAllElectrolytes();

  renderProfile();
  updateSceneClasses();
  renderMissionState();
  renderChecklist();
  renderHydrationVisuals();
}

function settleAtFullHydration() {
  if (state.rescued) return;
  const profile = getCurrentProfile();
  state.hydration = 100;
  state.rescued = true;
  state.instruction = `${profile.name}'s daily target is matched: ${formatScoops(profile.scoops)} and the right mg totals.`;
  state.message = "Daily target matched!";
  animateHydration(100, 500);
  burstSparkles(18);
  pulseCharacter("is-celebrating", 900);
  showToast("Daily target matched. Hydration rescue complete.");
  playTone("victory");
  render();
  queue(showVictoryOverlay, 1040);
}

function finishDrink() {
  state.isDrinking = false;
  refs.scene.classList.remove("is-drinking", "is-shortcut");

  if (hasAllElectrolytes() && state.hydration >= 86) {
    settleAtFullHydration();
    return;
  }

  if (hasAllElectrolytes()) {
    state.instruction = "The daily target is measured. Serve one more cup to finish.";
    state.message = "Target ready. Water please!";
  } else if (hasAnyElectrolytes()) {
    state.instruction = "Keep matching the scoop or mg targets before serving water.";
    state.message = `${getMixProgressPercent()}% of the target is measured.`;
  } else {
    state.instruction = `Start with ${formatScoops(getCurrentProfile().scoops)} or the matching electrolyte mg.`;
    state.message = getCurrentProfile().message;
  }

  render();
}

// Each sip first spikes the bar, then settles back to the retained amount to
// visualize the water leaking out before the body hangs on to what it can.
function drinkWater() {
  if (state.isDrinking || state.rescued) return;

  const count = getElectrolyteCount();
  const leakLevel = getLeakLevel();
  const retention = getRetentionPercent() / 100;
  const sipPower = hasAllElectrolytes() ? 120 : SIP_POWER[count];
  const netGain = Math.round(sipPower * retention);
  const previewLoss = Math.round(leakLevel * 18) + 4;
  const previewHydration = clamp(state.hydration + netGain + previewLoss, 0, 100);
  const retainedHydration = hasAllElectrolytes()
    ? 100
    : clamp(state.hydration + netGain, 0, 100);
  const puddleDelta = hasAllElectrolytes() ? -12 : Math.round(leakLevel * 26);

  state.isDrinking = true;
  refs.scene.classList.add("is-drinking");
  playTone("water");

  if (count === 0) {
    state.instruction = "Water helps, but the daily electrolyte target is still empty.";
    state.message = "I still need the mix.";
    showToast("Measure the Re-Lyte scoop or mg target first.");
  } else if (hasAllElectrolytes()) {
    state.instruction = "Target matched. Water completes the hydration rescue.";
    state.message = "That is the right mix!";
    showToast("Daily mix matched. Serving water.");
  } else {
    state.instruction = "Partial mix measured. Finish the remaining mg targets.";
    state.message = `${getMixProgressPercent()}% measured so far.`;
    showToast(`${getMixProgressPercent()}% of the daily target measured.`);
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

const ELECTROLYTE_SYMBOLS = ELECTROLYTES.reduce((symbols, electrolyte) => {
  symbols[electrolyte.id] = electrolyte.symbol;
  return symbols;
}, {});

function launchElectrolyte(id, button) {
  const buttonRect = button.getBoundingClientRect();
  const sceneRect = refs.scene.getBoundingClientRect();
  const charRect = refs.character.getBoundingClientRect();

  const startX = buttonRect.left + buttonRect.width / 2 - sceneRect.left;
  const startY = buttonRect.top + buttonRect.height / 2 - sceneRect.top;
  const endX = charRect.left + charRect.width / 2 - sceneRect.left;
  const endY = charRect.top + charRect.height * 0.35 - sceneRect.top;

  const dx = endX - startX;
  const dy = endY - startY;
  const midX = dx * 0.5;
  const midY = dy * 0.5 - Math.abs(dx) * 0.45;

  const pill = document.createElement("div");
  pill.className = `electrolyte-pill pill-${id}`;
  pill.textContent = ELECTROLYTE_SYMBOLS[id] || "";
  pill.style.left = `${startX}px`;
  pill.style.top = `${startY}px`;
  pill.style.setProperty("--dx", `${dx}px`);
  pill.style.setProperty("--dy", `${dy}px`);
  pill.style.setProperty("--mid-x", `${midX}px`);
  pill.style.setProperty("--mid-y", `${midY}px`);

  refs.scene.appendChild(pill);
  queue(() => pill.remove(), 700);
}

function addElectrolyte(id, button) {
  if (state.isDrinking || state.rescued) return;

  const electrolyte = ELECTROLYTES.find((entry) => entry.id === id);
  const target = getTargetAmount(id);
  if (state.amounts[id] >= target) return;

  state.amounts[id] = Math.min(target, state.amounts[id] + electrolyte.perScoop);
  if (button) launchElectrolyte(id, button);
  pulseCharacter("is-popping", 420);
  playTone("mineral");

  if (hasAllElectrolytes()) {
    state.instruction = "Daily scoop and mg target matched. Serve water to complete the rescue.";
    state.message = "The mix is right!";
    burstSparkles(12);
    showToast("All electrolyte mg targets matched.");
  } else {
    state.instruction = `${electrolyte.label} is now ${formatMg(state.amounts[id])} of ${formatMg(target)}.`;
    state.message = `${electrolyte.symbol} counted. Keep matching the target.`;
    burstSparkles(7);
    showToast(`${electrolyte.label} +${formatMg(electrolyte.perScoop)}.`);
  }

  render();
}

function addScoop() {
  if (state.isDrinking || hasAllElectrolytes()) return;

  if (state.rescued) {
    state.instruction = "This person's daily target is already matched.";
    state.message = "Target complete!";
    burstSparkles(10);
    render();
    return;
  }

  state.scoops = Math.min(getCurrentProfile().scoops, state.scoops + 1);
  ELECTROLYTES.forEach((electrolyte) => {
    state.amounts[electrolyte.id] = Math.min(
      getTargetAmount(electrolyte.id),
      state.amounts[electrolyte.id] + electrolyte.perScoop
    );
  });

  state.instruction = `${formatScoops(state.scoops)} measured. Target is ${formatScoops(getCurrentProfile().scoops)}.`;
  state.message = hasAllElectrolytes()
    ? "Scoop target matched. Water please!"
    : `${formatScoops(getCurrentProfile().scoops - state.scoops)} to go.`;
  refs.shortcutBtn.classList.add("is-firing");
  showToast(`Re-Lyte +1 scoop: ${ELECTROLYTES.map((entry) => `${entry.symbol} ${formatMg(entry.perScoop)}`).join(", ")}.`);
  playTone("shortcut");
  burstSparkles(hasAllElectrolytes() ? 18 : 10);
  pulseCharacter("is-popping", 420);
  render();

  queue(() => refs.shortcutBtn.classList.remove("is-firing"), 900);
}

function resetGame() {
  const profileIndex = state.profileIndex;
  clearQueuedWork();
  refs.scene.querySelectorAll(".electrolyte-pill").forEach((el) => el.remove());
  refs.scene.classList.remove("is-drinking", "is-shortcut");
  refs.character.classList.remove("is-popping", "is-celebrating", "is-rescued");
  refs.shortcutBtn.classList.remove("is-firing");
  refs.sparkleLayer.innerHTML = "";
  hideVictoryOverlay();
  state = createInitialState(profileIndex);
  render();
}

function advanceProfile() {
  const nextProfileIndex = (state.profileIndex + 1) % TRAINING_PROFILES.length;
  clearQueuedWork();
  refs.scene.querySelectorAll(".electrolyte-pill").forEach((el) => el.remove());
  refs.scene.classList.remove("is-drinking", "is-shortcut");
  refs.character.classList.remove("is-popping", "is-celebrating", "is-rescued");
  refs.shortcutBtn.classList.remove("is-firing");
  refs.sparkleLayer.innerHTML = "";
  hideVictoryOverlay();
  state = createInitialState(nextProfileIndex);
  render();
}

function showVictoryOverlay() {
  if (!refs.victoryOverlay) return;
  const profile = getCurrentProfile();
  refs.victoryScore.textContent = `${getRescueScore()} pts`;
  refs.victoryCopy.textContent = `${profile.name}'s target was ${formatScoops(profile.scoops)}: Na ${formatMg(getTargetAmount("sodium"))}, K ${formatMg(getTargetAmount("potassium"))}, Mg ${formatMg(getTargetAmount("magnesium"))}, Ca ${formatMg(getTargetAmount("calcium"))}.`;
  refs.overlayReplayBtn.textContent =
    state.profileIndex === TRAINING_PROFILES.length - 1 ? "Start over" : "Next person";
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
  button.addEventListener("click", () => addElectrolyte(button.dataset.electrolyte, button));
});

refs.shortcutBtn.addEventListener("click", addScoop);
refs.resetBtn.addEventListener("click", resetGame);
refs.overlayReplayBtn.addEventListener("click", advanceProfile);

if (reducedMotionQuery.addEventListener) {
  reducedMotionQuery.addEventListener("change", () => {
    render();
  });
} else if (reducedMotionQuery.addListener) {
  reducedMotionQuery.addListener(() => {
    render();
  });
}

CHARACTER_STATES.map(({ src }) => src).forEach((src) => {
  const image = new Image();
  image.src = src;
});

render();
