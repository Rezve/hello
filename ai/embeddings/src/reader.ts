import { readFile } from 'fs/promises';

export class Reader {

    async readFile(path: string) {
        try {
            const file = await readFile(path);
            return file.toString();
        } catch (error: any) {
            console.log('Read file error: ' + error.message)
        }
        return null;
    }

    /**
     * Splits text into chunks by sentences.
     * 
     * @param text - The text to be chunked.
     * @param maxSentencesPerChunk - Maximum number of sentences per chunk.
     * @param overlap - The number of overlapping sentences between chunks (defaults to 0).
     * @returns An array of sentence chunks.
     */
    chunkTextBySentences(
        text: string,
        maxSentencesPerChunk: number,
        overlap: number = 0
    ): string[] {
        if (maxSentencesPerChunk <= 0) {
            throw new Error("maxSentencesPerChunk must be greater than 0");
        }

        // Split the text into sentences using a regex pattern that captures sentence-ending punctuation.
        const sentenceRegex = /([.!?])\s+/;
        const sentences = text.split(sentenceRegex).filter(Boolean).map((s, i, arr) => {
            // Join the punctuation back to the sentence
            if (i % 2 === 0 && arr[i + 1]) {
                return s + arr[i + 1];
            }
            return s;
        });

        const chunks: string[] = [];
        let currentChunk: string[] = [];

        for (let i = 0; i < sentences.length; i++) {
            currentChunk.push(sentences[i]);

            // When the chunk reaches the max length, or when the last sentence is added,
            // create the chunk and reset for the next one.
            if (currentChunk.length === maxSentencesPerChunk) {
                chunks.push(this.cleanText(currentChunk.join(" ").trim()));
                currentChunk = currentChunk.slice(Math.max(0, currentChunk.length - overlap)); // Keep overlap sentences
            }
        }

        // Add the remaining sentences if there are any left
        if (currentChunk.length > 0) {
            chunks.push(this.cleanText(currentChunk.join(" ").trim()));
        }

        return chunks;
    }

    cleanText(text: string): string {
        // Replace \r\n, \n, \r, and other whitespace characters like tabs
        return text.replace(/[\r\n\t]+/g, '').trim();
    }
}

