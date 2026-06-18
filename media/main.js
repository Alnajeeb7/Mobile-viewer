(function () {
  const vscode = acquireVsCodeApi();

  // Device presets: width/height in CSS pixels (matches common browser
  // device-toolbar presets). "Responsive" has no fixed size and fills the
  // available viewport. `chrome` selects the realistic device shell drawn
  // around the preview (notch, dynamic island, punch-hole camera, home
  // button, tablet bezel, or smart-display speaker). `category` groups the
  // device picker; `platform` selects the status-bar icon style.
  const DEVICES = [
    { name: 'Responsive', width: null, height: null, chrome: 'responsive', category: 'General', platform: 'none' },
    { name: 'iPhone SE', width: 375, height: 667, chrome: 'homeButton', category: 'Phones', platform: 'ios' },
    { name: 'iPhone XR', width: 414, height: 896, chrome: 'notch', category: 'Phones', platform: 'ios' },
    { name: 'iPhone 12 Pro', width: 390, height: 844, chrome: 'notch', category: 'Phones', platform: 'ios' },
    { name: 'iPhone 14 Pro Max', width: 430, height: 932, chrome: 'island', category: 'Phones', platform: 'ios' },
    { name: 'Pixel 7', width: 412, height: 915, chrome: 'punchHole', category: 'Phones', platform: 'android' },
    { name: 'Samsung Galaxy S8+', width: 360, height: 740, chrome: 'minimal', category: 'Phones', platform: 'android' },
    { name: 'Samsung Galaxy S26 Ultra', width: 412, height: 919, chrome: 'punchHole', category: 'Phones', platform: 'samsung' },
    { name: 'Samsung Galaxy A51/71', width: 412, height: 914, chrome: 'punchHole', category: 'Phones', platform: 'android' },
    { name: 'iPad Mini', width: 768, height: 1024, chrome: 'tablet', category: 'Tablets & Laptops', platform: 'none' },
    { name: 'iPad Air', width: 820, height: 1180, chrome: 'tablet', category: 'Tablets & Laptops', platform: 'none' },
    { name: 'iPad Pro', width: 1024, height: 1366, chrome: 'tablet', category: 'Tablets & Laptops', platform: 'none' },
    { name: 'Surface Pro 7', width: 912, height: 1368, chrome: 'tablet', category: 'Tablets & Laptops', platform: 'none' },
    { name: 'Surface Duo', width: 540, height: 720, chrome: 'minimal', category: 'Foldables', platform: 'android' },
    { name: 'Galaxy Z Fold 5', width: 344, height: 882, chrome: 'punchHole', category: 'Foldables', platform: 'samsung' },
    { name: 'Asus Zenbook Fold', width: 853, height: 1280, chrome: 'tablet', category: 'Foldables', platform: 'none' },
    { name: 'Nest Hub', width: 1024, height: 600, chrome: 'display', category: 'Smart Displays', platform: 'none' },
    { name: 'Nest Hub Max', width: 1280, height: 800, chrome: 'displayCam', category: 'Smart Displays', platform: 'none' }
  ];

  // Height (unscaled CSS px) of the status bar overlay drawn at the top of
  // the screen for each chrome type. Only phone-style shells get one.
  const STATUS_BAR_HEIGHT = {
    notch:      44,
    island:     50,
    homeButton: 22,
    punchHole:  30,
    minimal:    26
  };

  // Bezel thickness (CSS px, unscaled) reserved around the screen for each
  // chrome type. These match the padding values implied by media/style.css.
  const BEZEL = {
    responsive: { top: 0,  right: 0,  bottom: 0,  left: 0  },
    notch:      { top: 10, right: 9,  bottom: 18, left: 9  },
    island:     { top: 9,  right: 9,  bottom: 18, left: 9  },
    punchHole:  { top: 9,  right: 9,  bottom: 18, left: 9  },
    minimal:    { top: 9,  right: 8,  bottom: 16, left: 8  },
    homeButton: { top: 24, right: 10, bottom: 56, left: 10 },
    tablet:     { top: 30, right: 16, bottom: 16, left: 16 },
    display:    { top: 16, right: 16, bottom: 48, left: 16 },
    displayCam: { top: 36, right: 16, bottom: 48, left: 16 }
  };

  // When a phone-style device is rotated to landscape, its notch / island /
  // punch-hole would visually move to a side edge. Rather than guess at a
  // sideways cutout, fall back to a clean minimal bezel for landscape.
  const PHONE_CHROMES = new Set(['notch', 'island', 'punchHole', 'homeButton', 'minimal']);

  const LABEL_SPACE = 30; // vertical space reserved for the floating device label
  const MIN_ZOOM = 0.3;
  const MAX_ZOOM = 2;

  const urlInput = document.getElementById('urlInput');
  const goBtn = document.getElementById('goBtn');
  const refreshBtn = document.getElementById('refreshBtn');
  const deviceSelect = document.getElementById('deviceSelect');
  const favBtn = document.getElementById('favBtn');
  const rotateBtn = document.getElementById('rotateBtn');
  const fitBtn = document.getElementById('fitBtn');
  const statusBarBtn = document.getElementById('statusBarBtn');
  const zoomInBtn = document.getElementById('zoomInBtn');
  const zoomOutBtn = document.getElementById('zoomOutBtn');
  const zoomLabel = document.getElementById('zoomLabel');
  const deviceFrame = document.getElementById('deviceFrame');
  const deviceFrameOuter = document.getElementById('deviceFrameOuter');
  const deviceLabel = document.getElementById('deviceLabel');
  const screenWrap = document.getElementById('screenWrap');
  const previewFrame = document.getElementById('previewFrame');
  const viewport = document.getElementById('viewport');
  const statusBar = document.getElementById('statusBar');
  const statusTime = document.getElementById('statusTime');
  const wallpaper = document.getElementById('wallpaper');
  const lockTime = document.getElementById('lockTime');
  const lockDate = document.getElementById('lockDate');

  // Builds the device <select>, grouping favorites at the top followed by
  // each device category as an <optgroup>.
  function rebuildDeviceOptions() {
    const previousValue = deviceSelect.value;
    deviceSelect.innerHTML = '';

    const makeOption = (device, index) => {
      const option = document.createElement('option');
      option.value = String(index);
      option.textContent = device.width
        ? `${device.name} (${device.width} x ${device.height})`
        : device.name;
      return option;
    };

    if (state.favorites.length) {
      const favGroup = document.createElement('optgroup');
      favGroup.label = '\u2605 Favorites';
      DEVICES.forEach((device, index) => {
        if (state.favorites.includes(device.name)) {
          favGroup.appendChild(makeOption(device, index));
        }
      });
      deviceSelect.appendChild(favGroup);
    }

    const categories = [];
    DEVICES.forEach((device) => {
      if (!categories.includes(device.category)) {
        categories.push(device.category);
      }
    });

    categories.forEach((category) => {
      const group = document.createElement('optgroup');
      group.label = category;
      DEVICES.forEach((device, index) => {
        if (device.category === category) {
          group.appendChild(makeOption(device, index));
        }
      });
      deviceSelect.appendChild(group);
    });

    deviceSelect.value = previousValue;
  }

  // Restore previous session state if the panel was hidden/reopened.
  const saved = vscode.getState() || {};
  const DEFAULT_DEVICE_INDEX = DEVICES.findIndex((d) => d.name === 'iPhone 14 Pro Max');

  // One-time migration: earlier versions of this extension auto-loaded
  // "http://localhost:3000" as a hardcoded default and persisted it via
  // vscode.getState(). That stale saved URL would silently override the
  // wallpaper on upgrade even though the user never actually typed it in.
  // If the saved URL still matches that old hardcoded default exactly,
  // treat it as "never set" so the wallpaper shows as intended.
  const restoredUrl = saved.url === 'http://localhost:3000' ? '' : (saved.url || '');

  const state = {
    url: restoredUrl,
    deviceIndex: typeof saved.deviceIndex === 'number' ? saved.deviceIndex : DEFAULT_DEVICE_INDEX,
    rotated: !!saved.rotated,
    zoom: saved.zoom || 1,
    autoFit: saved.autoFit !== false, // default true
    favorites: Array.isArray(saved.favorites) ? saved.favorites : [],
    statusBarMode: saved.statusBarMode || 'off' // 'light' | 'dark' | 'off'
  };

  urlInput.value = state.url;
  rebuildDeviceOptions();
  deviceSelect.value = String(state.deviceIndex);

  function saveState() {
    vscode.setState(state);
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function currentLayout() {
    const device = DEVICES[state.deviceIndex];
    let { width, height } = device;
    let chromeKey = device.chrome;

    if (state.rotated && width && height) {
      [width, height] = [height, width];
      if (PHONE_CHROMES.has(chromeKey)) {
        chromeKey = 'minimal';
      }
    }

    const bezel = BEZEL[chromeKey] || BEZEL.responsive;
    return { device, width, height, chromeKey, bezel };
  }

  // Calculates the zoom level needed so the full device frame (including
  // its bezel/chrome) fits entirely inside the visible viewport — mirrors a
  // browser devtools "fit" toggle.
  function computeFitZoom() {
    const { width, height, bezel } = currentLayout();
    if (!width) return 1;

    const availW = viewport.clientWidth - 16; // small breathing room
    const availH = viewport.clientHeight - 16;

    const frameW = width + bezel.left + bezel.right;
    const frameH = height + bezel.top + bezel.bottom + LABEL_SPACE;

    if (availW <= 0 || availH <= 0) return 1;

    const scale = Math.min(availW / frameW, availH / frameH, 1);
    return clamp(Math.round(scale * 100) / 100, MIN_ZOOM, MAX_ZOOM);
  }

  function applyDevice() {
    const { device, width, height, chromeKey, bezel } = currentLayout();

    favBtn.classList.toggle('active', state.favorites.includes(device.name));
    favBtn.textContent = state.favorites.includes(device.name) ? '\u2605' : '\u2606';

    // Wallpaper platform drives the gradient + clock style
    if (wallpaper) {
      wallpaper.dataset.platform = device.platform || 'none';
    }

    const barHeight = STATUS_BAR_HEIGHT[chromeKey];
    const showBar = !!barHeight && state.statusBarMode !== 'off';
    if (showBar) {
      statusBar.style.display = 'flex';
      statusBar.style.height = barHeight + 'px';
      statusBar.dataset.platform = device.platform;
      statusBar.dataset.theme = state.statusBarMode;
      previewFrame.style.top = barHeight + 'px';
      previewFrame.style.height = `calc(100% - ${barHeight}px)`;
      updateClock();
    } else {
      statusBar.style.display = 'none';
      previewFrame.style.top = '0';
      previewFrame.style.height = '100%';
    }

    if (!width) {
      deviceFrame.classList.add('responsive');
      deviceFrame.removeAttribute('data-chrome');
      deviceFrame.style.width = '100%';
      deviceFrame.style.height = '100%';
      deviceFrame.style.transform = 'none';
      deviceFrameOuter.style.width = '100%';
      deviceFrameOuter.style.height = '100%';
      screenWrap.style.top = '0';
      screenWrap.style.left = '0';
      screenWrap.style.width = '100%';
      screenWrap.style.height = '100%';
      deviceLabel.textContent = 'Responsive';
      state.zoom = 1;
    } else {
      deviceFrame.classList.remove('responsive');
      deviceFrame.setAttribute('data-chrome', chromeKey);
      deviceFrame.setAttribute('data-platform-hint', device.platform || 'none');
      screenWrap.style.top = bezel.top + 'px';
      screenWrap.style.left = bezel.left + 'px';
      screenWrap.style.width = width + 'px';
      screenWrap.style.height = height + 'px';
      deviceLabel.textContent = `${device.name} - ${width} x ${height}`;

      if (state.autoFit) {
        state.zoom = computeFitZoom();
      }

      const frameW = width + bezel.left + bezel.right;
      const frameH = height + bezel.top + bezel.bottom;

      // The inner frame keeps its true (unscaled) size and is visually
      // scaled with transform-origin: top left. The outer wrapper is sized
      // to the resulting on-screen footprint, so the viewport's scrollable
      // area always matches what's actually visible — no phantom scroll
      // space from the unscaled layout box.
      deviceFrame.style.width = frameW + 'px';
      deviceFrame.style.height = frameH + 'px';
      deviceFrame.style.transform = `scale(${state.zoom})`;
      deviceFrameOuter.style.width = (frameW * state.zoom) + 'px';
      deviceFrameOuter.style.height = (frameH * state.zoom) + 'px';
    }

    zoomLabel.textContent = Math.round(state.zoom * 100) + '%';
    rotateBtn.disabled = !device.width;
    fitBtn.classList.toggle('active', state.autoFit && !!device.width);
  }

  function normalizeUrl(raw) {
    let url = raw.trim();
    if (!url) return '';
    if (!/^https?:\/\//i.test(url)) {
      url = 'http://' + url;
    }
    return url;
  }

  function loadUrl(raw) {
    const url = normalizeUrl(raw);
    if (!url) {
      // No URL — show wallpaper, hide iframe completely
      previewFrame.style.display = 'none';
      previewFrame.src = 'about:blank';
      if (wallpaper) wallpaper.style.display = 'flex';
      urlInput.value = '';
      state.url = '';
      saveState();
      return;
    }
    state.url = url;
    urlInput.value = url;
    // Hide wallpaper, show iframe
    if (wallpaper) wallpaper.style.display = 'none';
    previewFrame.style.display = 'block';
    previewFrame.src = url;
    saveState();
  }

  goBtn.addEventListener('click', () => loadUrl(urlInput.value));

  // If the page genuinely fails to load (e.g. dev server isn't running),
  // fall back to the wallpaper instead of leaving a dead blank iframe.
  previewFrame.addEventListener('error', () => {
    loadUrl('');
  });

  urlInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      loadUrl(urlInput.value);
    }
  });

  refreshBtn.addEventListener('click', () => {
    if (!state.url) return;
    const current = previewFrame.src;
    previewFrame.style.display = 'block';
    previewFrame.src = 'about:blank';
    requestAnimationFrame(() => { previewFrame.src = current; });
  });

  deviceSelect.addEventListener('change', () => {
    state.deviceIndex = Number(deviceSelect.value);
    state.rotated = false;
    state.autoFit = true;
    applyDevice();
    saveState();
  });

  favBtn.addEventListener('click', () => {
    const device = DEVICES[state.deviceIndex];
    const idx = state.favorites.indexOf(device.name);
    if (idx === -1) {
      state.favorites.push(device.name);
    } else {
      state.favorites.splice(idx, 1);
    }
    rebuildDeviceOptions();
    deviceSelect.value = String(state.deviceIndex);
    applyDevice();
    saveState();
  });

  statusBarBtn.addEventListener('click', () => {
    const order = ['light', 'dark', 'off'];
    const next = order[(order.indexOf(state.statusBarMode) + 1) % order.length];
    state.statusBarMode = next;
    statusBarBtn.dataset.mode = next;
    applyDevice();
    saveState();
  });

  rotateBtn.addEventListener('click', () => {
    state.rotated = !state.rotated;
    if (state.autoFit) {
      applyDevice();
    } else {
      // Re-fit once on rotate even if the user previously set a manual
      // zoom, so the rotated frame doesn't immediately overflow.
      state.zoom = computeFitZoom();
      applyDevice();
    }
    saveState();
  });

  fitBtn.addEventListener('click', () => {
    state.autoFit = true;
    applyDevice();
    saveState();
  });

  zoomInBtn.addEventListener('click', () => {
    state.autoFit = false;
    state.zoom = clamp(Math.round((state.zoom + 0.1) * 10) / 10, MIN_ZOOM, MAX_ZOOM);
    applyDevice();
    saveState();
  });

  zoomOutBtn.addEventListener('click', () => {
    state.autoFit = false;
    state.zoom = clamp(Math.round((state.zoom - 0.1) * 10) / 10, MIN_ZOOM, MAX_ZOOM);
    applyDevice();
    saveState();
  });

  // Re-fit automatically whenever the panel is resized (only while
  // auto-fit is enabled), so the device frame never gets clipped.
  let resizeFrame = null;
  const resizeObserver = new ResizeObserver(() => {
    if (resizeFrame) return;
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = null;
      if (state.autoFit) {
        applyDevice();
      }
    });
  });
  resizeObserver.observe(viewport);

  // Live clock for the status bar overlay and lock-screen wallpaper.
  function updateClock() {
    const now = new Date();
    const isAndroid = statusBar.dataset.platform === 'android' || statusBar.dataset.platform === 'samsung';
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    if (hours === 0) hours = 12;
    const timeStr = isAndroid ? `${hours}:${minutes} ${ampm}` : `${hours}:${minutes}`;
    statusTime.textContent = timeStr;
    lockTime.textContent = timeStr;
    // Lock screen date
    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    lockDate.textContent = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
  }
  setInterval(updateClock, 15000);
  updateClock();

  statusBarBtn.dataset.mode = state.statusBarMode;

  applyDevice();
  loadUrl(state.url); // shows wallpaper if url is empty, iframe if url is set
})();
