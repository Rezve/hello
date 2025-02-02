# Hello AI Agent

This is an experimental AI agent that can visit a web page, interact with UI elements based on user instructions, and capture screenshots as proof of task completion.

### **Features:**
- Visit a given URL.
- Locate and interact with specific UI elements (e.g., clicking a link).
- Take screenshots after performing actions.
- Automatically close the browser after completing the task.

---

### **Overview:**

The system consists of two agents:

1. **ControlAgent:** This agent takes user input and converts it into a list of tasks. It organizes the actions in a structured way to be executed sequentially.

2. **BrowserAgent:** This agent is responsible for executing the tasks one by one. It keeps the browser page open and shared between instructions, enabling multiple operations to be performed in sequence. At the end of the task list, it automatically closes the browser.

### **Example Usage:**

1. **User input:**

    ```
    Go to this url: https://example.com/
    When the page is loaded, find the dom selector of 'More information...' link.
    Once you found the link, click on it. 
    After clicking on the link take a screenshot.
    When all done call tool to close the browser
    ```

2. **Expected Output:**
    - **Files generated:**
      - `screenshot_1738522333088.png` (screenshot taken after the page loads)
      - `after_click_1738522326511.png` (screenshot taken after clicking the link)

---

### **Installation & Setup:**

1. Clone the repository:
    ```bash
    git clone <repo-url>
    cd <project-directory>
    ```

2. Install dependencies:
    ```bash
    yarn install
    ```

3. Start the agent:
    ```bash
    yarn start
    ```

---

### **How It Works:**
- The agent takes user input in the form of instructions (e.g., visiting a URL, interacting with UI elements).
- It uses a headless browser (via Puppeteer) to visit the specified web page, interact with the DOM, and perform the necessary actions.
- The browser is closed after the task finishes.

