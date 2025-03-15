(function() {
    let selectedElement = null;

    document.addEventListener('mousemove', (e) => {
        chrome.storage.local.get(["hidingEnabled"], (result) => {
            if (!result.hidingEnabled) return;
            const element = document.elementFromPoint(e.clientX, e.clientY);
            if (element && element !== selectedElement) {
                if (selectedElement) {
                    selectedElement.style.outline = '';
                }
                selectedElement = element;
                selectedElement.style.outline = '2px solid #FF007F'; // Radium Pink Highlight
            }
        });
    });

    document.addEventListener('click', (e) => {
        e.preventDefault();
        chrome.storage.local.get(["hidingEnabled"], (result) => {
            if (!result.hidingEnabled) return;
            if (selectedElement) {
                selectedElement.style.display = 'none';
                const path = getPath(selectedElement);
                chrome.storage.local.get(["hiddenElements"], (data) => {
                    const hiddenElements = data.hiddenElements || [];
                    hiddenElements.push(path);
                    chrome.storage.local.set({ "hiddenElements": hiddenElements });
                });
            }
        });
    });

    function getPath(element) {
        if (!element) return null;
        const path = [];
        while (element.parentElement) {
            let selector = element.tagName.toLowerCase();
            if (element.id) {
                selector += `#${element.id}`;
            } else if (element.className) {
                selector += `.${Array.from(element.classList).join('.')}`;
            }
            path.unshift(selector);
            element = element.parentElement;
        }
        return path.join(' > ');
    }

    chrome.storage.local.get(["hiddenElements"], (data) => {
        const hiddenElements = data.hiddenElements || [];
        hiddenElements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.display = 'none';
            }
        });
    });
})();