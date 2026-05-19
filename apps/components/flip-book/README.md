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
      "sections": [
        {
          "title": "Optional internal section",
          "body": ["Section paragraph."]
        }
      ],
      "callout": "Optional highlighted sentence.",
      "finePrint": ["Optional legal or disclaimer text."],
      "table": {
        "headers": ["Column one", "Column two"],
        "rows": [["A", "B"]]
      },
      "image": "../../../assets/imgs/example.jpg",
      "imageAlt": "Image description",
      "imageFit": "cover",
      "imagePosition": "before-copy",
      "caption": "Optional image or page caption.",
      "accent": "#2f4a37",
      "layout": "default"
    }
  ]
}
```

Supported `layout` values are `default`, `text-only`, and `image-full`.
Supported `imageFit` values are `cover` and `contain`.
Supported `imagePosition` values are `before-copy` and `after-copy`.

By default, the component loads the `401k` book. Select a book with the `book` parameter:

```text
index.html?book=401k
index.html?book=consolidate-your-retirement
```

Current book values:

- `401k`: 401(k) Info Guide (`content.json`).
- `consolidate-your-retirement`: Consolidate your retirement accounts (`content-consolidate-retirement.json`).

Because the component fetches JSON, use it through a local/static server or a hosted site.
