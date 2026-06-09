# redmond_university

Static project for training modules and mini-games embedded in Canvas.

## Current Structure

```text
.
├── apps/
│   ├── badges/
│   ├── cards/
│   └── video/
├── assets/
│   ├── login/
│   └── media/
├── components/
│   └── cta/
├── games/
│   ├── farm/
│   ├── jeopardy/
│   ├── hydration-habitats/
│   ├── re-lyte-rescue/
│   ├── smoothie/
│   └── two-truths-hydration/
├── menu/
└── index.html
```

The login page lives at the root, and its shared files are stored in `assets/login/`.

## Main Routes

- Main login: `index.html`
- Menu hub: `menu/index.html`
- Cards: `apps/cards/index.html`
- Hydration cards: `apps/cards/hydration-cards.html`
- Video: `apps/video/index.html`
- Reusable CTA: `components/cta/index.html`
- Games:
  - `games/farm/index.html`
  - `games/hydration-habitats/index.html`
  - `games/jeopardy/index.html`
  - `games/re-lyte-rescue/index.html`
  - `games/smoothie/index.html`
  - `games/two-truths-hydration/index.html`

## Language by URL

These pages support `?lang=en` or `?lang=es`:

- `index.html`
- `menu/index.html`
- `apps/video/index.html`
- `games/farm/index.html`
- `games/jeopardy/index.html`
- `games/two-truths-hydration/index.html`

## GitHub Pages (Quick Setup)

1. Push to `main`.
2. In GitHub, go to `Settings > Pages`.
3. Source: `Deploy from a branch`.
4. Branch: `main` and folder: `/ (root)`.

Final URL:
`https://<username>.github.io/redmond_university/`
