import { contextBridge, ipcRenderer } from 'electron';
import { BatchConfig } from '../renderer/components/BatchConfig';

contextBridge.exposeInMainWorld('electronAPI', {
  invoke: (channel: string, data: any) => {
    const validChannels = [
      'config:db',
      'storage:retrieve-key',
      'storage:encrypt',
      'storage:decrypt',
      'storage:saveConfig',
      'storage:loadConfig',
      'app:start'
    ];

    if (validChannels.includes(channel)) {
      return ipcRenderer.invoke(channel, data);
    }
    throw new Error(`Invalid channel: ${channel}`);
  },
  on: (channel: string, callback: any) => {
    const validChannels = [
      'app:progress',
      'app:complete'
    ];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => callback(...args));
    }
  },
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  },
  start: (channel: string, batchConfig: BatchConfig) => ipcRenderer.send(channel, batchConfig),
  stop: (channel: string) => ipcRenderer.send(channel),
  minimize: () => ipcRenderer.send('minimize-window'),
  maximize: () => ipcRenderer.send('maximize-window'),
  close: () => ipcRenderer.send('close-window'),
});