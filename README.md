# Selective Content Hider Chrome Extension

A powerful Chrome extension that allows you to hide unwanted sections of websites by simply selecting them. Perfect for decluttering your browsing experience and focusing on the content that matters.

## Features

### Core Functionality
- **Easy Element Hiding**: Click on any element to hide it with a smooth fade-out animation
- **Smart Select Mode**: Automatically identify and hide similar elements (e.g., all ads, all sidebars)
- **Persistent Hiding**: Hidden elements stay hidden even after page refresh
- **Quick Restore**: Easily restore hidden elements individually or all at once

### Enhanced UI
- **Real-time Counter**: See how many elements are currently hidden
- **Recently Hidden List**: View and restore your last 5 hidden elements
- **Visual Feedback**: Clear highlighting of elements before hiding
- **Modern Dark Theme**: Sleek and user-friendly interface

### Smart Features
- **Smart Select**: Automatically identifies similar elements based on:
  - HTML structure
  - CSS classes
  - Element attributes
  - Content patterns
- **Dynamic Content Support**: Handles dynamically loaded content and page refreshes
- **Element State Preservation**: Maintains original element properties for accurate restoration

### Keyboard Shortcuts
- `Ctrl+Shift+H`: Toggle hiding mode
- `Ctrl+Shift+R`: Reset hidden elements

### Settings
- **Highlight on Hover**: Visual feedback when hovering over elements
- **Persist Hidden Elements**: Keep elements hidden after page reload
- **Smart Select**: Enable automatic detection of similar elements

## Installation

1. Clone this repository or download the ZIP file
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory

## Usage

1. Click the extension icon to open the popup
2. Click "Enable Hiding Mode" to start
3. Hover over elements to see them highlighted
4. Click to hide an element
5. Use Smart Select to hide similar elements
6. Use the "Recently Hidden" section to restore specific elements
7. Click "Restore Hidden Elements" to show all hidden elements

## Technical Details

### Storage
- Uses Chrome's storage API to save hidden elements
- Maintains element selectors for reliable restoration
- Stores recent elements for quick access

### Performance
- Efficient element selection and hiding
- Smooth animations for better user experience
- Optimized handling of dynamic content

### Reliability
- Multiple initialization attempts for reliable element hiding
- Robust handling of page refreshes
- Preservation of original element states

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to all contributors who have helped improve this extension
- Inspired by the need for a better web browsing experience
