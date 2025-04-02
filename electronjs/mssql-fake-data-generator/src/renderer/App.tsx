import React, { useEffect, useState } from 'react';
import './styles/App.css';

const App: React.FC = () => {
  const [nodeVersion, setNodeVersion] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Get Node.js version
    const version = window.electronAPI.getNodeVersion();
    setNodeVersion(version);

    // Example: Read a file (adjust path as needed)
    try {
      window.electronAPI.readFile('test.txt').then(setFileContent).catch((err) => {
        console.log("hi------", err);
        setFileContent(err)
      });
    } catch (err) {
      console.log("🚀 ~ useEffect ~ err:", err)
      setFileContent('Error reading file');
    }

    // Listen for IPC messages
    window.electronAPI.onMessage('message-from-main', (data) => {
      setMessage(data);
    });

    // Send a message to main process
    window.electronAPI.sendMessage('message-from-renderer', 'Hello from renderer!');
  }, []);

  return (
    <div>
      <h1>Welcome to My Electron + React + TypeScript App!</h1>
      <p>Node.js Version: {nodeVersion}</p>
      <p>File Content: {fileContent}</p>
      <p>Message from Main: {message}</p>
    </div>
  );
};

export default App;