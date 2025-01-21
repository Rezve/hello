import readline from 'readline';
import { LLM } from './llm';

/**
 *  The Chatter class enables users to engage in conversations by taking their input 
 *  and passing it to a Large Language Model (LLM) for response generation. 
 */
export class Chatter {
    private rl;
    private llm: LLM;

    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false
        });
        this.llm = new LLM();
        console.log('How can i help you (type "exit" to quit)');
    }

    ask() {
        this.rl.question('[You]: ', async (question) => {
            if (question.toLowerCase() === 'exit') {
                console.log('Exiting...');
                this.rl.close();
            } else {

                // await this.answerStream(question);
                await this.answerSequence(question);
                
                this.ask();
            }
        });
    }

    private async answerStream(question: string) {
        process.stdout.write(`[Machine]: `);
        await this.llm.getAnswerStream(question, (chunkMessage) => {
            process.stdout.write(chunkMessage)
        });
        console.log('\n');
    }

    private async answerSequence(question: string) {
        const answer = await this.llm.getAnswerSequence(question);
        console.log(`[Machine]: `, answer , '\n')
        // console.log('\n');
    }
}