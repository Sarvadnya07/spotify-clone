declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";
declare module "*.mp3";

interface ElectronApi {
  sendNotification: (title: string, body: string) => void;
  onPlayPause: (callback: () => void) => (() => void) | void;
  onNext: (callback: () => void) => (() => void) | void;
  onPrev: (callback: () => void) => (() => void) | void;
}

interface Window {
  electronAPI?: ElectronApi;
}
