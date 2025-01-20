import { ChromaClient } from "chromadb";
import ollama from "ollama";

export class ChromaDB {
    private client: ChromaClient;
    private collectionName = 'test';

    constructor() {
        this.client = new ChromaClient({
            path: 'http://localhost:8000'
        });
    }

    async reset(collectionName: string) {
        await this.client.deleteCollection({ name: collectionName });
    }

    async insert(documentName: string, chunks: string[]) {
        const collection = await this.client.getOrCreateCollection({
            name: this.collectionName,
        });

        for await (const [index, chunk] of chunks.entries()) {
            const embed = (await ollama.embeddings({ model: 'nomic-embed-text', prompt: chunk })).embedding
            await collection.add({ ids: [documentName + index], embeddings: [embed], metadatas: [{ source: documentName }], documents: [chunk] })
        }
    }

    async find(query: number[]) {
        const collection = await this.client.getOrCreateCollection({
            name: this.collectionName,
        });
        return (await collection.query({ queryEmbeddings: [query], nResults: 5 })).documents[0].join("\n\n")
    }
}