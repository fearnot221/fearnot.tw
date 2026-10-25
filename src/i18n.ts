import type { Lang } from "./data/profile";

export const htmlLang: Record<Lang, "zh-Hant-TW" | "en"> = { zh: "zh-Hant-TW", en: "en" };

export const ui = {
  experience: { zh: "經歷", en: "Experience" },
  communities: { zh: "社群", en: "Communities" },
  education: { zh: "學歷", en: "Education" },
  skills: { zh: "技能", en: "Skills" },
  awardsCerts: { zh: "獎項與證照", en: "Awards & Certifications" },
  projects: { zh: "專案", en: "Projects" },
  summary: { zh: "簡介", en: "Summary" },
  present: { zh: "今", en: "now" },
  print: { zh: "列印", en: "Print" },
  download: { zh: "下載", en: "Download" },
  language: { zh: "語言", en: "Language" },
  docs: { zh: "履歷文件", en: "Résumé documents" },
  skip: { zh: "跳到主要內容", en: "Skip to content" },
} satisfies Record<string, Record<Lang, string>>;

/** "/resume/" <-> "/en/resume/"; the zh site lives at the root. Paths keep their trailing slash (directory index). */
export const pathFor = (lang: Lang, path: string) => (lang === "en" ? `/en${path}` : path);
