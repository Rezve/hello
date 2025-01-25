const { spawn } = require('child_process');

const modelName = 'llama3-groq-tool-use';

function executeCommand() {
  console.log(`Starting 'ollama pull ${modelName}'...`);

  const process = spawn('ollama', ['pull', modelName], { stdio: 'inherit' });

  // Set a timeout to stop the command after 30 seconds
  const timeout = setTimeout(() => {
    console.log('Stopping the current process...');
    process.kill('SIGINT');
  }, 1 * 60 * 1000);
 
  // Restart the process after it stops
  process.on('close', (code, signal) => {
    clearTimeout(timeout);
    if (signal) {
      setTimeout(executeCommand, 1000);
    } else {
      if (code == 0) {
        console.log("Download completed");
      }
    }
  });

  // Handle errors
  process.on('error', (err) => {
    clearTimeout(timeout);
    console.error('Failed to start the process:', err);
    setTimeout(executeCommand, 5000);
  });
}

// Start the execution loop
executeCommand();

// node download.js