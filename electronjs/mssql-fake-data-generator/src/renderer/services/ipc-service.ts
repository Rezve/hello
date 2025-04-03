export class IPCService {
    static async fetchFileList(dirPath: any):Promise<string[]> {
      try {
        const files = await window.electronAPI.invoke('files:list', dirPath);
        return files;
      } catch (error) {
        console.error('IPC Error:', error);
        throw error;
      }
    }
  
    static listenForUpdates(callback: any) {
      window.electronAPI.on('update:status', (data: any) => callback(data));
    }
  
    static cleanup() {
      window.electronAPI.removeAllListeners('update:status');
    }
  }
