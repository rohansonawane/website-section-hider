document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('toggle');
    const resetButton = document.getElementById('reset');
    const statusIndicator = document.getElementById('statusIndicator');
    const highlightToggle = document.getElementById('highlightToggle');
    const persistToggle = document.getElementById('persistToggle');

    // Initialize state
    chrome.storage.local.get(['hidingEnabled', 'highlightEnabled', 'persistEnabled'], function(result) {
        updateUI(result.hidingEnabled);
        highlightToggle.checked = result.highlightEnabled !== false;
        persistToggle.checked = result.persistEnabled !== false;
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
                if (chrome.runtime.lastError) {
                    console.error('Error sending message:', chrome.runtime.lastError);
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
});
