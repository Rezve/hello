import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  invoke: (channel: string, data: any) => {
    const validChannels = [
      'config:db',
      'storage:retrieve-key',
      'storage:encrypt',
      'storage:decrypt',
      'storage:saveConfig',
      'storage:loadConfig'
    ];

    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, data);
    }
    throw new Error(`Invalid channel: ${channel}`);
  },
  on: (channel: string, callback: any) => {
    const validChannels = ['update:status'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  },
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  },
});