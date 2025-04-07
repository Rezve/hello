import React, { useState } from 'react';
import './styles/App.css';
import HomePage from './pages/HomePage';
import { NotificationProvider } from './components/notification/NotificationContext';

const App: React.FC = () => {
  return (
    <NotificationProvider>
      <div className="h-screen flex flex-col bg-gray-100">
        {/* Custom Title Bar */}
        <div
          className="flex items-center justify-between p-2 bg-gray-800 text-white"
          style={{ webkitAppRegion: 'drag' }}
        >
          <span className="text-sm font-medium">Feed My DB</span>
          <div className="flex flex-row space-x-1" style={{ webkitAppRegion: 'no-drag' }}>
            <button
              className="w-8 h-6 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-md transition-colors duration-200"
              onClick={() => window.electronAPI.send('window:minimize')}
            >
              −
            </button>
            <button
              className="w-8 h-6 flex items-center justify-center bg-gray-700 hover:bg-gray-600 rounded-md transition-colors duration-200"
              onClick={() => window.electronAPI.send('window:maximize')}
            >
              □
            </button>
            <button
              className="w-8 h-6 flex items-center justify-center bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200"
              onClick={() => window.electronAPI.send('window:close')}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-hidden">
          <HomePage />
        </div>

        {/* Optional Status Bar */}
        <div className="p-2 bg-gray-200 border-t border-gray-300 text-sm text-gray-600">
          Status: Ready
        </div>
      </div>
    </NotificationProvider>
  );
};

export default App;