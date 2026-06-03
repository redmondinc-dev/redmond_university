(function () {
  "use strict";

  const STORAGE_PREFIX = "relyte-two-truths-hydration-v1";
  const TOTAL_CARDS_PER_ROUND = 3;

  const content = {
    en: {
      pageTitle: "Two Truths and a Lie: Hydration Edition",
      ui: {
        kicker: "Re-Lyte Micro Game",
        title: "Two Truths and a Lie: Hydration Edition",
        intro: "Find the hydration myth. Every correct pick adds to your Re-Lyte bottle.",
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
          topic: "Electrolytes",
          title: "Electrolytes matter",
          prompt: "Hydration is more than chasing ounces. Find the myth.",
          claims: [
            {
              text: "Electrolytes help carry electrical signals that support muscles and nerves.",
              truth: true,
              note: "Sodium, potassium, magnesium, and calcium all help normal body function.",
            },
            {
              text: "Sodium helps the body hold onto fluid when sweat loss is high.",
              truth: true,
              note: "That is why salty sweat can change what your body needs.",
            },
            {
              text: "If you drink enough plain water, electrolytes never matter.",
              truth: false,
              note: "Water matters, but heavy sweat or heat can also raise mineral needs.",
            },
          ],
          explanation:
            "Plain water is useful, but hydration also depends on fluid balance. Electrolytes help the body use and retain fluids, especially when sweat loss climbs.",
          takeaway: "Hydration is water plus fluid-balance minerals.",
        },
        {
          topic: "Daily loss",
          title: "Everyday electrolyte loss",
          prompt: "Not every electrolyte loss looks like a gym session.",
          claims: [
            {
              text: "Sweat carries water and electrolytes out of the body.",
              truth: true,
              note: "Sodium is usually the mineral lost in the largest amount through sweat.",
            },
            {
              text: "Long shifts, hot rooms, and outdoor work can increase electrolyte loss.",
              truth: true,
              note: "Daily context matters, even without a formal workout.",
            },
            {
              text: "Only professional athletes need to think about electrolytes.",
              truth: false,
              note: "Heat, sweat, and long active days can affect many people.",
            },
          ],
          explanation:
            "Electrolyte needs are context driven. Work, heat, travel, workouts, and long active days can all change what normal hydration support looks like.",
          takeaway: "Sweat loss is not limited to athletes.",
        },
        {
          topic: "Water myths",
          title: "Hydration signals",
          prompt: "Some popular hydration advice is too simple.",
          claims: [
            {
              text: "Thirst, urine color, heat, and activity can all give hydration clues.",
              truth: true,
              note: "No single signal tells the whole story.",
            },
            {
              text: "Very pale urine all day is not automatically the perfect hydration target.",
              truth: true,
              note: "It can sometimes mean fluid intake is outpacing what the body needs.",
            },
            {
              text: "The best hydration plan is always to drink as much water as possible.",
              truth: false,
              note: "More is not always better. Balance matters.",
            },
          ],
          explanation:
            "Hydration is about balance, not maximum water. Too much plain water without enough minerals can work against fluid balance.",
          takeaway: "Better hydration is balanced, not endless.",
        },
        {
          topic: "Salt",
          title: "The salt confusion",
          prompt: "Salt gets blamed for everything. Spot the overstatement.",
          claims: [
            {
              text: "Sweat can remove enough sodium that some people need to replace it.",
              truth: true,
              note: "Needs vary by sweat rate, heat, diet, and activity.",
            },
            {
              text: "Electrolytes include minerals beyond sodium, such as potassium and magnesium.",
              truth: true,
              note: "A balanced mix supports more than one mineral role.",
            },
            {
              text: "Salt always dehydrates everyone in every situation.",
              truth: false,
              note: "The real question is amount, context, and total diet.",
            },
          ],
          explanation:
            "Sodium is an electrolyte, not automatically the enemy. In sweaty or hot conditions, replacing sodium can support better fluid retention.",
          takeaway: "Sodium can support hydration when context calls for it.",
        },
        {
          topic: "Sugar",
          title: "Sugar and electrolytes",
          prompt: "A hydration drink does not need to feel like candy.",
          claims: [
            {
              text: "A sugar-free electrolyte mix can still help replace minerals.",
              truth: true,
              note: "Mineral replacement does not require a high-sugar drink.",
            },
            {
              text: "Taste can be clean and salty because electrolytes are minerals.",
              truth: true,
              note: "That mineral taste is part of the function.",
            },
            {
              text: "Electrolytes only work when a drink is loaded with sugar.",
              truth: false,
              note: "Sugar can serve specific performance needs, but it is not always required.",
            },
          ],
          explanation:
            "Electrolytes are minerals. Some people want carbs for endurance fuel, but everyday electrolyte replacement can be done without a sugary drink.",
          takeaway: "Electrolytes do not have to mean high sugar.",
        },
        {
          topic: "Heat",
          title: "When needs increase",
          prompt: "Find the statement that ignores real life conditions.",
          claims: [
            {
              text: "Heat and humidity can raise sweat rate and electrolyte needs.",
              truth: true,
              note: "The same activity can be more demanding in hotter conditions.",
            },
            {
              text: "Travel days and dry environments can make hydration harder to read.",
              truth: true,
              note: "Routine changes can change fluid habits and thirst cues.",
            },
            {
              text: "Indoor days mean hydration needs never change.",
              truth: false,
              note: "Long shifts, dry air, caffeine, and activity can still matter.",
            },
          ],
          explanation:
            "Hydration needs move with environment and routine. Heat is obvious, but long days indoors can still change how much support someone needs.",
          takeaway: "Environment and routine change hydration needs.",
        },
        {
          topic: "Retention",
          title: "Using the water you drink",
          prompt: "One card treats water intake and hydration as the same thing.",
          claims: [
            {
              text: "Electrolytes help maintain fluid balance inside and outside cells.",
              truth: true,
              note: "That balance is part of why minerals matter.",
            },
            {
              text: "In high-sweat moments, electrolytes can help fluids stick around longer.",
              truth: true,
              note: "Retention is the difference between drinking water and using it well.",
            },
            {
              text: "Hydration is only the number of ounces you drink.",
              truth: false,
              note: "Ounces count, but absorption, retention, and mineral balance count too.",
            },
          ],
          explanation:
            "Water intake is one input. Hydration is the outcome: fluid balance, mineral balance, and whether the body can actually use what you drink.",
          takeaway: "Hydration is an outcome, not just an ounce count.",
        },
        {
          topic: "Timing",
          title: "Smart hydration timing",
          prompt: "Find the advice that waits too long.",
          claims: [
            {
              text: "Starting hydrated before heat or activity can make the day easier.",
              truth: true,
              note: "Playing catch-up after heavy sweat is harder.",
            },
            {
              text: "After sweaty activity, fluids plus electrolytes can support recovery.",
              truth: true,
              note: "Replacement works best when it matches what was lost.",
            },
            {
              text: "You should wait until you feel depleted before thinking about hydration.",
              truth: false,
              note: "A simple plan before, during, and after works better.",
            },
          ],
          explanation:
            "Good hydration is proactive. A small plan before heat, sweat, or long active days is easier than trying to recover after feeling depleted.",
          takeaway: "Plan hydration before the hard part starts.",
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
        button.setAttribute(
          "aria-label",
          `${claim.text} ${isLie ? ui.lie : ui.truth}. ${claim.note}`
        );
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
    wrap.append(createElement("span", "truth-badge", label), createElement("span", "claim-note", note));
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
