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
    When all done, close the browser
    ```

2. **Expected Output:**
    - **Files generated:**
      - `screenshot_1738522333088.png` (screenshot taken after the page loads)

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

### **Logs:**

```bash
🚀 Task lists:  [
  {
    task: 'Open a web browser and navigate to https://example.com/',
    details: ''
  },
  {
    task: 'Find the DOM selector of the element with text content "More information...".',
    details: ''
  },
  { task: 'Click on the element found in step 2.', details: '' },
  {
    task: 'Take a screenshot of the page after clicking on the element.',
    details: ''
  },
  { task: 'Close the web browser.', details: '' }
]
Executing task:  {
  task: 'Open a web browser and navigate to https://example.com/',
  details: ''
}
🚀 loadPageAndGetHTMLContent: https://example.com/
Task Response:  
Executing task:  {
  task: 'Find the DOM selector of the element with text content "More information...".',
  details: ''
}
Task Response:  <tool_call>
{"id": 0, "name": "getSelector", "arguments": {"userLookingFor": "More information...", "htmlContent": "<!DOCTYPE html><html><head>\n    <title>Example Domain</title>\n\n    <meta charset=\"utf-8\">\n    <meta http-equiv=\"Content-type\" content=\"text/html; charset=utf-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n    <style type=\"text/css\">\n    body {\n        background-color: #f0f0f2;\n        margin: 0;\n        padding: 0;\n        font-family: -apple-system, system-ui, BlinkMacSystemFont, \"Segoe UI\", \"Open Sans\", \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  


    \n    div {\n        width: 600px;\n        margin: 5em auto;\n        padding: 2em;\n        background-color: #fdfdff;\n        border-radius: 0.5em;\n        box-shadow: 2px 3px 7px 2px rgba(0,0,0,0.02);\n    }\n    a:link, a:visited {\n        color: #38488f;\n        text-decoration: none;\n    }\n    
@media (max-width: 700px) {\n        div {\n            margin: 0 auto;\n            width: auto;\n        }\n    }\n    </style>    </head>\n\n<body>\n<div@media (max-width: 700px) {\n        div {\n            margin: 0 auto;\n            width: auto;\n        }\n    }\n    </style>    </head>\n\n<body>\n<div>\n    <h1>Example Domain</h1>\n    <p>This domain is for use in illustrative examples in documents. You may use this\n    domain in literature without prior coordination or asking for permission.</p>\n    <p><a href=\"https://www.iana.org/domains/example\">More information...</a></p>\n</div>\n\n</body></html>"}}
</tool_call>
Executing task:  { task: 'Click on the element found in step 2.', details: '' }
🚀 click selector: a[href='https://www.iana.org/domains/example']
Task Response:
Executing task:  {
  task: 'Take a screenshot of the page after clicking on the element.',
  details: ''
}
🚀 Taking screenshot
Task Response:
Executing task:  { task: 'Close the web browser.', details: '' }
🚀 error: Invalid JSON response
                task: Close the web browser.
                optional details:

Task Response:  undefined
Done
```

