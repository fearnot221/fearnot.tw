// The Resume's own content (/resume/ and its PDF), maintained separately from the home page (profile.ts):
// the two may differ. Chinese only, so plain strings. Name, contact links and location come from `person`.
// Keep it to one A4 page: `npm run assets` regenerates the PDF and fails if it spills onto a second page.

export interface ResumeRole {
  title: string;
  start: string;
  end?: string; // omitted = present; equal to start = a single year
  bullets?: string[];
}

export const resume = {
  summary:
    "專注於資訊安全與網路維運。具備滲透測試、Web 安全、數位鑑識與封包分析的實務經驗，熟悉 Linux 系統管理與網路服務維運，並能以 Python、TypeScript 開發全端應用與自動化工具。長期投入南臺灣資訊教育，擅長技術課程規劃與社群經營。",

  skills: [
    { group: "Security", items: "滲透測試、紅隊演練、Web 安全、數位鑑識、封包分析" },
    { group: "Network", items: "網路維運、Linux 系統管理" },
    { group: "Engineering", items: "Python、TypeScript、前後端開發、Discord Bot" },
    { group: "Community", items: "社群經營、課程規劃、營隊與年會籌辦" },
  ],

  education: [{ title: "國立鳳山高級中學", start: "2023", end: "2026" }] as ResumeRole[],

  // one entry per organisation; `bullets` on the entry itself go under all of its roles
  experience: [
    {
      org: "SCIST 南臺灣學生資訊社群",
      roles: [
        {
          title: "總召、網管",
          start: "2024",
          end: "2026",
          bullets: [
            "第五、六屆總召。經營 2,700 人以上的社群，撰寫計畫書向資訊科技公司募得 30 餘萬元贊助，舉辦為期一年、學員超過 200 人的免費資安與演算法課程，並與 20 餘所南部高中資訊社合作。",
            "開發 SCIST Discord bot：學員輸入代碼即可領取身分組，管理員可批次發放，大幅減少行政工作。",
            "擔任第五、六屆網管，負責社群的網路與服務維運。",
            "在 SITCON、HITCON 擺攤推廣，並設計、開發問答式迷宮小遊戲。",
          ],
        },
        {
          title: "資訊安全推廣課程 講師",
          start: "2024",
          end: "2026",
          bullets: ["有感於南部缺乏資安資源，開辦資訊安全推廣課程，讓更多國高中生接觸資安。"],
        },
      ],
    },
    {
      org: "SITCON 2026 學生計算機年會",
      roles: [
        {
          title: "場務組 組長",
          start: "2025",
          end: "2026",
          bullets: [
            "管理年會場地相關事務，並規劃 SITCON Hour of Code 南部場。",
            "SITCON 2025 場務組機動股股長：協助報到、場地機動、餐飲與物流規劃。",
            "SITCON Camp 2025 庶務組組長：負責營隊住宿與場地。",
          ],
        },
      ],
    },
  ] as { org: string; roles: ResumeRole[]; bullets?: string[] }[],

  // 獎項與證照
  awards: [
    { title: "第 55 屆全國技能競賽 南區分賽 網路安全職類 第一名", year: "2025" },
    { title: "InfoSec Taiwan CTF 2025 高中組 第二名", year: "2025" },
    { title: "HITCON CTF 2025 第 32 名／1,289 隊（臺灣第五）", year: "2025" },
    { title: "AIS3 EOF 進階資安攻防演練 決賽第八名、最佳藍色小精靈獎", year: "2025" },
    { title: "iPAS 資訊安全工程師 中級", year: "2025" },
    { title: "APCS 程式設計觀念 4 級、實作 3 級", year: "2025" },
  ],

  projects: [
    {
      title: "SCIST Discord bot",
      year: "2025",
      href: "https://github.com/fearnot221/scist-bot",
      summary: "以代碼領取身分組、管理員批次發放，簡化社群行政流程。",
    },
    {
      title: "115 特殊選才資訊群組",
      year: "2025",
      href: "https://github.com/fearnot221/115_dc_bot",
      summary: "建立 Discord 群組整理各校特選簡章、日程與歷屆心得，並開發 bot 簡化身分審核。",
    },
  ] as { title: string; year: string; href?: string; summary?: string }[],
};
