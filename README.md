# Mobile Viewer

Preview any web page or local dev server inside a realistic phone, tablet,
foldable, or smart-display frame, without leaving VS Code.

Mobile Viewer opens a side panel containing a webview with an `<iframe>`.
Point it at a URL — typically `http://localhost:3000` or another local dev
server — pick a device from the dropdown, and the frame resizes to that
device's exact viewport so you can check layout, responsiveness, and
touch-target sizing as you work.

---

## Features

- **Live preview pane** — runs alongside your editor as a side-by-side
  webview, similar to VS Code's built-in Simple Browser.
- **Device switcher** — one dropdown with 17 presets plus a "Responsive"
  mode that fills the available space:

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

- **Status bar overlay** — phone-shell devices show an OS-accurate status
  bar (live clock, signal, Wi-Fi, and battery icons) in a dedicated strip
  above the page. iOS devices use a 12-hour clock; Android devices append
  AM/PM. Click the status-bar button (▤) to cycle Light / Dark / Off to
  match your page's theme.
- **Favorite devices** — star a device to pin it to a Favorites group at
  the top of the list. Favorites persist across sessions.
- **Categorized device list** — Phones, Tablets & Laptops, Foldables, and
  Smart Displays, for faster browsing.
- **Rotate** — toggles the selected device between portrait and landscape
  (disabled in Responsive mode).
- **Idle-state wallpaper** — shows a platform-appropriate lock screen
  (distinct styles for iOS, Android/Pixel, and Samsung) with a live clock
  instead of a blank screen when no URL is loaded.
- **Auto-fit to panel** — the device frame scales to always fit within the
  panel, recalculated on device change, rotation, and panel resize. Manual
  zoom (`+`/`−`) overrides this until **Fit** is re-enabled.
- **Zoom controls** — 30%–200%, so larger devices (iPad Pro, Surface Pro 7)
  still fit on smaller monitors.
- **Address bar** — type a URL and press *Go* / *Enter*. `http://` is added
  automatically if omitted (e.g. `localhost:5173` loads
  `http://localhost:5173`).
- **Reload button** — refreshes the preview without retyping the URL.
- **State persistence** — last URL, device, rotation, and zoom level are
  restored when the panel is reopened (`retainContextWhenHidden`).

---

## Screenshots

**iPhone 14 Pro Max** — captures the floating Dynamic Island cutout
exactly as it appears on the real device, paired with a live iOS-style
status bar above the page (12-hour clock, signal, Wi-Fi, and battery
icons) and a gesture bar along the bottom edge.

![iPhone 14 Pro Max](https://github.com/Alnajeeb7/mobile-viewer/raw/HEAD/media/screenshots/iphone-14-pro-max.png)

**Pixel 7** — shows the centered front-camera cutout at the top of the
screen alongside Android's dark-themed status bar, with the clock shown
in 12-hour format with AM/PM, matching how the device looks in hand.

![Pixel 7](https://github.com/Alnajeeb7/mobile-viewer/raw/HEAD/media/screenshots/pixel-7.png)

**Samsung Galaxy S26 Ultra** — the same centered front-camera cutout as
the Pixel, paired with the One UI-inspired idle wallpaper that appears
when no URL is loaded: a diagonal wave gradient with a live clock.

![Samsung Galaxy S26 Ultra](https://github.com/Alnajeeb7/mobile-viewer/raw/HEAD/media/screenshots/galaxy-s26-ultra.png)

**iPad Air** — the thicker tablet bezel with a small camera dot centered
along the top edge, sized to the iPad Air's actual viewport so layouts
and breakpoints can be checked at true scale.

![iPad Air](https://github.com/Alnajeeb7/mobile-viewer/raw/HEAD/media/screenshots/ipad-air.png)

**iPhone SE** — the classic home-button design with a top speaker bar
and earpiece speaker, representing the smallest supported iPhone
viewport for testing compact layouts.

![iPhone SE](https://github.com/Alnajeeb7/mobile-viewer/raw/HEAD/media/screenshots/iphone-se.png)

**Nest Hub Max** — the smart-display shell with a light bezel and a
visible speaker grille along the bottom, plus the camera bar that's
unique to the Max model.

![Nest Hub Max](https://github.com/Alnajeeb7/mobile-viewer/raw/HEAD/media/screenshots/nest-hub-max.png)

---

## Device Shells

Every preset renders inside a shell matching its real-world silhouette,
not a generic rounded rectangle:

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

Phone shells include subtle side power/volume buttons. Rotating a phone to
landscape switches its shell to the minimal-bezel variant, since a
notch/island/punch-hole would otherwise land awkwardly on a side edge.

---

## Getting Started

1. Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`).
2. Run **"Mobile Viewer: Open Preview"** — or click the device icon in the
   editor title bar.
3. A new panel opens beside your editor.
4. Type the URL of your running app (e.g. `http://localhost:3000`) and
   press **Go**.
5. Choose a device from the dropdown to resize the preview frame.

> Keep your dev server (`npm run dev`, `vite`, etc.) running in a terminal,
> then arrange the Mobile Viewer panel next to your editor for a live,
> responsive preview as you code.

---

## Installation

Mobile Viewer is available on the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=azeezaerodev.mobile-viewer).

1. Open the **Extensions** view (`Ctrl+Shift+X` / `Cmd+Shift+X`).
2. Search for **"Mobile Viewer"**.
3. Click **Install**.

Or from a terminal:

```bash
code --install-extension azeezaerodev.mobile-viewer
```

---

## Known Limitations

- **Cross-origin restrictions still apply.** Sites that set
  `X-Frame-Options` or `Content-Security-Policy: frame-ancestors` headers
  can't be embedded in an `<iframe>` at all — this is a browser/security
  restriction, not something the extension can bypass. Local dev servers
  (`localhost`) are unaffected in almost all cases.
- **No device emulation of touch/user-agent.** The frame resizes the
  viewport to match each device's CSS pixel dimensions (so media queries
  and responsive layouts behave correctly), but it doesn't spoof the
  `User-Agent` string or emulate touch events, pixel ratio, or geolocation.
- **Zoom is visual only.** It scales the rendered frame for convenience on
  small monitors; it doesn't change the effective viewport size reported
  to the page.

---

## Requirements

- VS Code `1.80.0` or later.
- Works on Windows, macOS, and Linux — the extension uses only the
  cross-platform `vscode` Webview API.

---

## License

MIT
