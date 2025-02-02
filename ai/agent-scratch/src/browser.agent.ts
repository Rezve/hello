import { generateText, tool } from "ai";
import { LLM } from "./llm";
import { z } from "zod";
import puppeteer from "puppeteer";
import { createOllama } from "ollama-ai-provider";

/**
 * This agent is responsible for exposing browser-related tools to the LLM model.
 */
export class BrowserAgent extends LLM {
    private page: any;
    private browser: any;
    private modelName;

    constructor(model: string, system: string) {
        super(model, system);
        this.modelName = model;
        this.setTools(this.getTools());
    }

    getTools() {
        return {
            // tool to load page using puppeteer
            loadPageAndGetHTMLContent: tool({
                description: 'Get the content of the URL and also load the page using puppeteer js headless browser',
                parameters: z.object({
                    url: z.string().describe('URL'),
                }),
                execute: async ({ url }) => {
                    console.log("🚀 loadPageAndGetHTMLContent:", url);

                    this.browser = await puppeteer.launch({ headless: 'shell' });
                    this.page = await this.browser.newPage();

                    try {
                        await this.page.goto(url, { waitUntil: 'networkidle2' });
                        const htmlContent = await this.page.content();
                        return htmlContent;
                    } catch (error) {
                        console.error('Error fetching HTML content:', error);
                        throw error;
                    } finally {
                        // await browser.close();
                    }
                }
            }),

            // take screenshot
            screenshot: tool({
                description: 'Take a screenshot of the page',
                parameters: z.object({
                    url: z.string(),
                }),
                execute: async () => {
                    console.log("🚀 Taking screenshot")
                    await this.page.screenshot({ path: `screenshot_${new Date().getTime()}.png` });
                }
            }),

            // I thought the LLM would use this, but I never saw it get called.
            isPageLoaded: tool({
                description: 'Use this to determine if the page is loaded or not. This function will return true if page is loaded. Or false.',
                parameters: z.object({}),
                execute: async () => {
                    console.log("🚀 isPageLoaded:", this.page ? true : false)
                    return this.page ? true : false;
                }
            }),

            // click on the dom
            click: tool({
                description: 'If page is loaded, use this tool to click in page',
                parameters: z.object({
                    selector: z.string().describe('DOM selector'),
                }),
                execute: async ({ selector }) => {
                    console.log("🚀 click selector:", selector)
                    await this.page.click(selector)
                    await this.page.screenshot({ path: `after_click_${new Date().getTime()}.png` });
                    return;
                }
            }),

            // Created a fancy fresh LLM instance just to get the selector from HTML.  
            // This guy has never been called—just sitting here as garbage.
            getSelector: tool({
                description: 'You have html content and know what the user is looking for. Find those sections from the dom using from this function',
                parameters: z.object({
                    userLookingFor: z.string().describe('The UI element user is looking for, user intent'),
                    htmlContent: z.string().describe('full html content'),
                }),
                execute: async ({ userLookingFor, htmlContent }) => {
                    console.log('🚀 getSelector: ', userLookingFor, htmlContent.length)
                    const ollama = createOllama({
                        baseURL: process.env.OLLAMA_BASE_URL,
                    });
                    const result = await generateText({
                        model: ollama(this.modelName),
                        messages: [
                            {
                                role: 'user', content: `
                                User is looking for this: ${userLookingFor}
                                from this HTML content: ${htmlContent}
                            ` }
                        ],
                        system: `this.system`
                    })

                    return result;
                }
            }),

            // This guy actually works! But I also have a check at the upper level.  
            // Otherwise, the process continues to run.
            close: tool({
                description: 'Close the browser',
                parameters: z.object({}),
                execute: async () => {
                    try {
                        this.browser.close();
                    } catch (error) {
                        console.log('Failed to close browser' + error.message)
                    }
                }
            })
        }
    }

    // Manual closing, can't rely on LLM yet.
    async close() {
        await this.browser.close();
    }
}