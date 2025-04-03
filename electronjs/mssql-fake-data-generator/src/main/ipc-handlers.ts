import { BrowserWindow } from "electron";
const fs = require('fs').promises;
import { ipcMain } from 'electron';

function registerHandlers(mainWindow: BrowserWindow) {
    ipcMain.handle('files:list', async (event, dirPath) => {
      try {
        const dir = dirPath || __dirname;
        const files = await fs.readdir(dir);
        return files;
      } catch (error: any) {
        throw new Error(`Failed to read directory: ${error.message}`);
      }
  });
}
  
export { registerHandlers }