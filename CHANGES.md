# Changes from Original Sanitize It

This document outlines the modifications made to create the Firefox-compatible version of Sanitize It.

## Technical Changes

### 1. API Migration
- **Chrome API → Firefox API**: All `chrome.*` calls replaced with `browser.*`
  - `chrome.action` → `browser.action`
  - `chrome.tabs` → `browser.tabs`
  - `chrome.scripting` → `browser.scripting`

### 2. Clipboard Access
- **Changed**: Clipboard copy method moved to background script
- **Method**: Uses `document.execCommand('copy')` instead of content script
- **Reason**: Better cross-page compatibility in Firefox

### 3. Notification System
- **Changed**: Removed Chrome notification API
- **Added**: Custom toast notification with CSS animations
- **Styling**: Green toast with slide-in/slide-out animations
- **Timing**: Displays for 1.5 seconds before page navigation

### 4. Script Injection
- **Changed**: Parameter name from `function` to `func`
- **Reason**: Firefox scripting API uses different parameter naming

### 5. Manifest Updates
- **Added**: `browser_specific_settings` for Firefox/Gecko compatibility
- **Added**: Gecko ID: `sanitize-it@example.com`
- **Added**: Minimum Firefox version: 109.0
- **Changed**: Background script declaration for Firefox manifest v3

### 6. Workflow Changes
- **Order**: Toast notification shows BEFORE navigation (not after)
- **Timing**: 2.5-second delay before navigating to sanitized URL
- **Reason**: Ensures user sees confirmation before page reloads

## Documentation Changes

### README.md
- Added "Firefox Edition" branding
- Updated all code examples to use `browser` API
- Replaced Chrome/Edge/Safari installation instructions with Firefox-specific ones
- Added browser compatibility section
- Updated permissions descriptions
- Added proper attribution to original author
- Added Credits and Attribution section
- Enhanced license section with dual copyright and disclaimer

### Source Code Headers
- Added dual copyright notices (Seth Cottle + Ryan Cuppernull)
- Added note about Firefox-specific implementation
- Maintained GPL v3 license

### New Files
- **NOTICE**: Comprehensive attribution and modification notice
- **CHANGES.md**: This file documenting all modifications

## License Compliance (GPL v3)

All changes maintain GPL v3 license compatibility:
- ✅ Source code remains open and available
- ✅ Original author (Seth Cottle) properly attributed
- ✅ Modifications clearly documented
- ✅ Same GPL v3 license applied to derivative work
- ✅ "No warranty" disclaimer prominently displayed
- ✅ Modified files carry notices of changes

## Future Considerations

If submitting to Firefox Add-ons (AMO):
1. Update Gecko ID to unique identifier
2. Package as .zip file
3. Submit for Mozilla signing
4. Consider using web-ext for development and packaging

## Testing

Confirmed compatible with:
- Firefox 109.0+
- Zen Browser (with browser API handling)

---

**Last Updated**: January 2025  
**Maintainer**: Ryan Cuppernull ([@proxemics](https://github.com/proxemics))  
**Original Author**: Seth Cottle ([@sethcottle](https://github.com/sethcottle))

