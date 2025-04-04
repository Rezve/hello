import { BrowserWindow } from "electron";
import { ipcMain } from 'electron';
import { DataGeneratorManager } from "./data-generator.manager";

function registerHandlers(mainWindow: BrowserWindow) {
  ipcMain.handle('config:db',  async (event, dbConfig) => DataGeneratorManager.setDBConfig(event, dbConfig))
}
  
export { registerHandlers }