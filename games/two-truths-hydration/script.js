(function () {
  "use strict";

  const STORAGE_PREFIX = "relyte-two-truths-hydration-v2";
  const TOTAL_CARDS_PER_ROUND = 3;

  const content = {
    en: {
      pageTitle: "Two Truths and a Lie",
      ui: {
        kicker: "Re-Lyte Micro Game",
        title: "Two Truths and a Lie",
        intro:
          "You’ll see three statements. Two are true, and one is a lie. Select the lie to fill up your Re-Lyte bottle!",
        replay: "Play again",
        progressLabel: "Bottle progress",
        bottleTitle: "Re-Lyte fill",
        hydrationMix: "Hydration Mix",
        scoreLabel: "Score",
        streakLabel: "Streak",
        knowledgeLabel: "Knowledge",
        recapLabel: "Unlocked recap",
        recapTitle: "Hydration takeaways",
        recapHelp: "Open hydration recap",
        completeChip: "Game complete",
        playAgain: "Play again",
        roundOf: "Round {current} of {total}",
        chooseLie: "Which statement is the lie?",
        truth: "TRUTH",
        lie: "LIE",
        correct: "Correct",
        incorrect: "Not it",
        correctTitle: "That was the lie.",
        incorrectTitle: "Close. Here is the lie.",
        nextRound: "Next round",
        viewRecap: "View recap",
        cards: "cards",
        lockedTakeaway: "Unlock this takeaway by finishing the round.",
        perfectTitle: "Hydration IQ complete",
        perfectCopy:
          "Perfect run. You spotted every myth and filled the bottle with the right hydration cues.",
        completeTitle: "Hydration IQ complete",
        completeCopy:
          "You finished the loop and reviewed the myths that make hydration confusing.",
        selectCard: "Select card {number} as the lie.",
        liveCorrect: "Correct. The Re-Lyte bottle filled to {percent} percent.",
        liveIncorrect: "Not it. The correct lie was revealed and the bottle stayed at {percent} percent.",
      },
      rounds: [
        {
          topic: "Hydration",
          title: "Everyday hydration",
          prompt: "Select the lie.",
          claims: [
            {
              text: "Dehydration contributes to headaches, fatigue, brain fog, etc.",
              truth: true,
              note: "",
            },
            {
              text: "Electrolytes facilitate electrical impulses in the body.",
              truth: true,
              note: "",
            },
            {
              text: "Only athletes need electrolyte supplements.",
              truth: false,
              note: "Electrolytes are crucial for optimal everyday functioning. Everyone needs them!",
            },
          ],
          explanation:
            "Electrolytes are crucial for optimal everyday functioning. Everyone needs them!",
          takeaway:
            "Electrolytes are crucial for optimal everyday functioning. Everyone needs them!",
        },
        {
          topic: "Activity",
          title: "Activity support",
          prompt: "Select the lie.",
          claims: [
            {
              text: "You should sip electrolytes every 30-60 minutes during activity.",
              truth: true,
              note: "",
            },
            {
              text: "It’s possible to drink too much water.",
              truth: true,
              note: "",
            },
            {
              text: "I only need to take electrolytes if it’s hot and I’m sweating a lot.",
              truth: false,
              note:
                "We lose electrolytes not just when we sweat, but when we sleep, move around, think, breathe, etc.",
            },
          ],
          explanation:
            "We lose electrolytes not just when we sweat, but when we sleep, move around, think, breathe, etc.",
          takeaway:
            "We lose electrolytes not just when we sweat, but when we sleep, move around, think, breathe, etc.",
        },
        {
          topic: "Climate",
          title: "Changing conditions",
          prompt: "Select the lie.",
          claims: [
            {
              text: "You need more electrolytes at high altitudes.",
              truth: true,
              note: "",
            },
            {
              text: "Pregnancy increases electrolyte needs.",
              truth: true,
              note: "",
            },
            {
              text: "I don’t need electrolytes in cold weather.",
              truth: false,
              note: "You still lose electrolytes as you breathe, even in cold weather.",
            },
          ],
          explanation: "You still lose electrolytes as you breathe, even in cold weather.",
          takeaway: "You still lose electrolytes as you breathe, even in cold weather.",
        },
        {
          topic: "Water",
          title: "Water balance",
          prompt: "Select the lie.",
          claims: [
            {
              text: "You lose electrolytes just by sitting, moving around, thinking, breathing, etc.",
              truth: true,
              note: "",
            },
            {
              text: "If you wait to drink when you’re thirsty, you’re already a bit dehydrated.",
              truth: true,
              note: "",
            },
            {
              text: "Plain water is enough to hydrate you.",
              truth: false,
              note:
                "Hydration isn’t just about water! Our blood is full of minerals, especially sodium, and because we lose some of those minerals through everyday living, we have to replenish them as well as fluids.",
            },
          ],
          explanation:
            "Hydration isn’t just about water! Our blood is full of minerals, especially sodium, and because we lose some of those minerals through everyday living, we have to replenish them as well as fluids.",
          takeaway:
            "Hydration isn’t just about water! Our blood is full of minerals, especially sodium, and because we lose some of those minerals through everyday living, we have to replenish them as well as fluids.",
        },
        {
          topic: "Intake",
          title: "Daily intake",
          prompt: "Select the lie.",
          claims: [
            {
              text: "You lose electrolytes while you sleep.",
              truth: true,
              note: "",
            },
            {
              text: "You need more electrolytes when you’re fasting.",
              truth: true,
              note: "",
            },
            {
              text: "The more water you drink, the better!",
              truth: false,
              note:
                `It's not common, but when your fluid intake outpaces your sodium levels, it can disrupt your body's natural balance and leave you feeling "off" rather than hydrated.`,
            },
          ],
          explanation:
            `It's not common, but when your fluid intake outpaces your sodium levels, it can disrupt your body's natural balance and leave you feeling "off" rather than hydrated.`,
          takeaway:
            `It's not common, but when your fluid intake outpaces your sodium levels, it can disrupt your body's natural balance and leave you feeling "off" rather than hydrated.`,
        },
        {
          topic: "Food",
          title: "Food and supplements",
          prompt: "Select the lie.",
          claims: [
            {
              text: "Low-carb diets increase electrolyte needs.",
              truth: true,
              note: "",
            },
            {
              text: "You can meet some of your hydration needs by consuming watery foods like cucumbers and watermelon.",
              truth: true,
              note: "",
            },
            {
              text: "All electrolyte supplements are the same",
              truth: false,
              note:
                "Unlike other electrolyte brands, Re-Lyte’s higher sodium content, combined with complementary electrolytes like potassium and magnesium, helps maintain proper fluid distribution inside and outside of cells, supports nerve signaling and muscle function, and promotes more efficient, sustained hydration.",
            },
          ],
          explanation:
            "Unlike other electrolyte brands, Re-Lyte’s higher sodium content, combined with complementary electrolytes like potassium and magnesium, helps maintain proper fluid distribution inside and outside of cells, supports nerve signaling and muscle function, and promotes more efficient, sustained hydration.",
          takeaway:
            "Unlike other electrolyte brands, Re-Lyte’s higher sodium content, combined with complementary electrolytes like potassium and magnesium, helps maintain proper fluid distribution inside and outside of cells, supports nerve signaling and muscle function, and promotes more efficient, sustained hydration.",
        },
        {
          topic: "Needs",
          title: "Changing needs",
          prompt: "Select the lie.",
          claims: [
            {
              text: "You can find electrolytes in foods like fruits and vegetables, nuts, and dairy.",
              truth: true,
              note: "",
            },
            {
              text: "Fluids and electrolytes are required for true hydration.",
              truth: true,
              note: "",
            },
            {
              text: "Our hydration needs don’t change.",
              truth: false,
              note:
                "Our hydration needs depend on activity level, illness, pregnancy and breastfeeding, caffeine and alcohol intake, diet, environment, and sleep quality. Our needs are always in flux!",
            },
          ],
          explanation:
            "Our hydration needs depend on activity level, illness, pregnancy and breastfeeding, caffeine and alcohol intake, diet, environment, and sleep quality. Our needs are always in flux!",
          takeaway:
            "Our hydration needs depend on activity level, illness, pregnancy and breastfeeding, caffeine and alcohol intake, diet, environment, and sleep quality. Our needs are always in flux!",
        },
        {
          topic: "Sources",
          title: "Electrolyte sources",
          prompt: "Select the lie.",
          claims: [
            {
              text: "Caffeine and alcohol consumption cause electrolyte loss.",
              truth: true,
              note: "",
            },
            {
              text: "Breastfeeding increases electrolyte needs.",
              truth: true,
              note: "",
            },
            {
              text: "Electrolytes are only found in mineral salt and supplements.",
              truth: false,
              note:
                "You can also find electrolytes in foods like bananas, leafy greens, potatoes, nuts, dairy, etc.",
            },
          ],
          explanation:
            "You can also find electrolytes in foods like bananas, leafy greens, potatoes, nuts, dairy, etc.",
          takeaway:
            "You can also find electrolytes in foods like bananas, leafy greens, potatoes, nuts, dairy, etc.",
        },
      ],
    },
  };

  const refs = {
    live: document.getElementById("live-region"),
    resetBtn: document.getElementById("reset-btn"),
    roundLabel: document.getElementById("round-label"),
    roundTitle: document.getElementById("round-title"),
    roundPrompt: document.getElementById("round-prompt"),
    roundProgress: document.getElementById("round-progress"),
    cardsGrid: document.getElementById("cards-grid"),
    feedbackPanel: document.getElementById("feedback-panel"),
    feedbackChip: document.getElementById("feedback-chip"),
    feedbackTitle: document.getElementById("feedback-title"),
    feedbackText: document.getElementById("feedback-text"),
    nextBtn: document.getElementById("next-btn"),
    bottleMeter: document.getElementById("bottle-meter"),
    bottleLiquid: document.getElementById("bottle-liquid"),
    bottlePercent: document.getElementById("bottle-percent"),
    scoreValue: document.getElementById("score-value"),
    streakValue: document.getElementById("streak-value"),
    knowledgeValue: document.getElementById("knowledge-value"),
    recapHelpBtn: document.getElementById("recap-help-btn"),
    recapCount: document.getElementById("recap-count"),
    recapModal: document.getElementById("recap-modal"),
    recapCloseBtn: document.getElementById("recap-close-btn"),
    takeawayList: document.getElementById("takeaway-list"),
    completionScreen: document.getElementById("completion-screen"),
    completionTitle: document.getElementById("completion-title"),
    completionCopy: document.getElementById("completion-copy"),
    completionScore: document.getElementById("completion-score"),
    playAgainBtn: document.getElementById("play-again-btn"),
    burstLayer: document.getElementById("burst-layer"),
    confettiLayer: document.getElementById("confetti-layer"),
  };

  const reducedMotionQuery = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : { matches: false };

  const lang = "en";
  let state = loadState(lang) || createInitialState(lang);
  let audioContext = null;
  let bottlePulseTimer = 0;
  let isRecapOpen = false;

  function createInitialState(language) {
    return {
      lang: language,
      roundIndex: 0,
      answers: [],
      score: 0,
      streak: 0,
      bestStreak: 0,
      complete: false,
      roundOrders: content[language].rounds.map(() => shuffle([0, 1, 2])),
    };
  }

  function loadState(language) {
    const stored = safeStorageGet(getStorageKey(language));
    if (!stored) return null;

    try {
      const parsed = JSON.parse(stored);
      if (!parsed || parsed.lang !== language) return null;
      if (!Array.isArray(parsed.answers) || !Array.isArray(parsed.roundOrders)) return null;
      if (parsed.roundOrders.length !== content[language].rounds.length) return null;
      parsed.roundIndex = clamp(parsed.roundIndex || 0, 0, content[language].rounds.length - 1);
      parsed.score = parsed.answers.filter((answer) => answer && answer.correct).length;
      parsed.streak = Number(parsed.streak) || 0;
      parsed.bestStreak = Number(parsed.bestStreak) || 0;
      parsed.complete = Boolean(parsed.complete);
      return parsed;
    } catch (error) {
      return null;
    }
  }

  function saveState() {
    safeStorageSet(getStorageKey(lang), JSON.stringify(state));
  }

  function getStorageKey(language) {
    return `${STORAGE_PREFIX}:${language}`;
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

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function format(template, values) {
    return Object.keys(values).reduce(
      (output, key) => output.replaceAll(`{${key}}`, String(values[key])),
      template
    );
  }

  function getUi() {
    return content[lang].ui;
  }

  function getRounds() {
    return content[lang].rounds;
  }

  function getCurrentRound() {
    return getRounds()[state.roundIndex];
  }

  function getCurrentAnswer() {
    return state.answers[state.roundIndex] || null;
  }

  function getCompletedCount() {
    return state.answers.filter(Boolean).length;
  }

  function getRoundProgressPercent() {
    return Math.round((getCompletedCount() / getRounds().length) * 100);
  }

  function getBottleFillPercent() {
    return Math.round((state.score / getRounds().length) * 100);
  }

  function updateStaticText() {
    const ui = getUi();
    document.documentElement.lang = lang;
    document.title = ui.pageTitle;

    document.querySelectorAll("[data-ui]").forEach((element) => {
      const key = element.dataset.ui;
      if (ui[key]) element.textContent = ui[key];
    });

    refs.recapHelpBtn.setAttribute("aria-label", ui.recapHelp);
    refs.recapCloseBtn.setAttribute("aria-label", "Close recap");
  }

  function render() {
    updateStaticText();
    renderRound();
    renderCards();
    renderFeedback();
    renderBottle();
    renderStats();
    renderTakeaways();
    renderRecapModal();
    renderCompletion(false);
    saveState();
  }

  function renderRound() {
    const ui = getUi();
    const round = getCurrentRound();
    const current = state.roundIndex + 1;
    const total = getRounds().length;
    refs.roundLabel.textContent = format(ui.roundOf, { current, total });
    refs.roundTitle.textContent = round.title;
    refs.roundPrompt.textContent = round.prompt || ui.chooseLie;
    refs.roundProgress.style.width = `${getRoundProgressPercent()}%`;
  }

  function renderCards() {
    const ui = getUi();
    const round = getCurrentRound();
    const answer = getCurrentAnswer();
    const order = state.roundOrders[state.roundIndex] || [0, 1, 2];
    const fragment = document.createDocumentFragment();

    order.forEach((claimIndex, visualIndex) => {
      const claim = round.claims[claimIndex];
      const button = document.createElement("button");
      const cardNumber = visualIndex + 1;
      const revealed = Boolean(answer);
      const selected = answer && answer.selectedClaimIndex === claimIndex;
      const isLie = !claim.truth;

      button.type = "button";
      button.className = "claim-card";
      button.dataset.claimIndex = String(claimIndex);
      button.disabled = revealed;
      button.style.animationDelay = `${visualIndex * 45}ms`;
      button.setAttribute("aria-label", format(ui.selectCard, { number: cardNumber }) + ` ${claim.text}`);

      if (revealed) {
        button.classList.add("is-revealed", isLie ? "is-lie" : "is-truth");
        if (selected) {
          button.classList.add("is-selected", answer.correct ? "is-correct-pick" : "is-wrong-pick");
        }
        const revealLabel = `${claim.text} ${isLie ? ui.lie : ui.truth}${
          claim.note ? `. ${claim.note}` : "."
        }`;
        button.setAttribute("aria-label", revealLabel);
      }

      button.append(
        createCardTop(round.topic, cardNumber),
        createElement("span", "claim-text", claim.text),
        createRevealRow(isLie ? ui.lie : ui.truth, claim.note)
      );

      button.addEventListener("click", () => handleCardSelect(claimIndex, button));
      fragment.append(button);
    });

    refs.cardsGrid.replaceChildren(fragment);
  }

  function createCardTop(topic, number) {
    const top = createElement("span", "card-top");
    top.append(createElement("span", "topic-token", topic), createElement("span", "card-number", `0${number}`));
    return top;
  }

  function createRevealRow(label, note) {
    const wrap = createElement("span", "reveal-row");
    wrap.append(createElement("span", "truth-badge", label));
    if (note) wrap.append(createElement("span", "claim-note", note));
    return wrap;
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  function renderFeedback() {
    const ui = getUi();
    const answer = getCurrentAnswer();
    refs.feedbackPanel.hidden = !answer;

    if (!answer) return;

    const round = getCurrentRound();
    const isFinal = state.roundIndex === getRounds().length - 1;
    refs.feedbackPanel.classList.toggle("is-miss", !answer.correct);
    refs.feedbackChip.textContent = answer.correct ? ui.correct : ui.incorrect;
    refs.feedbackTitle.textContent = answer.correct ? ui.correctTitle : ui.incorrectTitle;
    refs.feedbackText.textContent = round.explanation;
    refs.nextBtn.textContent = isFinal ? ui.viewRecap : ui.nextRound;
  }

  function renderBottle() {
    const percent = getBottleFillPercent();
    refs.bottleMeter.style.setProperty("--fill-level", `${percent}%`);
    refs.bottleMeter.setAttribute("aria-valuenow", String(percent));
    refs.bottlePercent.textContent = `${percent}%`;
  }

  function renderStats() {
    const ui = getUi();
    const completed = getCompletedCount();
    const total = getRounds().length;
    refs.scoreValue.textContent = `${state.score} / ${total}`;
    refs.streakValue.textContent = String(state.streak);
    refs.knowledgeValue.textContent = `${completed * TOTAL_CARDS_PER_ROUND} ${ui.cards}`;
  }

  function renderTakeaways() {
    const ui = getUi();
    const completed = getCompletedCount();
    const fragment = document.createDocumentFragment();
    refs.recapCount.textContent = `${completed} / ${getRounds().length}`;

    getRounds().forEach((round, index) => {
      const item = document.createElement("li");
      item.dataset.index = String(index + 1);
      const isUnlocked = state.complete || index < completed;
      item.classList.toggle("is-locked", !isUnlocked);
      item.textContent = isUnlocked ? round.takeaway : ui.lockedTakeaway;
      fragment.append(item);
    });

    refs.takeawayList.replaceChildren(fragment);
  }

  function renderCompletion(withCelebration) {
    const ui = getUi();
    const total = getRounds().length;
    const perfect = state.score === total;
    refs.completionScreen.hidden = !state.complete;
    updateBodyLock();

    if (!state.complete) return;

    refs.completionTitle.textContent = perfect ? ui.perfectTitle : ui.completeTitle;
    refs.completionCopy.textContent = perfect ? ui.perfectCopy : ui.completeCopy;
    refs.completionScore.textContent = `${state.score} / ${total}`;
    refs.roundProgress.style.width = "100%";

    if (withCelebration) {
      focusAfterRender(refs.completionScreen);
      launchConfetti();
      playTone("complete");
    }
  }

  function renderRecapModal() {
    refs.recapModal.hidden = !isRecapOpen;
    updateBodyLock();
  }

  function updateBodyLock() {
    document.body.classList.toggle("is-locked", state.complete || isRecapOpen);
  }

  function handleCardSelect(claimIndex, card) {
    if (getCurrentAnswer() || state.complete) return;

    const round = getCurrentRound();
    const selectedClaim = round.claims[claimIndex];
    const correct = selectedClaim.truth === false;
    state.answers[state.roundIndex] = {
      selectedClaimIndex: claimIndex,
      correct,
    };

    if (correct) {
      state.score += 1;
      state.streak += 1;
      state.bestStreak = Math.max(state.bestStreak, state.streak);
    } else {
      state.streak = 0;
    }

    const percentAfterAnswer = getBottleFillPercent();

    render();
    if (correct) pulseBottle();
    createAnswerBurst(card, correct);
    playTone(correct ? "correct" : "miss");

    const ui = getUi();
    refs.live.textContent = format(correct ? ui.liveCorrect : ui.liveIncorrect, {
      percent: percentAfterAnswer,
    });
    focusAfterRender(refs.feedbackPanel);
  }

  function goToNextRound() {
    if (!getCurrentAnswer()) return;

    if (state.roundIndex >= getRounds().length - 1) {
      state.complete = true;
      render();
      renderCompletion(true);
      saveState();
      return;
    }

    state.roundIndex += 1;
    render();
    focusFirstCard();
  }

  function resetGame() {
    isRecapOpen = false;
    safeStorageRemove(getStorageKey(lang));
    state = createInitialState(lang);
    render();
    focusFirstCard();
  }

  function openRecap() {
    isRecapOpen = true;
    renderRecapModal();
    focusAfterRender(refs.recapModal);
  }

  function closeRecap() {
    isRecapOpen = false;
    renderRecapModal();
    focusAfterRender(refs.recapHelpBtn);
  }

  function pulseBottle() {
    window.clearTimeout(bottlePulseTimer);
    refs.bottleMeter.classList.remove("is-pulsing");
    window.requestAnimationFrame(() => {
      refs.bottleMeter.classList.add("is-pulsing");
      bottlePulseTimer = window.setTimeout(() => {
        refs.bottleMeter.classList.remove("is-pulsing");
      }, 760);
    });
  }

  function createAnswerBurst(card, correct) {
    if (reducedMotionQuery.matches || !card) return;

    const panelBox = refs.burstLayer.getBoundingClientRect();
    const cardBox = card.getBoundingClientRect();
    const originX = cardBox.left - panelBox.left + cardBox.width / 2;
    const originY = cardBox.top - panelBox.top + cardBox.height / 2;
    const count = correct ? 16 : 8;

    for (let index = 0; index < count; index += 1) {
      const droplet = document.createElement("span");
      const angle = (Math.PI * 2 * index) / count;
      const distance = correct ? 92 : 44;
      droplet.className = "droplet";
      droplet.style.left = `${originX}px`;
      droplet.style.top = `${originY}px`;
      droplet.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
      droplet.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
      droplet.style.background = correct ? "var(--water)" : "var(--orange)";
      refs.burstLayer.append(droplet);
      window.setTimeout(() => droplet.remove(), 760);
    }
  }

  function launchConfetti() {
    if (reducedMotionQuery.matches) return;

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
    window.setTimeout(() => refs.confettiLayer.replaceChildren(), 2200);
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
      correct: [523, 784, 0.16],
      miss: [260, 196, 0.18],
      complete: [523, 659, 0.34],
    };
    const [start, end, duration] = tones[type] || tones.correct;
    const now = context.currentTime;
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = type === "miss" ? "sawtooth" : "triangle";
    oscillator.frequency.setValueAtTime(start, now);
    oscillator.frequency.exponentialRampToValueAtTime(end, now + duration);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(type === "complete" ? 0.12 : 0.07, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    oscillator.connect(gain).connect(context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }

  function focusAfterRender(element) {
    window.requestAnimationFrame(() => {
      element.focus({ preventScroll: true });
    });
  }

  function focusFirstCard() {
    window.requestAnimationFrame(() => {
      const firstCard = refs.cardsGrid.querySelector(".claim-card:not([disabled])");
      if (firstCard) firstCard.focus({ preventScroll: true });
    });
  }

  refs.resetBtn.addEventListener("click", resetGame);
  refs.nextBtn.addEventListener("click", goToNextRound);
  refs.recapHelpBtn.addEventListener("click", openRecap);
  refs.recapCloseBtn.addEventListener("click", closeRecap);
  refs.recapModal.addEventListener("click", (event) => {
    if (event.target === refs.recapModal) closeRecap();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isRecapOpen) closeRecap();
  });
  refs.playAgainBtn.addEventListener("click", resetGame);

  render();
})();
