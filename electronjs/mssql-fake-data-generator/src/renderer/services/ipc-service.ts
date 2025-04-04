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
      // find existing key for encryption
      let key = await window.electronAPI.invoke('storage:retrieve-key', 'encryptionKey');

      // if not found generate one
      if (!key) {
        key = await window.electronAPI.invoke('storage:store-key', 'encryptionKey');
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
      const config = await window.electronAPI.invoke('storage:loadConfig', '') as any

      if (config?.encryptedPassword) {
        let key = await window.electronAPI.invoke('storage:retrieve-key', 'encryptionKey');
        config.password = await window.electronAPI.invoke('storage:decrypt', { encryptedText: config?.encryptedPassword?.encryptedData, key, iv: config?.encryptedPassword?.iv })
        delete config.encryptedPassword;
      }

      console.log("===============config:========", config)
      return config;
    }

    static async getSavedDBConfig() {

    }
  }
