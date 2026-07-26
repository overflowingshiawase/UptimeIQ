# UptimeIQ－預防性保養與妥善率智慧平台
### 需求規格書（BRD）暨資料庫設計文件

---

## 0. 專案定位與敘事主軸

**身分設定**：以產品經理／創業者身分，設計一套要銷售給製造業客戶的設備保養管理產品，而不是替特定公司客製化的內部工具。

**核心敘事**：舊專案（SMOIADSP）是 **Case導向**——建立在單一工廠的個案情境上，因此容易被質疑「為什麼一定要這樣設計」。本專案改為 **Product導向**——任何製造業工廠都能套用，邏輯由工業界公開標準與數學公式支撐，而非個人經驗判斷。

**一句話定位**：
> 一套以資料驅動保養排程與設備績效分析為核心的智慧平台，協助製造業降低非預期停機、提升設備妥善率。

命名刻意不使用「預測性維護」「全生命週期管理」等暗示更大範圍的字眼，確保命名與實際開發範圍一致。

---

## 1. 產品概述

| 項目 | 內容 |
|---|---|
| 產品名稱 | UptimeIQ（中文：預防性保養與妥善率智慧平台） |
| 目標客戶 | 中小型製造業工廠（不限單一產業，透過設備類別欄位容納不同設備類型） |
| 核心價值主張 | 降低非預期停機成本、提升設備妥善率（Availability） |
| 商業模式假設 | SaaS訂閱制，依設備台數或用戶數計費（本階段不展開，僅作為敘事背景） |

---

## 2. 範圍界定（Scope）

### 本次開發範圍（MVP，2大模組）
- BRD-01：資料驅動保養排程
- BRD-02：設備績效與導入效益分析

### 明確排除、列入Roadmap
- Asset全生命週期管理（採購～報廢）
- 完整工單派工／簽核流程
- 巡檢管理（Inspection）
- 備品庫存管理（Spare Parts Inventory）
- 預測性維護（IoT / Sensor-based Predictive Maintenance，需感測器數據與ML模型，本階段不具備條件）
- 完整RBAC權限矩陣（角色管理後台）

> 排除原因：避免重蹈舊專案「範圍過大、每個功能都做20%」的問題，將資源集中在能被資料邏輯完整支撐的2個模組上。

---

## 3. 使用者角色與權限設計

| 角色 | 可視範圍 | 可執行操作 |
|---|---|---|
| **viewer**（技術員／現場人員） | 僅自己被指派的設備（`assigned_machines`） | 查看自己設備的保養排程、新增自己處理的維修紀錄 |
| **admin**（設備主管／廠長） | 全廠所有設備 | 查看全部保養排程、維修紀錄、績效儀表板（MTBF/MTTR/Availability/ROI）、可調整保養規則基準值 |

**實作方式**（輕量，不做角色管理後台）：
1. 前端依 `role` 欄位決定頁面顯示範圍（績效儀表板僅admin可見）
2. Supabase RLS 僅設一條政策：`role = 'admin' OR machine_id IN assigned_machines`，不建立完整權限矩陣

---

## 4. BRD-01：資料驅動保養排程（Preventive Maintenance Scheduling）

### 4.1 需求背景（Business Case）
傳統中小型工廠多以固定週期（如每3個月）排定保養，未考慮設備實際運轉狀況與歷史故障頻率，容易「保養過度」（浪費人力）或「保養不足」（增加故障風險）。

### 4.2 User Story
- 身為設備主管，我希望系統能依據每台設備的運轉數據與歷史故障間隔，動態建議下一次保養時間，而不是固定套用同一週期。
- 身為技術員，我希望能看到自己負責設備的保養到期提醒。

### 4.3 核心邏輯（資料驅動公式）

```
下一次保養建議時間 = 基準週期 × 調整係數

調整係數 = f(該設備近期MTBF, 故障嚴重度加權)

規則：
- 若該設備近期 MTBF（平均故障間隔）低於歷史平均 → 調整係數 < 1（縮短週期）
- 若該設備近期無故障、MTBF穩定或上升 → 調整係數 = 1（維持基準週期）
- 若近期故障嚴重度（Critical）出現 → 額外縮短週期
```

此邏輯屬於工業界 **Reliability-Centered Maintenance（可靠度中心保養）** 的簡化實作，不是憑個人經驗設定的規則。

### 4.4 驗收標準（Acceptance Criteria）
- 每台設備需有 `base_pm_cycle`（基準週期，可依日曆天數或運轉時數設定）
- 系統能依上述公式自動計算 `next_pm_due_date` 並顯示於清單
- 逾期未保養的設備需有明確狀態標示

---

## 5. BRD-02：設備績效與導入效益分析（Performance & ROI Analytics）

### 5.1 需求背景（Business Case）
廠長／老闆決定是否採購一套系統，最終看的是「能不能降低成本」。因此除了呈現維護型KPI，還需要換算成金額，才具備說服買單的商業說服力。

### 5.2 User Story
- 身為廠長，我希望能一眼看到整體設備妥善率與停機造成的成本損失，以評估是否值得投資保養改善。

### 5.3 KPI 公式定義（皆為工業界公開標準定義，非自訂邏輯）

| KPI | 公式 | 說明 |
|---|---|---|
| MTBF（平均故障間隔） | 總正常運轉時間 ÷ 故障次數 | 數值越高代表設備越穩定 |
| MTTR（平均修復時間） | 總維修時間 ÷ 維修次數 | 數值越低代表維修效率越高 |
| Availability（妥善率） | MTBF ÷ (MTBF + MTTR) | 業界標準可用率公式 |
| PM Compliance（保養達成率） | 已完成保養次數 ÷ 應完成保養次數 × 100% | 衡量保養排程是否確實執行 |
| 停機成本試算 | 停機時數 × 每小時停機成本（人力+產能損失，由客戶自行輸入） | 用於呈現ROI，是說服老闆買單的關鍵頁面 |

### 5.4 驗收標準
- 儀表板需能依「全廠」與「單一設備」兩種顆粒度呈現上述KPI
- 停機成本試算需可讓使用者調整「每小時停機成本」參數（因不同工廠成本結構不同）

---

## 6. 資料來源與可信度說明（因應「數據從哪來」的質疑）

**Demo階段**：本專案數據為模擬產生，用於展示邏輯正確性與介面呈現，非真實工廠數據。模擬數據產生規則會明確標註（例如依設定的故障率分布隨機產生維修紀錄）。

**正式產品情境下**：所有KPI數據並非人工填寫，而是系統在維修工單結案時自動寫入 `maintenance_record`，MTBF／MTTR／Availability等指標由系統對這些紀錄即時做SQL聚合計算得出，非人為輸入的數字，因此具備可追溯性與可信度。

**公式依據**：MTBF、MTTR、Availability、PM Compliance 皆為設備維護管理領域的公開標準定義，任何面試官或客戶皆可自行查證，不依賴個人經驗背書。

---

## 7. 資料庫欄位設計（Database Schema）

### 7.1 machine_master（設備主檔）
| 欄位 | 型別 | 說明 |
|---|---|---|
| machine_id | uuid (PK) | 設備唯一識別碼 |
| machine_name | text | 設備名稱 |
| equipment_category | text | 設備類別（產線機台/空調/發電機/堆高機…，可擴充，用於容納各式設備） |
| model | text | 型號 |
| manufacturer | text | 製造商 |
| install_date | date | 安裝日期 |
| location | text | 所在位置 |
| base_pm_cycle_days | integer | 基準保養週期（日曆天數） |
| base_pm_cycle_hours | integer | 基準保養週期（運轉時數，可選） |
| status | text | 啟用／停用 |
| created_at | timestamp | 建檔時間 |

### 7.2 fault_type（故障類型對照表，可由客戶自訂）
| 欄位 | 型別 | 說明 |
|---|---|---|
| fault_type_id | uuid (PK) | 故障類型ID |
| fault_name | text | 故障名稱（如：洩漏、異音、異常溫升，客戶可自行新增） |
| severity_level | text | Critical / Major / Minor |
| severity_weight | numeric | 嚴重度權重，供BRD-01調整係數公式使用 |
| description | text | 說明 |

### 7.3 maintenance_record（維修／保養執行紀錄）
| 欄位 | 型別 | 說明 |
|---|---|---|
| record_id | uuid (PK) | 紀錄ID |
| machine_id | uuid (FK → machine_master) | 對應設備 |
| record_type | text | PM（預防保養）／CM（故障維修） |
| fault_type_id | uuid (FK → fault_type，CM類型才需填) | 對應故障類型 |
| start_time | timestamp | 開始時間 |
| end_time | timestamp | 結束時間 |
| downtime_hours | numeric | 停機時數（可由start/end計算） |
| repair_cost | numeric | 維修成本（可選） |
| technician_id | uuid (FK → user_profiles) | 處理人員 |
| notes | text | 備註 |
| created_at | timestamp | 建檔時間 |

### 7.4 pm_schedule（保養排程與預測）
| 欄位 | 型別 | 說明 |
|---|---|---|
| schedule_id | uuid (PK) | 排程ID |
| machine_id | uuid (FK → machine_master) | 對應設備 |
| last_pm_date | date | 上次保養日期 |
| calculated_mtbf | numeric | 系統計算之近期MTBF（快取值） |
| adjustment_factor | numeric | 依嚴重度計算之調整係數 |
| next_pm_due_date | date | 系統計算之下次建議保養日期 |
| status | text | 待保養／已逾期／已完成 |

### 7.5 user_profiles（既有，延伸角色欄位）
| 欄位 | 型別 | 說明 |
|---|---|---|
| user_id | uuid (PK, FK → auth.users) | 使用者ID |
| full_name | text | 姓名 |
| role | text | admin／viewer |
| assigned_machines | uuid[] | viewer被指派可視的設備清單（陣列或關聯表皆可） |

### 7.6 資料表關聯（ER概述）
```
machine_master (1) ── (N) maintenance_record
machine_master (1) ── (1) pm_schedule
fault_type     (1) ── (N) maintenance_record
user_profiles  (1) ── (N) maintenance_record  [technician_id]
```

> 說明：績效儀表板（MTBF/MTTR/Availability/PM Compliance）建議以 SQL View 或前端查詢聚合計算，不另建實體表，避免資料庫結構過度複雜。

---

## 8. Roadmap（未來規劃項目）

| 項目 | 排除原因 |
|---|---|
| Asset全生命週期管理 | 範圍過大，本階段聚焦保養排程與績效分析 |
| 完整工單派工流程 | 僅需最小化資料輸入介面即可支撐分析邏輯 |
| 巡檢管理 | 與PM排程功能重疊度高，優先度較低 |
| 備品庫存管理 | 需額外的消耗預測邏輯，列入下一階段 |
| 預測性維護（IoT/ML） | 需感測器數據與訓練模型，非規則式邏輯可支撐，避免overclaim |
| 完整RBAC權限矩陣 | 現階段兩層角色已足夠展示權限設計思維 |

---

## 9. 技術架構

- 前端：HTML / CSS / JavaScript
- 後端／資料庫：Supabase（免費方案）
- 身分驗證：Supabase Auth + user_profiles（admin／viewer 二層角色）
- 權限控管：前端頁面權限判斷 + Supabase RLS（單一政策：admin全開，viewer限assigned_machines）
