(function () {
  "use strict";

  const STORAGE_KEY = "relyte-electrolyte-matching-v2";

  const pairs = [
    {
      id: "sodium",
      name: "Sodium",
      symbol: "Na",
      image: "../../assets/imgs/hydration-cards/Na.png",
      alt: "Sodium electrolyte character",
      description: "Helps maintain fluid balance and supports nerve and muscle function.",
      cue:
        "Hydration is not just about water. Blood is full of minerals, especially sodium, and those minerals need to be replenished with fluids.",
    },
    {
      id: "chloride",
      name: "Chloride",
      symbol: "Cl",
      image: "../../assets/imgs/hydration-cards/Cl.png",
      alt: "Chloride electrolyte character",
      description: "Works with sodium to support hydration and digestion.",
      cue:
        "Fluids and electrolytes work together for true hydration, especially when everyday life keeps using minerals up.",
    },
    {
      id: "potassium",
      name: "Potassium",
      symbol: "K",
      image: "../../assets/imgs/hydration-cards/K.png",
      alt: "Potassium electrolyte character",
      description: "Helps balance fluids and supports muscle and heart function.",
      cue:
        "Complementary electrolytes like potassium help maintain proper fluid distribution inside and outside of cells.",
    },
    {
      id: "magnesium",
      name: "Magnesium",
      symbol: "Mg",
      image: "../../assets/imgs/hydration-cards/Mg.png",
      alt: "Magnesium electrolyte character",
      description: "Supports energy production, relaxation, and cellular processes.",
      cue:
        "Electrolytes facilitate electrical impulses in the body, supporting everyday function beyond hard workouts.",
    },
    {
      id: "calcium",
      name: "Calcium",
      symbol: "Ca",
      image: "../../assets/imgs/hydration-cards/Ca.png",
      alt: "Calcium electrolyte character",
      description: "Supports muscle movement, nerve signaling, and bone health.",
      cue:
        "You can find electrolytes in foods like fruits and vegetables, nuts, and dairy, not only in supplements.",
    },
  ];

  const johnnyFrames = [
    {
      src: "../../assets/imgs/png/re-lyte-rescue/johnny-hydration-1.png",
      alt: "Johnny needs hydration",
      label: "Ready",
      copy: "Start by choosing an electrolyte.",
    },
    {
      src: "../../assets/imgs/png/re-lyte-rescue/johnny-hydration-2.png",
      alt: "Johnny is getting thirsty",
      label: "Started",
      copy: "One electrolyte is in place.",
    },
    {
      src: "../../assets/imgs/png/re-lyte-rescue/johnny-hydration-3.png",
      alt: "Johnny is recovering hydration",
      label: "Recovering",
      copy: "The mix is starting to work.",
    },
    {
      src: "../../assets/imgs/png/re-lyte-rescue/johnny-hydration-4.png",
      alt: "Johnny is retaining hydration",
      label: "Retaining",
      copy: "Johnny is holding onto more hydration.",
    },
    {
      src: "../../assets/imgs/png/re-lyte-rescue/johnny-hydration-5.png",
      alt: "Johnny is hydrated",
      label: "Hydrated",
      copy: "Almost every electrolyte role is matched.",
    },
    {
      src: "../../assets/imgs/png/re-lyte-rescue/johnny-hydration-5.png",
      alt: "Johnny is celebrating hydration",
      label: "Complete",
      copy: "Every electrolyte role is matched.",
    },
  ];

  const refs = {
    live: document.getElementById("live-region"),
    resetBtn: document.getElementById("reset-btn"),
    scoreBtn: document.getElementById("score-btn"),
    finalScoreBtn: document.getElementById("final-score-btn"),
    completionPanel: document.getElementById("completion-panel"),
    matchCount: document.getElementById("match-count"),
    matchBoard: document.getElementById("match-board"),
    threadLayer: document.getElementById("thread-layer"),
    electrolyteList: document.getElementById("electrolyte-list"),
    descriptionList: document.getElementById("description-list"),
    hydrationMeter: document.getElementById("hydration-meter"),
    hydrationFill: document.getElementById("hydration-fill"),
    hydrationPercent: document.getElementById("hydration-percent"),
    johnnyScene: document.querySelector(".johnny-scene"),
    johnnyImg: document.getElementById("johnny-img"),
    mineralOrbit: document.getElementById("mineral-orbit"),
    dropLayer: document.getElementById("drop-layer"),
    statusStrip: document.querySelector(".status-strip"),
    statusChip: document.getElementById("status-chip"),
    statusCopy: document.getElementById("status-copy"),
    scoreModal: document.getElementById("score-modal"),
    closeScoreBtn: document.getElementById("close-score-btn"),
    scoreNumber: document.getElementById("score-number"),
    scoreCopy: document.getElementById("score-copy"),
    recapList: document.getElementById("recap-list"),
    playAgainBtn: document.getElementById("play-again-btn"),
    confettiLayer: document.getElementById("confetti-layer"),
  };

  const reducedMotionQuery = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : { matches: false };

  let state = loadState() || createInitialState();
  let boostTimer = 0;
  let threadRenderFrame = 0;
  let scoreModalOpen = false;

  function createInitialState() {
    return {
      selectedId: "",
      connections: {},
      descriptionOrder: shuffle(pairs.map((pair) => pair.id)),
      lastConnection: null,
      complete: false,
    };
  }

  function loadState() {
    const stored = safeStorageGet(STORAGE_KEY);
    if (!stored) return null;

    try {
      const parsed = JSON.parse(stored);
      if (!parsed || !Array.isArray(parsed.descriptionOrder)) return null;
      const validIds = new Set(pairs.map((pair) => pair.id));
      if (parsed.descriptionOrder.length !== pairs.length) return null;
      if (!parsed.descriptionOrder.every((id) => validIds.has(id))) return null;
      return {
        selectedId:
          validIds.has(parsed.selectedId) && !parsed.connections?.[parsed.selectedId]
            ? parsed.selectedId
            : "",
        connections: sanitizeConnections(parsed.connections, validIds),
        descriptionOrder: parsed.descriptionOrder,
        lastConnection: null,
        complete: Boolean(parsed.complete),
      };
    } catch (error) {
      return null;
    }
  }

  function sanitizeConnections(record, validIds) {
    const output = {};
    if (!record || typeof record !== "object") return output;
    const usedDescriptions = new Set();

    Object.keys(record).forEach((key) => {
      const value = record[key];
      if (!validIds.has(key) || !validIds.has(value) || usedDescriptions.has(value)) return;
      output[key] = value;
      usedDescriptions.add(value);
    });
    return output;
  }

  function saveState() {
    safeStorageSet(
      STORAGE_KEY,
      JSON.stringify({
        selectedId: state.selectedId,
        connections: state.connections,
        descriptionOrder: state.descriptionOrder,
        complete: state.complete,
      })
    );
  }

  function safeStorageGet(key) {
    try {
      return window.sessionStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      window.sessionStorage.setItem(key, value);
    } catch (error) {
      return false;
    }
    return true;
  }

  function safeStorageRemove(key) {
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      return false;
    }
    return true;
  }

  function shuffle(items) {
    const output = [...items];
    for (let index = output.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [output[index], output[randomIndex]] = [output[randomIndex], output[index]];
    }
    return output;
  }

  function getPair(id) {
    return pairs.find((pair) => pair.id === id);
  }

  function getConnectionCount() {
    return Object.keys(state.connections).length;
  }

  function getScore() {
    return pairs.filter((pair) => state.connections[pair.id] === pair.id).length;
  }

  function getPercent() {
    return Math.round((getScore() / pairs.length) * 100);
  }

  function isElectrolyteConnected(id) {
    return Boolean(state.connections[id]);
  }

  function getConnectedElectrolyteForDescription(id) {
    return Object.keys(state.connections).find((electrolyteId) => state.connections[electrolyteId] === id) || "";
  }

  function isDescriptionConnected(id) {
    return Boolean(getConnectedElectrolyteForDescription(id));
  }

  function isCorrectConnection(id) {
    return state.connections[id] === id;
  }

  function render() {
    renderMinerals();
    renderElectrolytes();
    renderDescriptions();
    renderProgress();
    renderCompletion();
    renderScoreModal();
    queueThreadRender();
    saveState();
  }

  function renderMinerals() {
    const fragment = document.createDocumentFragment();

    pairs.forEach((pair) => {
      const token = document.createElement("span");
      const connected = isElectrolyteConnected(pair.id);
      token.className = "mineral-token";
      token.classList.toggle("is-connected", connected);
      token.classList.toggle("is-active", isCorrectConnection(pair.id));
      token.setAttribute("aria-label", `${pair.name} ${connected ? "connected" : "not connected"}`);

      const img = document.createElement("img");
      img.src = pair.image;
      img.alt = "";
      if (pair.photo) img.classList.add("is-photo");
      token.append(img);
      fragment.append(token);
    });

    refs.mineralOrbit.replaceChildren(fragment);
  }

  function renderElectrolytes() {
    const fragment = document.createDocumentFragment();

    pairs.forEach((pair) => {
      const button = document.createElement("button");
      const connected = isElectrolyteConnected(pair.id);
      const correct = isCorrectConnection(pair.id);
      const justConnected = state.lastConnection && state.lastConnection.electrolyteId === pair.id;
      button.type = "button";
      button.className = "choice-card electrolyte-card";
      button.disabled = connected;
      button.dataset.id = pair.id;
      button.classList.toggle("is-selected", state.selectedId === pair.id);
      button.classList.toggle("is-connected", connected);
      button.classList.toggle("is-matched", correct);
      button.classList.toggle("is-wrong", connected && !correct);
      button.classList.toggle("is-new-wrong", justConnected && connected && !correct);
      button.setAttribute("aria-pressed", state.selectedId === pair.id ? "true" : "false");
      button.setAttribute(
        "aria-label",
        connected
          ? `${pair.name}, ${pair.symbol}, connected`
          : `${pair.name}, ${pair.symbol}`
      );

      const img = document.createElement("img");
      img.src = pair.image;
      img.alt = "";
      if (pair.photo) img.classList.add("is-photo");

      const copy = document.createElement("span");
      copy.className = "electrolyte-copy";

      const name = document.createElement("strong");
      name.textContent = pair.name;

      const symbol = document.createElement("small");
      symbol.textContent = pair.symbol;

      copy.append(name, symbol);
      button.append(img, copy);
      button.addEventListener("click", () => selectElectrolyte(pair.id));
      fragment.append(button);
    });

    refs.electrolyteList.replaceChildren(fragment);
  }

  function renderDescriptions() {
    const fragment = document.createDocumentFragment();

    state.descriptionOrder.forEach((id, index) => {
      const pair = getPair(id);
      const connectedElectrolyteId = getConnectedElectrolyteForDescription(id);
      const connected = Boolean(connectedElectrolyteId);
      const correct = connectedElectrolyteId === id;
      const justConnected =
        state.lastConnection &&
        state.lastConnection.descriptionId === id &&
        state.lastConnection.electrolyteId === connectedElectrolyteId;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice-card description-card";
      button.disabled = connected;
      button.dataset.id = id;
      button.classList.toggle("is-connected", connected);
      button.classList.toggle("is-matched", correct);
      button.classList.toggle("is-wrong", connected && !correct);
      button.classList.toggle("is-new-wrong", justConnected && connected && !correct);
      button.setAttribute(
        "aria-label",
        connected ? `Role ${index + 1}, connected. ${pair.description}` : `Role ${index + 1}. ${pair.description}`
      );

      const label = document.createElement("small");
      label.textContent = `Role ${index + 1}`;

      const text = document.createElement("p");
      text.textContent = pair.description;

      button.append(label, text);
      button.addEventListener("click", () => selectDescription(id));
      fragment.append(button);
    });

    refs.descriptionList.replaceChildren(fragment);
  }

  function renderProgress() {
    const connected = getConnectionCount();
    const score = getScore();
    const percent = getPercent();
    const frame = johnnyFrames[Math.min(score, johnnyFrames.length - 1)];

    refs.matchCount.textContent = `${connected} / ${pairs.length}`;
    refs.hydrationFill.style.width = `${percent}%`;
    refs.hydrationPercent.textContent = `${percent}%`;
    refs.hydrationMeter.setAttribute("aria-valuenow", String(percent));
    refs.johnnyScene.dataset.level = String(score);
    refs.johnnyImg.src = frame.src;
    refs.johnnyImg.alt = frame.alt;

    if (!state.lastConnection && !state.selectedId && connected > 0 && !state.complete) {
      refs.statusChip.textContent = `${connected} / ${pairs.length}`;
      refs.statusCopy.textContent = `${pairs.length - connected} connections left.`;
      refs.statusStrip.classList.remove("is-miss");
      refs.statusStrip.classList.add("is-correct");
    }
  }

  function renderCompletion() {
    const complete = getConnectionCount() === pairs.length;
    state.complete = complete;
    refs.completionPanel.hidden = !complete;
    refs.scoreBtn.hidden = !complete;

    if (complete && !scoreModalOpen) {
      refs.statusStrip.classList.remove("is-miss");
      refs.statusStrip.classList.add("is-correct");
      refs.statusChip.textContent = "Complete";
      refs.statusCopy.textContent = `Final result: ${getScore()} of ${pairs.length} correct.`;
    }
  }

  function renderScoreModal() {
    refs.scoreModal.hidden = !scoreModalOpen;
    document.body.classList.toggle("is-locked", scoreModalOpen);

    if (!scoreModalOpen) return;

    const score = getScore();
    refs.scoreNumber.textContent = `${score} / ${pairs.length}`;
    refs.scoreCopy.textContent =
      score === pairs.length
        ? "Perfect result. Every thread connects the right electrolyte to its role."
        : "Threads stay in place once connected. The recap below shows what you connected and the correct role.";

    const fragment = document.createDocumentFragment();
    pairs.forEach((pair) => {
      const item = document.createElement("li");
      const connectedRole = getPair(state.connections[pair.id]);
      const correct = connectedRole && connectedRole.id === pair.id;
      item.className = correct ? "is-correct" : "is-wrong";
      item.textContent = correct
        ? `${pair.name}: correct. ${pair.description} ${pair.cue}`
        : `${pair.name}: connected to "${connectedRole ? connectedRole.description : "no role"}". Correct role: ${
            pair.description
          } ${pair.cue}`;
      fragment.append(item);
    });
    refs.recapList.replaceChildren(fragment);
  }

  function queueThreadRender() {
    window.cancelAnimationFrame(threadRenderFrame);
    threadRenderFrame = window.requestAnimationFrame(renderThreads);
  }

  function renderThreads() {
    if (!refs.threadLayer || !refs.matchBoard) return;

    const boardRect = refs.matchBoard.getBoundingClientRect();
    const stacked = areChoiceColumnsStacked();
    refs.threadLayer.setAttribute("viewBox", `0 0 ${boardRect.width} ${boardRect.height}`);
    refs.threadLayer.setAttribute("width", String(boardRect.width));
    refs.threadLayer.setAttribute("height", String(boardRect.height));

    const fragment = document.createDocumentFragment();

    Object.keys(state.connections).forEach((electrolyteId) => {
      const descriptionId = state.connections[electrolyteId];
      const electrolyteCard = refs.electrolyteList.querySelector(`[data-id="${electrolyteId}"]`);
      const descriptionCard = refs.descriptionList.querySelector(`[data-id="${descriptionId}"]`);
      if (!electrolyteCard || !descriptionCard) return;

      const start = getThreadPoint(electrolyteCard, boardRect, "start", stacked);
      const end = getThreadPoint(descriptionCard, boardRect, "end", stacked);
      const pathData = getThreadPath(start, end, stacked);
      const correct = electrolyteId === descriptionId;

      const shadow = createSvgElement("path", "thread-shadow");
      shadow.setAttribute("d", pathData);

      const path = createSvgElement("path", correct ? "thread-path is-correct" : "thread-path is-wrong");
      path.setAttribute("d", pathData);

      const startDot = createSvgElement("circle", correct ? "thread-dot" : "thread-dot is-wrong");
      startDot.setAttribute("cx", String(start.x));
      startDot.setAttribute("cy", String(start.y));
      startDot.setAttribute("r", "5");

      const endDot = createSvgElement("circle", correct ? "thread-dot" : "thread-dot is-wrong");
      endDot.setAttribute("cx", String(end.x));
      endDot.setAttribute("cy", String(end.y));
      endDot.setAttribute("r", "5");

      fragment.append(shadow, path, startDot, endDot);
    });

    refs.threadLayer.replaceChildren(fragment);
  }

  function areChoiceColumnsStacked() {
    const electrolyteRect = refs.electrolyteList.getBoundingClientRect();
    const descriptionRect = refs.descriptionList.getBoundingClientRect();
    return electrolyteRect.bottom <= descriptionRect.top || descriptionRect.bottom <= electrolyteRect.top;
  }

  function getThreadPoint(card, boardRect, side, stacked) {
    const rect = card.getBoundingClientRect();
    if (stacked) {
      return {
        x: rect.left - boardRect.left + rect.width / 2,
        y: rect.top - boardRect.top + (side === "start" ? rect.height : 0),
      };
    }

    return {
      x: rect.left - boardRect.left + (side === "start" ? rect.width : 0),
      y: rect.top - boardRect.top + rect.height / 2,
    };
  }

  function getThreadPath(start, end, stacked) {
    if (stacked) {
      const bend = Math.max(48, Math.abs(end.y - start.y) * 0.36);
      return `M ${start.x} ${start.y} C ${start.x} ${start.y + bend}, ${end.x} ${end.y - bend}, ${end.x} ${end.y}`;
    }

    const bend = Math.max(58, Math.abs(end.x - start.x) * 0.44);
    return `M ${start.x} ${start.y} C ${start.x + bend} ${start.y}, ${end.x - bend} ${end.y}, ${end.x} ${end.y}`;
  }

  function createSvgElement(tag, className) {
    const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
    element.setAttribute("class", className);
    return element;
  }

  function selectElectrolyte(id) {
    if (isElectrolyteConnected(id) || state.complete) return;
    state.selectedId = state.selectedId === id ? "" : id;
    state.lastConnection = null;

    const pair = getPair(id);
    refs.statusStrip.classList.remove("is-miss", "is-correct");
    refs.statusChip.textContent = pair ? pair.symbol : "Ready";
    refs.statusCopy.textContent = pair
      ? `${pair.name} is selected.`
      : "Start by choosing an electrolyte.";
    refs.live.textContent = refs.statusCopy.textContent;
    render();
  }

  function selectDescription(descriptionId) {
    if (isDescriptionConnected(descriptionId) || state.complete) return;

    if (!state.selectedId) {
      refs.statusStrip.classList.add("is-miss");
      refs.statusStrip.classList.remove("is-correct");
      refs.statusChip.textContent = "Choose";
      refs.statusCopy.textContent = "Choose an electrolyte first.";
      refs.live.textContent = refs.statusCopy.textContent;
      return;
    }

    const selected = getPair(state.selectedId);
    const target = getPair(descriptionId);
    if (!selected || !target) return;

    lockConnection(selected, target);
  }

  function lockConnection(selected, target) {
    const correct = selected.id === target.id;
    state.connections[selected.id] = target.id;
    state.selectedId = "";
    state.lastConnection = {
      electrolyteId: selected.id,
      descriptionId: target.id,
      correct,
    };

    render();

    if (correct) {
      boostJohnny();
      createDrops();
    }

    if (state.complete) {
      refs.statusStrip.classList.remove("is-miss");
      refs.statusStrip.classList.add("is-correct");
      refs.statusChip.textContent = "Complete";
      refs.statusCopy.textContent = `Final result: ${getScore()} of ${pairs.length} correct.`;
      refs.live.textContent = refs.statusCopy.textContent;
      window.setTimeout(() => {
        openScore();
      }, 420);
      return;
    }

    refs.statusStrip.classList.toggle("is-miss", !correct);
    refs.statusStrip.classList.toggle("is-correct", correct);
    refs.statusChip.textContent = correct ? "Correct" : "Set";
    refs.statusCopy.textContent = correct
      ? `${selected.name}: ${selected.description}`
      : `${selected.name} is set to a different role. Keep going.`;
    refs.live.textContent = correct
      ? `${selected.name} connected correctly. Johnny hydration is now ${getPercent()} percent.`
      : `${selected.name} connected to a different role and stays in place.`;
  }

  function boostJohnny() {
    window.clearTimeout(boostTimer);
    refs.johnnyImg.classList.remove("is-boosted");
    window.requestAnimationFrame(() => {
      refs.johnnyImg.classList.add("is-boosted");
      boostTimer = window.setTimeout(() => {
        refs.johnnyImg.classList.remove("is-boosted");
      }, 520);
    });
  }

  function createDrops() {
    if (reducedMotionQuery.matches) return;

    const count = 12;
    const originX = refs.dropLayer.clientWidth / 2;
    const originY = refs.dropLayer.clientHeight * 0.62;

    for (let index = 0; index < count; index += 1) {
      const drop = document.createElement("span");
      const angle = (Math.PI * 2 * index) / count;
      const distance = 48 + Math.random() * 42;
      drop.className = "drop";
      drop.style.left = `${originX}px`;
      drop.style.top = `${originY}px`;
      drop.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
      drop.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
      refs.dropLayer.append(drop);
      window.setTimeout(() => drop.remove(), 820);
    }
  }

  function launchConfetti() {
    if (reducedMotionQuery.matches || !refs.confettiLayer) return;

    refs.confettiLayer.replaceChildren();
    const count = 70;
    for (let index = 0; index < count; index += 1) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.animationDelay = `${Math.random() * 0.38}s`;
      piece.style.animationDuration = `${1.05 + Math.random() * 0.7}s`;
      refs.confettiLayer.append(piece);
    }
    window.setTimeout(clearConfetti, 2200);
  }

  function clearConfetti() {
    if (refs.confettiLayer) refs.confettiLayer.replaceChildren();
  }

  function openScore() {
    if (!state.complete) return;
    scoreModalOpen = true;
    renderScoreModal();
    refs.scoreModal.focus();

    if (getScore() === pairs.length) {
      launchConfetti();
    } else {
      clearConfetti();
    }
  }

  function closeScore() {
    scoreModalOpen = false;
    renderScoreModal();
    refs.scoreBtn.focus();
  }

  function resetGame() {
    safeStorageRemove(STORAGE_KEY);
    state = createInitialState();
    scoreModalOpen = false;
    state.lastConnection = null;
    clearConfetti();
    refs.statusStrip.classList.remove("is-miss", "is-correct");
    refs.statusChip.textContent = "Ready";
    refs.statusCopy.textContent = "Start by choosing an electrolyte.";
    refs.live.textContent = "Game reset.";
    render();
  }

  refs.resetBtn.addEventListener("click", resetGame);
  refs.playAgainBtn.addEventListener("click", resetGame);
  refs.scoreBtn.addEventListener("click", openScore);
  refs.finalScoreBtn.addEventListener("click", openScore);
  refs.closeScoreBtn.addEventListener("click", closeScore);
  refs.scoreModal.addEventListener("click", (event) => {
    if (event.target === refs.scoreModal) closeScore();
  });
  window.addEventListener("resize", queueThreadRender);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && scoreModalOpen) closeScore();
  });

  render();
})();
