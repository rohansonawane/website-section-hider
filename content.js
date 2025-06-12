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
    let smartSelectEnabled = false;
    let similarElements = [];
    let initializationAttempts = 0;
    const MAX_INITIALIZATION_ATTEMPTS = 5;
    const INITIALIZATION_DELAY = 1000; // 1 second

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
                const hiddenElements = result.hiddenElements;
                let allElementsFound = true;

                // Try to find and hide elements
                hiddenElements.forEach(selector => {
                    const elements = document.querySelectorAll(selector);
                    if (elements.length === 0) {
                        allElementsFound = false;
                    } else {
                        elements.forEach(element => {
                            if (element && (!element.style.display || element.style.display !== 'none')) {
                                hideElement(element);
                            }
                        });
                    }
                    });

                // If not all elements were found and we haven't exceeded max attempts, try again
                if (!allElementsFound && initializationAttempts < MAX_INITIALIZATION_ATTEMPTS) {
                    initializationAttempts++;
                    setTimeout(initializeHiddenElements, INITIALIZATION_DELAY);
                }
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
        } else if (request.action === "restoreElement") {
            const recentElements = chrome.storage.local.get(['recentElements'], function(data) {
                const elements = data.recentElements || [];
                if (elements[request.index]) {
                    restoreSpecificElement(elements[request.index].selector);
                    sendResponse({success: true});
                } else {
                    sendResponse({success: false});
                }
            });
        } else if (request.action === "toggleSmartSelect") {
            smartSelectEnabled = request.enabled;
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
            if (smartSelectEnabled) {
                // Find and highlight similar elements
                similarElements = findSimilarElements(selectedElement);
                similarElements.forEach(element => {
                    highlightElement(element, true); // true indicates it's a similar element
                });
                
                // Show confirmation dialog
                const confirm = window.confirm(`Found ${similarElements.length} similar elements. Hide all of them?`);
                if (confirm) {
                    // Hide the selected element and all similar elements
                    hideElement(selectedElement);
                    similarElements.forEach(element => {
                        hideElement(element);
                        if (persistEnabled) {
                            saveHiddenElement(element);
                        }
                    });
                }
                
                // Remove highlights
                removeHighlight(selectedElement);
                similarElements.forEach(element => removeHighlight(element));
                similarElements = [];
            } else {
                // Normal hiding behavior
            hideElement(selectedElement);
            if (persistEnabled) {
                saveHiddenElement(selectedElement);
            }
            removeHighlight(selectedElement);
            }
            selectedElement = null;
        }
    });

    /**
     * Add visual highlight to an element
     * Shows a blue outline around the element to indicate it can be hidden
     */
    function highlightElement(element, isSimilar = false) {
        element.style.outline = isSimilar ? '2px solid #e74c3c' : '2px solid #4a90e2';
        element.style.outlineOffset = '2px';
        element.style.cursor = 'pointer';
        element.style.transition = 'outline 0.2s ease';
        
        if (isSimilar) {
            element.style.opacity = '0.7';
        }
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
        
        // Store the original display value if not already stored
        if (!element.hasAttribute('data-original-display')) {
            element.setAttribute('data-original-display', element.style.display || '');
        }
        
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
        
        const originalDisplay = element.getAttribute('data-original-display') || '';
        element.style.display = originalDisplay;
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
        const elementText = getElementText(element);
        
        chrome.storage.local.get(['hiddenElements', 'recentElements'], function(data) {
            const hiddenElements = data.hiddenElements || [];
            const recentElements = data.recentElements || [];
            
            if (!hiddenElements.includes(path)) {
                hiddenElements.push(path);
                
                // Add to recent elements
                recentElements.unshift({
                    selector: path,
                    text: elementText,
                    timestamp: Date.now()
                });
                
                // Keep only the most recent elements
                if (recentElements.length > 5) {
                    recentElements.pop();
                }
                
                chrome.storage.local.set({
                    hiddenElements: hiddenElements,
                    recentElements: recentElements
                });
            }
        });
    }

    /**
     * Restore all hidden elements
     * Shows all previously hidden elements and optionally clears storage
     */
    function restoreAllElements() {
        chrome.storage.local.get(['hiddenElements', 'recentElements', 'persistEnabled'], function(data) {
            const hiddenElements = data.hiddenElements || [];
            hiddenElements.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    if (element) {
                        showElement(element);
                    }
                });
            });
            
            // Clear both hidden elements and recent elements from storage
            chrome.storage.local.set({
                hiddenElements: [],
                recentElements: []
            }, function() {
                // Notify popup that elements have been restored
                chrome.runtime.sendMessage({
                    action: "elementsRestored"
                });
            });
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

    // Add a MutationObserver to handle dynamically loaded content
    const observer = new MutationObserver(function(mutations) {
        if (persistEnabled) {
            chrome.storage.local.get(['hiddenElements'], function(result) {
                if (result.hiddenElements && result.hiddenElements.length > 0) {
                    result.hiddenElements.forEach(selector => {
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

    // Start observing the document with the configured parameters
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // Modify the existing initialization code
    document.addEventListener('DOMContentLoaded', function() {
        // Reset initialization attempts
        initializationAttempts = 0;
        
        // Initial attempt to initialize hidden elements
        initializeHiddenElements();
        
        // Additional attempt after a delay to catch elements that might load later
        setTimeout(initializeHiddenElements, INITIALIZATION_DELAY);
    });

    // Add a page load event listener as a backup
    window.addEventListener('load', function() {
        // Reset initialization attempts
        initializationAttempts = 0;
        
        // Try to initialize hidden elements again after the page is fully loaded
        initializeHiddenElements();
    });

    // Final attempt to initialize hidden elements after a short delay
    setTimeout(initializeHiddenElements, 500);

    // Add this function to get element text
    function getElementText(element) {
        if (!element) return '';
        
        // Try to get meaningful text from the element
        const text = element.textContent || '';
        const trimmed = text.trim();
        
        // If the element has no text, try to get an identifier
        if (!trimmed) {
            if (element.id) return `#${element.id}`;
            if (element.className) return `.${element.className.split(' ')[0]}`;
            return element.tagName.toLowerCase();
        }
        
        // Return first 50 characters of text
        return trimmed.substring(0, 50) + (trimmed.length > 50 ? '...' : '');
    }

    // Add this function to restore a specific element
    function restoreSpecificElement(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if (element) {
                showElement(element);
            }
        });
        
        // Remove from storage
        chrome.storage.local.get(['hiddenElements', 'recentElements'], function(data) {
            const hiddenElements = data.hiddenElements || [];
            const recentElements = data.recentElements || [];
            
            const newHiddenElements = hiddenElements.filter(path => path !== selector);
            const newRecentElements = recentElements.filter(item => item.selector !== selector);
            
            chrome.storage.local.set({
                hiddenElements: newHiddenElements,
                recentElements: newRecentElements
            });
        });
    }

    // Add this function to find similar elements
    function findSimilarElements(element) {
        if (!element) return [];
        
        // Get element's characteristics
        const tagName = element.tagName.toLowerCase();
        const classes = Array.from(element.classList);
        const attributes = Array.from(element.attributes).map(attr => `${attr.name}="${attr.value}"`);
        
        // Find elements with similar characteristics
        const similar = Array.from(document.querySelectorAll(tagName)).filter(el => {
            if (el === element) return false;
            
            // Check if elements share classes
            const sharedClasses = classes.filter(cls => el.classList.contains(cls));
            if (sharedClasses.length > 0) return true;
            
            // Check if elements have similar attributes
            const elAttributes = Array.from(el.attributes).map(attr => `${attr.name}="${attr.value}"`);
            const sharedAttributes = attributes.filter(attr => elAttributes.includes(attr));
            if (sharedAttributes.length > 0) return true;
            
            // Check if elements have similar structure
            if (el.children.length === element.children.length) return true;
            
            return false;
        });
        
        return similar;
    }
})();