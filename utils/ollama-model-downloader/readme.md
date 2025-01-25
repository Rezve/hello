# Ollama Pull Hack Script

This script is designed to address an issue (ONLY in one of my computer) with the `ollama pull <model-name>` command where the download progress unexpectedly moves backward. When the image starts downloading, it can sometimes revert, causing delays.

### Issue:
When running `ollama pull <model-name>`, the download begins, but after a while, it moves backward. To resolve this, manually interrupting the process with `Ctrl+C` and restarting seems to continue the download from where it left off.

### Solution:
This script automates the workaround by simulating a `Ctrl+C` after 1 minute of running the `ollama pull` command. It ensures the download continues from the point where it left off, preventing any backward progress.

### How to Use:
1. Clone the repository or download the script.
2. Change the model name
3. Run the script:  
   `node download.js`
4. The script will initiate the download and automatically simulate `Ctrl+C` after 1 minute.
