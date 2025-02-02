import { ControlAgent } from "./control.agent";

(async () => {
    const task = `
        Go to this url: https://example.com/
        When the page is loaded, find the dom selector of 'More information...' link.
        Once you found the link, click on it. 
        After clicking on the link take a screenshot.
        When all done call tool to close the browser
    `;

    const agent = new ControlAgent(task);
    await agent.run();

    console.log('Done')
})();