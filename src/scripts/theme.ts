export {};

const THEME_KEY = "unstripped-theme";
const LIGHT = "light";
const DARK = "dark";

function getPreferredTheme(): string {
  // Light by default (matches the unstripped prototype).
  return localStorage.getItem(THEME_KEY) ?? LIGHT;
}

let themeValue: string =
  (window as unknown as { __theme?: { value: string } }).__theme?.value ??
  getPreferredTheme();

function persist(): void {
  localStorage.setItem(THEME_KEY, themeValue);
  reflect();
}

function reflect(): void {
  const root = document.firstElementChild;
  root?.setAttribute("data-theme", themeValue);
  root?.classList.toggle("dark", themeValue === DARK);

  for (const btn of document.querySelectorAll<HTMLButtonElement>(
    "[data-theme-set]"
  )) {
    const target = btn.dataset.themeSet;
    btn.setAttribute("aria-pressed", target === themeValue ? "true" : "false");
  }

  const bg = window.getComputedStyle(document.body).backgroundColor;
  document
    .querySelector("meta[name='theme-color']")
    ?.setAttribute("content", bg);
}

function setup(): void {
  reflect();
  for (const btn of document.querySelectorAll<HTMLButtonElement>(
    "[data-theme-set]"
  )) {
    btn.addEventListener("click", () => {
      const next = btn.dataset.themeSet;
      if (next !== LIGHT && next !== DARK) return;
      themeValue = next;
      persist();
    });
  }
}

setup();

document.addEventListener("astro:after-swap", setup);

document.addEventListener("astro:before-swap", event => {
  const color = document
    .querySelector("meta[name='theme-color']")
    ?.getAttribute("content");
  if (color) {
    (event as { newDocument: Document }).newDocument
      .querySelector("meta[name='theme-color']")
      ?.setAttribute("content", color);
  }
});
