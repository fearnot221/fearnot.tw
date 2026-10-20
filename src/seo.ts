import { person, skills, type Lang } from "./data/profile";

const site = "https://fearnot.tw";
// placeholder links (bare domains) must never be published as identity claims
const profiles = person.links.filter((l) => l.label !== "SCIST" && new URL(l.href).pathname.length > 1).map((l) => l.href);

/** Home is the handle only; the real name appears only where the Resume/CV already shows it. */
export function personLd(lang: Lang, withRealName: boolean) {
  return {
    "@type": "Person",
    ...(withRealName && { "@id": `${site}/#person` }),
    name: withRealName ? person.name[lang] : person.handle,
    ...(withRealName && { alternateName: [person.handle, person.name[lang === "zh" ? "en" : "zh"]] }),
    url: `${site}/`,
    description: person.lede[lang],
    knowsAbout: skills.map((s) => s.group),
    memberOf: { "@type": "Organization", name: "SCIST", url: "https://scist.org" },
    ...(profiles.length && { sameAs: profiles }),
  };
}

export function homeLd(lang: Lang) {
  return { "@context": "https://schema.org", ...personLd(lang, false) };
}

export function docLd(lang: Lang, url: string) {
  return { "@context": "https://schema.org", "@type": "ProfilePage", url, mainEntity: personLd(lang, true) };
}
