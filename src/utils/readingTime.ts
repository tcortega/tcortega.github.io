/**
 * Approximate reading time in whole minutes (min 1).
 */
export function readingTimeMinutes(body: string | undefined | null): number {
  if (!body) return 1;
  const words = body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/[#>*_\-\[\]\(\)!]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function categoryKindLabel(category: "re" | "til" | "tut"): string {
  switch (category) {
    case "til":
      return "til";
    case "tut":
      return "tutorial";
    default:
      return "deep dive";
  }
}
