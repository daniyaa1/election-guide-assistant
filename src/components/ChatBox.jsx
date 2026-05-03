import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

function ChatBox({ messages, isLoading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="chat-box">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isLoading ? (
        <div className="message-row assistant-row">
          <div className="message-bubble assistant-bubble thinking-bubble">
            Thinking...
          </div>
        </div>
      ) : null}

      <div ref={bottomRef} />
    </div>
  );
}

export default ChatBox;
