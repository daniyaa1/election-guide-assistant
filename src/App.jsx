import { useState } from "react";
import ChatBox from "./components/ChatBox";
import QuickActions from "./components/QuickActions";

const apiBaseUrl = import.meta.env.VITE_API_URL || "";

const starterMessage = {
  id: 1,
  role: "assistant",
  text: "Hi, I can walk you through West Bengal election basics in a simple way.",
  response: {
    title: "Election Guide Assistant",
    steps: [
      "Ask in English, Bengali, or Hindi.",
      "Pick a quick topic for polling, eligibility, process, or timeline help."
    ],
    extra: "The guide is written to feel more relevant to West Bengal election questions."
  }
};

function App() {
  const [messages, setMessages] = useState([starterMessage]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendQuestion = async (rawQuestion) => {
    const question = rawQuestion.trim();

    if (!question || isLoading) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: question
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 700));

      const history = [...messages, userMessage].map((message) => ({
        role: message.role,
        text: message.text
      }));

      const response = await fetch(`${apiBaseUrl}/api/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question, history })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: data.title,
          response: data
        }
      ]);
    } catch (error) {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: "Something went wrong while reaching the server.",
          response: {
            title: "Server issue",
            steps: [
              "Make sure `npm run dev` is still running in the terminal.",
              "Check that the backend started on port 5050.",
              "If another app is using that port, stop it and restart this project."
            ],
            extra: error.message || "The request could not be completed."
          }
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendQuestion(inputValue);
  };

  return (
    <div className="page-shell">
      <main className="assistant-layout">
        <section className="hero-panel">
          <div className="hero-top">
            <p className="eyebrow">West Bengal Focus</p>
            <div className="status-pill">English, Bengali, Hindi</div>
          </div>

          <div className="hero-main">
            <h1>Election Guide Assistant</h1>
            <p className="hero-copy">
              A cleaner election help desk for West Bengal style queries,
              built to explain voting steps, eligibility, timelines, and the
              basic process without sounding too formal.
            </p>
          </div>

          <div className="hero-facts">
            <div className="fact-card">
              <span className="fact-number">3</span>
              <span className="fact-label">languages</span>
            </div>
            <div className="fact-card">
              <span className="fact-number">4</span>
              <span className="fact-label">core guides</span>
            </div>
          </div>

          <div className="sample-prompts">
            <span>Try:</span>
            <p>Who can vote in West Bengal?</p>
            <p>ভোট দিতে কী লাগবে?</p>
            <p>मतदान की प्रक्रिया क्या है?</p>
          </div>

          <QuickActions onPick={sendQuestion} disabled={isLoading} />
        </section>

        <section className="chat-panel">
          <div className="chat-header">
            <div>
              <p className="chat-kicker">Assistant Chat</p>
              <h2>Ask about elections in plain language</h2>
            </div>
            <div className="chat-badge">Bengal-ready replies</div>
          </div>

          <ChatBox messages={messages} isLoading={isLoading} />

          <form className="composer" onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Ask in English, বাংলা, or हिंदी"
            />
            <button type="submit" disabled={isLoading}>
              Send
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default App;
