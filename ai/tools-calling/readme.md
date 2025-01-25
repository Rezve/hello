# Session-Based Chat with LLM

This repository contains a simple experiment where I tested session-based chatting with a large language model (LLM). The goal is to maintain the full conversation in memory and pass it back and forth.

## Setup Instructions

To run this project locally:

1. **Copy environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Run the model locally**:
   ```bash
   ollama run llama3-groq-tool-use
   ```

3. **Install dependencies**:
   ```bash
   yarn install
   ```

4. **Start the app**:
   ```bash
   yarn start
   ```

That's it! The app should be running, and you'll be able to test session-based chatting.

