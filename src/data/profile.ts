// Content of the home page (both languages). The Resume keeps its own content in resume.ts.
// Every user-facing string is bilingual. Items marked TODO still need confirmation.
// `details` and `roles` are not shown anywhere; they are kept as the full record.

import { createHash } from "node:crypto";

export type Lang = "zh" | "en";
export type T = Record<Lang, string>;

export interface Entry {
  start: string;
  end?: string; // omitted = present; equal to start = a single year
  title: T;
  org: T;
  summary?: T;
  details?: T[]; // not shown (full record)
  href?: string;
}

// One organisation; several roles in it share the org line, and `summary` here covers them all.
// `kind` picks the home page section: work → 工作經歷, talk → 演講或講課, community → 社群
export interface Org {
  kind: "work" | "talk" | "community";
  org: T;
  roles: Role[];
  summary?: T;
  href?: string;
}

export type Role = Pick<Entry, "start" | "end" | "title" | "summary" | "details">;

export interface Item {
  year?: string;
  title: T;
}

const EMAIL = "kenin221@gmail.com";
const gravatar = (email: string, size: number) =>
  `https://gravatar.com/avatar/${createHash("sha256").update(email.trim().toLowerCase()).digest("hex")}?s=${size}&d=404`;

export const person = {
  handle: "Fearnot",
  name: { zh: "盧明澤", en: "Ming-Tse Lu" } as T,
  roles: {
    zh: "資訊安全・網路維運・社群經營",
    en: "Security · Network Ops · Community",
  } as T,
  lede: {
    zh: "嗨！我是 Fearnot ，長期貢獻於社群領域，熱衷於參加各種活動，目前鑽研於資訊安全及網路維運相關領域。",
    en: "Hi! I'm Fearnot, an active contributor to various communities with a passion for participating in all kinds of events. I'm currently focusing on cybersecurity and network operations.",
  } as T,
  /** Gravatar of the contact email; set to undefined to show the empty frame instead */
  avatar: gravatar(EMAIL, 320) as string | undefined,
  location: { zh: "臺灣", en: "Taiwan" } as T,
  email: EMAIL,
  links: [
    {
      label: "GitHub",
      href: "https://github.com/fearnot221",
      text: "github.com/fearnot221",
    },
    { label: "SCIST", href: "https://scist.org", text: "scist.org" },
  ],
};

export const experience: Org[] = [
  {
    kind: "community",
    org: { zh: "SCIST 南臺灣學生資訊社群", en: "SCIST" },
    href: "https://scist.org",
    roles: [
      {
        start: "2024",
        end: "2026",
        title: { zh: "總召、網管", en: "Lead Organizer & Network Admin" },
        summary: {
          zh: "第五、六屆總召。經營 2,700 人以上的社群，撰寫計畫書向資訊科技公司募得 30 餘萬元贊助，舉辦為期一年、學員超過 200 人的免費資安與演算法課程，並與 20 餘所南部高中資訊社合作。",
          en: "Led the 5th and 6th terms. Runs a 2,700+ member community, raised over NT$300,000 from tech companies through written proposals, and ran a free year-long security and algorithms program for 200+ students with 20+ high school computer clubs in southern Taiwan.",
        },
        details: [
          {
            zh: "開發 SCIST Discord bot：學員輸入代碼即可領取身分組，管理員可批次發放，大幅減少行政工作。",
            en: "Built the SCIST Discord bot: students claim roles with a code and admins grant roles in batches, removing most manual admin work.",
          },
          {
            zh: "擔任第五、六屆網管，負責社群的網路與服務維運。",
            en: "Network administrator for the 5th and 6th terms, running the community's network and services.",
          },
          {
            zh: "在 SITCON、HITCON 擺攤推廣，並設計、開發問答式迷宮小遊戲。",
            en: "Ran booths at SITCON and HITCON, with a quiz-maze mini game I designed and built.",
          },
        ],
      },
    ],
  },
  {
    kind: "talk",
    org: { zh: "SCIST 南臺灣學生資訊社群", en: "SCIST" },
    roles: [
      {
        start: "2024",
        end: "2026",
        title: {
          zh: "資訊安全推廣課程 講師",
          en: "Instructor, Security Outreach Course",
        },
        summary: {
          zh: "有感於南部缺乏資安資源，開辦資訊安全推廣課程，讓更多國高中生接觸資安。",
          en: "Started a security outreach course so more students in under-served southern Taiwan can get into security.",
        },
      },
    ],
  },
  {
    kind: "community",
    org: { zh: "SITCON 2026 學生計算機年會", en: "SITCON 2026" },
    href: "https://sitcon.org",
    roles: [
      {
        start: "2025",
        end: "2026",
        title: { zh: "場務組 組長", en: "Venue Team Lead" },
        summary: {
          zh: "管理年會場地相關事務，並規劃 SITCON Hour of Code 南部場。",
          en: "Ran venue operations for the conference and is planning the southern SITCON Hour of Code.",
        },
        details: [
          {
            zh: "SITCON 2025 場務組機動股股長：協助報到、場地機動、餐飲與物流規劃。",
            en: "SITCON 2025, venue floor team lead: registration, on-site logistics, catering and supplies.",
          },
          {
            zh: "SITCON Camp 2025 庶務組組長：負責營隊住宿與場地。",
            en: "SITCON Camp 2025, operations lead: lodging and venues.",
          },
        ],
      },
    ],
  },
  {
    kind: "community",
    org: {
      zh: "六校聯合寒訓、SCIST × 南十五校聯合寒訓",
      en: "Six-School & SCIST × 15-School Winter Camps",
    },
    roles: [
      {
        start: "2025",
        end: "2025",
        title: { zh: "聯合寒訓 總召、副召", en: "Winter Camp Lead & Deputy Lead" },
        summary: {
          zh: "帶領六校、超過 70 人參訪科技公司與校園；並與南部十五所高中合辦三天住宿營隊，約 150 人參與。",
          en: "Led a six-school trip of 70+ students to tech companies and campuses, and co-ran a three-day residential camp with 15 southern high schools for about 150 students.",
        },
      },
    ],
  },
  {
    kind: "talk",
    org: { zh: "AIS3 Club", en: "AIS3 Club" },
    roles: [
      {
        start: "2024",
        end: "2024",
        title: {
          zh: "南區資安體驗營 講師",
          en: "Instructor, Southern Security Camp",
        },
        summary: {
          zh: "講授 Linux 基礎：作業系統、虛擬機到基礎指令與應用。",
          en: "Taught Linux fundamentals: operating systems, virtual machines and everyday commands.",
        },
      },
    ],
  },
  {
    kind: "community",
    org: { zh: "MOPCON", en: "MOPCON" },
    href: "https://mopcon.org",
    roles: [
      {
        start: "2024",
        end: "2025",
        title: { zh: "場務組 副組長", en: "Deputy Venue Lead" },
        summary: {
          zh: "2024 年擔任組員，2025 年擔任副組長。",
          en: "Crew in 2024, deputy lead in 2025.",
        },
      },
    ],
  },
];

export const education: Entry[] = [
  // TODO: add the university once confirmed
  {
    start: "2023",
    end: "2026",
    title: {
      zh: "國立鳳山高級中學",
      en: "National Fengshan Senior High School",
    },
    org: { zh: "", en: "" },
  },
];

export const training: Entry[] = [
  {
    start: "2024",
    end: "2024",
    title: {
      zh: "AIS3 新型態資安暑期課程",
      en: "AIS3 Summer Security Program",
    },
    org: { zh: "進階資安攻防競技組", en: "Advanced CTF track" },
    summary: {
      zh: "專題設計 Flask／Jinja2 的 SSTI 題目，並研究完整的防禦方式。",
      en: "Final project: designed a Flask/Jinja2 SSTI challenge and studied how to defend against it properly.",
    },
  },
  {
    start: "2024",
    end: "2026",
    title: {
      zh: "AIS3 好厲駭 高階培訓（第九、十屆）",
      en: "AIS3 HolyHack Advanced Mentorship (9th, 10th)",
    },
    org: { zh: "教育部", en: "Ministry of Education" },
    summary: {
      zh: "AI 與資安、Windows Exploitation 系列課程。",
      en: "AI for security and Windows exploitation series.",
    },
  },
  {
    start: "2023",
    end: "2024",
    title: {
      zh: "SCIST 第四屆 資安學員",
      en: "SCIST 4th Term, Security Track",
    },
    org: { zh: "SCIST", en: "SCIST" },
    summary: {
      zh: "Linux、Python、Web、Crypto、Pwn、Reverse，結業成績 3／27。",
      en: "Linux, Python, Web, Crypto, Pwn and Reverse; finished 3rd of 27.",
    },
  },
  {
    start: "2024",
    end: "2025",
    title: {
      zh: "AIS3 Club 資安社團幹部研習",
      en: "AIS3 Club Leadership Training",
    },
    org: { zh: "AIS3 Club", en: "AIS3 Club" },
    summary: {
      zh: "2025 年受邀上台分享 SCIST 的社群經營。",
      en: "Invited in 2025 to present how SCIST is run.",
    },
  },
];

export const awards: Item[] = [
  {
    year: "2025",
    title: {
      zh: "第 55 屆全國技能競賽 南區分賽 網路安全職類 第一名",
      en: "1st place, Cyber Security, 55th National Skills Competition (Southern Regional)",
    },
  },
  {
    year: "2025",
    title: {
      zh: "InfoSec Taiwan CTF 2025 高中組 第二名",
      en: "2nd place, high school division, InfoSec Taiwan CTF 2025",
    },
  },
  {
    year: "2025",
    title: {
      zh: "HITCON CTF 2025 第 32 名／1,289 隊（臺灣第五）",
      en: "HITCON CTF 2025: 32nd of 1,289 teams (5th in Taiwan)",
    },
  },
  {
    year: "2025",
    title: {
      zh: "AIS3 EOF 進階資安攻防演練 決賽第八名、最佳藍色小精靈獎",
      en: "AIS3 EOF Finals: 8th place and Best Blue Team award",
    },
  },
  {
    year: "2025",
    title: {
      zh: "HSPC 成大高中生程式設計邀請賽 初賽 41／143，晉級決賽",
      en: "NCKU HSPC: 41st of 143 in qualifiers, advanced to finals",
    },
  },
  {
    year: "2025",
    title: {
      zh: "picoCTF 2025 第 1,156 名／10,460",
      en: "picoCTF 2025: 1,156th of 10,460",
    },
  },
  {
    year: "2024",
    title: {
      zh: "THJCC CTF 臺灣高中聯合資安競賽 第 8 名（佳作）",
      en: "THJCC CTF (Taiwan high school joint CTF): 8th, honorable mention",
    },
  },
  {
    year: "2024",
    title: { zh: "FHSH CTF 第 3 名", en: "FHSH CTF: 3rd place" },
  },
  {
    year: "2024",
    title: { zh: "LoTuX CTF 第 7 名", en: "LoTuX CTF: 7th place" },
  },
  {
    year: "2024",
    title: { zh: "AIS3 Pre-Exam 第 130 名", en: "AIS3 Pre-Exam: 130th" },
  },
  {
    year: "2024",
    title: {
      zh: "picoCTF 2024 第 1,173 名／11,517",
      en: "picoCTF 2024: 1,173rd of 11,517",
    },
  },
];

export const certifications: Item[] = [
  {
    year: "2025",
    title: {
      zh: "iPAS 資訊安全工程師 中級",
      en: "iPAS Information Security Engineer, Intermediate",
    },
  },
  {
    year: "2025",
    title: {
      zh: "APCS 程式設計觀念 4 級、實作 3 級",
      en: "APCS: Concepts level 4, Implementation level 3",
    },
  },
  {
    year: "2024",
    title: {
      zh: "iPAS 資訊安全工程師 初級",
      en: "iPAS Information Security Engineer, Associate",
    },
  },
];

// TODO: rewrite these from GitHub descriptions into what you built and why
export const projects: Entry[] = [
  {
    start: "2026",
    end: "2026",
    title: { zh: "evergreenbloom-demo", en: "evergreenbloom-demo" },
    org: { zh: "", en: "" },
    summary: {
      zh: "松櫻祭網站展示版",
      en: "Demo build of the festival website",
    },
    href: "https://github.com/fearnot221/evergreenbloom-demo",
  },
  {
    start: "2026",
    end: "2026",
    title: { zh: "evergreenbloom-pwa", en: "evergreenbloom-pwa" },
    org: { zh: "", en: "" },
    summary: {
      zh: "松櫻祭集章遊戲 PWA，以 Docker 部署",
      en: "Stamp-collecting game PWA for the Evergreen Bloom festival, deployed with Docker",
    },
    href: "https://github.com/fearnot221/evergreenbloom-pwa",
  },
  {
    start: "2026",
    end: "2026",
    title: { zh: "UI-db", en: "UI-db" },
    org: { zh: "", en: "" },
    summary: {
      zh: "收集 UI 效果與工具的資料庫",
      en: "A database of UI effects and tools",
    },
    href: "https://github.com/fearnot221/UI-db",
  },
  {
    start: "2026",
    end: "2026",
    title: { zh: "evergreenbloom", en: "evergreenbloom" },
    org: { zh: "", en: "" },
    summary: {
      zh: "松櫻祭活動網站：Bloom E2 原型與中央大學校園地圖",
      en: "Festival web app for Evergreen Bloom: Bloom E2 prototype and an NCU campus map",
    },
    href: "https://github.com/fearnot221/evergreenbloom",
  },
  {
    start: "2026",
    end: "2026",
    title: { zh: "confsys", en: "confsys" },
    org: { zh: "", en: "" },
    summary: {
      zh: "可重複使用的研討會管理平台，每場活動獨立部署",
      en: "Reusable conference management platform with independently deployed instances",
    },
    href: "https://github.com/fearnot221/confsys",
  },
  {
    start: "2026",
    end: "2026",
    title: { zh: "cert-app", en: "cert-app" },
    org: { zh: "", en: "" },
    summary: {
      zh: "多組織證書發放：不可竄改的 PDF、公開驗證、QR code 與到期管理",
      en: "Multi-organization certificates: immutable PDFs, public verification, QR codes and expiry management",
    },
    href: "https://github.com/fearnot221/cert-app",
  },
  {
    start: "2026",
    end: "2026",
    title: { zh: "ATLab", en: "ATLab" },
    org: { zh: "", en: "" },
    summary: { zh: "ATLab 網站", en: "Website for ATLab" },
    href: "https://github.com/fearnot221/ATLab",
  },
  {
    start: "2026",
    end: "2026",
    title: { zh: "ashore-test", en: "ashore-test" },
    org: { zh: "", en: "" },
    summary: { zh: "Ashore 網站測試", en: "Ashore site test" },
    href: "https://github.com/fearnot221/ashore-test",
  },
  {
    start: "2026",
    end: "2026",
    title: { zh: "dns-manager", en: "dns-manager" },
    org: { zh: "", en: "" },
    summary: {
      zh: "NCUEECESNMG DNS 管理系統：PowerDNS 紀錄、DNS 申請與資產清冊",
      en: "DNS manager for NCUEECESNMG: PowerDNS records, DNS applications and inventory",
    },
    href: "https://github.com/fearnot221/dns-manager",
  },
  {
    start: "2026",
    end: "2026",
    title: { zh: "split-bill", en: "split-bill" },
    org: { zh: "", en: "" },
    summary: { zh: "分帳小工具", en: "Bill-splitting tool" },
    href: "https://github.com/fearnot221/split-bill",
  },
  {
    start: "2026",
    end: "2026",
    title: {
      zh: "thaumcraft-research-planner",
      en: "thaumcraft-research-planner",
    },
    org: { zh: "", en: "" },
    summary: {
      zh: "GTNH Thaumcraft 研究路線規劃工具",
      en: "Research route planner for GTNH Thaumcraft",
    },
    href: "https://github.com/fearnot221/thaumcraft-research-planner",
  },
  {
    start: "2025",
    end: "2025",
    title: { zh: "SCIST Discord bot", en: "SCIST Discord bot" },
    org: { zh: "", en: "" },
    summary: {
      zh: "以代碼領取身分組、管理員批次發放，簡化社群行政流程。",
      en: "Code-based role claiming and batch role grants that streamline community admin.",
    },
    href: "https://github.com/fearnot221/scist-bot",
  },
  {
    start: "2025",
    end: "2025",
    title: {
      zh: "115 特殊選才資訊群組",
      en: "Special Admission 2026 info group",
    },
    org: { zh: "", en: "" },
    href: "https://github.com/fearnot221/115_dc_bot",
    summary: {
      zh: "建立 Discord 群組整理各校特選簡章、日程與歷屆心得，並開發 bot 簡化身分審核。",
      en: "Discord community gathering special admission rules, dates and applicants' notes, with a bot for identity checks.",
    },
  },
  {
    start: "2025",
    end: "2025",
    title: { zh: "SCIST 問答迷宮遊戲", en: "SCIST quiz maze game" },
    org: { zh: "", en: "" },
    href: "https://github.com/fearnot221/2025-sitcon-scist-game",
    summary: {
      zh: "為 SITCON 擺攤設計的問答式迷宮小遊戲，讓會眾認識 SCIST。",
      en: "A quiz-maze mini game built for the SCIST booth at SITCON.",
    },
  },
];

/** Roles without a clear date range (not shown; full record). */
export const roles: Item[] = [
  {
    title: {
      zh: "鳳山高中電腦資訊社（FSCS）社長",
      en: "President, Fengshan High School Computer Club (FSCS)",
    },
  },
  {
    title: {
      zh: "高雄資訊社團聯盟（ITLC）第五屆總召",
      en: "Lead organizer, Kaohsiung IT Club League (ITLC), 5th term",
    },
  },
  {
    title: {
      zh: "教育體系資安攻防演練 檢測員",
      en: "Tester, education-sector security exercise",
    },
  },
  {
    title: {
      zh: "113 學年度鳳山高中學生代表",
      en: "Student representative, Fengshan High School (2024–25)",
    },
  },
];

/** Footer strip of Winter GIFs (square files in public/). Empty = that many reserved frames are shown. */
export const footerGifs: string[] = []; // TODO: e.g. ["/winter-1.gif", "/winter-2.gif"]
export const reservedGifSlots = 3;

export const skills: { group: string; items: T }[] = [
  {
    group: "Security",
    items: {
      zh: "滲透測試、紅隊演練、Web 安全、數位鑑識、封包分析",
      en: "Penetration testing, red teaming, web security, forensics, packet analysis",
    },
  },
  {
    group: "Network",
    items: {
      zh: "網路維運、Linux 系統管理",
      en: "Network operations, Linux administration",
    },
  },
  {
    group: "Engineering",
    items: {
      zh: "Python、TypeScript、前後端開發、Discord Bot",
      en: "Python, TypeScript, full-stack web, Discord bots",
    },
  },
  {
    group: "Community",
    items: {
      zh: "社群經營、課程規劃、營隊與年會籌辦",
      en: "Community building, curriculum design, camps and conferences",
    },
  },
];
