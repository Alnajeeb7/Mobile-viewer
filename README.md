# Mobile Viewer

Preview any web page or local dev server inside a mobile, tablet, or desktop
device frame — without leaving VS Code.

Mobile Viewer opens a side panel containing a webview with an `<iframe>`. You
point it at a URL (typically `http://localhost:3000` or similar), pick a
device from the dropdown, and the frame instantly resizes to that device's
viewport so you can check layout, responsiveness, and touch-target sizing as
you work.

---

## Features

- **Live preview pane** — runs alongside your editor as a side-by-side
  webview, just like VS Code's built-in Simple Browser.
- **Device switcher** — a single dropdown with 17 common presets plus a
  "Responsive" mode that fills the available space:

  | Phones | Tablets | Foldables | Laptops / Desktops | Smart displays |
  |---|---|---|---|---|
  | iPhone SE (375×667) | iPad Mini (768×1024) | Surface Duo (540×720) | Surface Pro 7 (912×1368) | Nest Hub (1024×600) |
  | iPhone XR (414×896) | iPad Air (820×1180) | Galaxy Z Fold 5 (344×882) | | Nest Hub Max (1280×800) |
  | iPhone 12 Pro (390×844) | iPad Pro (1024×1366) | Asus Zenbook Fold (853×1280) | | |
  | iPhone 14 Pro Max (430×932) | | | | |
  | Pixel 7 (412×915) | | | | |
  | Samsung Galaxy S8+ (360×740) | | | | |
  | Samsung Galaxy S26 Ultra (412×919) | | | | |
  | Samsung Galaxy A51/71 (412×914) | | | | |

- **Live status bar overlay** — phone-shell devices show a realistic OS
  status bar (live clock that updates automatically, plus signal, Wi-Fi and
  battery icons) in its own dedicated strip above the page, exactly like a
  real device screenshot. iOS devices use a 12-hour clock ("9:41"); Android
  devices use "9:41 AM". Click the status-bar button (▤) to cycle **Light /
  Dark / Off** to match your page's theme.
- **Favorite devices** — click the star next to the device dropdown to pin
  your most-used devices to a **★ Favorites** group at the top of the list.
  Favorites persist across sessions.
- **Categorized device list** — devices are grouped into Phones, Tablets &
  Laptops, Foldables, and Smart Displays for faster browsing.
- **Rotate** — flips the selected device between portrait and landscape
  (disabled in Responsive mode).
- **Lock-screen wallpaper when idle** — with no URL loaded, each platform
  shows a distinct, recognizable wallpaper instead of a blank screen: iOS
  devices get a two-orb pink/violet-to-icy-blue glow (inspired by the
  default iOS lock screen), Pixel/Android devices get a sage-green nature
  gradient with a left-aligned Material-style clock and widget pill, and
  Samsung devices get a pale diagonal "wave" gradient echoing One UI's key
  art. The clock and date update live.
- **Fit to screen** — automatically scales the device frame so it always
  fits entirely within the panel (recalculated on device change, rotation,
  and panel resize). Manual zoom (`+`/`−`) temporarily overrides this; click
  **Fit** again to re-enable auto-fit.
- **Zoom controls** — scale the device frame from 30% to 200% so large
  devices (e.g. iPad Pro, Surface Pro 7) still fit on smaller monitors.
- **Address bar** — type any URL and press *Go* / *Enter*. `http://` is
  added automatically if you omit a protocol (e.g. typing `localhost:5173`
  loads `http://localhost:5173`).
- **Reload button** — refreshes the previewed page without retyping the URL.
- **State persistence** — the panel remembers the last URL, device, rotation,
  and zoom level even after it's hidden and reopened (`retainContextWhenHidden`).

---

## Screenshots

**iPhone 14 Pro Max** — Dynamic Island shell, status bar, live clock

![iPhone 14 Pro Max](https://github.com/Alnajeeb7/mobile-viewer/raw/HEAD/media/screenshots/iphone-14-pro-max.png)

**Pixel 7** — punch-hole camera, Android dark status bar

![Pixel 7](https://github.com/Alnajeeb7/mobile-viewer/raw/HEAD/media/screenshots/pixel-7.png)

**Samsung Galaxy S26 Ultra** — punch-hole camera, One UI-style wave wallpaper

![Samsung Galaxy S26 Ultra](https://github.com/Alnajeeb7/mobile-viewer/raw/HEAD/media/screenshots/galaxy-s26-ultra.png)

**iPad Air** — tablet bezel with top camera dot

![iPad Air](https://github.com/Alnajeeb7/mobile-viewer/raw/HEAD/media/screenshots/ipad-air.png)

**iPhone SE** — classic home button + earpiece speaker

![iPhone SE](https://github.com/Alnajeeb7/mobile-viewer/raw/HEAD/media/screenshots/iphone-se.png)

**Nest Hub Max** — smart display with speaker grille

![Nest Hub Max](https://github.com/Alnajeeb7/mobile-viewer/raw/HEAD/media/screenshots/nest-hub-max.png)

---

## Realistic device shells

Every device preset renders inside a shell that matches its real-world
silhouette, not just a generic rounded rectangle:

| Shell | Used by | Details |
|---|---|---|
| Dynamic Island | iPhone 14 Pro Max | Floating pill cutout + gesture bar |
| Notch | iPhone XR, iPhone 12 Pro | Rounded notch + gesture bar |
| Punch-hole camera | Pixel 7, Galaxy S26 Ultra, Galaxy A51/71, Galaxy Z Fold 5 | Centered camera dot + gesture bar |
| Home button | iPhone SE | Top speaker bar + circular home button |
| Minimal bezel | Galaxy S8+, Surface Duo, landscape phones | Slim bezel + gesture bar |
| Tablet | iPad Mini/Air/Pro, Surface Pro 7, Asus Zenbook Fold | Thicker bezel + top camera dot |
| Smart display | Nest Hub, Nest Hub Max | Light bezel + speaker grille (Max adds a camera bar) |
| Responsive | Responsive mode | Dashed outline, fills the panel |

Phone shells also get subtle side power/volume buttons. When a phone is
rotated to landscape, its shell switches to the minimal bezel so the
notch/island/punch-hole doesn't end up awkwardly on a side edge.

---

## Getting Started

1. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
2. Run **"Mobile Viewer: Open Preview"** — or click the device icon in the
   editor title bar.
3. A new panel opens beside your editor.
4. Type the URL of your running app (e.g. `http://localhost:3000`) and press
   **Go**.
5. Choose a device from the dropdown to resize the preview frame.

> **Tip:** Keep your dev server (`npm run dev`, `vite`, etc.) running in a
> terminal, then arrange the Mobile Viewer panel next to your editor for a
> live, responsive preview as you code.

---

## Installing the `.vsix`

If you received `mobile-viewer-1.0.0.vsix` directly:

1. Open VS Code.
2. Open the **Extensions** view (`Ctrl+Shift+X` / `Cmd+Shift+X`).
3. Click the `...` (More Actions) menu at the top of the Extensions view.
4. Select **"Install from VSIX..."** and choose the file.
5. Reload the window if prompted.

Alternatively, from a terminal:

```bash
code --install-extension mobile-viewer-1.0.0.vsix
```

---

## Project Structure

The extension is intentionally kept to a minimal set of files:

```
mobile-viewer/
├── package.json     # Extension manifest (commands, menus, metadata)
├── extension.js      # Activation logic & webview panel creation
├── icon.png           # Extension icon (Marketplace / Extensions view)
├── media/
│   ├── main.js        # Webview UI logic (device list, zoom, navigation)
│   ├── style.css       # Webview styling + per-device chrome shells
│   └── screenshots/     # Marketplace gallery images
└── README.md
```

No build step, bundler, or external dependencies are required — the
extension runs directly on the VS Code Extension API (`vscode` module) and
plain web technologies (HTML/CSS/JS) inside the webview.

---

## Design Decisions

- **Single webview, single command.** Rather than multiple views or a
  custom editor, one `WebviewPanel` is created on demand and reused if the
  command is run again (`panel.reveal()`), keeping the extension simple and
  avoiding duplicate panels.
- **iframe-based preview.** The simplest and most maintainable way to render
  arbitrary web content inside a webview is a sandboxed `<iframe>`. The
  Content-Security-Policy explicitly allows `frame-src http: https:` so any
  local or remote URL can be loaded.
- **Device presets as plain data.** All device dimensions live in a single
  `DEVICES` array in `media/main.js`, making it trivial to add, remove, or
  re-order devices without touching extension logic.
- **Status bar gets dedicated space, not an overlay on top of content.**
  Rather than drawing the clock/icons over the page (which would obscure
  any header at the top of the site), the iframe is offset below a
  same-height status-bar strip with its own background. This matches how a
  real device screenshot looks — status bar, then app content — and avoids
  ever covering part of the page.
  (`notch`, `island`, `punchHole`, `homeButton`, `minimal`, `tablet`,
  `display`, `displayCam`, `responsive`) mapped to a fixed bezel size in
  `media/main.js`. `media/style.css` then draws the matching cutouts
  (notch, Dynamic Island, punch-hole, home button, camera dot, speaker
  grille) via `[data-chrome="..."]` attribute selectors. Adding a new shell
  is a matter of adding one bezel entry and one CSS block — no changes to
  the rendering logic itself.
  recomputes the device frame's scale whenever the panel is resized, so the
  full device — including its label — always stays visible (matching the
  "fit" behavior of browser device toolbars). Manual zoom takes precedence
  until the **Fit** button is pressed again.
- **CSS-driven resizing.** Switching devices simply changes the `width` /
  `height` / `transform: scale()` of a `div.device-frame` wrapping the
  iframe — no iframe reloads, so navigation state persists across device
  switches.
- **Theme-aware styling.** All colors are sourced from VS Code's CSS custom
  properties (`--vscode-*`), so the panel automatically matches the user's
  light/dark/high-contrast theme.
- **State persistence via `vscode.getState`/`setState`.** Combined with
  `retainContextWhenHidden: true`, the preview survives the panel being
  hidden behind other tabs.

---

## Known Limitations

- **Cross-origin restrictions still apply.** Some websites set
  `X-Frame-Options` or `Content-Security-Policy: frame-ancestors` headers
  that prevent them from being embedded in an `<iframe>` at all (this is a
  browser/security restriction, not something the extension can bypass).
  Local development servers (`localhost`) are unaffected in almost all
  cases.
- **No device emulation of touch/user-agent.** The frame resizes the
  *viewport* to match each device's CSS pixel dimensions (so CSS media
  queries and responsive layouts behave correctly), but it does not spoof
  the `User-Agent` string or emulate touch events, pixel ratio, or
  geolocation.
- **Zoom is visual only.** The zoom control scales the rendered frame for
  convenience on small monitors; it does not change the effective viewport
  size reported to the page.

---

## Requirements

- VS Code `1.80.0` or later.
- Works on Windows, macOS, and Linux — the extension uses only the
  cross-platform `vscode` Webview API.

---

## License

MIT
