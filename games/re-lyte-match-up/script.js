(function () {
  "use strict";

  const ASSET_ROOT = "../memory/assets/";
  const CHARACTER_ROOT = "../../assets/imgs/png/";
  const products = [
    { id: "hydration", name: "Hydration", image: ASSET_ROOT + "re-lyte-hydration.webp" },
    { id: "pre-workout", name: "Pre-Workout", image: ASSET_ROOT + "re-lyte-pre-workout.webp" },
    { id: "hydration-plus-capsules", name: "Hydration Plus Capsules", image: ASSET_ROOT + "re-lyte-hydration-plus-capsules.jpg" },
    { id: "energy", name: "Energy", image: ASSET_ROOT + "re-lyte-energy.webp" },
    { id: "kids", name: "Kids", image: ASSET_ROOT + "re-lyte-kids.webp" },
    { id: "immunity", name: "Immunity", image: ASSET_ROOT + "re-lyte-immunity.webp" },
    { id: "hydration-support-capsules", name: "Hydration Support Capsules", image: ASSET_ROOT + "re-lyte-hydration-capsules.jpg" },
    { id: "energy-boost-capsules", name: "Energy Boost Capsules", image: ASSET_ROOT + "re-lyte-capsules.webp" },
  ];

  const characters = {
    johnnyDaily: { image: "imgs/Johnny Waking Up.png", alt: "Johnny waking up and hydrating" },
    johnnyWorkout: { image: "imgs/Johnny Exercising.png", alt: "Workout Johnny exercising" },
    silas: { image: CHARACTER_ROOT + "Stuard of the Land small.png", alt: "Silas" },
    caleb: { image: CHARACTER_ROOT + "Concious Caretaker.png", alt: "Caleb" },
    maya: { image: CHARACTER_ROOT + "Optimized Living Enthusiast.png", alt: "Maya" },
    cedar: { image: CHARACTER_ROOT + "Peak Performer.png", alt: "Cedar" },
    shawna: { image: CHARACTER_ROOT + "Master of the Meal.png", alt: "Chef Shawna" },
  };

  const storyBank = [
    { name: "Johnny", character: "johnnyDaily", answer: "hydration", story: "My alarm goes off, and the day is already moving. I’ve got work, errands, and plenty to get done, but I’ve learned that starting my morning with good hydration helps me feel ready for whatever the day brings. I’m not an elite athlete—I just want something simple I can make part of my everyday routine." },
    { name: "Workout Johnny", character: "johnnyWorkout", answer: "pre-workout", story: "I’m not a professional athlete, but I like getting a good workout in when I can. When I know I’ve got a tough training session ahead, I want to show up ready to push myself and get the most out of my workout. I’m looking for something designed to support me before an intense workout." },
    { name: "Silas", character: "silas", answer: "hydration-plus-capsules", story: "My days on the farm start early, and there’s always something that needs to be done. Between feeding animals, working the fields, and keeping up with the endless list of chores, I don’t always have time to stop and prepare a drink. I want a simple, convenient way to get the electrolytes I need while I’m working and keep moving through my day." },
    { name: "Caleb", character: "caleb", answer: "energy", story: "Between school drop-offs, work, and keeping up with the kids, my mornings can get hectic fast. By the afternoon, I’m running on fumes. I’m looking for something that can help support my energy so I can keep showing up for my family." },
    { name: "Caleb", character: "caleb", answer: "kids", story: "My kids spend most of their free time running around. Soccer practice, bike rides, playing outside—it seems like they’re always moving. I want to make hydration easy and enjoyable for them, with something designed specifically with kids in mind." },
    { name: "Caleb", character: "caleb", answer: "immunity", story: "I’m usually thinking about everyone else before I think about myself. When sickness starts making its way through the family, I want to be proactive about supporting our health. I’m looking for something that combines hydration with ingredients that support immune health." },
    { name: "Maya", character: "maya", answer: "hydration-support-capsules", story: "I read labels. I want to know exactly what I’m putting into my body, and I don’t want a long list of ingredients I don’t recognize. I don’t love the taste of unflavored, but I also don’t want all the extras that can come with flavored options. I’m looking for a simple, tasteless way to get the electrolytes I want, without adding anything unnecessary to my routine." },
    { name: "Maya", character: "maya", answer: "immunity", story: "I’m always looking for simple, proactive ways to support my health. I pay attention to what I’m putting into my body, and I’d rather build supportive habits into my routine than wait until I’m feeling run down. I’m looking for something that combines hydration with thoughtful ingredients that support immune health." },
    { name: "Cedar", character: "cedar", answer: "pre-workout", story: "I have a big workout planned today, and it’s not going to be easy. When I train, I want to be intentional about how I prepare. I’m looking for something specifically designed to support myself through a challenging workout." },
    { name: "Cedar", character: "cedar", answer: "hydration", story: "Not every morning is about pushing my limits. Some days, I start with a little yoga, stretching, and quiet time before the rest of my day begins. I’m looking for a simple hydration routine that supports me through everyday movement and wellness—not just intense workouts." },
    { name: "Chef Shawna", character: "shawna", answer: "energy-boost-capsules", story: "I’m on my feet all day, and my job requires me to taste everything. I need to stay energized, but I don’t want to constantly be drinking something flavored while I’m working with food. I’m looking for a convenient option to hydrate and boost my energy that won’t interfere with my palate." },
    { name: "Chef Shawna", character: "shawna", answer: "immunity", story: "When I’m cooking for other people, getting sick isn’t an option I want to entertain. I’m proactive about my health and like to support my immune system before I’m feeling run down, especially when I have meals to prepare and people counting on me. I’m looking for something that can support hydration while also providing ingredients that support my immune health." },
  ];

  let stories = shuffle(storyBank);

  const refs = Object.fromEntries(["live-region", "reset-btn", "progress-label", "score-label", "progress-track", "progress-fill", "game-layout", "story-number", "character-image", "customer-name", "customer-story", "product-grid", "selection-status", "feedback-card", "feedback-icon", "feedback-label", "feedback-title", "feedback-copy", "next-btn", "results-card", "results-title", "score-number", "results-copy", "play-again-btn", "confetti-layer"].map((id) => [id.replace(/-([a-z])/g, (_, c) => c.toUpperCase()), document.getElementById(id)]));

  let state = { index: 0, score: 0, answered: false, selected: "" };

  function productById(id) { return products.find((product) => product.id === id); }

  function shuffle(items) {
    const output = [...items];
    for (let index = output.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [output[index], output[randomIndex]] = [output[randomIndex], output[index]];
    }
    return output;
  }

  function renderStory() {
    const item = stories[state.index];
    const character = characters[item.character];
    refs.storyNumber.textContent = String(state.index + 1).padStart(2, "0");
    refs.characterImage.src = character.image;
    refs.characterImage.alt = character.alt;
    refs.customerName.textContent = item.name;
    refs.customerStory.textContent = item.story;
    refs.progressLabel.textContent = `Story ${state.index + 1} of ${stories.length}`;
    refs.scoreLabel.textContent = `${state.score} ${state.score === 1 ? "match" : "matches"}`;
    refs.progressTrack.setAttribute("aria-valuenow", state.index);
    refs.progressFill.style.width = `${(state.index / stories.length) * 100}%`;
    refs.selectionStatus.textContent = state.answered ? "Answer revealed" : "Select a product";
    renderProducts();
  }

  function renderProducts() {
    const item = stories[state.index];
    const fragment = document.createDocumentFragment();
    products.forEach((product) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "product-card";
      button.dataset.id = product.id;
      button.disabled = state.answered;
      if (state.answered && product.id === item.answer) button.classList.add("is-correct");
      if (state.answered && product.id === state.selected && state.selected !== item.answer) button.classList.add("is-wrong");
      const image = document.createElement("img");
      image.src = product.image;
      image.alt = product.name;
      const name = document.createElement("strong");
      name.textContent = product.name;
      button.append(image, name);
      if (state.answered && (product.id === item.answer || product.id === state.selected)) {
        const mark = document.createElement("span");
        mark.className = "result-mark";
        mark.textContent = product.id === item.answer ? "✓" : "×";
        mark.setAttribute("aria-hidden", "true");
        button.append(mark);
      }
      fragment.append(button);
    });
    refs.productGrid.replaceChildren(fragment);
  }

  function chooseProduct(id) {
    if (state.answered) return;
    const item = stories[state.index];
    const correct = id === item.answer;
    state.selected = id;
    state.answered = true;
    if (correct) state.score += 1;
    const answer = productById(item.answer);
    refs.feedbackLabel.textContent = correct ? "Correct match" : "Answer";
    refs.feedbackTitle.textContent = correct ? `${answer.name} is the best match.` : `The best match is ${answer.name}.`;
    refs.feedbackCopy.textContent = `${item.name} — ${answer.name}`;
    refs.feedbackIcon.textContent = correct ? "✓" : "!";
    refs.feedbackCard.classList.toggle("is-wrong", !correct);
    refs.nextBtn.textContent = state.index === stories.length - 1 ? "View results" : "Next story";
    refs.feedbackCard.hidden = false;
    document.body.classList.add("modal-open");
    refs.liveRegion.textContent = refs.feedbackTitle.textContent;
    renderStory();
    refs.nextBtn.focus();
  }

  function nextStory() {
    if (!state.answered) return;
    if (state.index === stories.length - 1) { showResults(); return; }
    state.index += 1;
    state.answered = false;
    state.selected = "";
    refs.feedbackCard.hidden = true;
    document.body.classList.remove("modal-open");
    renderStory();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showResults() {
    refs.gameLayout.hidden = true;
    refs.feedbackCard.hidden = true;
    document.body.classList.add("modal-open");
    refs.resultsCard.hidden = false;
    refs.progressLabel.textContent = `Story ${stories.length} of ${stories.length}`;
    refs.scoreLabel.textContent = `${state.score} matches`;
    refs.progressTrack.setAttribute("aria-valuenow", stories.length);
    refs.progressFill.style.width = "100%";
    refs.scoreNumber.textContent = `${state.score} / ${stories.length}`;
    refs.resultsTitle.textContent = state.score === stories.length
      ? `You matched all ${stories.length} customer stories.`
      : `You matched ${state.score} of ${stories.length} customer stories.`;
    refs.resultsCopy.textContent = state.score === stories.length ? "Every customer found their Re-Lyte match." : "Play again to match every customer with their Re-Lyte product.";
    refs.playAgainBtn.focus();
    celebrate();
  }

  function resetGame() {
    stories = shuffle(storyBank);
    state = { index: 0, score: 0, answered: false, selected: "" };
    refs.gameLayout.hidden = false;
    refs.feedbackCard.hidden = true;
    document.body.classList.remove("modal-open");
    refs.resultsCard.hidden = true;
    refs.confettiLayer.replaceChildren();
    renderStory();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function celebrate() {
    const colors = ["#007b83", "#e66b38", "#e4b84f", "#368965", "#43b8e5"];
    refs.confettiLayer.replaceChildren();
    for (let index = 0; index < 240; index += 1) {
      const piece = document.createElement("span");
      piece.className = "confetti";
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[index % colors.length];
      piece.style.setProperty("--drift", `${Math.random() * 260 - 130}px`);
      piece.style.setProperty("--size", `${7 + Math.random() * 8}px`);
      piece.style.setProperty("--duration", `${3.8 + Math.random() * .45}s`);
      piece.style.animationDelay = `${Math.random() * .7}s`;
      refs.confettiLayer.append(piece);
    }
    window.setTimeout(() => refs.confettiLayer.replaceChildren(), 5000);
  }

  refs.productGrid.addEventListener("click", (event) => { const button = event.target.closest(".product-card"); if (button) chooseProduct(button.dataset.id); });
  refs.nextBtn.addEventListener("click", nextStory);
  refs.resetBtn.addEventListener("click", resetGame);
  refs.playAgainBtn.addEventListener("click", resetGame);
  document.addEventListener("keydown", (event) => {
    if (!refs.feedbackCard.hidden && event.key === "Tab") {
      event.preventDefault();
      refs.nextBtn.focus();
    }
    if (!refs.resultsCard.hidden && event.key === "Tab") {
      event.preventDefault();
      refs.playAgainBtn.focus();
    }
  });
  renderStory();
})();
