import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { registerHandlers } from './ipc-handlers';

function createWindow(): void {
  const mainWindow: BrowserWindow = new BrowserWindow({
    show: false,
    backgroundColor: '#f3f4f6',
    webPreferences: {
      nodeIntegration: false, // Disable direct Node.js access in renderer
      contextIsolation: true, // Enable context isolation for security
      preload: path.join(__dirname, 'preload.js'), // Path to compiled preload script
    },
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.maximize();
    mainWindow.show();
  });

  registerHandlers(mainWindow);

  const htmlPath = path.join(__dirname, '../index.html');
  console.log('Loading HTML from:', htmlPath);
  mainWindow.loadFile(htmlPath).catch((err) => {
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