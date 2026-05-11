# Primary Domain Counter - Local Testing & Packaging Guide

This guide explains how to:

1. Load the extension temporarily in Firefox for local testing.
2. Verify domain counting behavior.
3. Package the extension for sharing.

## Prerequisites

- Firefox (recent version, 109+ recommended).
- This project checked out locally.

---

## 1) Load locally in Firefox (temporary add-on)

1. Open Firefox.
2. Go to `about:debugging#/runtime/this-firefox`.
3. Click **Load Temporary Add-on...**.
4. Select this project folder's `manifest.json`.
5. Firefox loads the add-on and shows it in the temporary extensions list.

> Note: temporary add-ons are removed when Firefox fully restarts.

---

## 2) Manual test checklist

After loading the add-on:

1. Open a few tabs across repeated domains, for example:
   - 4 tabs on `youtube.com`
   - 2 tabs on `mail.google.com` (which should count under `google.com` with current logic)
2. Click the extension icon in the top-right toolbar.
3. Confirm the popup shows `domain: count` entries sorted by:
   - highest count first, then
   - alphabetical order for ties.

### Additional checks

- **Empty/unsupported pages:** pages like `about:config` are ignored.
- **Localhost:** `http://localhost:3000` is counted as `localhost`.
- **IP tabs:** `http://127.0.0.1:8080` is counted as `127.0.0.1`.
- **Error state:** if popup script fails, it displays an error message.

---

## 3) Package the add-on

You can package the extension either manually (ZIP/XPI) or with `web-ext`.

### Option A: Manual ZIP packaging

From the project root:

```bash
mkdir -p dist
zip -r dist/primary-domain-counter.zip manifest.json background.js popup
```

For Firefox, an `.xpi` is essentially a zip archive with a different extension. You can copy/rename the output if needed:

```bash
cp dist/primary-domain-counter.zip dist/primary-domain-counter.xpi
```

### Option B: Package with `web-ext` (recommended)

Install `web-ext` (one-time):

```bash
npm install --global web-ext
```

Build package:

```bash
mkdir -p dist
web-ext build --source-dir . --artifacts-dir dist
```

The generated package appears in `dist/`.

---

## 4) Install packaged build for testing

For unsigned/local package testing, use `about:debugging` and load the `.xpi` temporarily, or load from source as above.

If you want permanent installation for general users, submit/sign through Mozilla Add-ons (AMO):

- https://addons.mozilla.org/developers/

Firefox generally requires signed add-ons for normal permanent installs.
