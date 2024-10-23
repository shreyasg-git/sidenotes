// Listen for extension icon clicks
chrome.action.onClicked.addListener((tab) => {
  // Open the side panel
  chrome.sidePanel.open();
});
