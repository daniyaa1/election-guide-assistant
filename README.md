# Election Guide Assistant

Election Guide Assistant is a small full-stack web app that explains election basics in a simple chat-style interface, with answers tailored more toward West Bengal election questions.

## Features

- Chat-style assistant UI
- Quick topic buttons for common election questions
- Structured replies with steps and short extra notes
- Replies in the same language as the user input: English, Bengali, or Hindi
- Remembers recent chat context for short follow-up questions
- Loading state and auto-scroll behavior
- Express API with keyword-based matching
- Optional Gemini fallback for questions outside the local dataset

## Tech Stack

- React with Vite
- Node.js and Express
- Plain CSS

## How to Run

1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npm run dev
```

3. Open the frontend in your browser:

```text
http://localhost:5173
```

The backend runs on `http://127.0.0.1:5050` by default.

If the app says a port is already in use, stop the older process first and then run `npm run dev` again.

## Optional Gemini Setup

If you want the assistant to try Google Gemini for unknown questions, create a `.env` file or export this variable before starting the server:

```bash
GEMINI_API_KEY=your_api_key_here
```

If no API key is provided, the app still works with the built-in election topics.
