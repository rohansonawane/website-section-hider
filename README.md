# Selective Content Hider Chrome Extension

A powerful Chrome extension that lets you selectively hide elements on any webpage. Perfect for decluttering your browsing experience by removing distracting or unwanted content.

## 🌟 Features

- **Easy Element Selection**: Simply hover over any element to highlight it
- **Persistent Hiding**: Elements stay hidden even after page reloads
- **Smooth Animations**: Elements fade out/in with smooth transitions
- **Smart Selectors**: Automatically generates reliable selectors for elements
- **Dynamic Content Support**: Works with dynamically loaded content
- **Customizable Settings**: Toggle features like highlighting and persistence

## 🚀 Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory

## 💡 How to Use

1. **Enable Hiding Mode**:
   - Click the extension icon in your toolbar
   - Click the "Enable Hiding Mode" button

2. **Hide Elements**:
   - Hover over any element to highlight it
   - Click to hide the highlighted element
   - The element will fade out smoothly

3. **Restore Elements**:
   - Click the extension icon
   - Click "Reset" to show all hidden elements
   - Elements will fade back in smoothly

4. **Customize Settings**:
   - Toggle "Highlight Elements" to show/hide hover effects
   - Toggle "Persist Hidden Elements" to keep elements hidden after page reloads

## 🔧 Technical Details

- Uses Chrome's storage API to persist hidden elements
- Implements MutationObserver to handle dynamic content
- Generates reliable CSS selectors for element identification
- Smooth animations using CSS transitions
- Responsive design for the popup interface

## 🛠️ Development

The extension consists of several key components:

- `popup.html` & `popup.js`: The user interface and controls
- `content.js`: Core functionality for hiding and managing elements
- `background.js`: Handles extension state and messaging
- `manifest.json`: Extension configuration and permissions

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## Future Enhancements 💡

- User-defined rules for automatically hiding certain sections
- Enhanced UI/UX with better visibility of hidden content
- Option to hide content based on type (images, videos, text, etc.)
- Export/import hidden element configurations
- Support for more keyboard shortcuts
- Integration with popular websites for better element selection
