// Get the textarea element
const notepad = document.getElementById("notepad");
const scrollbtn = document.getElementById("scrollbtn");
const copybtn = document.getElementById("copybtn");
const clearbtn = document.getElementById("clearbtn");
const urlbtn = document.getElementById("urlbtn");

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

// Load saved text when the panel opens
chrome.storage.local.get(["noteText"], function (result) {
  if (result.noteText) {
    notepad.value = result.noteText;
  }
});

// Save text whenever it changes
notepad.addEventListener("input", function () {
  chrome.storage.local.set({
    noteText: notepad.value,
  });
});
