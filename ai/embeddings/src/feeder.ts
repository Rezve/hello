import { ChromaDB } from "./chroma-db";
import { Reader } from "./reader";

export class Feeder {
    async feed(files: string[]) {
        console.info("Feeding started");

        const db = new ChromaDB();
        const reader = new Reader();
            
        for (const file of files) {
            const text = await reader.readFile(`./data/${file}`);
            if (!text) {
                console.log('Failed to read text from '+ file);
                return;
            }
        
            const chunks = reader.chunkTextBySentences(text, 10, 1);
            await db.insert(file, chunks)
        }

        console.info("Feeding has been completed!");
    }
}