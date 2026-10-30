const scriptUrl = "https://script.google.com/macros/s/AKfycbxNWWiLGFO11A1YUV28U1K1pa7OZl90y11RFP0PdugnEOcaWU-_YTPYpOhp23UqrJwoeQ/exec";
const form = document.querySelector("#registration-form");
const statusMessage = document.querySelector("#form-status");
const submitButton = form.querySelector("button[type='submit']");
const submissionFrame = document.querySelector(".submission-frame");
const submissionFrameName = "submission-frame";
let awaitingResponse = false;

function showStatus(message, state = "success") {
  statusMessage.textContent = message;
  statusMessage.dataset.state = state;
}

function addHiddenField(targetForm, name, value) {
  const input = document.createElement("input");
  input.type = "hidden";
  input.name = name;
  input.value = value;
  targetForm.append(input);
}

form.addEventListener("input", (event) => {
  if (event.target instanceof HTMLInputElement) {
    event.target.removeAttribute("aria-invalid");
  }
});

window.addEventListener("message", (event) => {
  if (!event.origin.endsWith("-script.googleusercontent.com") || !awaitingResponse) return;
  awaitingResponse = false;
  submitButton.disabled = false;

  if (event.data?.type !== "employee-tour-registration") return;
  if (event.data.ok) {
    form.reset();
    form.elements.namedItem("參加人數").value = "1";
    showStatus("報名資料已送出，期待在沖繩見到你！");
  } else {
    showStatus("送出未完成，請稍後再試或聯絡活動窗口。", "error");
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  showStatus("");

  const invalidField = [...form.elements].find((field) => field instanceof HTMLInputElement && !field.checkValidity());
  if (invalidField) {
    invalidField.setAttribute("aria-invalid", "true");
    invalidField.reportValidity();
    showStatus("請確認必填欄位與資料格式。", "error");
    return;
  }

  if (!scriptUrl || !scriptUrl.startsWith("https://script.google.com/macros/s/")) {
    showStatus("表單尚未連結 Google Apps Script，完成部署後即可收件。", "error");
    return;
  }

  const submission = document.createElement("form");
  submission.method = "post";
  submission.action = scriptUrl;
  submission.target = submissionFrameName;
  submission.hidden = true;
  for (const [name, value] of new FormData(form)) {
    addHiddenField(submission, name, value);
  }
  document.body.append(submission);
  awaitingResponse = true;
  submitButton.disabled = true;
  showStatus("正在送出報名資料…");
  submission.submit();
  submission.remove();
  window.setTimeout(() => {
    if (!awaitingResponse) return;
    awaitingResponse = false;
    submitButton.disabled = false;
    showStatus("尚未收到回覆，請檢查網路連線後再試。", "error");
  }, 20000);
});