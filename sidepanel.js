const notepad = document.getElementById("notepad");
const scrollbtn = document.getElementById("scrollbtn");
const copybtn = document.getElementById("copybtn");
const clearbtn = document.getElementById("clearbtn");
const urlbtn = document.getElementById("urlbtn");

function appendToNotes(text) {
  console.log("Appending to notes:", text);
  notepad.value = notepad.value + "\n" + text;

  saveCurrentNotepadToLocal();
}

let port;

function connectToBackground() {
  port = chrome.runtime.connect({ name: "sidePanel" });

  // Handle messages received through the port
  port.onMessage.addListener((message) => {
    if (message.action === "appendToNotes") {
      appendToNotes(message.data.str);
    }
  });

  // Notify background that side panel is ready
  port.postMessage({ action: "sidePanelReady" });
}

// Initialize connection when document is loaded
document.addEventListener("DOMContentLoaded", () => {
  connectToBackground();
});

// Reconnect if connection is lost but panel is still open
port?.onDisconnect.addListener(() => {
  setTimeout(() => {
    if (document.visibilityState === "visible") {
      connectToBackground();
    }
  }, 100);
});

async function getCurrentTabUrl() {
  try {
    // Query for the active tab in the current window
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });

    return tab?.url || "";
  } catch (error) {
    console.error("Error getting current tab:", error);
    return "";
  }
}

urlbtn.addEventListener("click", async () => {
  const cursorposition = notepad.selectionStart;

  const url = await getCurrentTabUrl();

  const text = url + " ";

  const before = notepad.value.substring(0, cursorposition);
  const after = notepad.value.substring(cursorposition, notepad.value.length);

  notepad.value = before + text + after;

  saveCurrentNotepadToLocal();

  notepad.focus();
  notepad.selectionStart = notepad.selectionEnd = cursorposition + text.length;
});

copybtn.addEventListener("click", () => {
  navigator.clipboard.writeText(notepad.value);
});

clearbtn.addEventListener("click", () => {
  navigator.clipboard.writeText(notepad.value);
  if (confirm("Clear All Text?")) {
    notepad.value = "";
    saveCurrentNotepadToLocal();
  } else {
    return;
  }
});

scrollbtn.innerText = "v";
scrollbtn.addEventListener("click", () => {
  console.log("AAA", scrollbtn.innerText);
  if (scrollbtn.innerText === "^") {
    console.log("SCROLL TO TOP : 0");
    notepad.scrollTo({ top: 0, behavior: "smooth" });

    scrollbtn.innerText = "v";
    return;
  }
  if (scrollbtn.innerText === "v") {
    console.log("SCROLL TO BOTTOM : ", notepad.scrollHeight);

    notepad.scrollTo({ top: notepad.scrollHeight, behavior: "smooth" });
    scrollbtn.innerText = "^";
    return;
  }
});

chrome.storage.local.get(["noteText"], function (result) {
  if (result.noteText) {
    notepad.value = result.noteText;
  }
});

notepad.addEventListener("input", function () {
  chrome.storage.local.set({
    noteText: notepad.value,
  });
});

const saveCurrentNotepadToLocal = () => {
  chrome.storage.local.set({
    noteText: notepad.value,
  });
};
