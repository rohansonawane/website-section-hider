document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggle');
    const resetButton = document.getElementById('reset');
    const statusIndicator = document.getElementById('statusIndicator');
    const highlightToggle = document.getElementById('highlightToggle');
    const persistToggle = document.getElementById('persistToggle');
    const smartSelectToggle = document.getElementById('smartSelectToggle');

    // Initialize state
    chrome.storage.local.get(['hidingEnabled', 'highlightEnabled', 'persistEnabled', 'smartSelectEnabled'], function(result) {
        updateUI(result.hidingEnabled);
        highlightToggle.checked = result.highlightEnabled !== false;
        persistToggle.checked = result.persistEnabled !== false;
        smartSelectToggle.checked = result.smartSelectEnabled || false;
    });

    // Toggle hiding mode
    toggleButton.addEventListener('click', function() {
        chrome.storage.local.get(['hidingEnabled'], function(result) {
            const newState = !result.hidingEnabled;
            chrome.storage.local.set({ hidingEnabled: newState }, function() {
                updateUI(newState);
                updateTabState(newState);
            });
        });
    });

    // Reset hidden elements
    resetButton.addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "reset"}, function(response) {
                if (response && response.success) {
                    // Clear storage directly in popup as well
                    chrome.storage.local.set({
                        hiddenElements: [],
                        recentElements: []
                    }, function() {
                        // Update UI
                        updateHiddenCount();
                        updateRecentElements();
                    });
                }
            });
        });
    });

    // Toggle highlight feature
    highlightToggle.addEventListener('change', function() {
        chrome.storage.local.set({ highlightEnabled: this.checked });
    });

    // Toggle persistence feature
    persistToggle.addEventListener('change', function() {
        chrome.storage.local.set({ persistEnabled: this.checked });
    });

    // Toggle Smart Select feature
    smartSelectToggle.addEventListener('change', function() {
        const enabled = this.checked;
        chrome.storage.local.set({ smartSelectEnabled: enabled });
        
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: "toggleSmartSelect",
                enabled: enabled
            });
        });
    });

    // Update UI based on state
    function updateUI(enabled) {
        toggleButton.textContent = enabled ? 'Disable Hiding Mode' : 'Enable Hiding Mode';
        statusIndicator.classList.toggle('active', enabled);
    }

    // Update tab state
    function updateTabState(enabled) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: enabled ? "enable" : "disable"}, function(response) {
                if (chrome.runtime.lastError) {
                    console.error('Error sending message:', chrome.runtime.lastError);
                }
            });
        });
    }

    // Listen for keyboard shortcuts
    chrome.commands.onCommand.addListener(function(command) {
        if (command === 'toggle_hiding') {
            toggleButton.click();
        } else if (command === 'reset_hidden') {
            resetButton.click();
        }
    });

    // Add these variables at the top
    let recentElements = [];
    const MAX_RECENT_ELEMENTS = 5;

    // Add this function to update the counter
    function updateHiddenCount() {
        chrome.storage.local.get(['hiddenElements'], function(result) {
            const count = result.hiddenElements ? result.hiddenElements.length : 0;
            document.getElementById('hiddenCount').textContent = count;
            
            // Update the reset button state
            const resetButton = document.getElementById('reset');
            resetButton.disabled = count === 0;
            resetButton.style.opacity = count === 0 ? '0.5' : '1';
        });
    }

    // Add this function to update recent elements
    function updateRecentElements() {
        chrome.storage.local.get(['recentElements'], function(result) {
            recentElements = result.recentElements || [];
            const recentElementsList = document.getElementById('recentElements');
            recentElementsList.innerHTML = '';

            if (recentElements.length === 0) {
                const emptyMessage = document.createElement('div');
                emptyMessage.className = 'empty-message';
                emptyMessage.textContent = 'No hidden elements';
                recentElementsList.appendChild(emptyMessage);
                return;
            }

            recentElements.forEach((element, index) => {
                const div = document.createElement('div');
                div.className = 'recent-element';
                
                const textSpan = document.createElement('span');
                textSpan.className = 'recent-element-text';
                textSpan.textContent = element.text || 'Hidden Element';
                
                const restoreButton = document.createElement('button');
                restoreButton.className = 'restore-button';
                restoreButton.textContent = 'Restore';
                restoreButton.onclick = () => restoreElement(index);
                
                div.appendChild(textSpan);
                div.appendChild(restoreButton);
                recentElementsList.appendChild(div);
            });
        });
    }

    // Add this function to restore a specific element
    function restoreElement(index) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: "restoreElement",
                index: index
            }, function(response) {
                if (response && response.success) {
                    updateRecentElements();
                    updateHiddenCount();
                }
            });
        });
    }

    // Add these lines to the existing initialization code
    updateHiddenCount();
    updateRecentElements();
    
    // Listen for changes in storage
    chrome.storage.onChanged.addListener(function(changes, namespace) {
        if (namespace === 'local') {
            if (changes.hiddenElements) {
                updateHiddenCount();
            }
            if (changes.recentElements) {
                updateRecentElements();
            }
        }
    });
});

// Add this message listener at the top level
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "elementsRestored") {
        // Update UI when elements are restored
        updateHiddenCount();
        updateRecentElements();
    }
});
