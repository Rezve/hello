import { BrowserWindow } from "electron";
import { ipcMain } from 'electron';
import { DataGeneratorManager } from "./data-generator.manager";
import { getKey, storeKey } from "./setup-keychain";
import { decrypt, encrypt } from "./crypto";
import { loadConfig, saveConfig } from "../utils/storage";

function registerHandlers(mainWindow: BrowserWindow) {
  ipcMain.handle('config:db',  async (event, dbConfig) => DataGeneratorManager.setDBConfig(event, dbConfig))

  ipcMain.handle('storage:retrieve-key', async (event, account) => {
    console.log("🚀 ~ ipcMain.handle ~ storage:retrieve-key:", account)
    return await getKey(account);
  });

  ipcMain.handle('storage:encrypt', async (event, { text, key }) => {
    console.log("🚀 ~ ipcMain.handle ~ storage:encrypt:", text, key)
    return await encrypt(text, key);
  });

  ipcMain.handle('storage:decrypt', async (event, { encryptedText, key, iv }) => {
    console.log("🚀 ~ ipcMain.handle ~ storage:decrypt:", encryptedText, key, iv)
    return await decrypt(encryptedText, key, iv);
  });

  ipcMain.handle('storage:saveConfig', async (event, config) => {
    console.log("🚀 ~ ipcMain.handle ~ storage:saveConfig:", config)
    return await saveConfig(config);
  });

  ipcMain.handle('storage:loadConfig', async (event) => {
    console.log("🚀 ~ ipcMain.handle ~ storage:loadConfig:")
    return await loadConfig();
  });
}

export { registerHandlers }