// Listen for messages from the background worker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "STALE_CHECK") {
    showStalePrompt(sendResponse);
    showStalePrompt();
  }
  if (message.type === "DISMISS_PROMPT") {
    const overlay = document.getElementById("rabbithole-stale-prompt");
    if (overlay) overlay.remove();
  }
});


function showStalePrompt() {
  // Don't show if already showing
  if (document.getElementById("rabbithole-stale-prompt")) return;

  const overlay = document.createElement("div");
  overlay.id = "rabbithole-stale-prompt";
  overlay.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: sans-serif;
  `;

  overlay.innerHTML = `
    <div style="background: white; padding: 32px; border-radius: 12px; text-align: center; max-width: 400px;">
      <img src="${chrome.runtime.getURL('assets/still_recording.png')}" width="60" />
      <h2>Still down the rabbit hole?</h2>
      <p>You've been inactive for a while. Want to keep recording?</p>
      <button id="rh-keep" style="margin: 8px; padding: 10px 24px; background: #4CAF50; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;">Keep Recording</button>
      <button id="rh-save" style="margin: 8px; padding: 10px 24px; background: #f44336; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 16px;">Save & Stop</button>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById("rh-keep").addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "STALE_RESPONSE", action: "keep" });
    overlay.remove();
  });

  document.getElementById("rh-save").addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "STALE_RESPONSE", action: "save" });
    overlay.remove();
  });
}