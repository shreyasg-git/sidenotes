// Get the textarea element
const notepad = document.getElementById("notepad");

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
