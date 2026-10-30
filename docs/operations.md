# 維運與部署

## 前端修改與發布

1. 在 `index.html`、`styles.css`、`app.js` 或 `cover.jpg` 修改網站內容。
2. 先以瀏覽器檢查桌機與手機版，並確認表單欄位、行程和對話框符合預期。
3. 若修改 CSS 或 JavaScript，更新 `index.html` 中對應資產的查詢版本（目前為 `?v=2`），避免瀏覽器或 Pages CDN 繼續使用快取檔案。
4. 提交並推送到 `main`。GitHub Pages Actions 會自動建置與部署；確認 workflow 成功後再檢查公開網址。

```powershell
git status --short
git add index.html styles.css app.js cover.jpg README.md docs
git commit -m "Describe the website update"
git push
```

公開網址：[https://menglin0307.github.io/2026-travel-registration/](https://menglin0307.github.io/2026-travel-registration/)。GitHub Pages 使用 `main` 分支根目錄；GitHub workflow 由 Pages 設定自動建立，無需手動維護 workflow YAML。

## Apps Script 修改與發布

1. 以擁有者帳號開啟既有 Apps Script 專案，將 `apps-script/Code.gs` 的變更同步至編輯器並儲存。此 repo 目前沒有 `clasp` 自動同步，修改本機檔案不會自動更新雲端專案。
2. 選擇「部署」→「管理部署作業」→「編輯」，版本選「建立新版本」，確認執行身分仍是擁有者、存取權仍是「所有人」，然後更新部署。
3. 更新後確認 `/exec` 網址與 `app.js` 的 `scriptUrl` 一致。若端點網址改變，修改 `app.js` 並重新部署 GitHub Pages。
4. 實際送出一筆辨識明確的虛構測試資料，確認成功對話框、Apps Script 執行記錄與試算表資料；完成後只刪除自己新增的測試列。

## 驗證清單

- 行程顯示三天日期與共 13 項活動，區塊順序仍為標題、圖片、行程／表單。
- 空白必填欄位、無效 email、參加人數小於 1 或大於 99 時，表單應阻止送出。
- 成功送出時，按鈕恢復可用、表單重設，並顯示「報名資料已送出~」與「確定」按鈕；按下後對話框關閉。
- 試算表檔名為 `2026_旅遊報名表`，分頁為「報名資料」；電話值保留前導零且儲存格格式為文字。
- 桌機與手機版均無水平溢位；Pages workflow 完成後，公開網址載入最新 CSS／JavaScript。
- `git status --short` 不應顯示未提交變更；`spec/` 不應出現在 repo 追蹤清單。

## 常見問題

| 症狀 | 檢查方向 |
| --- | --- |
| 成功送出後表單一直等待 | 確認 Apps Script 部署允許所有人存取、前端 `scriptUrl` 指向 `/exec`，以及後端回覆使用 `window.top.postMessage`。再檢查 Apps Script「執行項目」中的例外。 |
| Apps Script 執行完成但試算表沒有新列 | 檢查執行記錄錯誤、Script Properties 中的試算表 ID、`HEADERS` 與前端 `name` 是否一致，以及所選檔案是否為 Google 試算表。 |
| 電話前導零消失 | 確認後端在寫入資料前呼叫 `getRange(row, 4).setNumberFormat("@")`，並以文字值提交電話。 |
| 網站仍顯示舊行程或舊互動 | 確認 Pages workflow 已成功，再檢查 `index.html` 的資產版本參數是否更新；以全新分頁或清除快取確認。 |
| 成功資料已寫入但頁面顯示逾時 | 檢查訊息來源是否為 `-script.googleusercontent.com`，回覆類型是否為 `employee-tour-registration`，以及瀏覽器載入的 `app.js` 是否為最新版本。 |