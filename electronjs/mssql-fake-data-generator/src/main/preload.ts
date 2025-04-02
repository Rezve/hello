import { contextBridge, ipcRenderer } from 'electron';

// Expose a function to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Example: A function to get the current Node.js process version
  getNodeVersion: () => process.version,
  
  // Example: A custom Node.js function to read a file (requires 'fs')
  readFile: (filePath: string) => {
    const { readFile } = require('fs/promises')
    return readFile(filePath, 'utf8');
  },

  // Example: IPC to send/receive messages between main and renderer
  sendMessage: (channel: string, data: any) => {
    ipcRenderer.send(channel, data);
  },
  onMessage: (channel: string, callback: (data: any) => void) => {
    ipcRenderer.on(channel, (event, data) => callback(data));
  },
});