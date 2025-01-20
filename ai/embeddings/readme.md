# Hello Embeddings

This is a test project designed to explore how embeddings work. The goal of this project is to:

1. Feed custom data.
2. Ask questions and receive answers from the custom data.

## How It Works

### Training

1. Read text data from the `data` folder.
2. Chunk the text into smaller segments.
3. Convert the text data into vector representations using the `nomic-embed-text` model.
4. Insert the vector data into an in-memory vector database.

### Chatting

1. Read a user question.
2. Convert the question into a vector representation and search the database for relevant information.
3. Pass the query and the search results to the model.
4. Display the model's response.

## How to Use

1. Start Chroma DB:

   ```bash
   docker run -p 8000:8000 -e ANONYMIZED_TELEMETRY=False chromadb/chroma
   ```

2. Pull the required models:

   ```bash
   ollama pull nomic-embed-text
   ollama run llama3.2
   ```

3. Install dependencies:

   ```bash
   yarn install
   ```

4. Start the application:

   ```bash
   yarn start
   ```