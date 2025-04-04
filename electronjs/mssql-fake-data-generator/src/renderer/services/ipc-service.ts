export class IPCService {  
    static listenForUpdates(callback: any) {
      window.electronAPI.on('update:status', (data: any) => callback(data));
    }
  
    static cleanup() {
      window.electronAPI.removeAllListeners('update:status');
    }

    static async setDBConfig(config: any) {
      try {
        return await window.electronAPI.invoke('config:db', config)
      } catch (error) {
        console.error('IPC Error:', error);
      }
    }
  }
