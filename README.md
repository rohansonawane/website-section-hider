# 🚀 Website Section Hider (Selective Content Hider)

A powerful Chrome extension to declutter your web experience by hiding unwanted sections of any website. Hide ads, sidebars, popups, or any distracting content with a single click. Enjoy a cleaner, more focused browsing experience!

---

## ✨ Features

- **One-Click Hiding:** Instantly hide any element on a webpage by clicking it.
- **Smart Select Mode:** Automatically find and hide similar elements (e.g., all ads, all sidebars).
- **Persistent Hiding:** Hidden elements stay hidden even after refreshing or revisiting the page.
- **Recently Hidden List:** Quickly restore any of your last 5 hidden elements.
- **Real-Time Counter:** See how many elements are currently hidden on the page.
- **Dynamic Content Support:** Handles elements that load after the initial page load.
- **Modern UI:** Sleek, dark-themed popup with intuitive controls.
- **Keyboard Shortcuts:**  
  - `Ctrl+Shift+H` — Toggle hiding mode  
  - `Ctrl+Shift+R` — Restore all hidden elements
- **Customizable Settings:**  
  - Highlight on hover  
  - Persist hidden elements  
  - Enable/disable Smart Select

---

## 🧑‍💻 Tech Stack

- **JavaScript (ES6+)** — Core logic for content manipulation and popup UI
- **HTML5** — Popup and options page structure
- **CSS3** — Modern, responsive, dark-themed styling for popup
- **Chrome Extensions API**
  - `manifest_version: 3`
  - `chrome.storage` for persistence
  - `chrome.scripting` for content script injection
  - `chrome.runtime` for messaging
  - `chrome.commands` for keyboard shortcuts
- **MutationObserver** — Detects and handles dynamically loaded content
- **Web Standards** — No frameworks, no build step, pure web technologies

---

## 📸 Screenshots

<!--
Add screenshots/gifs here for better visual appeal.
Example:
![Popup UI](screenshots/popup.png)
![Hiding in action](screenshots/hide-demo.gif)
-->

---

## 🛠️ Installation

1. **Clone or Download** this repository.
2. Go to `chrome://extensions/` in your Chrome browser.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select this project's directory.

---

## 🚦 Usage

1. Click the extension icon to open the popup.
2. Click **Enable Hiding Mode**.
3. Hover over any element to highlight it, then click to hide.
4. Use **Smart Select** to hide all similar elements at once.
5. Restore hidden elements from the **Recently Hidden** list or with the **Restore Hidden Elements** button.

---

## ⚙️ Settings

- **Highlight on Hover:** Toggle element highlighting.
- **Persist Hidden Elements:** Keep elements hidden after reload.
- **Smart Select:** Enable/disable automatic detection of similar elements.

---

## 📝 Technical Details

- **Persistent Storage:** Uses Chrome's `storage` API to save selectors for hidden elements and recent actions.
- **Selector Generation:** Generates unique CSS selectors for reliable targeting and restoration.
- **Dynamic Content:** MutationObserver ensures elements loaded after page load are also hidden.
- **Multiple Initialization Attempts:** Robust hiding on refresh and for slow-loading pages.
- **Element State Preservation:** Stores and restores original display values for accurate restoration.
- **Popup UI:** Built with HTML, CSS, and vanilla JS for speed and simplicity.
- **No External Dependencies:** 100% self-contained, no frameworks or libraries required.

---

## 🧩 Project Structure

```
.
├── background.js      # Background service worker
├── content.js         # Main logic for hiding/showing elements
├── popup.html         # Extension popup UI
├── popup.js           # Popup UI logic
├── manifest.json      # Chrome extension manifest
├── icons/             # Extension icons
├── README.md          # This file
└── ...                # Other assets
```

---

## 🧑‍💻 Development & Contribution

- No build step required. All files are ready to use as-is.
- Contributions, issues, and feature requests are welcome!
- Please [open an issue](https://github.com/rohansonawane/website-section-hider/issues) or submit a pull request.

---

## 🙋 FAQ

**Q:** Will this extension work on all websites?  
**A:** Yes, it works on any website you visit.

**Q:** Can I restore only one hidden element?  
**A:** Yes, use the **Recently Hidden** list in the popup.

**Q:** Does it sync across devices?  
**A:** Not yet, but this is a planned feature!

**Q:** Is my data private?  
**A:** Yes, all data is stored locally in your browser and never leaves your device.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- Thanks to all contributors and users for feedback and support!
- Inspired by the need for a distraction-free web.
