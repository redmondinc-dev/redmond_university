# Flip Book Component

Standalone static component for showing structured content as a book-style flip interface.

## Files

- `index.html`: component markup.
- `styles.css`: book layout, responsive spread, page flip animation.
- `script.js`: JSON loading, rendering, navigation, keyboard, and swipe behavior.
- `content.json`: editable book content.

## Content Schema

```json
{
  "title": "Book title",
  "eyebrow": "Small label",
  "subtitle": "Short supporting text",
  "settings": {
    "startPage": 0
  },
  "pages": [
    {
      "title": "Page title",
      "eyebrow": "Section",
      "description": "Primary page copy.",
      "body": ["Paragraph one.", "Paragraph two."],
      "bullets": ["Optional item"],
      "image": "../../../assets/imgs/example.jpg",
      "imageAlt": "Image description",
      "caption": "Optional image or page caption.",
      "accent": "#2f4a37",
      "layout": "default"
    }
  ]
}
```

Supported `layout` values are `default`, `text-only`, and `image-full`.

By default, the component loads `content.json`. A different JSON file can be passed with:

```text
index.html?data=custom-content.json
```

Because the component fetches JSON, use it through a local/static server or a hosted site.
