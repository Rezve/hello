export interface ElectronAPI {
  getNodeVersion: () => string;
  readFile: (filePath: string) => Promise<string>;
  sendMessage: (channel: string, data: any) => void;
  onMessage: (channel: string, callback: (data: any) => void) => void;
  
  invoke: (channel: string, data: any) => Promise<string[]>;
  on: (channel: string, callback: (data: any) => void) => void;
  removeAllListeners: (channel: string) => void;
}

export {};
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}