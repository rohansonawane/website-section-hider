// Initialize extension state
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.set({
        hidingEnabled: false,
        highlightEnabled: true,
        persistEnabled: true,
        hiddenElements: []
    });
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(function(command) {
    if (command === 'toggle_hiding') {
        chrome.storage.local.get(['hidingEnabled'], function(result) {
            const newState = !result.hidingEnabled;
            chrome.storage.local.set({ hidingEnabled: newState });
            
            // Update all active tabs
            chrome.tabs.query({}, function(tabs) {
                tabs.forEach(tab => {
                    chrome.tabs.sendMessage(tab.id, {action: newState ? "enable" : "disable"});
                });
            });
        });
    } else if (command === 'reset_hidden') {
        chrome.storage.local.get(['persistEnabled'], function(result) {
            if (!result.persistEnabled) {
                chrome.storage.local.set({ hiddenElements: [] });
            }
            
            // Reset all active tabs
            chrome.tabs.query({}, function(tabs) {
                tabs.forEach(tab => {
                    chrome.tabs.sendMessage(tab.id, {action: "reset"});
                });
            });
        });
    }
});

// Handle context menu
chrome.contextMenus.create({
    id: "restoreHiddenElements",
    title: "Restore Hidden Elements",
    contexts: ["page"]
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "restoreHiddenElements") {
        chrome.tabs.sendMessage(tab.id, {action: "reset"});
    }
});