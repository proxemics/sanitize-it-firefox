// Copyright (C) 2024 Seth Cottle (Original Work)
// Copyright (C) 2025 Ryan Cuppernull (Firefox Modifications)

// This file is part of Sanitize It (Firefox Edition).
// This version uses Firefox's browser API and background script clipboard access.

// Sanitize It is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or any later version.

// Sanitize It is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. Please see the
// GNU General Public License for more details.

console.log('Background script loaded');

// Check if we're running in Zen Browser
const isZenBrowser = typeof browser.tabs.executeScript !== 'function';
console.log('Running in Zen Browser:', isZenBrowser);

// Add listener for extension icon click
browser.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked');
  sanitizeAndUpdateUrl(tab);
});

function sanitizeAndUpdateUrl(tab) {
  console.log('sanitizeAndUpdateUrl function called');
  let url = new URL(tab.url);
  
  console.log('Original URL:', url.toString());
  
  // Remove everything after '?'
  url.search = '';
  
  // Remove ref parameters from the pathname
  let newPathname = url.pathname.replace(/\/ref\/.*$/, '');
  newPathname = newPathname.replace(/\/ref=.*$/, '');
  url.pathname = newPathname;

  // Remove hash
  url.hash = '';
  
  const sanitizedUrl = url.toString();
  console.log('Sanitized URL:', sanitizedUrl);
  
  // Copy to clipboard from background script
  try {
    const textArea = document.createElement('textarea');
    textArea.value = sanitizedUrl;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const success = document.execCommand('copy');
    console.log('Background clipboard copy attempt:', success ? 'succeeded' : 'failed');
    
    document.body.removeChild(textArea);
  } catch (error) {
    console.log('Background clipboard operation failed:', error);
  }
  
  // Show toast notification on current page BEFORE navigating
  browser.scripting.executeScript({
    target: { tabId: tab.id },
    func: showToast
  }).then(() => {
    console.log('Toast notification injected successfully');
    
    // Wait for toast animation to complete (3 seconds display + fade out)
    setTimeout(() => {
      browser.tabs.update(tab.id, { url: sanitizedUrl }).then(() => {
        console.log('Tab updated with sanitized URL');
      }).catch((error) => {
        console.error('Error updating tab:', error);
      });
    }, 2500); // 3s display + 300ms fade = 3.3s total
  }).catch((error) => {
    console.error('Error showing toast notification:', error);
    // If toast fails, still navigate to sanitized URL
    browser.tabs.update(tab.id, { url: sanitizedUrl });
  });
}

// Content script function to show toast notification
function showToast() {
  const toast = document.createElement('div');
  toast.textContent = '✓ URL sanitized and copied! Reloading page...';
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 2147483647;
    background: #4CAF50;
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 14px;
    font-weight: 500;
    animation: slideIn 0.3s ease-out;
  `;
  
  // Add animation keyframes
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes slideOut {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(400px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(toast);
  
  // Slide out and remove after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => {
      toast.remove();
      style.remove();
    }, 300);
  }, 1500);
}

console.log('Background script setup complete');