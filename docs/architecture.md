# 系統架構與資料流程

## 系統組成

此網站不使用伺服器端框架或建置工具，前端由 GitHub Pages 提供靜態檔案，報名資料由 Google Apps Script 接收並寫入 Google 試算表。

| 元件 | 位置 | 職責 |
| --- | --- | --- |
| 頁面結構與表單 | `index.html` | 活動標題、橫幅、三日行程、欄位、成功對話框及隱藏回覆 iframe。 |
| 樣式 | `styles.css` | 桌機／手機版版面、行程時間軸、表單與成功對話框。 |
| 前端互動 | `app.js` | 表單驗證、POST 傳送、Apps Script 回覆處理、狀態訊息與成功對話框。 |
| 活動圖片 | `cover.jpg` | 頁面橫幅圖片。 |
| 表單後端 | `apps-script/Code.gs` | 欄位檢查、試算表建立／選取、資料寫入與跨 iframe 回覆。 |
| 維護文件 | `docs/` | 架構、資料流與操作方式。 |

GitHub Pages 使用 `main` 分支根目錄，repo 為 `menglin0307/2026-travel-registration`。GitHub 無法保留規格中的中文 repo 名稱，因此使用此 ASCII 名稱；試算表仍使用 `2026_旅遊報名表`。

## 報名資料流程

1. 使用者在 `index.html` 填寫表單。姓名、email、電話必填；瀏覽器會檢查 email 格式與參加人數範圍。
2. `app.js` 將欄位序列化為隱藏表單，以 POST 傳送至同檔設定的 Apps Script `/exec` 網址，目標為隱藏的 `submission-frame`。
3. Apps Script 的 `doPost(event)` 再檢查姓名、email、電話非空，並檢查參加人數為 1 至 99 的整數。
4. `getOrCreateSheet_()` 優先使用 Script Properties 儲存的試算表 ID；若尚無 ID，只接受 MIME 類型為 Google 試算表的同名檔案，找不到才建立試算表。
5. 後端將一筆資料寫入「報名資料」分頁，設定電話欄為文字格式，並附上報名時間。
6. Apps Script 回覆 `employee-tour-registration` 訊息給最上層頁面。前端只接受 `-script.googleusercontent.com` 來源的回覆；成功時重設表單並打開成功對話框，失敗時顯示表單錯誤訊息。

## 表單與試算表欄位

前端欄位名稱必須與 Apps Script 的 `HEADERS` 對應，欄位順序如下：

| 順序 | 欄位 | 必填 | 寫入注意事項 |
| --- | --- | --- | --- |
| 1 | 姓名 | 是 | 文字，最多 80 字。 |
| 2 | email | 是 | 文字，最多 120 字。 |
| 3 | 單位 | 否 | 文字，最多 100 字。 |
| 4 | 電話 | 是 | 文字，最多 30 字；寫入前設定儲存格格式為 `@`，保留前導零。 |
| 5 | 職稱 | 否 | 文字，最多 100 字。 |
| 6 | 參加人數 | 是 | 整數，範圍 1 至 99。 |
| 7 | 報名時間 | 系統產生 | Apps Script 寫入 `new Date()`。 |

試算表第一列為以上標題，分頁名稱為「報名資料」。對可能被試算表解讀成公式的字串，後端會加上單引號前綴再寫入。

## 權限與資料邊界

- Apps Script 網頁應用程式以擁有者身分執行，存取權設定為「所有人」，因此訪客不需登入 Google 即可提交。
- 試算表留在擁有者的 Google 雲端硬碟，不應將試算表或 Apps Script 編輯權限公開分享；只分享網站網址。
- 公開端點可被任何人呼叫。現況沒有 CAPTCHA、登入限制、速率限制或重複報名攔截；若活動需要防濫用，應另行設計並驗證。
- Apps Script `/exec` 網址會出現在前端程式中，應視為公開端點，不可當作密碼或存放其他秘密。
- `spec/` 由根目錄 `.gitignore` 排除，不應以 `git add -f` 強制加入 repository。