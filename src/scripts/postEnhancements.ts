export {};

// Progressive enhancements for article pages: heading anchor links + an image
// lightbox. Bundled module (not is:inline) so it's typed and minified; it
// re-initialises on astro:after-swap like theme.ts / categoryFilter.ts. Because
// each swap replaces #article with a fresh element, re-binding listeners to the
// new node is correct and leaks nothing (old listeners die with the old DOM).

// The active overlay's close handler, kept in module scope so astro:before-swap
// can dismiss it without a window global.
let closeActiveLightbox: (() => void) | null = null;

function addHeadingLinks(): void {
  const headings = document.querySelectorAll(
    "#article h2, #article h3, #article h4, #article h5, #article h6"
  );
  for (const heading of headings) {
    if (heading.querySelector(".heading-link")) continue;
    heading.classList.add("group");
    const link = document.createElement("a");
    link.className =
      "heading-link ms-2 no-underline opacity-50 hover:opacity-100";
    link.href = "#" + heading.id;
    const span = document.createElement("span");
    span.ariaHidden = "true";
    span.innerText = "#";
    link.appendChild(span);
    heading.appendChild(link);
  }
}

function initLightbox(): void {
  const article = document.getElementById("article");
  if (!article) return;

  const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let overlay: HTMLDivElement | null = null;
  let lastFocused: HTMLElement | null = null;

  requestAnimationFrame(() => {
    for (const image of article.querySelectorAll("img")) {
      if (image.closest("a")) continue;
      image.setAttribute("role", "button");
      image.setAttribute("tabindex", "0");
      image.setAttribute("aria-haspopup", "dialog");
      image.setAttribute(
        "aria-label",
        image.alt ? `Zoom image: ${image.alt}` : "Zoom image"
      );
    }
  });

  function onKeyDown(e: KeyboardEvent): void {
    if (e.key === "Escape") close();
  }

  function open(src: string, alt: string, trigger: HTMLElement | null): void {
    if (overlay) return;
    lastFocused = trigger ?? (document.activeElement as HTMLElement | null);

    overlay = document.createElement("div");
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute(
      "aria-label",
      alt ? `Image preview: ${alt}` : "Image preview"
    );
    overlay.className =
      "fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/70 opacity-0 transition-opacity duration-200 motion-reduce:transition-none";

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "Close image preview");
    closeButton.className =
      "absolute end-4 top-4 rounded p-2 text-3xl leading-none text-white";
    closeButton.innerHTML = "&#10005;";
    closeButton.addEventListener("click", close);

    const image = document.createElement("img");
    image.src = src;
    image.alt = "";
    image.className =
      "max-h-[90dvh] max-w-[90dvw] cursor-default object-contain";

    overlay.append(closeButton, image);
    overlay.addEventListener("click", e => {
      if (e.target === overlay) close();
    });

    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    closeActiveLightbox = close;

    requestAnimationFrame(() => overlay?.classList.add("opacity-100"));
    closeButton.focus();
  }

  function close(): void {
    if (!overlay) return;
    const el = overlay;
    overlay = null;
    closeActiveLightbox = null;
    document.removeEventListener("keydown", onKeyDown);
    document.body.style.overflow = "";
    lastFocused?.focus();
    lastFocused = null;
    if (prefersReducedMotion()) {
      el.remove();
      return;
    }
    const remove = () => el.remove();
    el.addEventListener("transitionend", remove, { once: true });
    setTimeout(remove, 250);
    el.classList.remove("opacity-100");
  }

  function triggerFromEvent(e: Event): HTMLImageElement | null {
    const target = e.target as HTMLElement | null;
    const image = target?.closest("img") ?? null;
    if (!image || !article!.contains(image) || image.closest("a")) return null;
    return image;
  }

  article.addEventListener("click", e => {
    const image = triggerFromEvent(e);
    if (!image) return;
    e.preventDefault();
    open(image.currentSrc || image.src, image.alt, image);
  });

  article.addEventListener("keydown", e => {
    if (e.key !== "Enter" && e.key !== " " && e.key !== "Spacebar") return;
    const image = triggerFromEvent(e);
    if (!image) return;
    e.preventDefault();
    open(image.currentSrc || image.src, image.alt, image);
  });
}

function setup(): void {
  addHeadingLinks();
  initLightbox();
}

setup();

document.addEventListener("astro:after-swap", () => {
  setup();
  window.scrollTo({ left: 0, top: 0, behavior: "instant" });
});

// Dismiss an open lightbox before the page swaps out. Bound once at import.
document.addEventListener("astro:before-swap", () => closeActiveLightbox?.());
