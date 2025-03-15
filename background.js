chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "restoreHiddenElements",
        title: "Restore Hidden Elements",
        contexts: ["all"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "restoreHiddenElements") {
        chrome.storage.local.remove("hiddenElements");
        chrome.tabs.reload(tab.id);
    }
});

// Listen for keyboard shortcut commands
chrome.commands.onCommand.addListener((command) => {
    if (command === "toggle_hiding") {
        chrome.storage.local.get(["hidingEnabled"], (result) => {
            const newState = !result.hidingEnabled;
            chrome.storage.local.set({ "hidingEnabled": newState });
        });
    } else if (command === "reset_hidden") {
        chrome.storage.local.remove("hiddenElements");
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.reload(tabs[0].id);
        });
    }
});