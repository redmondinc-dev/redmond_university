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
        intro: "Find the hydration myth. Every round adds to your Re-Lyte bottle.",
        replay: "Replay",
        soundOff: "Sound off",
        soundOn: "Sound on",
        progressLabel: "Bottle progress",
        bottleTitle: "Re-Lyte fill",
        hydrationMix: "Hydration Mix",
        scoreLabel: "Score",
        streakLabel: "Streak",
        knowledgeLabel: "Knowledge",
        recapLabel: "Unlocked recap",
        recapTitle: "Hydration takeaways",
        recapHelp: "Open hydration recap",
        completeChip: "Bottle full",
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
          "Bottle full. You finished the loop and reviewed the myths that make hydration confusing.",
        selectCard: "Select card {number} as the lie.",
        liveCorrect: "Correct. The Re-Lyte bottle filled to {percent} percent.",
        liveIncorrect: "Not it. The correct lie was revealed and the bottle filled to {percent} percent.",
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
    es: {
      pageTitle: "Dos verdades y una mentira: Hidratacion",
      ui: {
        kicker: "Microjuego Re-Lyte",
        title: "Dos verdades y una mentira: Hidratacion",
        intro: "Encuentra el mito de hidratacion. Cada ronda llena tu botella Re-Lyte.",
        replay: "Jugar otra vez",
        soundOff: "Sonido apagado",
        soundOn: "Sonido activo",
        progressLabel: "Progreso de botella",
        bottleTitle: "Carga Re-Lyte",
        hydrationMix: "Mezcla de Hidratacion",
        scoreLabel: "Puntaje",
        streakLabel: "Racha",
        knowledgeLabel: "Aprendizaje",
        recapLabel: "Resumen desbloqueado",
        recapTitle: "Claves de hidratacion",
        recapHelp: "Abrir resumen de hidratacion",
        completeChip: "Botella llena",
        playAgain: "Jugar de nuevo",
        roundOf: "Ronda {current} de {total}",
        chooseLie: "Cual afirmacion es la mentira?",
        truth: "VERDAD",
        lie: "MENTIRA",
        correct: "Correcto",
        incorrect: "No era",
        correctTitle: "Esa era la mentira.",
        incorrectTitle: "Cerca. Esta era la mentira.",
        nextRound: "Siguiente ronda",
        viewRecap: "Ver resumen",
        cards: "cartas",
        lockedTakeaway: "Completa esta ronda para desbloquear la clave.",
        perfectTitle: "IQ de hidratacion completo",
        perfectCopy:
          "Ronda perfecta. Detectaste todos los mitos y llenaste la botella con buenas claves de hidratacion.",
        completeTitle: "IQ de hidratacion completo",
        completeCopy:
          "Botella llena. Terminaste el ciclo y repasaste los mitos que confunden la hidratacion.",
        selectCard: "Seleccionar carta {number} como la mentira.",
        liveCorrect: "Correcto. La botella Re-Lyte llego a {percent} por ciento.",
        liveIncorrect:
          "No era. La mentira correcta fue revelada y la botella llego a {percent} por ciento.",
      },
      rounds: [
        {
          topic: "Electrolitos",
          title: "Los electrolitos importan",
          prompt: "Hidratarse es mas que perseguir onzas. Encuentra el mito.",
          claims: [
            {
              text: "Los electrolitos ayudan a llevar senales electricas que apoyan musculos y nervios.",
              truth: true,
              note: "Sodio, potasio, magnesio y calcio apoyan funciones normales del cuerpo.",
            },
            {
              text: "El sodio ayuda al cuerpo a retener liquidos cuando se suda mucho.",
              truth: true,
              note: "Por eso el sudor salado puede cambiar lo que el cuerpo necesita.",
            },
            {
              text: "Si tomas suficiente agua sola, los electrolitos nunca importan.",
              truth: false,
              note: "El agua importa, pero el sudor fuerte o el calor tambien suben la necesidad de minerales.",
            },
          ],
          explanation:
            "El agua sola ayuda, pero la hidratacion tambien depende del balance de liquidos. Los electrolitos ayudan al cuerpo a usar y retener fluidos, sobre todo cuando aumenta el sudor.",
          takeaway: "La hidratacion es agua mas minerales de balance.",
        },
        {
          topic: "Perdida diaria",
          title: "Perdida diaria de electrolitos",
          prompt: "No toda perdida de electrolitos parece una sesion de gimnasio.",
          claims: [
            {
              text: "El sudor saca agua y electrolitos del cuerpo.",
              truth: true,
              note: "El sodio suele ser el mineral que mas se pierde por sudor.",
            },
            {
              text: "Turnos largos, cuartos calientes y trabajo al aire libre pueden aumentar la perdida.",
              truth: true,
              note: "El contexto del dia importa, incluso sin entrenamiento formal.",
            },
            {
              text: "Solo los atletas profesionales deben pensar en electrolitos.",
              truth: false,
              note: "Calor, sudor y dias activos tambien afectan a muchas personas.",
            },
          ],
          explanation:
            "La necesidad de electrolitos depende del contexto. Trabajo, calor, viajes, entrenamientos y dias activos pueden cambiar el apoyo de hidratacion.",
          takeaway: "La perdida por sudor no es solo de atletas.",
        },
        {
          topic: "Mitos del agua",
          title: "Senales de hidratacion",
          prompt: "Algunos consejos populares son demasiado simples.",
          claims: [
            {
              text: "Sed, color de orina, calor y actividad pueden dar pistas de hidratacion.",
              truth: true,
              note: "Ninguna senal cuenta toda la historia.",
            },
            {
              text: "Orina muy clara todo el dia no siempre es la meta perfecta.",
              truth: true,
              note: "A veces significa que el liquido supera lo que el cuerpo necesita.",
            },
            {
              text: "El mejor plan siempre es tomar tanta agua como sea posible.",
              truth: false,
              note: "Mas no siempre es mejor. El balance importa.",
            },
          ],
          explanation:
            "La hidratacion se trata de balance, no de agua maxima. Demasiada agua sola, sin suficientes minerales, puede ir contra el balance de fluidos.",
          takeaway: "Mejor hidratacion significa balance, no exceso.",
        },
        {
          topic: "Sal",
          title: "La confusion sobre la sal",
          prompt: "A la sal se le culpa de todo. Detecta la exageracion.",
          claims: [
            {
              text: "El sudor puede sacar suficiente sodio como para que algunas personas deban reemplazarlo.",
              truth: true,
              note: "La necesidad cambia por sudor, calor, dieta y actividad.",
            },
            {
              text: "Los electrolitos incluyen minerales ademas del sodio, como potasio y magnesio.",
              truth: true,
              note: "Una mezcla balanceada apoya mas de un rol mineral.",
            },
            {
              text: "La sal siempre deshidrata a todos en cualquier situacion.",
              truth: false,
              note: "La pregunta real es cantidad, contexto y dieta total.",
            },
          ],
          explanation:
            "El sodio es un electrolito, no un enemigo automatico. En calor o mucho sudor, reemplazar sodio puede apoyar mejor retencion de fluidos.",
          takeaway: "El sodio puede apoyar hidratacion segun el contexto.",
        },
        {
          topic: "Azucar",
          title: "Azucar y electrolitos",
          prompt: "Una bebida de hidratacion no tiene que sentirse como dulce.",
          claims: [
            {
              text: "Una mezcla de electrolitos sin azucar aun puede ayudar a reemplazar minerales.",
              truth: true,
              note: "Reemplazar minerales no exige una bebida alta en azucar.",
            },
            {
              text: "El sabor puede ser limpio y salado porque los electrolitos son minerales.",
              truth: true,
              note: "Ese sabor mineral es parte de la funcion.",
            },
            {
              text: "Los electrolitos solo funcionan cuando la bebida tiene mucha azucar.",
              truth: false,
              note: "El azucar puede servir para rendimiento especifico, pero no siempre se requiere.",
            },
          ],
          explanation:
            "Los electrolitos son minerales. Algunas personas quieren carbohidratos como energia de resistencia, pero el reemplazo diario de minerales puede hacerse sin bebida azucarada.",
          takeaway: "Electrolitos no tiene que significar mucha azucar.",
        },
        {
          topic: "Calor",
          title: "Cuando suben las necesidades",
          prompt: "Encuentra la frase que ignora condiciones reales.",
          claims: [
            {
              text: "Calor y humedad pueden aumentar el sudor y la necesidad de electrolitos.",
              truth: true,
              note: "La misma actividad puede exigir mas en condiciones calientes.",
            },
            {
              text: "Dias de viaje y ambientes secos pueden hacer mas dificil leer la hidratacion.",
              truth: true,
              note: "Cambios de rutina tambien cambian habitos de liquido y sed.",
            },
            {
              text: "Los dias en interiores significan que la hidratacion nunca cambia.",
              truth: false,
              note: "Turnos largos, aire seco, cafeina y actividad aun pueden importar.",
            },
          ],
          explanation:
            "Las necesidades de hidratacion se mueven con ambiente y rutina. El calor es obvio, pero un dia largo en interiores tambien puede cambiar el apoyo necesario.",
          takeaway: "Ambiente y rutina cambian la hidratacion.",
        },
        {
          topic: "Retencion",
          title: "Usar el agua que tomas",
          prompt: "Una carta trata consumo de agua e hidratacion como lo mismo.",
          claims: [
            {
              text: "Los electrolitos ayudan a mantener balance de liquidos dentro y fuera de las celulas.",
              truth: true,
              note: "Ese balance es parte de por que importan los minerales.",
            },
            {
              text: "En momentos de mucho sudor, los electrolitos pueden ayudar a que los fluidos duren mas.",
              truth: true,
              note: "Retencion es la diferencia entre tomar agua y usarla bien.",
            },
            {
              text: "Hidratacion es solo el numero de onzas que tomas.",
              truth: false,
              note: "Las onzas cuentan, pero absorcion, retencion y minerales tambien.",
            },
          ],
          explanation:
            "El agua que tomas es un dato. La hidratacion es el resultado: balance de fluidos, balance mineral y si el cuerpo puede usar lo que bebes.",
          takeaway: "Hidratacion es resultado, no solo onzas.",
        },
        {
          topic: "Timing",
          title: "Buen timing de hidratacion",
          prompt: "Encuentra el consejo que espera demasiado.",
          claims: [
            {
              text: "Empezar hidratado antes de calor o actividad puede hacer el dia mas facil.",
              truth: true,
              note: "Ponerse al dia despues de sudar mucho es mas dificil.",
            },
            {
              text: "Despues de sudar, fluidos mas electrolitos pueden apoyar recuperacion.",
              truth: true,
              note: "Reemplazar funciona mejor cuando se parece a lo que se perdio.",
            },
            {
              text: "Debes esperar a sentirte agotado antes de pensar en hidratacion.",
              truth: false,
              note: "Un plan simple antes, durante y despues funciona mejor.",
            },
          ],
          explanation:
            "Buena hidratacion es proactiva. Un pequeno plan antes de calor, sudor o dias activos es mas facil que recuperarse despues de sentirse agotado.",
          takeaway: "Planea hidratacion antes de la parte dificil.",
        },
      ],
    },
  };

  const refs = {
    live: document.getElementById("live-region"),
    brandLink: document.querySelector(".brand-mark"),
    languageButtons: Array.from(document.querySelectorAll(".language-btn")),
    soundToggle: document.getElementById("sound-toggle"),
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

  let lang = getInitialLanguage();
  let state = loadState(lang) || createInitialState(lang);
  let audioContext = null;
  let bottlePulseTimer = 0;
  let isRecapOpen = false;

  function getInitialLanguage() {
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("lang");
    if (requested === "en" || requested === "es") return requested;

    const stored = safeStorageGet(`${STORAGE_PREFIX}:last-lang`);
    if (stored === "en" || stored === "es") return stored;

    return navigator.language && navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
  }

  function createInitialState(language) {
    return {
      lang: language,
      roundIndex: 0,
      answers: [],
      score: 0,
      streak: 0,
      bestStreak: 0,
      soundOn: false,
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
      parsed.soundOn = Boolean(parsed.soundOn);
      parsed.complete = Boolean(parsed.complete);
      return parsed;
    } catch (error) {
      return null;
    }
  }

  function saveState() {
    safeStorageSet(getStorageKey(lang), JSON.stringify(state));
    safeStorageSet(`${STORAGE_PREFIX}:last-lang`, lang);
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

  function getFillPercent() {
    return Math.round((getCompletedCount() / getRounds().length) * 100);
  }

  function updateStaticText() {
    const ui = getUi();
    document.documentElement.lang = lang;
    document.title = ui.pageTitle;

    document.querySelectorAll("[data-ui]").forEach((element) => {
      const key = element.dataset.ui;
      if (ui[key]) element.textContent = ui[key];
    });

    refs.languageButtons.forEach((button) => {
      const isActive = button.dataset.lang === lang;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    const next = new URL("../../menu/index.html", window.location.href);
    next.searchParams.set("lang", lang);
    refs.brandLink.href = `${next.pathname}${next.search}`;
    refs.recapHelpBtn.setAttribute("aria-label", ui.recapHelp);
    refs.recapCloseBtn.setAttribute("aria-label", lang === "es" ? "Cerrar resumen" : "Close recap");
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
    renderSound();
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
    refs.roundProgress.style.width = `${getFillPercent()}%`;
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
    const percent = getFillPercent();
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

  function renderSound() {
    const ui = getUi();
    const label = state.soundOn ? ui.soundOn : ui.soundOff;
    const labelNode = refs.soundToggle.querySelector("[data-ui]");
    if (labelNode) labelNode.textContent = label;
    refs.soundToggle.setAttribute("aria-pressed", String(state.soundOn));
  }

  function handleCardSelect(claimIndex, card) {
    if (getCurrentAnswer() || state.complete) return;

    const round = getCurrentRound();
    const selectedClaim = round.claims[claimIndex];
    const correct = selectedClaim.truth === false;
    const percentAfterAnswer = Math.round(((getCompletedCount() + 1) / getRounds().length) * 100);

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

    render();
    pulseBottle();
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

  function setLanguage(nextLang) {
    if (nextLang !== "en" && nextLang !== "es") return;
    isRecapOpen = false;
    lang = nextLang;
    state = loadState(lang) || createInitialState(lang);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    render();
    focusFirstCard();
  }

  function toggleSound() {
    state.soundOn = !state.soundOn;
    if (state.soundOn) {
      ensureAudioContext();
      playTone("toggle");
    }
    renderSound();
    saveState();
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
    if (!state.soundOn) return;
    const context = ensureAudioContext();
    if (!context) return;

    const tones = {
      correct: [523, 784, 0.16],
      miss: [260, 196, 0.18],
      complete: [523, 659, 0.34],
      toggle: [420, 560, 0.12],
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

  refs.languageButtons.forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.lang));
  });
  refs.soundToggle.addEventListener("click", toggleSound);
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
