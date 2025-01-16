

# Dcard Comment Blocker

A Chrome extension that allows users to block and hide comments from specific users on Dcard.

## Features

- Block comments from specific users
- Automatically hides comments from blocked users
- Expands "View more comments" sections automatically
- Real-time comment blocking (works on newly loaded comments)
- Persistent blocked users list using Chrome storage

## Installation

1. Clone this repository or download the ZIP file
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory

## How to Use

1. Click the extension icon in Chrome toolbar
2. Add usernames to block (with or without @ symbol)
3. Navigate to any Dcard post
4. Comments from blocked users will be automatically hidden

## Technical Details

The extension uses:
- Chrome Storage API for persisting blocked users
- MutationObserver for detecting new comments
- Content Scripts for DOM manipulation
- Aggressive CSS hiding for blocked comments

## Known Limitations

- May need manual refresh on some pages
- Loading times depend on comment section size
- Requires "View more comments" button to be visible

## Files

- `manifest.json`: Extension configuration
- `content.js`: Main blocking logic
- `popup.html`: User interface
- `popup.js`: UI interaction handling
- `styles.css`: Extension styling

## Contributing

Feel free to submit issues and pull requests.

## Status

Currently archived. The extension works but has room for improvement. Not actively maintained.

## License

MIT License