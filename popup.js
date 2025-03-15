document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("toggle");
    const resetButton = document.getElementById("reset");

    chrome.storage.local.get(["hidingEnabled"], (result) => {
        toggleButton.textContent = result.hidingEnabled ? "Disable Hiding" : "Enable Hiding";
    });

    toggleButton.addEventListener("click", () => {
        chrome.storage.local.get(["hidingEnabled"], (result) => {
            const newState = !result.hidingEnabled;
            chrome.storage.local.set({ "hidingEnabled": newState });
            toggleButton.textContent = newState ? "Disable Hiding" : "Enable Hiding";
        });
    });

    resetButton.addEventListener("click", () => {
        chrome.storage.local.remove("hiddenElements");
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.reload(tabs[0].id);
        });
    });
});
