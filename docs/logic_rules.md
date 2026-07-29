# 邏輯規則設計文件

> 此文件會在 Phase 3、Phase 4、Phase 6 陸續補完，現在先建立架構。

## 1. 異常風險分數（Phase 3 補完）
公式：risk_score = base_weight * (days_since_last_pm / historical_avg_interval) + fault_type_weight
- 假設來源：（待補——本人產線觀察：距離上次保養時間越久，滴油異常機率越高）
- 權重決定方式：（待補）
- 具體算例：（待補）

## 2. 交接完整度分數（Phase 4 補完）
公式：completeness_score = 已填寫必要欄位數 / 總必要欄位數
- 必要欄位定義：（待補）
- 具體算例：（待補）

## 3. 資料來源聲明（Phase 2 補完）
（待補——模擬資料 vs 真實資料的區分聲明）

## 4. AI用途分工聲明（Phase 7 補完）
（待補——哪些是規則計算、哪些是LLM輔助生成說明文字，避免被誤解為黑盒子預測）