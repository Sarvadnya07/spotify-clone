const { contextBridge, ipcRenderer } = require('electron');

/**
 * Electron Preload Script
 * Safely exposes native APIs to the renderer process.
 */
contextBridge.exposeInMainWorld('electronAPI', {
  // Native Notifications
  sendNotification: (title, body) => ipcRenderer.send('notify', { title, body }),
  
  // Media Control Listeners (Global Hotkeys)
  onPlayPause: (callback) => ipcRenderer.on('media-play-pause', () => callback()),
  onNext: (callback) => ipcRenderer.on('media-next', () => callback()),
  onPrev: (callback) => ipcRenderer.on('media-prev', () => callback()),
});
