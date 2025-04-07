import { BrowserWindow } from "electron";
import { ipcMain } from 'electron';
import { DataGeneratorManager } from "./data-generator.manager";
import { getKey, storeKey } from "./setup-keychain";
import { decrypt, encrypt } from "./crypto";
import { loadConfig, saveConfig } from "./storage";

function registerHandlers(mainWindow: BrowserWindow) {
  ipcMain.handle('config:db',  async (event, dbConfig) => DataGeneratorManager.setDBConfig(event, dbConfig))

  ipcMain.handle('storage:retrieve-key', async (event, account) => {
    return await getKey(account);
  });

  ipcMain.handle('storage:encrypt', async (event, { text, key }) => {
    return await encrypt(text, key);
  });

  ipcMain.handle('storage:decrypt', async (event, { encryptedText, key, iv }) => {
    return await decrypt(encryptedText, key, iv);
  });

  ipcMain.handle('storage:saveConfig', async (event, config) => {
    return await saveConfig(config);
  });

  ipcMain.handle('storage:loadConfig', async (event) => {
    return await loadConfig();
  });

  ipcMain.on('app:start', (event, batchConfig) => {
    DataGeneratorManager.start(mainWindow, batchConfig);
  })

  ipcMain.on('app:stop', (event) => {
    DataGeneratorManager.stop(mainWindow);
  })

  ipcMain.on('app:code', (event, code) => {    
    DataGeneratorManager.setGeneratorFunction(mainWindow, code);
  })

  ipcMain.on('window:minimize', () => mainWindow.minimize());
  ipcMain.on('window:maximize', () => (mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()));
  ipcMain.on('window:close', () => mainWindow.close());
}

export { registerHandlers }