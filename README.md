# UptimeIQ｜預防性保養與妥善率智慧平台

一套以資料驅動保養排程與設備績效分析為核心的智慧平台，協助製造業降低非預期停機、提升設備妥善率。

**Demo網址**：`（部署到Netlify後，把網址貼在這裡）`

---

## 履歷可直接引用的簡短介紹

> 設計並開發 UptimeIQ——一套以資料驅動保養排程與設備績效分析為核心的B2B保養管理平台原型。以產品經理視角定位為可跨產業銷售的產品，而非單一公司客製系統；核心邏輯（動態保養週期計算、MTBF/MTTR/Availability/PM Compliance）皆基於工業界公開標準公式，並設計「導入前後情境模擬」以量化ROI，回應商業決策者最關心的投資報酬問題。技術上實作了角色權限控管（RLS）、多資料表關聯設計、與完整的需求規格文件。

**技術關鍵字（履歷關鍵字欄可用）**：Supabase、PostgreSQL、Row Level Security、JavaScript、資料驅動設計、BRD需求文件、MTBF/MTTR分析、ROI試算

---

## 專案定位

以產品經理／創業者視角設計，可販售給任何製造業客戶的保養管理產品，而非為單一公司客製化的內部工具。設備類別可自由擴充（產線機台、空調、堆高機、發電機…），核心邏輯全部由業界公開標準公式支撐（MTBF／MTTR／Availability／PM Compliance），而非個人經驗判斷。

## 核心模組（MVP）

| 模組 | 說明 |
|---|---|
| BRD-01 資料驅動保養排程 | 依運轉狀況與歷史故障間隔（MTBF）動態計算下次保養時間，非固定週期 |
| BRD-02 設備績效與導入效益分析 | MTBF／MTTR／Availability／PM Compliance＋停機成本試算＋「導入前後」情境模擬＋單一設備故障時間軸 |

其餘模組（Asset全生命週期、備品庫存、預測性維護等）明確列為Roadmap，詳見產品定位頁與需求文件。

## 技術架構

- 前端：HTML / CSS / JavaScript（無框架）
- 後端／資料庫：Supabase（PostgreSQL + Auth + Row Level Security）
- 部署：Netlify（接GitHub自動部署）

## 頁面說明

| 檔案 | 說明 |
|---|---|
| `index.html` | 登入頁 |
| `machines.html` | 設備清單 |
| `maintenance-form.html` | 維修／保養紀錄輸入＋歷史紀錄瀏覽（年份／月份樹狀導覽） |
| `pm-schedule.html` | 動態保養排程（BRD-01核心邏輯） |
| `analytics.html` | 績效分析儀表板（BRD-02，含情境模擬與單一設備深潛，僅admin可見） |
| `product-overview.html` | 產品定位與Roadmap說明 |

## 需求文件

完整BRD需求規格書與資料庫設計，見 [`docs/UptimeIQ_需求文件與資料庫設計.md`](./docs/UptimeIQ_需求文件與資料庫設計.md)。

## 設計取捨說明

本專案初期規劃範圍較大（涵蓋Dashboard、AI、多主題BRD等十餘項功能），經課程指導老師與業界PM審視後，重新定位為「產品導向」而非「案例導向」，將範圍收斂至2個核心模組並深化其邏輯完整度，而非追求功能廣度。此取捨過程本身即為本專案希望呈現的商業分析與範圍管理能力之一。
