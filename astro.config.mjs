import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://fearnot.tw",
  trailingSlash: "always",
  devToolbar: { enabled: false },
  build: { inlineStylesheets: "always" },
  // remote avatar is fetched at build time and served from this site as a small webp
  image: { domains: ["gravatar.com"] },
  integrations: [
    sitemap({
      filter: (url) => !/\/(styleguide|og)\//.test(url),
      i18n: { defaultLocale: "zh", locales: { zh: "zh-Hant-TW", en: "en" } },
    }),
  ],
});
