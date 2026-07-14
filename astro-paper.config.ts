import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://unstripped.dev/",
    title: "unstripped",
    description: "reverse engineering notes, symbols included",
    author: "unstripped",
    profile: "https://github.com/tcortega",
    ogImage: "default-og.jpg",
    lang: "en",
    timezone: "UTC",
    dir: "ltr",
  },
  posts: {
    perPage: 50,
    perIndex: 15,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: false,
    },
    // Pagefind still builds at deploy time; chrome does not surface search in v1.
    search: false,
  },
  socials: [
    { name: "github", url: "https://github.com/tcortega" },
    { name: "mail", url: "mailto:hello@unstripped.dev" },
  ],
  shareLinks: [],
});
