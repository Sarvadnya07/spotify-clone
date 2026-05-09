const { contextBridge, ipcRenderer } = require('electron');

/**
 * Electron Preload Script
 * Safely exposes native APIs to the renderer process.
 */
contextBridge.exposeInMainWorld('electronAPI', {
  // Native Notifications
  sendNotification: (title, body) => ipcRenderer.send('notify', { title, body }),
  
  // Media Control Listeners (Global Hotkeys)
  onPlayPause: (callback) => {
    const listener = () => callback();
    ipcRenderer.on('media-play-pause', listener);
    return () => ipcRenderer.removeListener('media-play-pause', listener);
  },
  onNext: (callback) => {
    const listener = () => callback();
    ipcRenderer.on('media-next', listener);
    return () => ipcRenderer.removeListener('media-next', listener);
  },
  onPrev: (callback) => {
    const listener = () => callback();
    ipcRenderer.on('media-prev', listener);
    return () => ipcRenderer.removeListener('media-prev', listener);
  },
});
