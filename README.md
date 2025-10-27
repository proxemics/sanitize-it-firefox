![sanitizeit](https://github.com/user-attachments/assets/29507a3b-51d0-42e0-b7ba-b4698046025b)

# Sanitize It (Firefox Edition)

Sanitize It allows you to quickly remove tracking information from the current page and automatically copy the URL to your clipboard with a single click.

**This is a Firefox-compatible fork** adapted from [Seth Cottle's original Sanitize It](https://github.com/sethcottle/sanitize-it) extension, modified to work with Firefox's browser API and manifest requirements.

## Does Sanitize It work automatically?
No, you'll need to manually run Sanitize It when you want to clean up the URL of the current page you're on. Once you run Sanitize It, the sanitized URL will automatically copy to your clipboard for quick and easy sharing.

![CleanShot 2024-08-05 at 22 12 19@2x](https://github.com/user-attachments/assets/3532bcce-1974-4915-8b28-11cdeb7a39d8)

## Breaking Down Sanitize It

### Event Listener for Extension Icon Click

```javascript
browser.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked');
  sanitizeAndUpdateUrl(tab);
});
```

Sets up an event listener that triggers when the user clicks the extension icon. It logs the click and calls the `sanitizeAndUpdateUrl` function with the current tab as an argument.

**Firefox Note:** This version uses `browser` API instead of `chrome` API for Firefox compatibility.

### URL Sanitization Function

```javascript
function sanitizeAndUpdateUrl(tab) {
```

This function takes a tab object as its parameter, which represents the current browser tab.

```javascript
let url = new URL(tab.url);
```

Creates a new `URL` object from the current tab's URL. This allows easy manipulation of different parts of the URL.

```javascript
url.search = '';
```

Sets the `search` property of the URL (everything after and including the '?') to an empty string, effectively removing all query parameters.

```javascript
let newPathname = url.pathname.replace(/\/ref\/.*$/, '');
newPathname = newPathname.replace(/\/ref=.*$/, '');
url.pathname = newPathname;
```

Removes '/ref/' or '/ref=' and everything after it from the pathname. This handles cases where 'ref' parameters are part of the path rather than query parameters.

```javascript
url.hash = '';
```

Removes the hash (fragment identifier) from the URL.

```javascript
const sanitizedUrl = url.toString();
console.log('Sanitized URL:', sanitizedUrl);
```

Converts the modified URL object back to a string.

### Clipboard Copy in Background Script

In the Firefox version, clipboard copying happens directly in the background script using `document.execCommand('copy')`:

```javascript
const textArea = document.createElement('textarea');
textArea.value = sanitizedUrl;
document.body.appendChild(textArea);
textArea.focus();
textArea.select();
const success = document.execCommand('copy');
document.body.removeChild(textArea);
```

This approach ensures clipboard access works reliably across different Firefox versions and page contexts.

### Toast Notification and Page Update

```javascript
browser.scripting.executeScript({
  target: { tabId: tab.id },
  func: showToast
}).then(() => {
  console.log('Toast notification injected successfully');
  
  setTimeout(() => {
    browser.tabs.update(tab.id, { url: sanitizedUrl });
  }, 2500);
}).catch((error) => {
  console.error('Error showing toast notification:', error);
});
```

This injects a toast notification function into the current page, displays the notification for 2.5 seconds, then navigates to the sanitized URL.

### Toast Notification Function

```javascript
function showToast() {
  // Creates visual toast notification
}
```

This creates a custom toast notification that appears in the top-right corner of the page, informing the user that the URL has been sanitized and copied. The toast automatically slides out after 1.5 seconds, just before the page navigates to the sanitized URL.

**Note:** The Firefox version uses a custom toast notification instead of the browser's native notification system for better cross-page compatibility.

## Requested Permissions
Sanitize It requests a few permissions in the `manifest.json` file.

`activeTab` allows the extension to access the currently active tab when the user invokes the extension. This permission is used to access and modify the URL of the current tab when the user clicks the extension icon.

`scripting` allows the extension to inject and execute scripts in web pages. This permission is used to inject the toast notification function into the active tab to provide visual feedback.

`clipboardWrite` allows the extension to write data to the system clipboard. This permission is used in the background script to copy the sanitized URL to the user's clipboard.

`tabs` allows the extension access to the `browser.tabs` API, allowing it to interact with the browser's tab system. This permission is used to update the current tab's URL with the sanitized version.

## Browser Compatibility

This Firefox version uses the `browser` API and is compatible with:
- Firefox 109.0 and later
- Zen Browser (with special handling for browser API variations)

The extension uses Firefox-specific manifest v3 features and may not work in Chrome-based browsers without modification.

#### Privacy

Sanitize It runs completely locally in your browser. It does not collect any analytics, it does not store any information about your tabs or browser history, it does not send any data back for processing or analysis. Your data is yours and yours alone. 

## Installing Sanitize It for Firefox

This Firefox version is available for manual installation from this repository.

**For Chrome/Edge/Safari versions**, please see [Seth Cottle's original Sanitize It](https://github.com/sethcottle/sanitize-it).

#### For Firefox

1. Download the latest release from this repository and unzip it
2. Navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on..."
4. Select the `manifest.json` file from the unzipped folder

**Note:** Temporary add-ons are removed when Firefox restarts. For permanent installation, you can package and sign the extension:

#### To Create a Permanent Installation:
1. Package the extension as a .zip file (include manifest.json, background.js, and icon files)
2. Submit to [Firefox Add-ons](https://addons.mozilla.org/en-US/developers/) for signing
3. Or use [web-ext](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/) for self-distribution

Example using web-ext:
```bash
npm install -g web-ext
web-ext build
web-ext sign --api-key=your-api-key --api-secret=your-api-secret
```

## Credits and Attribution

### Original Work
This Firefox edition is a derivative work based on **Sanitize It** by [Seth Cottle](https://github.com/sethcottle).
- Original Repository: [github.com/sethcottle/sanitize-it](https://github.com/sethcottle/sanitize-it)
- Chrome/Edge/Safari versions available at the original repository

You can support Seth's original work through:
- [![Buy Me A Coffee](https://cdn.cottle.cloud/tabcloser/buttons/button-bmac.svg)](https://buymeacoffee.com/seth)
- [![PayPal](https://cdn.cottle.cloud/tabcloser/buttons/button-paypal.svg)](https://www.paypal.com/paypalme/sethcottle)
- [![GitHub Sponsors](https://cdn.cottle.cloud/tabcloser/buttons/button-ghs.svg)](https://github.com/sponsors/sethcottle)

### Firefox Modifications
Firefox-specific modifications and adaptations by [Ryan Cuppernull](https://github.com/proxemics) (2025)
- Converted to Firefox `browser` API
- Implemented background script clipboard access
- Added custom toast notification system
- Updated manifest for Firefox compatibility

## License

Copyright (C) 2024 Seth Cottle (Original Work)  
Copyright (C) 2025 Ryan Cuppernull (Firefox Modifications)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but **WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE**. See the
[GNU General Public License](https://www.gnu.org/licenses/gpl-3.0.html) for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

---

**DISCLAIMER:** This software is provided "AS IS" without warranty of any kind, either express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, or non-infringement. In no event shall the authors or copyright holders be liable for any claim, damages, or other liability arising from the use of this software.

This is a derivative work based on the original Sanitize It extension. The Firefox-specific modifications are independently maintained and are not officially endorsed by or affiliated with the original author.
