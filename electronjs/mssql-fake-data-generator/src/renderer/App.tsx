import React, { useState } from 'react';
import './styles/App.css';
import HomePage from './pages/HomePage';
import { IPCService } from './services/ipc-service';

const App: React.FC = () => {
  const [files, setFiles] = useState<string[]>([]);

  // Fetch file list on button click
  const handleFetchFiles = async () => {
    try {
      const fileList = await IPCService.fetchFileList(''); // Await IPC call
      setFiles(fileList);
    } catch (err) {
    }
  };

  return (
    <div>
      {files.map(f => <li>{f}</li>)}
      <button onClick={() => handleFetchFiles()}>Fetch</button>
      <HomePage />
    </div>
  );
};

export default App;