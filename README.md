# 🎯 Website Section Hider

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/your-extension-id?color=blue&label=Chrome%20Web%20Store)](https://chrome.google.com/webstore/detail/your-extension-id)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/rohansonawane/website-section-hider/graphs/commit-activity)

<div align="center">
  <img src="icons/icon128.png" alt="Website Section Hider Logo" width="128" height="128">
  <br>
  <p><em>Declutter your web experience with one click</em></p>
</div>

## 📋 Table of Contents
- [Overview](#-overview)
- [Features](#-features)
- [Installation](#-installation)
- [Usage Guide](#-usage-guide)
- [Technical Architecture](#-technical-architecture)
- [Development](#-development)
- [Contributing](#-contributing)
- [FAQ](#-faq)
- [Support](#-support)
- [License](#-license)

## 🌟 Overview

Website Section Hider is a powerful Chrome extension that helps you focus on what matters by hiding unwanted sections of any website. Whether it's ads, sidebars, popups, or any distracting content, hide them with a single click and enjoy a cleaner browsing experience.

### 🎯 Key Benefits
- **Distraction-Free Browsing**: Remove unwanted elements instantly
- **Smart Selection**: Automatically identify and hide similar elements
- **Persistent Settings**: Your preferences stay saved across sessions
- **User-Friendly Interface**: Intuitive controls with visual feedback

## ✨ Features

### Core Functionality
- **One-Click Hiding**: Instantly hide any element on a webpage
- **Smart Select Mode**: Automatically find and hide similar elements
- **Persistent Hiding**: Elements stay hidden after page refresh
- **Recently Hidden List**: Quick access to your last 5 hidden elements
- **Real-Time Counter**: Track how many elements are currently hidden

### User Interface
- **Modern Dark Theme**: Sleek and professional design
- **Visual Feedback**: Clear highlighting of elements before hiding
- **Intuitive Controls**: Easy-to-use popup interface
- **Keyboard Shortcuts**: Quick access to common actions

### Advanced Features
- **Dynamic Content Support**: Works with dynamically loaded elements
- **Smart Element Detection**: Identifies similar elements based on:
  - HTML structure
  - CSS classes
  - Element attributes
  - Content patterns
- **State Preservation**: Maintains original element properties

## 🛠️ Installation

### From Chrome Web Store
1. Visit the [Chrome Web Store](https://chrome.google.com/webstore/detail/your-extension-id)
2. Click "Add to Chrome"
3. Confirm the installation

### Manual Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/rohansonawane/website-section-hider.git
   ```
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (top right)
4. Click "Load unpacked" and select the project directory

## 🚀 Usage Guide

### Basic Usage
1. Click the extension icon to open the popup
2. Click "Enable Hiding Mode"
3. Hover over elements to highlight them
4. Click to hide the highlighted element

### Advanced Usage
- **Smart Select**: Enable in settings to automatically find similar elements
- **Keyboard Shortcuts**:
  - `Ctrl+Shift+H`: Toggle hiding mode
  - `Ctrl+Shift+R`: Restore all hidden elements
- **Recently Hidden**: Access your last 5 hidden elements for quick restoration

### Settings
- **Highlight on Hover**: Toggle element highlighting
- **Persist Hidden Elements**: Keep elements hidden after reload
- **Smart Select**: Enable automatic detection of similar elements

## 🏗️ Technical Architecture

### Tech Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Chrome Extension APIs**:
  - `chrome.storage` for persistence
  - `chrome.scripting` for content injection
  - `chrome.runtime` for messaging
  - `chrome.commands` for shortcuts
- **Core Technologies**:
  - MutationObserver for dynamic content
  - CSS Selectors for element targeting
  - Chrome Storage API for data persistence

### Project Structure
```
website-section-hider/
├── manifest.json          # Extension configuration
├── background.js          # Background service worker
├── content.js            # Content script for page interaction
├── popup/
│   ├── popup.html        # Popup interface
│   ├── popup.js          # Popup logic
│   └── popup.css         # Popup styles
├── icons/                # Extension icons
└── README.md            # Documentation
```

## 👨‍💻 Development

### Prerequisites
- Google Chrome browser
- Basic knowledge of JavaScript and Chrome Extensions

### Setup
1. Clone the repository
2. Install dependencies (if any)
3. Load the extension in Chrome
4. Start developing!

### Building
No build step required. The extension uses vanilla JavaScript and can be loaded directly.

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add comments for complex logic
- Update documentation as needed
- Test thoroughly before submitting

## ❓ FAQ

### General Questions
**Q: Will this work on all websites?**  
A: Yes, it works on any website you visit.

**Q: Is my data private?**  
A: Yes, all data is stored locally in your browser.

### Technical Questions
**Q: How does it handle dynamic content?**  
A: Using MutationObserver to detect and handle new elements.

**Q: Can I restore individual elements?**  
A: Yes, through the Recently Hidden list.

## 💬 Support

- **GitHub Issues**: [Open an issue](https://github.com/rohansonawane/website-section-hider/issues)
- **Email**: [Your email]
- **Discord**: [Your Discord server]

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors and users
- Inspired by the need for a distraction-free web
- Built with ❤️ for a better browsing experience

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/rohansonawane">Rohan Sonawane</a></sub>
</div>
