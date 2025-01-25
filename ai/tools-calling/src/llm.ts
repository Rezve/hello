import { createOllama, OllamaProvider } from 'ollama-ai-provider';
import { CoreMessage, generateText, streamText, tool } from 'ai';
import { z } from 'zod';
import { evaluate } from 'mathjs'

const CalculatorInputSchema = z.object({
    expr: z.string().describe('mathematical expression to evaluate')
  })
type CalculatorInput = z.infer<typeof CalculatorInputSchema>

/**
 * Class to interact with LLM models
 */
export class LLM {
    private ollama: OllamaProvider;
    private messages: CoreMessage[] = [];

    constructor() {
        this.ollama = createOllama({
            baseURL: process.env.OLLAMA_BASE_URL,
        });
    }

    /**
     * Get stream based answer
     * 
     * @param userInput 
     * @param chunkHandler 
     */
    async getAnswerStream(userInput: string, chunkHandler: (delta: string) => void) {
        this.messages.push({ role: 'user', content: userInput });

        const result = streamText({
                system: `
                    You are a helpful assistant with access to the following tools:

                    1. "greet": Use this tool only to greet the user by name when they explicitly provide their name or ask you to greet them by name. For example: "Say hello to John" or "Greet me as Alice".
                    2. "USDtoBDT": Use this tool only to convert amounts from USD to BDT. The query must explicitly mention conversion from USD to BDT, like "Convert 10 USD to BDT" or "How much is 15 dollars in BDT?".
                    3. "calculator": Use this tool only for evaluating mathematical expressions or calculations. These include arithmetic operations, unit conversions, and trigonometric functions. Example queries: "What is 5 + 3?", "Convert 12 cm to inches", or "What is sin(45)?".

                    If a query doesn't match the description of any of these tools, respond using your general knowledge without invoking a tool. Only call a tool if the query is clearly and directly related to its purpose.
                `,

                model: this.ollama('llama3-groq-tool-use'),
                messages: this.messages,
                toolChoice: 'auto',
                tools: {
                    greet: tool({
                        description: 'Greets the user by their name. Use this tool only when the user explicitly asks to be greeted or mentions their name. For example, "Greet me as John" or "Say hello to Alice."',
                        parameters: z.object({
                            name: z.string().describe('name of the user'),
                        }),
                        execute: async ({ name }) => {
                            console.log("🚀TOOL: greet:", name)
                            return `Hi ${name}! nice to meet you`
                        },
                    }),
                    USDtoBDT: tool({
                        description: 'Converts a specified amount in USD to BDT. Use this tool only when the user explicitly asks to convert an amount from USD to BDT. Example: "Convert 10 USD to BDT" or "How much is 20 dollars in BDT?"',
                        parameters: z.object({
                            usd: z.string().describe('amount of USD provided by the user')
                        }),
                        execute: async({ usd }) => {
                            console.log("🚀TOOL: USDtoBDT: ", usd)
                            return ( parseInt(usd) * 121)
                        }
                    }),
                    calculator: tool({
                        description: 'Evaluates mathematical expressions and handles basic calculations like addition, subtraction, multiplication, division, and trigonometric functions (e.g., sin, cos). Also performs unit conversions (e.g., cm to inches). Use this tool only for precise mathematical queries or conversions. Example: "What is 12 + 8?", "Convert 15 cm to inches", or "Calculate sin(30 degrees)."',
                        parameters: CalculatorInputSchema ,
                        execute: async (input: CalculatorInput) => {
                            const result: number = evaluate(input.expr)
                            console.log("🚀TOOL: calculator:", input.expr, JSON.stringify(result))
                            return result
                        }
                    })
                },
                maxSteps: 2
            })

        await this.processStreamResponse(result, chunkHandler);
    }

    /**
     * Process the stream response
     * 
     * @param result 
     * @param chunkHandler 
     */
    private async processStreamResponse(result: any, chunkHandler: (delta: string) => void) {
        let fullResponse = '';
        for await (const delta of result.textStream) {
            fullResponse += delta;
            chunkHandler(delta)
        }

        this.messages.push({ role: 'assistant', content: fullResponse });
    }

    /**
     * Get synchronous message
     * 
     * @param userInput 
     * @returns 
     */
    async getAnswerSequence(userInput: string) {

        this.messages.push({ role: 'user', content: userInput });

        const CalculatorInputSchema = z.object({
            expr: z.string().describe('mathematical expression to evaluate')
          })
        type CalculatorInput = z.infer<typeof CalculatorInputSchema>

        try {
            const result = await generateText({
                system: `
                    You are a helpful assistant with access to the following tools:

                    1. "greet": Use this tool only to greet the user by name when they explicitly provide their name or ask you to greet them by name. For example: "Say hello to John" or "Greet me as Alice".
                    2. "USDtoBDT": Use this tool only to convert amounts from USD to BDT. The query must explicitly mention conversion from USD to BDT, like "Convert 10 USD to BDT" or "How much is 15 dollars in BDT?".
                    3. "calculator": Use this tool only for evaluating mathematical expressions or calculations. These include arithmetic operations, unit conversions, and trigonometric functions. Example queries: "What is 5 + 3?", "Convert 12 cm to inches", or "What is sin(45)?".

                    If a query doesn't match the description of any of these tools, respond using your general knowledge without invoking a tool. Only call a tool if the query is clearly and directly related to its purpose.
                `,

                model: this.ollama('llama3-groq-tool-use'),
                messages: this.messages,
                toolChoice: 'auto',
                tools: {
                    greet: tool({
                        description: 'Greets the user by their name. Use this tool only when the user explicitly asks to be greeted or mentions their name. For example, "Greet me as John" or "Say hello to Alice."',
                        parameters: z.object({
                            name: z.string().describe('name of the user'),
                        }),
                        execute: async ({ name }) => {
                            console.log("🚀TOOL: greet:", name)
                            return `Hi ${name}! nice to meet you`
                        },
                    }),
                    USDtoBDT: tool({
                        description: 'Converts a specified amount in USD to BDT. Use this tool only when the user explicitly asks to convert an amount from USD to BDT. Example: "Convert 10 USD to BDT" or "How much is 20 dollars in BDT?"',
                        parameters: z.object({
                            usd: z.string().describe('amount of USD provided by the user')
                        }),
                        execute: async({ usd }) => {
                            console.log("🚀TOOL: USDtoBDT: ", usd)
                            return ( parseInt(usd) * 121)
                        }
                    }),
                    calculator: tool({
                        description: 'Evaluates mathematical expressions and handles basic calculations like addition, subtraction, multiplication, division, and trigonometric functions (e.g., sin, cos). Also performs unit conversions (e.g., cm to inches). Use this tool only for precise mathematical queries or conversions. Example: "What is 12 + 8?", "Convert 15 cm to inches", or "Calculate sin(30 degrees)."',
                        parameters: CalculatorInputSchema ,
                        execute: async (input: CalculatorInput) => {
                            const result: number = evaluate(input.expr)
                            console.log("🚀TOOL: calculator:", input.expr, JSON.stringify(result))
                            return result
                        }
                    })
                },
                maxSteps: 2
            })

            const toolResult = result.response.messages.find(m => m.role == 'tool')?.content.find(c => c.type == 'tool-result')?.result;
            console.log("🚀Tool message:", toolResult);
            
            this.messages.push({ role: 'assistant', content: result.text });
            return result.text;

        } catch (error) {
           return `It seems like you're asking for something outside the scope of my available tools. Let me know how I can assist you with these!`         
        }
    }
}