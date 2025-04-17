/**
 * Content Hider Chrome Extension
 * This script handles the core functionality of hiding and managing webpage elements
 */

(function() {
    // State variables to track extension status and settings
    let selectedElement = null;        // Currently highlighted element
    let isHidingEnabled = false;       // Whether hiding mode is active
    let highlightEnabled = true;       // Whether to show highlight on hover
    let persistEnabled = true;         // Whether to keep elements hidden after page reload

    /**
     * Initialize hidden elements when the page loads
     * This function checks storage for previously hidden elements and hides them again
     */
    function initializeHiddenElements() {
        chrome.storage.local.get(['hiddenElements', 'persistEnabled'], function(result) {
            // Update persistence setting from storage
            persistEnabled = result.persistEnabled !== false;
            
            // If persistence is enabled and we have hidden elements
            if (persistEnabled && result.hiddenElements && result.hiddenElements.length > 0) {
                // First attempt to find and hide elements immediately
                result.hiddenElements.forEach(selector => {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(element => {
                        if (element && !element.style.display || element.style.display !== 'none') {
                            hideElement(element);
                        }
                    });
                });

                // Second attempt after a delay to catch elements that might load later
                setTimeout(() => {
                    result.hiddenElements.forEach(selector => {
                        const elements = document.querySelectorAll(selector);
                        elements.forEach(element => {
                            if (element && !element.style.display || element.style.display !== 'none') {
                                hideElement(element);
                            }
                        });
                    });
                }, 1000);
            }
        });
    }

    // Load initial state from Chrome storage
    chrome.storage.local.get(['hidingEnabled', 'highlightEnabled', 'persistEnabled', 'hiddenElements'], function(result) {
        isHidingEnabled = result.hidingEnabled || false;
        highlightEnabled = result.highlightEnabled !== false;
        persistEnabled = result.persistEnabled !== false;
        
        // Initialize any previously hidden elements
        initializeHiddenElements();
    });

    /**
     * Listen for messages from the popup or background script
     * Handles enabling/disabling hiding mode and resetting hidden elements
     */
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === "enable") {
            isHidingEnabled = true;
        } else if (request.action === "disable") {
            isHidingEnabled = false;
            if (selectedElement) {
                removeHighlight(selectedElement);
                selectedElement = null;
            }
        } else if (request.action === "reset") {
            restoreAllElements();
            sendResponse({success: true});
        } else if (request.action === "clear") {
            clearAllElements();
            sendResponse({success: true});
        }
        return true; // Keep the message channel open for async response
    });

    /**
     * Listen for changes in Chrome storage
     * Updates the extension state when settings change
     */
    chrome.storage.onChanged.addListener(function(changes, namespace) {
        if (namespace === 'local') {
            // Update highlight setting
            if (changes.highlightEnabled) {
                highlightEnabled = changes.highlightEnabled.newValue;
                if (!highlightEnabled && selectedElement) {
                    removeHighlight(selectedElement);
                }
            }
            
            // Update persistence setting
            if (changes.persistEnabled) {
                persistEnabled = changes.persistEnabled.newValue;
            }
            
            // Handle changes to hidden elements
            if (changes.hiddenElements) {
                if (!changes.hiddenElements.newValue || changes.hiddenElements.newValue.length === 0) {
                    restoreAllElements();
                } else {
                    initializeHiddenElements();
                }
            }
        }
    });

    /**
     * Handle mouse movement to highlight elements that can be hidden
     * Shows a visual indicator when hovering over elements
     */
    document.addEventListener('mousemove', (e) => {
        if (!isHidingEnabled || !highlightEnabled) return;
        
        const element = document.elementFromPoint(e.clientX, e.clientY);
        if (element && element !== selectedElement) {
            if (selectedElement) {
                removeHighlight(selectedElement);
            }
            selectedElement = element;
            highlightElement(selectedElement);
        }
    });

    /**
     * Handle clicks to hide selected elements
     * Prevents default click behavior and hides the highlighted element
     */
    document.addEventListener('click', (e) => {
        if (!isHidingEnabled) return;
        
        e.preventDefault();
        if (selectedElement) {
            hideElement(selectedElement);
            if (persistEnabled) {
                saveHiddenElement(selectedElement);
            }
            removeHighlight(selectedElement);
            selectedElement = null;
        }
    });

    /**
     * Add visual highlight to an element
     * Shows a blue outline around the element to indicate it can be hidden
     */
    function highlightElement(element) {
        element.style.outline = '2px solid #4a90e2';
        element.style.outlineOffset = '2px';
        element.style.cursor = 'pointer';
        element.style.transition = 'outline 0.2s ease';
    }

    /**
     * Remove visual highlight from an element
     * Cleans up the highlighting styles
     */
    function removeHighlight(element) {
        element.style.outline = '';
        element.style.outlineOffset = '';
        element.style.cursor = '';
    }

    /**
     * Hide an element with a smooth animation
     * Fades out the element before hiding it completely
     */
    function hideElement(element) {
        if (!element) return;
        element.style.opacity = '0';
        element.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            element.style.display = 'none';
        }, 300);
    }

    /**
     * Show a hidden element with a smooth animation
     * Makes the element visible and fades it in
     */
    function showElement(element) {
        if (!element) return;
        element.style.display = '';
        element.style.opacity = '0';
        setTimeout(() => {
            element.style.opacity = '1';
        }, 10);
    }

    /**
     * Save a hidden element to Chrome storage
     * Stores the element's selector for persistence across page reloads
     */
    function saveHiddenElement(element) {
        if (!element) return;
        const path = getPath(element);
        chrome.storage.local.get(['hiddenElements'], function(data) {
            const hiddenElements = data.hiddenElements || [];
            if (!hiddenElements.includes(path)) {
                hiddenElements.push(path);
                chrome.storage.local.set({ hiddenElements: hiddenElements });
            }
        });
    }

    /**
     * Restore all hidden elements
     * Shows all previously hidden elements and optionally clears storage
     */
    function restoreAllElements() {
        chrome.storage.local.get(['hiddenElements', 'persistEnabled'], function(data) {
            const hiddenElements = data.hiddenElements || [];
            hiddenElements.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    if (element) {
                        showElement(element);
                    }
                });
            });
            if (!data.persistEnabled) {
                chrome.storage.local.set({ hiddenElements: [] });
            }
        });
    }

    /**
     * Clear all hidden elements
     * Shows all elements and clears storage
     */
    function clearAllElements() {
        chrome.storage.local.get(['hiddenElements'], function(data) {
            const hiddenElements = data.hiddenElements || [];
            hiddenElements.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    showElement(element);
                }
            });
            chrome.storage.local.set({ hiddenElements: [] });
        });
    }

    /**
     * Generate a unique CSS selector path for an element
     * Creates a reliable selector that can find the element again
     */
    function getPath(element) {
        if (!element) return null;
        const path = [];
        let currentElement = element;
        
        while (currentElement && currentElement !== document.body) {
            let selector = currentElement.tagName.toLowerCase();
            
            // Add ID if available (most specific selector)
            if (currentElement.id) {
                selector += `#${currentElement.id}`;
            } else {
                // Add classes if available (more specific than tag name)
                const classes = Array.from(currentElement.classList).filter(c => !c.startsWith('_'));
                if (classes.length > 0) {
                    selector += `.${classes.join('.')}`;
                }
                
                // Add nth-child if needed (helps with similar elements)
                const siblings = Array.from(currentElement.parentElement.children);
                const index = siblings.indexOf(currentElement) + 1;
                if (siblings.length > 1) {
                    selector += `:nth-child(${index})`;
                }
            }
            
            path.unshift(selector);
            currentElement = currentElement.parentElement;
        }
        
        return path.join(' > ');
    }

    /**
     * Watch for dynamic content changes
     * Ensures elements stay hidden even when content is loaded dynamically
     */
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                chrome.storage.local.get(['hiddenElements', 'persistEnabled'], function(data) {
                    if (data.persistEnabled && data.hiddenElements) {
                        data.hiddenElements.forEach(selector => {
                            const elements = document.querySelectorAll(selector);
                            elements.forEach(element => {
                                if (element && (!element.style.display || element.style.display !== 'none')) {
                                    hideElement(element);
                                }
                            });
                        });
                    }
                });
            }
        });
    });

    // Start watching the page for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Final attempt to initialize hidden elements after a short delay
    setTimeout(initializeHiddenElements, 500);
})();