const { app, BrowserWindow, shell, globalShortcut, ipcMain } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

/**
 * Spotify Clone - Electron Main Process
 * Handles native window management and OS-level integrations.
 */
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#000000',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'electron-preload.js'),
    },
    icon: path.join(__dirname, 'public/favicon.ico'),
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  // GLOBAL HOTKEYS REGISTRATION
  // These work even when the app is in the background
  app.whenReady().then(() => {
    globalShortcut.register('MediaPlayPause', () => {
      mainWindow.webContents.send('media-play-pause');
    });

    globalShortcut.register('MediaNextTrack', () => {
      mainWindow.webContents.send('media-next');
    });

    globalShortcut.register('MediaPreviousTrack', () => {
      mainWindow.webContents.send('media-prev');
    });
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('page-title-updated', (e) => e.preventDefault());
}

app.whenReady().then(createWindow);

app.on('will-quit', () => {
  // Unregister all shortcuts
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
