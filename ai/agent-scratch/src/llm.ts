import { createOllama, OllamaProvider } from 'ollama-ai-provider';
import { CoreMessage, generateObject, generateText, streamText } from 'ai';

/**
 * Class to interact with LLM models
 */
export class LLM {
    private tools;
    private schema;
    private ollama: OllamaProvider;
    private messages: CoreMessage[] = [];

    constructor(private model: string, private system: string) {
        this.ollama = createOllama({
            baseURL: process.env.OLLAMA_BASE_URL,
        });
    }

    setTools(tools) {
        this.tools = tools;
        return this;
    }

    setSchema(schema) {
        this.schema = schema;
        return this;
    }

    /**
     * Get synchronous message
     * 
     * @param userInput 
     * @returns 
     */
    async getAnswerSequence(userInput: string) {
        try {
            this.messages.push({ role: 'user', content: userInput });

            const result = await generateText({
                model: this.ollama(this.model),
                messages: this.messages,
                system: this.system,
                tools: this.tools,
                maxSteps: 1
            })

            const toolResult = result.toolResults?.find(ts => ts.type ==='tool-result')?.result;

            this.messages.push({ role: 'assistant', content: toolResult || result.text });
            return result.text;
        } catch (error) {
            console.log("🚀 error:", error.message, userInput)
        }
        return;
    }

    // For some error, I created another LLM call just for transformation.  
    // This can be optimized.
    async transform(userInput: string, response: string) {
        const result = await generateObject({
            model: this.ollama(this.model),
            system: `Convert user input into structured response`,
            output: 'array',
            schema: this.schema,
            prompt: `Convert this question: ${userInput} asked by user and
                this is the answer by LLM: ${response}
                Now give me structured response
                `,
        })
        return result;
    }
}