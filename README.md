# fearnot.tw

Fearnot 的個人網站與履歷，以 Astro、TypeScript 和原生 CSS 建置，部署於 GitHub Pages。

**[瀏覽網站](https://fearnot.tw/) · [English](https://fearnot.tw/en/) · [履歷](https://fearnot.tw/resume/)**

## 功能與頁面

- 繁體中文與英文首頁，共用個人資料來源。
- 深色／淺色主題切換，記住使用者選擇，支援減少動態效果偏好。
- A4 履歷、列印樣式與兩種語言的 PDF 下載。
- 靜態 Open Graph 分享圖片、canonical、hreflang、JSON-LD 與 sitemap。
- 自行託管的 WOFF2 子集字型與建置時圖片最佳化。

| 路徑                                       | 內容                             |
| ------------------------------------------ | -------------------------------- |
| `/`、`/en/`                                | 中文／英文首頁                   |
| `/resume/`、`/en/resume/`                  | 中文／英文履歷                   |
| `/pdf/resume-zh.pdf`、`/pdf/resume-en.pdf` | 可下載的履歷 PDF                 |
| `/styleguide/`                             | 設計樣式參考頁，設為 `noindex`   |
| `/og/{home,resume}-{zh,en}/`               | 分享圖片的渲染頁，設為 `noindex` |

## 本機開發

使用 **Node.js 24** 與 npm。專案不需要 `.env`、API 金鑰或後端服務。

```sh
git clone https://github.com/fearnot221/fearnot.tw.git
cd fearnot.tw
npm ci
npm run dev
```

依終端機輸出的網址開啟網站（通常為 `http://localhost:4321`）。首次啟動會從 Google Fonts 的 GitHub 儲存庫下載來源字型至 `.fonts-cache/`，需要網路連線；之後會使用快取。

| 指令              | 用途                                              |
| ----------------- | ------------------------------------------------- |
| `npm run dev`     | 更新開發用字型子集並啟動開發伺服器                |
| `npm run check`   | 檢查 Astro 與 TypeScript                          |
| `npm run build`   | 輸出靜態網站至 `dist/`，並更新正式字型子集        |
| `npm run preview` | 預覽 `dist/` 的正式建置                           |
| `npm run fonts`   | 下載／快取字型來源，依原始碼重建字型子集          |
| `npm run assets`  | 先建置，再以 Chromium 產生兩份 PDF 與四張分享圖片 |
| `npm run audit`   | 先建置，再執行 axe 無障礙檢查與 Lighthouse        |

`assets` 與 `audit` 需要 Playwright Chromium，首次使用前執行：

```sh
npx playwright install chromium
# Linux 若缺少系統套件，可改用 npx playwright install --with-deps chromium
```

`audit` 會檢查四個主要頁面的桌面／手機尺寸，以及首頁的深淺主題；另對中文首頁與履歷執行手機／桌面 Lighthouse。通過門檻為各分類至少 95 分、LCP 不超過 2 秒、CLS 不超過 0.01；效能數字會受執行環境影響。

## 專案結構

```text
src/
  data/profile.ts       個人資料、經歷、專案與技能
  i18n.ts               介面翻譯與語言路徑
  seo.ts                JSON-LD 結構化資料
  pages/                首頁、履歷、樣式參考與分享圖片渲染頁
  components/           共用頁面內容與語言／主題切換
  layouts/Base.astro    HTML 外框、SEO metadata 與主題初始化
  styles/               設計 tokens 與共用樣式
public/
  fonts/                已提交的字型子集
  pdf/                  已產生的履歷 PDF
  og/                   已產生的分享圖片 PNG
scripts/
  subset-fonts.mjs      字型下載、快取與子集化
  assets.mjs            PDF 與分享圖片產生工具
  audit.mjs             axe 與 Lighthouse 檢查
.github/workflows/
  deploy.yml            GitHub Pages 自動部署
```

## 更新內容

1. 在 `src/data/profile.ts` 修改資料，並同時維護 `zh`、`en` 文案。經歷、學歷與專案等條目透過 `resume: true` 選入目前的頁面；`details`、`training`、`roles` 等保留資料目前不會顯示。
2. 介面文字修改 `src/i18n.ts`；色彩、字型與間距優先修改 `src/styles/tokens.css`。
3. 新增中文字、更新姓名或標題後，執行以下流程，確保字型、PDF、分享圖片與網頁同步：

   ```sh
   npm run fonts
   npm run check
   npm run assets
   npm run build
   npm run preview
   ```

4. 檢查中英文首頁、履歷及產生的 PDF／PNG；需要完整無障礙與效能檢查時執行 `npm run audit`。將修改後的 `public/fonts/`、`public/pdf/`、`public/og/` 一併提交。

一般 CI 不會下載來源字型，也不會重新產生 PDF／分享圖片：缺少 `.fonts-cache/` 時，建置會直接沿用已提交的字型子集。這讓部署減少外部下載，但新增字元與靜態附件必須先在本機更新。Gravatar 頭像也在建置時取得並最佳化；無法取得時使用頁面既有的空框備援。

## GitHub Pages 部署

部署流程採用 [Astro 官方 GitHub Pages Action](https://docs.astro.build/en/guides/deploy/github/)。推送至 `main` 或在 Actions 手動執行 **Deploy to GitHub Pages** 後，流程會安裝依賴、執行 `npm run check` 與 `npm run build`，上傳 `dist/`，再部署至 `github-pages` environment。檢查或建置失敗時不會部署。

儲存庫的 [Settings → Pages](https://github.com/fearnot221/fearnot.tw/settings/pages) 使用以下設定：

- **Source**：GitHub Actions。
- **Custom domain**：`fearnot.tw`。
- **Enforce HTTPS**：憑證核發完成後啟用。

`astro.config.mjs` 的 `site` 設為 `https://fearnot.tw`，網站直接使用網域根目錄，因此不設定 `/fearnot.tw` 的 `base`。GitHub Actions 部署的自訂網域由 Pages 設定管理，無須 `CNAME` 檔案，詳見 [GitHub 自訂網域文件](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)。

根網域 DNS 指向 GitHub Pages：

| 類型 | 名稱 | 值（每個位址各一筆記錄）                                                                   |
| ---- | ---- | ------------------------------------------------------------------------------------------ |
| A    | `@`  | `185.199.108.153`、`185.199.109.153`、`185.199.110.153`、`185.199.111.153`                 |
| AAAA | `@`  | `2606:50c0:8000::153`、`2606:50c0:8001::153`、`2606:50c0:8002::153`、`2606:50c0:8003::153` |

變更網域時，也需要同步更新 `astro.config.mjs`、`public/robots.txt`、分享圖片渲染頁中的網域文字與本文件，並重新產生分享圖片。

## 素材與授權

來源字型為 Google Fonts 的 Literata、Fragment Mono、Noto Serif TC，採 SIL Open Font License；來源與授權請參閱 [Google Fonts 儲存庫](https://github.com/google/fonts/tree/main/ofl)。第三方素材的權利屬於各自權利人。

本專案目前未提供程式碼授權條款；若要重用程式碼、個人資料或設計，請先聯絡作者。
