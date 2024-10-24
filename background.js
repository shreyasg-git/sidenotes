let pendingMessages = [];
let isSidePanelReady = false;
let sidePanelPort = null;

chrome.commands.onCommand.addListener(async (command) => {
  if (command === "toggle-sidepanel") {
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.sidePanel.open({ tabId: tab.id });
    });
  }
});

// Handle port connections from side panel
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "sidePanel") {
    console.log("Side panel connected");
    sidePanelPort = port;

    // Listen for port disconnect
    port.onDisconnect.addListener(() => {
      console.log("Side panel disconnected");
      isSidePanelReady = false;
      sidePanelPort = null;
      pendingMessages = []; // Clear pending messages when panel closes
    });

    // Listen for messages through the port
    port.onMessage.addListener((message) => {
      if (message.action === "sidePanelReady") {
        console.log("Side panel reported ready");
        isSidePanelReady = true;

        // Process pending messages
        while (pendingMessages.length > 0) {
          const pendingMessage = pendingMessages.shift();
          port.postMessage(pendingMessage);
        }
      }
    });
  }
});

// Context menu click handler
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  // Open the side panel

  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.sidePanel.open({ tabId: tab.id });
  });

  const message = {
    action: "appendToNotes",
    data: { str: info.selectionText },
  };

  // If side panel is ready and connected, send immediately
  if (isSidePanelReady && sidePanelPort) {
    sidePanelPort.postMessage(message);
  } else {
    console.log("Queuing message for side panel");
    pendingMessages.push(message);
  }
});

// open on icon clicked
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

// adds a right-click menu option
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "captureText",
    title: "Add to Sidenotes",
    contexts: ["selection"], // Only show when text is selected
  });
});
