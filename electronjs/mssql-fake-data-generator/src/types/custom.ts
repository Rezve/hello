import { BatchConfig } from "../renderer/components/BatchConfig";

export interface ElectronAPI {
  getNodeVersion: () => string;
  readFile: (filePath: string) => Promise<string>;
  sendMessage: (channel: string, data: any) => void;
  onMessage: (channel: string, callback: (data: any) => void) => void;
  
  invoke: (channel: string, data: any) => Promise<string[]>;
  on: (channel: string, callback: (data: any) => void) => void;
  removeAllListeners: (channel: string) => void;
  start: (channel: string, batchConfig: BatchConfig) => void;
  stop: (channel: string) => void;
  send: (channel: string, data?: any) => void;
  // minimize: () => void;
  // maximize: () => void;
  // close: () => void;
}

export {};
declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
import 'react';

declare module 'react' {
  interface CSSProperties {
    webkitAppRegion?: 'drag' | 'no-drag';
  }
}