// Listen for extension icon clicks
chrome.action.onClicked.addListener((tab) => {
  // Open the side panel
  chrome.sidePanel.open();
});

// chrome.runtime.onInstalled.addListener(() => {
//   chrome.contextMenus.create({
//     id: "captureText",
//     title: "Add to Sidenotes",
//     contexts: ["selection"], // Only show when text is selected
//   });
// });

// chrome.contextMenus.onClicked.addListener((info, tab) => {
//   chrome.sidePanel.open({ windowId: chrome.window.id });

//   if (info.menuItemId === "captureText") {
//     // Send selected text to your sidebar
//     chrome.storage.local.get(["noteText"], (data) => {
//       const currentNotes = data.notes || "";
//       const newNotes = currentNotes + "\n\n" + info.selectionText;

//       chrome.storage.local.set(
//         {
//           notes: newNotes,
//         },
//         () => {
//           console.log("AAAAAAAAAAAA :: ", newNotes);
//           // Optional: Show a notification that text was captured
//           chrome.action.setBadgeText({ text: "+" });
//           setTimeout(() => {
//             chrome.action.setBadgeText({ text: "" });
//           }, 1000);
//         }
//       );
//     });
//   }
// });
