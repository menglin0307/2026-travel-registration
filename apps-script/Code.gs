const SHEET_NAME = "2026_旅遊報名表";
const TAB_NAME = "報名資料";
const HEADERS = ["姓名", "email", "單位", "電話", "職稱", "參加人數", "報名時間"];

function doPost(event) {
  try {
    const values = HEADERS.slice(0, 6).map((header) => String(event.parameter[header] || "").trim());
    if (!values[0] || !values[1] || !values[3]) {
      return response_(false);
    }

    const attendeeCount = Number(values[5] || 1);
    if (!Number.isInteger(attendeeCount) || attendeeCount < 1 || attendeeCount > 99) {
      return response_(false);
    }
    values[5] = attendeeCount;

    const sheet = getOrCreateSheet_();
    const row = sheet.getLastRow() + 1;
    const safeValues = values.map((value) => typeof value === "string" && /^[=+\-@\t\r]/.test(value) ? `'${value}` : value);
    sheet.getRange(row, 4).setNumberFormat("@");
    sheet.getRange(row, 1, 1, 6).setValues([safeValues]);
    sheet.getRange(row, 7).setValue(new Date());
    return response_(true);
  } catch (error) {
    console.error(error);
    return response_(false);
  }
}

function getOrCreateSheet_() {
  const properties = PropertiesService.getScriptProperties();
  const savedId = properties.getProperty("REGISTRATION_SHEET_ID");
  let spreadsheet = savedId ? SpreadsheetApp.openById(savedId) : null;

  if (!spreadsheet) {
    const matches = DriveApp.getFilesByName(SHEET_NAME);
    while (matches.hasNext()) {
      const file = matches.next();
      if (file.getMimeType() === MimeType.GOOGLE_SHEETS) {
        spreadsheet = SpreadsheetApp.open(file);
        break;
      }
    }
    if (!spreadsheet) spreadsheet = SpreadsheetApp.create(SHEET_NAME);
    properties.setProperty("REGISTRATION_SHEET_ID", spreadsheet.getId());
  }

  let sheet = spreadsheet.getSheetByName(TAB_NAME);
  if (!sheet) {
    const sheets = spreadsheet.getSheets();
    sheet = sheets.length === 1 && sheets[0].getLastRow() === 0
      ? sheets[0].setName(TAB_NAME)
      : spreadsheet.insertSheet(TAB_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#d8f3ec");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function response_(ok) {
  const payload = JSON.stringify({ type: "employee-tour-registration", ok });
  return HtmlService.createHtmlOutput(`<!doctype html><html><body><script>window.top.postMessage(${payload}, "*");</script></body></html>`)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}