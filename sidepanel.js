// Get the textarea element
const notepad = document.getElementById("notepad");
const scrollbtn = document.getElementById("scrollbtn");
const copybtn = document.getElementById("copybtn");
const clearbtn = document.getElementById("clearbtn");

scrollbtn.innerText = "v";

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
