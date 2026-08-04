(function () {
  "use strict";

  const products = [
    {
      id: "hydration",
      name: "Re-Lyte Hydration",
      image: "assets/re-lyte-hydration.webp",
      description: "Our most basic product, perfect for the everyday hydration needs of healthy adults.",
    },
    {
      id: "kids",
      name: "Re-Lyte Kids",
      image: "assets/re-lyte-kids.webp",
      description: "Balanced electrolytes for smaller, developing bodies, made with clean Real Salt minerals, naturally sourced colors and flavors, and stevia.",
    },
    {
      id: "pre-workout",
      name: "Re-Lyte Pre-Workout",
      image: "assets/re-lyte-pre-workout.webp",
      description: "Our highest-caffeine formula (150 mg), with amino acids to fuel workouts and support muscle recovery.",
    },
    {
      id: "energy",
      name: "Re-Lyte Energy",
      image: "assets/re-lyte-energy.webp",
      description: "Designed for daily energy without jitters or crashes, with a lighter 120 mg dose of caffeine.",
    },
    {
      id: "immunity",
      name: "Re-Lyte Immunity",
      image: "assets/re-lyte-immunity.webp",
      description: "A clean daily formula that blends hydration and immune support using electrolytes, vitamins, and herbs.",
    },
    {
      id: "capsules",
      name: "Re-Lyte Capsules",
      image: "assets/re-lyte-capsules.webp",
      description: "Convenient, no-mix electrolyte support. Energy Boost Capsules combine herbal energizers like ginseng and maca for sustained lift.",
    },
  ];

  const resultTiers = [
    {
      maxAttempts: 10,
      title: "Product master",
      kicker: "Excellent memory",
      copy: "You matched the products and descriptions with very few extra flips. Your recall was sharp from the start.",
    },
    {
      maxAttempts: 14,
      title: "Strong matcher",
      kicker: "Great finish",
      copy: "You kept the board organized and finished with a strong number of attempts.",
    },
    {
      maxAttempts: 18,
      title: "Steady progress",
      kicker: "Game complete",
      copy: "You found every pair. A few more rounds will make the product details easier to remember.",
    },
    {
      maxAttempts: Infinity,
      title: "Practice round complete",
      kicker: "Game complete",
      copy: "You completed the board. Try again and focus on one row at a time to lower your attempts.",
    },
  ];

  const refs = {
    grid: document.getElementById("memory-grid"),
    attempts: document.getElementById("attempt-count"),
    matches: document.getElementById("match-count"),
    progressFill: document.getElementById("progress-fill"),
    reset: document.getElementById("reset-btn"),
    live: document.getElementById("live-region"),
    resultOverlay: document.getElementById("result-overlay"),
    resultKicker: document.getElementById("result-kicker"),
    resultTitle: document.getElementById("result-title"),
    resultCopy: document.getElementById("result-copy"),
    finalAttempts: document.getElementById("final-attempts"),
    finalRating: document.getElementById("final-rating"),
    playAgain: document.getElementById("play-again-btn"),
    confettiLayer: document.getElementById("confetti-layer"),
  };

  const reducedMotionQuery = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : { matches: false };

  let audioContext = null;

  const state = {
    cards: [],
    flipped: [],
    attempts: 0,
    matches: 0,
    locked: false,
  };

  const compareClasses = [
    "is-compare-left",
    "is-compare-right",
    "is-compare-top",
    "is-compare-bottom",
  ];

  function shuffle(items) {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }
    return shuffled;
  }

  function buildDeck() {
    return shuffle(
      products.flatMap((product) => [
        { ...product, kind: "product", cardId: `${product.id}-product`, matched: false },
        { ...product, kind: "description", cardId: `${product.id}-description`, matched: false },
      ]),
    );
  }

  function createCard(card, index) {
    const button = document.createElement("button");
    button.className = "memory-card";
    button.type = "button";
    button.dataset.index = String(index);
    button.dataset.product = card.id;
    button.setAttribute("aria-label", `Card ${index + 1}. Hidden product or description.`);
    button.setAttribute("aria-pressed", "false");
    button.innerHTML = `
      <span class="card-inner">
        <span class="card-face card-back" aria-hidden="true">
          <strong>H2O</strong>
        </span>
        <span class="card-face card-front card-front--${card.kind}">
          ${card.kind === "product"
            ? `<img src="${card.image}" alt="${card.name}" draggable="false" />`
            : `<span class="product-description">${card.description}</span>`}
          <span class="product-name">${card.kind === "product" ? card.name : "Which product is it?"}</span>
        </span>
      </span>
    `;
    button.addEventListener("click", () => flipCard(index));
    return button;
  }

  function renderBoard() {
    refs.grid.replaceChildren(...state.cards.map(createCard));
  }

  function updateStats() {
    refs.attempts.textContent = String(state.attempts);
    refs.matches.textContent = `${state.matches} / ${products.length}`;
    refs.progressFill.style.width = `${(state.matches / products.length) * 100}%`;
  }

  function getCardButton(index) {
    return refs.grid.querySelector(`[data-index="${index}"]`);
  }

  function clearCompareClasses(indexes) {
    indexes.forEach((index) => {
      const button = getCardButton(index);
      if (button) button.classList.remove(...compareClasses);
    });
  }

  function updateCompareLayout() {
    clearCompareClasses(state.flipped);
    if (state.flipped.length !== 2) return;

    const [firstIndex, secondIndex] = state.flipped;
    const firstButton = getCardButton(firstIndex);
    const secondButton = getCardButton(secondIndex);
    if (!firstButton || !secondButton) return;

    const firstRow = Math.floor(firstIndex / 4);
    const secondRow = Math.floor(secondIndex / 4);
    const firstCol = firstIndex % 4;
    const secondCol = secondIndex % 4;

    if (firstRow === secondRow && Math.abs(firstCol - secondCol) === 1) {
      const leftButton = firstCol < secondCol ? firstButton : secondButton;
      const rightButton = firstCol < secondCol ? secondButton : firstButton;
      leftButton.classList.add("is-compare-left");
      rightButton.classList.add("is-compare-right");
      return;
    }

    if (firstCol === secondCol && Math.abs(firstRow - secondRow) === 1) {
      const topButton = firstRow < secondRow ? firstButton : secondButton;
      const bottomButton = firstRow < secondRow ? secondButton : firstButton;
      topButton.classList.add("is-compare-top");
      bottomButton.classList.add("is-compare-bottom");
    }
  }

  function revealCard(index) {
    const card = state.cards[index];
    const button = getCardButton(index);
    if (!button || !card) return;

    button.classList.add("is-flipped");
    button.setAttribute("aria-pressed", "true");
    button.setAttribute("aria-label", `Card ${index + 1}. ${card.kind === "product" ? card.name : card.description}`);
  }

  function hideCard(index) {
    const button = getCardButton(index);
    if (!button) return;

    button.classList.remove("is-flipped", "is-miss", ...compareClasses);
    button.setAttribute("aria-pressed", "false");
    button.setAttribute("aria-label", `Card ${index + 1}. Hidden product or description.`);
  }

  function markMatch(firstIndex, secondIndex) {
    const first = state.cards[firstIndex];
    const second = state.cards[secondIndex];
    const firstButton = getCardButton(firstIndex);
    const secondButton = getCardButton(secondIndex);

    first.matched = true;
    second.matched = true;
    state.matches += 1;

    [firstButton, secondButton].forEach((button) => {
      if (!button) return;
      button.classList.remove(...compareClasses);
      button.classList.add("is-matched");
      button.disabled = true;
      button.setAttribute("aria-label", `${first.name} matched.`);
    });

    refs.live.textContent = `${first.name} pair matched. ${state.matches} of ${products.length} pairs found.`;
    playTone("match");
    updateStats();

    if (state.matches === products.length) {
      window.setTimeout(finishGame, 520);
    }
  }

  function markMiss(firstIndex, secondIndex) {
    const firstButton = getCardButton(firstIndex);
    const secondButton = getCardButton(secondIndex);

    [firstButton, secondButton].forEach((button) => {
      if (button) button.classList.add("is-miss");
    });

    refs.live.textContent = "No match. Try another pair.";
    playTone("miss");

    window.setTimeout(() => {
      hideCard(firstIndex);
      hideCard(secondIndex);
      state.flipped = [];
      state.locked = false;
    }, 720);
  }

  function flipCard(index) {
    if (state.locked) return;

    const card = state.cards[index];
    if (!card || card.matched || state.flipped.includes(index)) return;

    revealCard(index);
    state.flipped.push(index);
    updateCompareLayout();
    playTone("flip");

    if (state.flipped.length < 2) return;

    state.locked = true;
    state.attempts += 1;
    updateStats();

    const [firstIndex, secondIndex] = state.flipped;
    const first = state.cards[firstIndex];
    const second = state.cards[secondIndex];

    if (first.id === second.id && first.kind !== second.kind) {
      state.flipped = [];
      state.locked = false;
      markMatch(firstIndex, secondIndex);
      return;
    }

    markMiss(firstIndex, secondIndex);
  }

  function getResultTier() {
    return resultTiers.find((tier) => state.attempts <= tier.maxAttempts) || resultTiers[resultTiers.length - 1];
  }

  function finishGame() {
    const tier = getResultTier();
    const efficiency = Math.round((products.length / state.attempts) * 100);

    refs.resultKicker.textContent = tier.kicker;
    refs.resultTitle.textContent = tier.title;
    refs.resultCopy.textContent = tier.copy;
    refs.finalAttempts.textContent = String(state.attempts);
    refs.finalRating.textContent = `${efficiency}%`;
    refs.resultOverlay.hidden = false;
    document.body.classList.add("is-locked");
    refs.live.textContent = `${tier.title}. Game complete in ${state.attempts} attempts.`;

    launchConfetti();
    playTone("complete");
    window.requestAnimationFrame(() => refs.playAgain.focus({ preventScroll: true }));
  }

  function focusFirstCard() {
    window.requestAnimationFrame(() => {
      const firstCard = refs.grid.querySelector(".memory-card:not(:disabled)");
      if (firstCard) firstCard.focus({ preventScroll: true });
    });
  }

  function resetGame(focusBoard) {
    state.cards = buildDeck();
    state.flipped = [];
    state.attempts = 0;
    state.matches = 0;
    state.locked = false;
    refs.resultOverlay.hidden = true;
    document.body.classList.remove("is-locked");
    refs.confettiLayer.replaceChildren();
    renderBoard();
    updateStats();
    refs.live.textContent = "New memory board ready.";
    if (focusBoard) focusFirstCard();
  }

  function launchConfetti() {
    if (reducedMotionQuery.matches) return;

    refs.confettiLayer.replaceChildren();
    const count = 86;

    for (let index = 0; index < count; index += 1) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.animationDelay = `${Math.random() * 0.42}s`;
      piece.style.animationDuration = `${1.05 + Math.random() * 0.82}s`;
      refs.confettiLayer.append(piece);
    }

    window.setTimeout(() => refs.confettiLayer.replaceChildren(), 2400);
  }

  function ensureAudioContext() {
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextConstructor) return null;
    if (!audioContext || audioContext.state === "closed") {
      audioContext = new AudioContextConstructor();
    }
    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
    }
    return audioContext;
  }

  function playTone(type) {
    const context = ensureAudioContext();
    if (!context) return;

    const tones = {
      flip: [420, 520, 0.08],
      match: [520, 780, 0.16],
      miss: [240, 180, 0.14],
      complete: [520, 880, 0.34],
    };
    const [start, end, duration] = tones[type] || tones.flip;
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = type === "miss" ? "sawtooth" : "triangle";
    oscillator.frequency.setValueAtTime(start, now);
    oscillator.frequency.exponentialRampToValueAtTime(end, now + duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(type === "complete" ? 0.12 : 0.06, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.connect(gain).connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }

  refs.reset.addEventListener("click", () => resetGame(false));
  refs.playAgain.addEventListener("click", () => resetGame(true));
  refs.resultOverlay.addEventListener("click", (event) => {
    if (event.target === refs.resultOverlay) {
      refs.playAgain.focus({ preventScroll: true });
    }
  });

  resetGame(false);
})();
