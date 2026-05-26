(function () {
  if (window.self !== window.top) {
    document.documentElement.classList.add("is-embedded");
  }

  const root = document.querySelector("[data-flipbook]");
  const book = document.getElementById("book");
  const spread = document.getElementById("spread");
  const leftPage = document.getElementById("leftPage");
  const rightPage = document.getElementById("rightPage");
  const prevButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");
  const pageCounter = document.getElementById("pageCounter");
  const progressFill = document.getElementById("progressFill");
  const pageStrip = document.getElementById("pageStrip");
  const bookEyebrow = document.getElementById("bookEyebrow");
  const bookTitle = document.getElementById("bookTitle");
  const bookSubtitle = document.getElementById("bookSubtitle");

  if (!root || !book || !spread || !leftPage || !rightPage) return;

  const compactViewport = window.matchMedia("(max-width: 760px)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const urlParams = new URLSearchParams(window.location.search);
  const bookSources = {
    "401k": "content.json",
    "consolidate-your-retirement": "content-consolidate-retirement.json",
    "empower-mobile-app": "content-empower-mobile-app.json",
    "empower-mobile": "content-empower-mobile-app.json",
  };
  const fallbackBook = {
    title: "Redmond Farm Guide",
    eyebrow: "Farm Systems",
    subtitle: "A short guide to how Redmond Farms teams move nourishing food from farm to market.",
    pages: [
      {
        title: "Heritage Farm",
        eyebrow: "Who",
        description:
          "Redmond's Heritage Farm team includes the farmers and the dairy cows, pigs, and chickens they care for.",
        body: [
          "Our caretakers incorporate intentional, regenerative farming methods to ensure happy and healthy animals.",
          "They also develop and produce our signature farm products.",
        ],
        accent: "#2f4a37",
      },
      {
        title: "Farm Market",
        eyebrow: "Why",
        description:
          "Redmond Farm Markets exist to provide our communities with nourishing products from our farm, production kitchen, and like-minded suppliers.",
        accent: "#314c5f",
      },
    ],
  };

  let bookData = normalizeBook(fallbackBook);
  let currentIndex = 0;
  let isAnimating = false;
  let pointerStart = null;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function toText(value) {
    return typeof value === "string" ? value.trim() : "";
  }

  function toTextArray(value) {
    if (Array.isArray(value)) {
      return value.map(toText).filter(Boolean);
    }

    const text = toText(value);
    return text ? [text] : [];
  }

  function padRow(row, columnCount) {
    return Array.from({ length: columnCount }, (_, index) => row[index] || "");
  }

  function normalizeTable(rawTable) {
    const table = rawTable && typeof rawTable === "object" ? rawTable : null;
    if (!table) return null;

    const headers = toTextArray(table.headers);
    const rows = Array.isArray(table.rows)
      ? table.rows.map(toTextArray).filter((row) => row.length)
      : [];
    const columnCount = Math.max(headers.length, ...rows.map((row) => row.length), 0);

    if (!columnCount) return null;

    return {
      headers: headers.length ? padRow(headers, columnCount) : [],
      rows: rows.map((row) => padRow(row, columnCount)),
    };
  }

  function normalizeSections(value) {
    if (!Array.isArray(value)) return [];

    return value
      .map((rawSection) => {
        const section = rawSection && typeof rawSection === "object" ? rawSection : {};
        return {
          title: toText(section.title),
          description: toText(section.description),
          body: toTextArray(section.body),
          bullets: toTextArray(section.bullets),
        };
      })
      .filter((section) => {
        return section.title || section.description || section.body.length || section.bullets.length;
      });
  }

  function normalizePage(rawPage, index) {
    const page = rawPage && typeof rawPage === "object" ? rawPage : {};
    const body = toTextArray(page.body);
    const bullets = toTextArray(page.bullets);
    const image = toText(page.image);
    const layout = toText(page.layout);
    const allowedLayouts = new Set(["default", "text-only", "image-full", "document-full"]);
    const imagePosition = toText(page.imagePosition);
    const allowedImagePositions = new Set(["before-copy", "after-copy"]);
    const imageFit = toText(page.imageFit);
    const allowedImageFits = new Set(["cover", "contain"]);
    const table = normalizeTable(page.table);
    const callout = toText(page.callout);
    const finePrint = toTextArray(page.finePrint);
    const sections = normalizeSections(page.sections);

    return {
      title: toText(page.title) || `Page ${index + 1}`,
      eyebrow: toText(page.eyebrow),
      description: toText(page.description),
      body,
      bullets,
      table,
      callout,
      finePrint,
      sections,
      image,
      imageAlt: toText(page.imageAlt) || toText(page.title) || `Page ${index + 1} image`,
      imageFit: allowedImageFits.has(imageFit) ? imageFit : "cover",
      imagePosition: allowedImagePositions.has(imagePosition) ? imagePosition : "before-copy",
      caption: toText(page.caption),
      accent: toText(page.accent),
      layout: allowedLayouts.has(layout) ? layout : image ? "default" : "text-only",
    };
  }

  function normalizeBook(rawBook) {
    const source = rawBook && typeof rawBook === "object" ? rawBook : fallbackBook;
    const rawPages = Array.isArray(source) ? source : Array.isArray(source.pages) ? source.pages : [];
    const pages = rawPages.map(normalizePage).filter((page) => {
      return page.title || page.description || page.body.length || page.image;
    });
    const hasEyebrow = Object.prototype.hasOwnProperty.call(source, "eyebrow");

    const normalizedPages = pages.length ? pages : fallbackBook.pages.map(normalizePage);

    return {
      title: toText(source.title) || fallbackBook.title,
      eyebrow: hasEyebrow ? toText(source.eyebrow) : fallbackBook.eyebrow,
      subtitle: toText(source.subtitle) || "",
      accent: toText(source.accent) || normalizedPages[0]?.accent || "#2f4a37",
      startPage: Number.isFinite(Number(source.settings?.startPage))
        ? Number(source.settings.startPage)
        : 0,
      pages: normalizedPages,
    };
  }

  function makeElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  function renderMedia(page) {
    const media = makeElement("figure", `page-media page-media--${page.imageFit}`);
    const image = document.createElement("img");
    image.src = page.image;
    image.alt = page.imageAlt;
    image.loading = "lazy";
    media.append(image);
    return media;
  }

  function renderTable(tableData) {
    const wrapper = makeElement("div", "page-table-wrap");
    const table = makeElement("table", "page-table");

    if (tableData.headers.length) {
      const thead = document.createElement("thead");
      const headerRow = document.createElement("tr");
      tableData.headers.forEach((header) => {
        headerRow.append(makeElement("th", "", header));
      });
      thead.append(headerRow);
      table.append(thead);
    }

    if (tableData.rows.length) {
      const tbody = document.createElement("tbody");
      tableData.rows.forEach((row) => {
        const tableRow = document.createElement("tr");
        row.forEach((cell) => {
          tableRow.append(makeElement("td", "", cell));
        });
        tbody.append(tableRow);
      });
      table.append(tbody);
    }

    wrapper.append(table);
    return wrapper;
  }

  function renderStatus(message) {
    leftPage.className = "book-page book-page--left book-page--empty";
    rightPage.className = "book-page book-page--right";
    leftPage.replaceChildren();

    const status = makeElement("div", "status-page");
    status.append(makeElement("p", "", message));
    rightPage.replaceChildren(status);
  }

  function renderMeta() {
    root.style.setProperty("--accent", bookData.accent);
    bookEyebrow.textContent = bookData.eyebrow;
    bookTitle.textContent = bookData.title;
    bookSubtitle.textContent = bookData.subtitle;
  }

  function renderPage(target, page, index, side) {
    const baseClass = `book-page book-page--${side}`;
    target.className = page ? baseClass : `${baseClass} book-page--empty`;
    target.replaceChildren();
    target.removeAttribute("aria-label");
    target.removeAttribute("aria-hidden");
    target.style.removeProperty("--page-accent");

    if (!page) {
      target.setAttribute("aria-hidden", "true");
      return;
    }

    target.style.setProperty("--page-accent", page.accent || bookData.accent);
    target.setAttribute("aria-label", `Page ${index + 1}: ${page.title}`);

    const inner = makeElement("div", `page-inner page-inner--${page.layout}`);
    const header = makeElement("header", "page-header");
    const content = makeElement("div", "page-content");
    const footer = makeElement("footer", "page-footer");

    if (page.eyebrow) header.append(makeElement("p", "page-kicker", page.eyebrow));
    header.append(makeElement("h2", "page-title", page.title));

    if (page.image && page.imagePosition === "after-copy") {
      content.classList.add("page-content--image-after");
    }

    if (!page.image) {
      content.classList.add("page-content--copy-only");
    }

    if (page.image && page.imagePosition !== "after-copy") {
      content.append(renderMedia(page));
    }

    const copy = makeElement("div", "page-copy");

    if (page.description) {
      copy.append(makeElement("p", "page-description", page.description));
    }

    if (page.body.length) {
      const body = makeElement("div", "page-body");
      page.body.forEach((paragraph) => {
        body.append(makeElement("p", "", paragraph));
      });
      copy.append(body);
    }

    if (page.table) {
      copy.append(renderTable(page.table));
    }

    if (page.bullets.length) {
      const list = makeElement("ul", "page-list");
      page.bullets.forEach((bullet) => {
        list.append(makeElement("li", "", bullet));
      });
      copy.append(list);
    }

    if (page.sections.length) {
      const sections = makeElement("div", "page-sections");
      page.sections.forEach((section) => {
        const sectionElement = makeElement("section", "page-section");

        if (section.title) {
          sectionElement.append(makeElement("h3", "page-section-title", section.title));
        }

        if (section.description) {
          sectionElement.append(makeElement("p", "page-section-description", section.description));
        }

        section.body.forEach((paragraph) => {
          sectionElement.append(makeElement("p", "page-section-copy", paragraph));
        });

        if (section.bullets.length) {
          const list = makeElement("ul", "page-list");
          section.bullets.forEach((bullet) => {
            list.append(makeElement("li", "", bullet));
          });
          sectionElement.append(list);
        }

        sections.append(sectionElement);
      });
      copy.append(sections);
    }

    if (page.callout) {
      copy.append(makeElement("p", "page-callout", page.callout));
    }

    if (page.finePrint.length) {
      const finePrint = makeElement("div", "page-fineprint");
      page.finePrint.forEach((paragraph) => {
        finePrint.append(makeElement("p", "", paragraph));
      });
      copy.append(finePrint);
    }

    content.append(copy);

    if (page.image && page.imagePosition === "after-copy") {
      content.append(renderMedia(page));
    }

    if (page.caption) footer.append(makeElement("p", "page-caption", page.caption));
    footer.append(makeElement("span", "page-number", String(index + 1)));

    inner.append(header, content, footer);
    target.append(inner);
  }

  function getStep() {
    return compactViewport.matches ? 1 : 2;
  }

  function normalizeIndex(index) {
    const lastIndex = bookData.pages.length - 1;
    const nextIndex = clamp(index, 0, lastIndex);

    if (compactViewport.matches) return nextIndex;
    return Math.floor(nextIndex / 2) * 2;
  }

  function getVisibleRange() {
    if (compactViewport.matches) {
      return { start: currentIndex, end: currentIndex };
    }

    return {
      start: currentIndex,
      end: Math.min(currentIndex + 1, bookData.pages.length - 1),
    };
  }

  function renderDots() {
    pageStrip.replaceChildren();

    bookData.pages.forEach((page, index) => {
      const dot = document.createElement("button");
      dot.className = "page-dot";
      dot.type = "button";
      dot.textContent = String(index + 1);
      dot.setAttribute("aria-label", `Go to page ${index + 1}: ${page.title}`);
      dot.addEventListener("click", () => goToIndex(index));
      pageStrip.append(dot);
    });
  }

  function updateControls() {
    const visibleRange = getVisibleRange();
    const total = bookData.pages.length;
    const step = getStep();
    const atStart = currentIndex <= 0;
    const atEnd = currentIndex + step >= total;
    const activeDots = Array.from(pageStrip.querySelectorAll(".page-dot"));
    const pageLabel =
      visibleRange.start === visibleRange.end
        ? `Page ${visibleRange.start + 1} of ${total}`
        : `Pages ${visibleRange.start + 1}-${visibleRange.end + 1} of ${total}`;
    const progress = ((visibleRange.end + 1) / total) * 100;

    prevButton.disabled = atStart;
    nextButton.disabled = atEnd;
    pageCounter.textContent = pageLabel;
    progressFill.style.width = `${progress}%`;

    activeDots.forEach((dot, index) => {
      const isActive = index >= visibleRange.start && index <= visibleRange.end;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-current", isActive ? "page" : "false");
    });
  }

  function renderBook() {
    currentIndex = normalizeIndex(currentIndex);

    if (compactViewport.matches) {
      renderPage(leftPage, null, -1, "left");
      renderPage(rightPage, bookData.pages[currentIndex], currentIndex, "right");
    } else {
      renderPage(leftPage, bookData.pages[currentIndex], currentIndex, "left");
      renderPage(rightPage, bookData.pages[currentIndex + 1], currentIndex + 1, "right");
    }

    updateControls();
  }

  function makeTurnPage(direction) {
    const sourcePage = compactViewport.matches
      ? rightPage
      : direction === "next"
        ? rightPage
        : leftPage;
    const turnPage = document.createElement("div");
    turnPage.className = `turn-page turn-page--${direction}`;

    const front = document.createElement("div");
    front.className = "turn-page-face turn-page-face--front";
    front.innerHTML = sourcePage.innerHTML;

    const sourceStyle = sourcePage.getAttribute("style");
    if (sourceStyle) front.setAttribute("style", sourceStyle);

    const back = document.createElement("div");
    back.className = "turn-page-face turn-page-face--back";

    turnPage.append(front, back);
    return turnPage;
  }

  function goToIndex(index) {
    const nextIndex = normalizeIndex(index);
    if (nextIndex === currentIndex || isAnimating) return;

    const direction = nextIndex > currentIndex ? "next" : "prev";

    if (reducedMotion.matches) {
      currentIndex = nextIndex;
      renderBook();
      return;
    }

    isAnimating = true;
    const turnPage = makeTurnPage(direction);
    spread.append(turnPage);

    window.requestAnimationFrame(() => {
      turnPage.classList.add("is-flipping");
    });

    window.setTimeout(() => {
      currentIndex = nextIndex;
      renderBook();
    }, 170);

    window.setTimeout(() => {
      turnPage.remove();
      isAnimating = false;
    }, 590);
  }

  function goNext() {
    goToIndex(currentIndex + getStep());
  }

  function goPrevious() {
    goToIndex(currentIndex - getStep());
  }

  function onKeydown(event) {
    if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;

    const tagName = document.activeElement?.tagName;
    if (tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT") return;

    if (event.key === "ArrowRight") {
      event.preventDefault();
      goNext();
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goPrevious();
    }
  }

  function onPointerDown(event) {
    pointerStart = {
      x: event.clientX,
      y: event.clientY,
    };
  }

  function onPointerUp(event) {
    if (!pointerStart) return;

    const deltaX = event.clientX - pointerStart.x;
    const deltaY = event.clientY - pointerStart.y;
    pointerStart = null;

    if (Math.abs(deltaX) < 50 || Math.abs(deltaY) > 70) return;

    if (deltaX < 0) goNext();
    if (deltaX > 0) goPrevious();
  }

  async function loadBook() {
    root.classList.add("is-loading");
    renderStatus("Loading content.");

    const bookKey = urlParams.get("book") || root.dataset.book || "401k";
    const source = bookSources[bookKey] || bookSources["401k"];

    try {
      const response = await fetch(source, { cache: "no-store" });
      if (!response.ok) throw new Error(`Unable to load ${source}`);
      bookData = normalizeBook(await response.json());
    } catch (error) {
      console.warn("Flip book content fallback loaded.", error);
      bookData = normalizeBook(fallbackBook);
    }

    root.classList.remove("is-loading");
    currentIndex = normalizeIndex(bookData.startPage);
    renderMeta();
    renderDots();
    renderBook();
  }

  prevButton.addEventListener("click", goPrevious);
  nextButton.addEventListener("click", goNext);
  book.addEventListener("pointerdown", onPointerDown);
  book.addEventListener("pointerup", onPointerUp);
  document.addEventListener("keydown", onKeydown);

  compactViewport.addEventListener("change", () => {
    currentIndex = normalizeIndex(currentIndex);
    renderBook();
  });

  loadBook();
})();
