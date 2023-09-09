const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const iconPath = path.join(__dirname, 'dist/TradeFix/assets/icons/win/repairing.ico');
  const iconDataUrl = `data:image/png;base64,${fs.readFileSync(iconPath).toString('base64')}`;

  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    backgroundColor: '#ffffff',
    icon: iconDataUrl,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile(path.join(__dirname, 'dist/TradeFix/index.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.commandLine.appendSwitch('js-flags', '--max-old-space-size=4096');