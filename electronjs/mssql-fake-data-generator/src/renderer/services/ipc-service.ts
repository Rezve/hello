import { BatchConfig } from "../components/BatchConfig";

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

    static async saveDBConfig(config: any) {
      // find existing key for encryption,  if not found it will generate one
      let key = await window.electronAPI.invoke('storage:retrieve-key', 'encryptionKey');
      if (!key) {
        throw new Error('Error: Unable to create encryptionKey')
      }

      // use it to encrypt password
      if (config.password) {
        config.encryptedPassword = await window.electronAPI.invoke('storage:encrypt', { text: config.password, key })
        delete config.password;
      }

      // store config with encrypted password
      return await window.electronAPI.invoke('storage:saveConfig', config)
    }

    static async loadConfig() {
      // TODO: combine all IPC call into one
      const config = await window.electronAPI.invoke('storage:loadConfig', '') as any

      if (config?.encryptedPassword) {
        let key = await window.electronAPI.invoke('storage:retrieve-key', 'encryptionKey');
        config.password = await window.electronAPI.invoke('storage:decrypt', { encryptedText: config?.encryptedPassword?.encryptedData, key, iv: config?.encryptedPassword?.iv })
        delete config.encryptedPassword;
      }
      return config;
    }

    static start(batchConfig: BatchConfig) {
      window.electronAPI.start('app:start', batchConfig);
    }

    static stop() {
      window.electronAPI.stop('app:stop');
    }
  }
