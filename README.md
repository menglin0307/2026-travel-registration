# 2027 員工旅遊報名網站

沖繩員工旅遊活動頁面，使用 GitHub Pages 發布，報名資料由 Google Apps Script 寫入 Google 試算表 `2026_旅遊報名表`。

## Google Apps Script

Apps Script 網頁應用程式已部署，表單端點已設定在 `app.js`。應用程式以擁有者身分執行，並允許所有人提交報名；試算表仍留在擁有者的 Google 雲端硬碟，不應公開分享。

第一次收到有效報名時，程式會建立 `2026_旅遊報名表` 試算表、標題列與「報名資料」分頁；電話欄以文字格式寫入。程式來源在 `apps-script/Code.gs`。修改後需儲存並建立新的 Apps Script 部署版本；若部署網址改變，也要更新 `app.js`。

只分享網站網址，不要分享 Apps Script 編輯權限或工作表連結。

## GitHub Pages

網站網址：https://menglin0307.github.io/2026-travel-registration/

此儲存庫不包含 `spec/` 規格資料夾。