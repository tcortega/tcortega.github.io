export {};

// Client-side re/til/tut category filter shared by the home INDEX and the
// archive. Toggles each row's parent <li> by data-category, and collapses any
// year band ([data-year-group]) whose rows all get hidden. Self-contained and
// re-bound after view transitions, mirroring scripts/theme.ts.

function setup(): void {
  const buttons =
    document.querySelectorAll<HTMLButtonElement>("[data-filter]");
  if (!buttons.length) return;

  const rows = document.querySelectorAll<HTMLElement>(
    ".index-row[data-category]"
  );
  const groups = document.querySelectorAll<HTMLElement>("[data-year-group]");

  function apply(filter: string): void {
    for (const btn of buttons) {
      btn.classList.toggle("is-active", btn.dataset.filter === filter);
    }

    for (const row of rows) {
      const cat = row.dataset.category ?? "re";
      const li = row.closest("li");
      if (li) li.hidden = !(filter === "all" || cat === filter);
    }

    for (const group of groups) {
      const anyVisible = Array.from(group.querySelectorAll("li")).some(
        li => !(li as HTMLElement).hidden
      );
      group.hidden = !anyVisible;
    }
  }

  for (const btn of buttons) {
    btn.addEventListener("click", () => apply(btn.dataset.filter ?? "all"));
  }
}

setup();

document.addEventListener("astro:after-swap", setup);
