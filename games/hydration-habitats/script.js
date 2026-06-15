(function () {
  "use strict";

  const ASSET_BASE = "../../assets/imgs/png/re-lyte-rescue/";

  const content = {
    en: {
      pageTitle: "Hydration Habitats",
      ui: {
        kicker: "Hydration Check",
        title: "Hydration Habitats",
        intro: "Pick one habit and watch the habitat respond.",
        reset: "Reset",
        habitatLabel: "Current habitat",
        habitLabel: "Hydration",
        habitTitle: "I drink...",
        reflectionLabel: "Next step",
        reflectionTitle: "What do you want to learn?",
        resultLabel: "Habitat mapped",
        liveUpdate: "{habitat}. Hydration habitat score is {score} percent.",
        goalResult: "From {habitat}, focus on {goal}.",
      },
      levels: [
        {
          id: "desert",
          token: "C",
          title: "Dry Desert",
          choice: "Soda, coffee, or energy drinks",
          short: "Low plain-water intake",
          score: 20,
          image: "hydration-boy-01-dehydrated.png",
          imageAlt: "Dehydrated character",
          feedback: "Your body may be asking for more plain water.",
        },
        {
          id: "sprout",
          token: "2",
          title: "First Sprout",
          choice: "2 glasses of water",
          short: "A small water baseline",
          score: 45,
          image: "hydration-boy-02-thirsty.png",
          imageAlt: "Thirsty character",
          feedback: "You have a start. Add one more water break.",
        },
        {
          id: "oasis",
          token: "8",
          title: "Oasis Builder",
          choice: "8 glasses of water",
          short: "Strong fluid rhythm",
          score: 78,
          image: "hydration-boy-04-retaining.png",
          imageAlt: "Recovering hydrated character",
          feedback: "Strong routine. Heat, activity, and sweat can change mineral needs.",
        },
        {
          id: "rainforest",
          token: "+",
          title: "Balanced Rainforest",
          choice: "Plenty of water + Re-Lyte",
          short: "Water plus electrolytes",
          score: 100,
          image: "hydration-boy-05-hydrated.png",
          imageAlt: "Hydrated character",
          feedback: "Water plus electrolytes can support hydration balance.",
        },
      ],
      goals: [
        {
          token: "H2O",
          label: "Drink more water",
          detail: "Build a simple daily rhythm",
          result: "drinking more water",
        },
        {
          token: "Na",
          label: "Understand electrolytes",
          detail: "Connect minerals to hydration",
          result: "understanding electrolytes",
        },
        {
          token: "DAY",
          label: "Build a daily routine",
          detail: "Make hydration easier to repeat",
          result: "building a daily routine",
        },
      ],
    },
    es: {
      pageTitle: "Hydration Habitats",
      ui: {
        kicker: "Chequeo de hidratacion",
        title: "Hydration Habitats",
        intro: "Elige un habito y mira como responde el habitat.",
        reset: "Reiniciar",
        habitatLabel: "Habitat actual",
        habitLabel: "Hidratacion",
        habitTitle: "Tomo...",
        reflectionLabel: "Siguiente paso",
        reflectionTitle: "Que quieres aprender?",
        resultLabel: "Habitat mapeado",
        liveUpdate: "{habitat}. El puntaje del habitat de hidratacion es {score} por ciento.",
        goalResult: "Desde {habitat}, enfocate en {goal}.",
      },
      levels: [
        {
          id: "desert",
          token: "C",
          title: "Desierto seco",
          choice: "Soda, cafe o energeticas",
          short: "Poca agua simple",
          score: 20,
          image: "hydration-boy-01-dehydrated.png",
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
          image: "hydration-boy-02-thirsty.png",
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
          image: "hydration-boy-04-retaining.png",
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
          image: "hydration-boy-05-hydrated.png",
          imageAlt: "Personaje hidratado",
          feedback: "Agua mas electrolitos apoya el balance de hidratacion.",
        },
      ],
      goals: [
        {
          token: "H2O",
          label: "Tomar mas agua",
          detail: "Crear un ritmo diario simple",
          result: "tomar mas agua",
        },
        {
          token: "Na",
          label: "Entender electrolitos",
          detail: "Conectar minerales con hidratacion",
          result: "entender los electrolitos",
        },
        {
          token: "DIA",
          label: "Crear una rutina diaria",
          detail: "Hacer la hidratacion mas repetible",
          result: "crear una rutina diaria",
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
    goalList: document.getElementById("goal-list"),
    range: document.getElementById("habit-range"),
    resultBox: document.getElementById("result-box"),
    resultCopy: document.getElementById("result-copy"),
    dropLayer: document.getElementById("drop-layer"),
  };

  const url = new URL(window.location.href);
  const requestedLang = (url.searchParams.get("lang") || "").toLowerCase();
  const lang = requestedLang === "es" ? "es" : "en";
  const dictionary = content[lang];
  const state = {
    levelIndex: 0,
    goalIndex: null,
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

  function createGoalButton(goal, index) {
    const button = document.createElement("button");
    button.className = "goal-choice";
    button.type = "button";
    button.dataset.index = String(index);
    button.setAttribute("aria-pressed", "false");
    button.innerHTML = `
      <span class="goal-token" aria-hidden="true">${goal.token}</span>
      <span class="goal-copy">
        <strong>${goal.label}</strong>
      </span>
    `;
    button.addEventListener("click", () => setGoal(index));
    return button;
  }

  function renderControls() {
    refs.choiceList.replaceChildren(...dictionary.levels.map(createChoiceButton));
    refs.goalList.replaceChildren(...dictionary.goals.map(createGoalButton));
  }

  function updateChoiceState() {
    refs.choiceList.querySelectorAll(".habit-choice").forEach((button) => {
      const active = Number(button.dataset.index) === state.levelIndex;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    refs.goalList.querySelectorAll(".goal-choice").forEach((button) => {
      const active = Number(button.dataset.index) === state.goalIndex;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function updateResult() {
    if (state.goalIndex === null) {
      refs.resultBox.hidden = true;
      refs.resultCopy.textContent = "";
      return;
    }

    const level = dictionary.levels[state.levelIndex];
    const goal = dictionary.goals[state.goalIndex];
    refs.resultCopy.textContent = format(dictionary.ui.goalResult, {
      habitat: level.title,
      goal: goal.result,
    });
    refs.resultBox.hidden = false;
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
    updateResult();

    if (announce) {
      refs.live.textContent = format(dictionary.ui.liveUpdate, {
        habitat: level.title,
        score: level.score,
      });
      burstDrops(level.score);
    }
  }

  function setGoal(nextIndex) {
    state.goalIndex = nextIndex;
    updateChoiceState();
    updateResult();
    burstDrops(dictionary.levels[state.levelIndex].score);
  }

  function resetGame() {
    state.goalIndex = null;
    setLevel(0, true);
    updateChoiceState();
    updateResult();
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
