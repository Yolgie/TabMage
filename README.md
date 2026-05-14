# Yolgie's Tab Mage

Yolgie's Tab Mage is a small Firefox WebExtension that summarizes your currently open tabs by domain. Click the extension icon in the Firefox toolbar to see a compact list of domains and how many open tabs belong to each one.

For example, if you have four YouTube tabs and two Gmail tabs open, the popup can show entries like:

```text
youtube.com: 4
google.com: 2
```

## Functionality

- Counts open tabs across all Firefox windows.
- Groups tabs by primary domain using the last two hostname segments for normal hostnames.
  - `www.youtube.com` and `m.youtube.com` are counted as `youtube.com`.
  - `mail.google.com` is counted as `google.com`.
- Displays counts in the toolbar popup as `domain: count`.
- Sorts the list by highest count first, then alphabetically for ties.
- Ignores browser/internal pages that do not have a countable web hostname, such as `about:` pages and extension pages.
- Handles local development hosts:
  - `localhost` stays grouped as `localhost`.
  - IPv4 addresses are shown as their full IP address.

## How it works

The extension uses the Firefox `tabs` permission to query open tabs. A Firefox-supported background script extracts a countable domain from each tab URL, builds domain totals, and returns the sorted list to the popup when the toolbar icon is clicked.

Because Firefox does not support Manifest V3 `background.service_worker`, this add-on declares `background.scripts` in `manifest.json` so `background.js` is registered and can answer popup messages.

## Project structure

```text
manifest.json       Extension metadata, permissions, toolbar action, and background script config
background.js       Tab querying, domain extraction, counting, and popup message handling
popup/popup.html    Popup markup
popup/popup.js      Popup rendering logic
popup/popup.css     Popup styling
GUIDE.md            Local testing and packaging instructions
```

## Local testing and packaging

See [GUIDE.md](GUIDE.md) for instructions on loading the extension temporarily in Firefox, manually testing the domain counts, and packaging the add-on as a ZIP/XPI or with `web-ext`.

## Notes and limitations

This extension currently uses a simple primary-domain heuristic: for multi-part hostnames it returns the final two hostname segments. This works well for domains such as `youtube.com` and `google.com`, but it does not use the Public Suffix List. Domains with multi-part public suffixes, such as `example.co.uk`, may therefore be grouped as `co.uk` instead of `example.co.uk`.
