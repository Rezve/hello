import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

function createWindow(): void {
  const win: BrowserWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: false, // Disable direct Node.js access in renderer
      contextIsolation: true, // Enable context isolation for security
      preload: path.join(__dirname, 'preload.js'), // Path to compiled preload script
    },
  });

  const htmlPath = path.join(__dirname, '../index.html');
  console.log('Loading HTML from:', htmlPath);
  win.loadFile(htmlPath).catch((err) => {
    console.error('Failed to load HTML:', err);
  });

  // Example IPC handler in main process
  ipcMain.on('message-from-renderer', (event, data) => {
    console.log('Message from renderer:', data);
    event.reply('message-from-main', 'Hello from main process!');
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});