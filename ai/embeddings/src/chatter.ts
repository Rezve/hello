import readline from 'readline';
import ollama from "ollama";
import { ChromaDB } from './chroma-db';


export class Chatter {
    private rl;
    private db: ChromaDB;

    constructor(chroma: ChromaDB) {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false
        });
        this.db = chroma;
        console.log('How can i help you (type "exit" to quit)');
    }

    ask() {
        this.rl.question('[You]: ', async (question) => {
            if (question.toLowerCase() === 'exit') {
                console.log('Exiting...');
                this.rl.close();
            } else {
              
                const answerStream = await this.answer(question);
                process.stdout.write(`[Machine]: `);
                for await (const chunk of answerStream) {
                    process.stdout.write(chunk.response)
                }
                console.log('\n');
                this.ask();
            }
        });
    }

    async answer(question: string) {
        const queryEmbed = (await ollama.embeddings({ model: 'nomic-embed-text', prompt: question })).embedding;
        const relevantDocs = await this.db.find(queryEmbed);
        const modelQuery = `${question} - Answer that question using the following text as a resource: ${relevantDocs}`
        
        return await ollama.generate({ model: 'llama3.2', prompt: modelQuery, stream: true });
    }
}