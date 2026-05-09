
/**
 * SocketService
 * Abstracted real-time event hub.
 * Designed to be a drop-in replacement for Socket.io.
 */

type SocketCallback = (data: any) => void;

class SocketService {
  private listeners: Record<string, SocketCallback[]> = {};
  private isConnected: boolean = false;

  constructor() {
    this.connect();
  }

  private connect() {
    // Simulate connection delay
    setTimeout(() => {
      this.isConnected = true;
      console.log('[SOCKET] Connected to Real-time Hub');
      this.startSimulation();
    }, 2000);
  }

  on(event: string, callback: SocketCallback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
    return () => this.off(event, callback);
  }

  off(event: string, callback: SocketCallback) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
  }

  emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  /**
   * Simulation Engine
   * Mimics production traffic from other users.
   */
  private startSimulation() {
    const friendNames = ['Alex', 'Sarah', 'Mike', 'Jordan', 'Elena'];
    const actions = ['PLAYING', 'JOINED', 'PAUSED'];

    setInterval(() => {
      if (!this.isConnected) return;
      
      const friend = friendNames[Math.floor(Math.random() * friendNames.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      
      this.emit('SOCIAL_UPDATE', {
        user: friend,
        action: action,
        timestamp: Date.now(),
        trackId: Math.floor(Math.random() * 5)
      });
    }, 15000); // New activity every 15s
  }
}

export const socketService = new SocketService();
