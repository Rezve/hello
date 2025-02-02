import { z } from "zod";
import { LLM } from "./llm";
import { BrowserAgent } from "./browser.agent";

/**
 * This agent takes user input and converts it into tasks  
 * so that other agents can perform the assigned tasks one by one.
 */
export class ControlAgent {
    private taskManager: LLM
    private browserAgent: BrowserAgent;

    constructor(private taskDetails: string) {
        // initialize and set the system message
        this.taskManager = new LLM('llama3.2', `
            You have ability to delegate task to other llm model. Your task will be
            converting user query into single task. Create instruction in a way
            so that LLM try to use tool 100% of time.
        `)

        // also setting the output schema
        this.taskManager.setSchema(z.object({
            task: z.string().describe('name of the task'),
            details: z.string().describe('Describe the task')
        }))

        // initialize the browser agent
        this.browserAgent = new BrowserAgent('llama3-groq-tool-use', `
            You have ability to load url and get html content, extract html content, get dom from users looking element, click on ui element using
            dom selector, you can take screenshot

            This is user query ${taskDetails}.
            You will be task one by one and perform the task using tool call.
        `)
    }

    async run() {
        // get the structured response from task manager { task: string; details: string }
        const response = await this.taskManager.getAnswerSequence(`
            Give me task from this user question: ${this.taskDetails}
        `);
        let structuredResponse = (await this.taskManager.transform(this.taskDetails, response))?.object as { task: string, details: string }[]
        console.log("🚀 Task lists: ", structuredResponse)

        // Execute all task using browser agent
        for (const step of structuredResponse) {
            console.log('Executing task: ', step);
            const taskResponse = await this.browserAgent.getAnswerSequence(`
                task: ${step.task}
                optional details: ${step.details}
            `);
            console.log('Task Response: ', taskResponse)
        }
        await this.browserAgent.close();
    }
}