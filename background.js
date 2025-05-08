// Copyright (C) 2024 Seth Cottle

// This file is part of Sanitize It.

// Sanitize It is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or any later version.

// Sanitize It is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. Please see the
// GNU General Public License for more details.

console.log('Background script loaded');

// Use browser namespace for Firefox/Zen compatibility
const browserAPI = typeof browser !== 'undefined' ? browser : chrome;

// Check if we're running in Zen Browser
const isZenBrowser = typeof browserAPI.tabs.executeScript !== 'function';
console.log('Running in Zen Browser:', isZenBrowser);

// Add listener for extension icon click
browserAPI.action.onClicked.addListener((tab) => {
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
  
  // Update the current tab with the sanitized URL
  browserAPI.tabs.update(tab.id, { url: sanitizedUrl }).then(() => {
    console.log('Tab updated with sanitized URL');
  }).catch((error) => {
    console.error('Error updating tab:', error);
  });
}

console.log('Background script setup complete');