document.getElementById("saveBtn").addEventListener("click", () => {
  const inputLang = document.getElementById("inputLang").value;
  const outputLang = document.getElementById("outputLang").value;

  // Save the selected languages to Chrome storage
  chrome.storage.sync.set({ inputLang, outputLang }, () => {
    console.log("Preferences saved:", { inputLang, outputLang });
    alert("Language preferences saved!");
  });
});

// Load the saved languages when the popup opens
window.onload = () => {
  chrome.storage.sync.get(["inputLang", "outputLang"], (result) => {
    if (result.inputLang) {
      document.getElementById("inputLang").value = result.inputLang;
    }
    if (result.outputLang) {
      document.getElementById("outputLang").value = result.outputLang;
    }
  });
};
