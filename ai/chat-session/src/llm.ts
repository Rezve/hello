import { createOllama, OllamaProvider } from 'ollama-ai-provider';
import { CoreMessage, generateText, streamText } from 'ai';

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
            model: this.ollama('llama3.2'),
            messages: this.messages,
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

        const result = await generateText({
            model: this.ollama('llama3.2'),
            messages: this.messages,
        })

        this.messages.push({ role: 'assistant', content: result.text });
        return result.text;
    }
}