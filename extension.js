const vscode = require('vscode');

/**
 * Generates a random nonce used for the webview Content-Security-Policy.
 */
function getNonce() {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

/**
 * Builds the HTML document shown inside the webview panel.
 */
function getWebviewContent(webview, styleUri, scriptUri) {
  const nonce = getNonce();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta
    http-equiv="Content-Security-Policy"
    content="default-src 'none';
             style-src ${webview.cspSource} 'unsafe-inline';
             script-src 'nonce-${nonce}';
             frame-src http: https:;
             img-src ${webview.cspSource} https: data:;"
  />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="${styleUri}" rel="stylesheet" />
  <title>Mobile Viewer</title>
</head>
<body>
  <div class="toolbar">
    <input id="urlInput" type="text" placeholder="http://localhost:3000" spellcheck="false" autocomplete="off" />
    <button id="goBtn" title="Load URL">Go</button>
    <button id="refreshBtn" title="Reload page">&#10227;</button>

    <select id="deviceSelect" title="Device"></select>
    <button id="favBtn" title="Favorite this device">&#9734;</button>

    <button id="rotateBtn" title="Rotate device">&#9100;</button>
    <button id="fitBtn" title="Fit to screen">&#9974; Fit</button>
    <button id="statusBarBtn" title="Status bar: click to cycle Light / Dark / Off">&#9637;</button>

    <button id="zoomOutBtn" title="Zoom out">&minus;</button>
    <span id="zoomLabel">100%</span>
    <button id="zoomInBtn" title="Zoom in">+</button>
  </div>

  <div class="viewport" id="viewport">
    <div class="device-frame-outer" id="deviceFrameOuter">
      <div class="device-frame" id="deviceFrame">
        <div class="device-label" id="deviceLabel"></div>

        <div class="side-button side-button--power"></div>
        <div class="side-button side-button--volume-up"></div>
        <div class="side-button side-button--volume-down"></div>

        <div class="chrome chrome-camera-dot" data-chrome-el="camera-dot"></div>
        <div class="chrome chrome-top-speaker" data-chrome-el="top-speaker"></div>
        <div class="chrome chrome-home-button" data-chrome-el="home-button"></div>
        <div class="chrome chrome-speaker" data-chrome-el="speaker"></div>

        <div class="screen-wrap" id="screenWrap">
          <div class="wallpaper" id="wallpaper">
            <div class="wallpaper-glow"></div>
            <div class="wallpaper-glow-2"></div>
            <div class="lock-clock">
              <div class="lock-date" id="lockDate">Wednesday, June 15</div>
              <div class="lock-time" id="lockTime">9:41</div>
            </div>
            <div class="lock-hint">Enter a URL above and press Go</div>
          </div>

          <iframe id="previewFrame" title="Mobile preview" src="about:blank"></iframe>

          <div class="status-bar" id="statusBar">
            <div class="status-time" id="statusTime">9:41</div>
            <div class="status-icons">
              <svg class="status-icon" viewBox="0 0 18 12" fill="currentColor" aria-hidden="true">
                <rect x="0" y="8" width="3" height="4" rx="1"/>
                <rect x="5" y="5" width="3" height="7" rx="1"/>
                <rect x="10" y="2" width="3" height="10" rx="1"/>
                <rect x="15" y="0" width="3" height="12" rx="1"/>
              </svg>
              <svg class="status-icon" viewBox="0 0 16 12" fill="currentColor" aria-hidden="true">
                <circle cx="8" cy="10.5" r="1.4"/>
                <path d="M4.8 7.6a4.6 4.6 0 0 1 6.4 0L9.8 9a2.6 2.6 0 0 0-3.6 0z"/>
                <path d="M2 4.8a8.5 8.5 0 0 1 12 0L12.6 6.2a6.5 6.5 0 0 0-9.2 0z"/>
              </svg>
              <svg class="status-icon status-icon--battery" viewBox="0 0 24 12" aria-hidden="true">
                <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" fill="none" stroke="currentColor"/>
                <rect x="22.5" y="4" width="1.5" height="4" rx="1" fill="currentColor"/>
                <rect x="2" y="2" width="17" height="8" rx="1" fill="currentColor"/>
              </svg>
            </div>
          </div>

          <div class="chrome chrome-notch" data-chrome-el="notch"></div>
          <div class="chrome chrome-island" data-chrome-el="island"></div>
          <div class="chrome chrome-punch-hole" data-chrome-el="punch-hole"></div>
          <div class="chrome chrome-gesture-bar" data-chrome-el="gesture-bar"></div>
        </div>
      </div>
    </div>
  </div>

  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
}

function activate(context) {
  /** @type {vscode.WebviewPanel | undefined} */
  let currentPanel;

  const disposable = vscode.commands.registerCommand('mobileViewer.open', () => {
    if (currentPanel) {
      currentPanel.reveal(vscode.ViewColumn.Beside);
      return;
    }

    currentPanel = vscode.window.createWebviewPanel(
      'mobileViewer',
      'Mobile Viewer',
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')]
      }
    );

    const styleUri = currentPanel.webview.asWebviewUri(
      vscode.Uri.joinPath(context.extensionUri, 'media', 'style.css')
    );
    const scriptUri = currentPanel.webview.asWebviewUri(
      vscode.Uri.joinPath(context.extensionUri, 'media', 'main.js')
    );

    currentPanel.webview.html = getWebviewContent(currentPanel.webview, styleUri, scriptUri);

    currentPanel.onDidDispose(
      () => {
        currentPanel = undefined;
      },
      null,
      context.subscriptions
    );
  });

  context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
