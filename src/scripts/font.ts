export {};

const FONT_KEY = "font";
const MONO = "mono";
const SERIF = "serif";

function getPreferredFont(): string {
  return localStorage.getItem(FONT_KEY) ?? MONO;
}

// Reuse the value already set by the inline FOUC-prevention script if available.
let fontValue: string =
  (window as unknown as { __font?: { value: string } }).__font?.value ??
  getPreferredFont();

function reflect(): void {
  const root = document.firstElementChild;
  root?.setAttribute("data-font", fontValue);
  document.querySelector("#font-btn")?.setAttribute("aria-label", fontValue);
}

function persist(): void {
  localStorage.setItem(FONT_KEY, fontValue);
  reflect();
}

function setup(): void {
  reflect();
  document.querySelector("#font-btn")?.addEventListener("click", () => {
    fontValue = fontValue === MONO ? SERIF : MONO;
    persist();
  });
}

setup();

// Re-run after View Transitions navigation.
document.addEventListener("astro:after-swap", setup);
