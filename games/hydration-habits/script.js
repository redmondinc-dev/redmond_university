(function () {
  "use strict";

  const ASSET_BASE = "../../assets/imgs/png/re-lyte-rescue/";

  const content = {
    en: {
      pageTitle: "Hydration Habits",
      ui: {
        kicker: "Hydration Check",
        title: "Hydration Habits",
        intro: "Think about your everyday hydration habits and choose the option that best describes you. As you make your selections, watch the environment change to reflect how your habits affect your hydration.",
        reset: "Reset",
        habitatLabel: "Current habitat",
        habitLabel: "Hydration",
        habitTitle: "I drink...",
        liveUpdate: "{habitat}. Hydration habitat score is {score} percent.",
      },
      levels: [
        {
          id: "desert",
          token: "C",
          title: "Dry Desert",
          choice: "mostly soda, coffee, or energy drinks",
          short: "Low plain-water intake",
          score: 20,
          image: "Hydration 101-ilustration-1.png",
          imageAlt: "Dehydrated character",
          feedback: "Your body may be craving more plain water. Even one extra glass is a great place to start.",
        },
        {
          id: "sprout",
          token: "2",
          title: "First Sprout",
          choice: "about 2 glasses of water a day",
          short: "A small water baseline",
          score: 45,
          image: "Hydration 101-ilustration-2.png",
          imageAlt: "Thirsty character",
          feedback: "You're building a healthy habit. Adding a little more water each day can make a difference.",
        },
        {
          id: "oasis",
          token: "8",
          title: "Oasis Builder",
          choice: "about 8 glasses of water a day",
          short: "Strong fluid rhythm",
          score: 78,
          image: "Hydration 101-ilustration-4.png",
          imageAlt: "Recovering hydrated character",
          feedback: "Great hydration starts with water. Your body also relies on electrolytes to help maintain fluid balance.",
        },
        {
          id: "rainforest",
          token: "+",
          title: "Balanced Rainforest",
          choice: "plenty of water and replenish electrolytes with Re-Lyte",
          short: "Water plus electrolytes",
          score: 100,
          image: "Hydration 101-ilustration-5.png",
          imageAlt: "Hydrated character",
          feedback: "Great job! A balance of water and electrolytes helps support hydration so you can feel your best.",
        },
      ],
    },
    es: {
      pageTitle: "Habitos de Hidratacion",
      ui: {
        kicker: "Chequeo de hidratacion",
        title: "Habitos de Hidratacion",
        intro: "Elige un habito de hidratacion y mira como responde el habitat.",
        reset: "Reiniciar",
        habitatLabel: "Habitat actual",
        habitLabel: "Hidratacion",
        habitTitle: "Tomo...",
        liveUpdate: "{habitat}. El puntaje del habitat de hidratacion es {score} por ciento.",
      },
      levels: [
        {
          id: "desert",
          token: "C",
          title: "Desierto seco",
          choice: "Soda, cafe o energeticas",
          short: "Poca agua simple",
          score: 20,
          image: "Hydration 101-ilustration-1.png",
          imageAlt: "Personaje deshidratado",
          feedback: "Tu cuerpo podria necesitar mas agua simple.",
        },
        {
          id: "sprout",
          token: "2",
          title: "Primer brote",
          choice: "2 vasos de agua",
          short: "Una base pequena de agua",
          score: 45,
          image: "Hydration 101-ilustration-2.png",
          imageAlt: "Personaje con sed",
          feedback: "Ya tienes un inicio. Agrega otra pausa de agua.",
        },
        {
          id: "oasis",
          token: "8",
          title: "Constructor de oasis",
          choice: "8 vasos de agua",
          short: "Buen ritmo de fluidos",
          score: 78,
          image: "Hydration 101-ilustration-4.png",
          imageAlt: "Personaje recuperando hidratacion",
          feedback: "Buen ritmo. El calor, la actividad y el sudor cambian tus minerales.",
        },
        {
          id: "rainforest",
          token: "+",
          title: "Rainforest balanceado",
          choice: "Bastante agua + Re-Lyte",
          short: "Agua mas electrolitos",
          score: 100,
          image: "Hydration 101-ilustration-5.png",
          imageAlt: "Personaje hidratado",
          feedback: "Agua mas electrolitos apoya el balance de hidratacion.",
        },
      ],
    },
  };

  const refs = {
    shell: document.querySelector(".game-shell"),
    live: document.getElementById("live-region"),
    reset: document.getElementById("reset-btn"),
    habitatTitle: document.getElementById("habitat-title"),
    hydrationMeter: document.getElementById("hydration-meter"),
    hydrationFill: document.getElementById("hydration-fill"),
    hydrationScore: document.getElementById("hydration-score"),
    character: document.getElementById("character-img"),
    feedback: document.getElementById("feedback-copy"),
    choiceList: document.getElementById("choice-list"),
    range: document.getElementById("habit-range"),
    dropLayer: document.getElementById("drop-layer"),
  };

  const url = new URL(window.location.href);
  const requestedLang = (url.searchParams.get("lang") || "").toLowerCase();
  const lang = requestedLang === "es" ? "es" : "en";
  const dictionary = content[lang];
  const state = {
    levelIndex: 0,
  };

  function format(template, values) {
    return template.replace(/\{(\w+)\}/g, (_, key) => values[key] || "");
  }

  function applyLanguage() {
    document.documentElement.lang = lang;
    document.title = dictionary.pageTitle;
    document.querySelectorAll("[data-ui]").forEach((element) => {
      const value = dictionary.ui[element.dataset.ui];
      if (value) element.textContent = value;
    });
  }

  function createChoiceButton(level, index) {
    const button = document.createElement("button");
    button.className = "habit-choice";
    button.type = "button";
    button.dataset.index = String(index);
    button.setAttribute("aria-pressed", "false");
    button.innerHTML = `
      <span class="choice-token" aria-hidden="true">${level.token}</span>
      <span class="choice-copy">
        <strong>${level.choice}</strong>
      </span>
    `;
    button.addEventListener("click", () => setLevel(index, true));
    return button;
  }

  function renderControls() {
    refs.choiceList.replaceChildren(...dictionary.levels.map(createChoiceButton));
  }

  function updateChoiceState() {
    refs.choiceList.querySelectorAll(".habit-choice").forEach((button) => {
      const active = Number(button.dataset.index) === state.levelIndex;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function burstDrops(score) {
    const count = Math.max(4, Math.round(score / 18));
    const fragment = document.createDocumentFragment();

    for (let index = 0; index < count; index += 1) {
      const drop = document.createElement("span");
      drop.className = "drop";
      drop.style.left = `${24 + Math.random() * 52}%`;
      drop.style.top = `${24 + Math.random() * 46}%`;
      drop.style.animationDelay = `${Math.random() * 0.18}s`;
      fragment.appendChild(drop);
    }

    refs.dropLayer.replaceChildren(fragment);
    window.setTimeout(() => refs.dropLayer.replaceChildren(), 900);
  }

  function setLevel(nextIndex, announce) {
    const level = dictionary.levels[nextIndex] || dictionary.levels[0];
    state.levelIndex = nextIndex;

    refs.shell.dataset.habitat = level.id;
    refs.habitatTitle.textContent = level.title;
    refs.hydrationFill.style.width = `${level.score}%`;
    refs.hydrationScore.textContent = `${level.score}%`;
    refs.hydrationMeter.setAttribute("aria-valuenow", String(level.score));
    refs.character.src = `${ASSET_BASE}${level.image}`;
    refs.character.alt = level.imageAlt;
    refs.feedback.textContent = level.feedback;
    refs.range.value = String(nextIndex);

    updateChoiceState();

    if (announce) {
      refs.live.textContent = format(dictionary.ui.liveUpdate, {
        habitat: level.title,
        score: level.score,
      });
      burstDrops(level.score);
    }
  }

  function resetGame() {
    setLevel(0, true);
    updateChoiceState();
  }

  function bindEvents() {
    refs.range.addEventListener("input", (event) => {
      setLevel(Number(event.target.value), true);
    });
    refs.reset.addEventListener("click", resetGame);
  }

  applyLanguage();
  renderControls();
  bindEvents();
  setLevel(0, false);
})();
