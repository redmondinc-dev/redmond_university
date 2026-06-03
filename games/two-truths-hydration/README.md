# Two Truths and a Lie: Hydration Edition

Static vanilla HTML/CSS/JavaScript micro-game for Re-Lyte hydration education.

## 1. Complete Game Architecture

- `index.html`: semantic shell, game controls, answer region, progress bottle, stats, recap help dialog, completion modal.
- `styles.css`: responsive visual system, card states, bottle fill, motion, reduced-motion fallback.
- `script.js`: English content, session state, rendering, scoring, reveal logic, always-on audio, recap, modal completion.
- Session progress is stored in `sessionStorage` under `relyte-two-truths-hydration-v1`.

## 2. UX Flow

1. Player lands on round 1 with three large claim cards.
2. Player selects the claim they believe is the lie.
3. All cards lock and reveal `TRUTH` or `LIE`.
4. Feedback explains the hydration concept in one short paragraph.
5. Correct picks advance the bottle fill, score updates, and recap takeaway unlocks.
6. Final round keeps the game visible and opens a result modal with score and replay.

## 3. Wireframe Structure

```text
Header: title + intro | play again
Main:
  Play panel:
    round status + progress track
    prompt
    3 claim cards
    feedback + next action
  Status panel:
    compact recap help button
    Re-Lyte bottle progress
    mineral visuals
    score/streak/knowledge stats
  Recap modal:
    unlocked recap list
  Completion overlay:
    completion result
    final score
    play again
```

## 4. Component Breakdown

- `game-header`: game title, intro, and replay control.
- `claim-card`: button-based answer cards with reveal state and selected state.
- `feedback-panel`: immediate correctness cue plus educational explanation.
- `bottle-meter`: animated progress and score anchor.
- `stats-card`: score, streak, and learned-card count.
- `recap-card`: compact help entry point for progressive retention.
- `recap-modal`: full takeaway list shown on demand.
- `completion-screen`: modal final reinforcement and replay loop.

## 5. Interaction Specifications

- Cards are native buttons for touch, mouse, keyboard, and screen readers.
- Hover raises cards on desktop; tap uses a quick press state on mobile.
- Selecting a card disables all cards to prevent accidental double answers.
- Correct selections add score and streak; incorrect selections reset streak but still reveal the lesson.
- Next button moves focus to the next card set; final round moves focus to the result screen.
- Play again clears only this game session.
- Audio feedback stays enabled; the interface does not expose language or sound controls.

## 6. Animation Specifications

- Card entry: short upward fade for immediate polish.
- Card reveal: badge and note fade in after selection.
- Correct answer: scale pulse plus water droplets.
- Incorrect answer: controlled shake plus orange droplets.
- Bottle: smooth liquid height transition and wave movement.
- Completion: confetti, disabled for reduced-motion users.

## 7. HTML Structure

The markup uses a semantic `header`, `main`, `section`, `aside`, ordered recap list, native buttons, `aria-live` regions, and `role="progressbar"` for the bottle.

## 8. CSS Architecture

- Root tokens define color, type, radius, and shadows.
- Layout is mobile-first with a single-column breakpoint, then desktop two-column enhancement.
- Components are class-scoped and state-driven with `is-*` classes.
- `prefers-reduced-motion` removes movement while preserving state changes.

## 9. JavaScript Architecture

- Content is stored as data objects, not hardcoded DOM.
- Rendering functions are split by UI region: round, cards, feedback, bottle, stats, recap, completion.
- State is the single source of truth: round index, answers, score, streak, and completion.
- Event handlers mutate state, then call `render()`.

## 10. Functional Implementation

Open `games/two-truths-hydration/index.html` directly or through `menu/index.html`.

## Design Rationale

- Engagement: three simultaneous choices create fast tension, immediate reveal, and quick next-round momentum.
- Retention: each round unlocks one concise takeaway, and the help icon keeps the recap available without crowding the game surface.
- Usability: large button cards, sticky status on desktop, linear flow on mobile, and clear focus management reduce friction.
- Education: myths are framed as the lie, making the learner actively correct the misconception instead of passively reading.
- Brand affinity: the Re-Lyte bottle is the primary score object, filling only with correct picks so the product visual matches the score.
- Completion: the result appears as a modal over the finished board, preserving context while confetti rewards the finish.
