function MessageBubble({ message }) {
  const isAssistant = message.role === "assistant";
  const response = message.response;

  return (
    <div className={`message-row ${isAssistant ? "assistant-row" : "user-row"}`}>
      <div
        className={`message-bubble ${
          isAssistant ? "assistant-bubble" : "user-bubble"
        }`}
      >
        <span className="message-label">
          {isAssistant ? "Guide" : "You"}
        </span>
        <p>{message.text}</p>

        {isAssistant && response?.steps?.length ? (
          <ol className="step-list">
            {response.steps.map((step, index) => (
              <li key={`${message.id}-${index}`}>{step}</li>
            ))}
          </ol>
        ) : null}

        {isAssistant && response?.extra ? (
          <p className="extra-note">{response.extra}</p>
        ) : null}
      </div>
    </div>
  );
}

export default MessageBubble;
