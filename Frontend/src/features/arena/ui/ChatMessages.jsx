import { SolutionCard } from "./SolutionCard";
import { IconSparkleLogo } from "./Icons";

function WinnerBadge({ winner }) {
  if (winner === "tie") {
    return <span className="winner-badge tie">Winner: Tie</span>;
  }

  const label = winner === "solution_1" ? "Solution 1" : "Solution 2";
  return <span className="winner-badge">Winner: {label}</span>;
}

function UserMessage({ message }) {
  return (
    <div className="message-row user fade-in">
      <div className="message-bubble user">{message.content}</div>
    </div>
  );
}

function AssistantMessage({ message, onGuide }) {
  const hasSolutions = Array.isArray(message.solutions) && message.solutions.length > 0;
  const content = message.content || (message.status === "streaming" ? "Response is still being generated..." : "");

  return (
    <div className="message-row assistant fade-in">
      <div className="assistant-avatar">
        <IconSparkleLogo />
      </div>
      <div className="assistant-content">
        {hasSolutions ? (
          <>
            <p className="assistant-intro">{message.intro}</p>
            <div className="solutions-stack">
              {message.solutions.map((solution) => (
                <SolutionCard key={solution.id} solution={solution} onGuide={onGuide} />
              ))}
            </div>
            <div className="assistant-footer">
              <WinnerBadge winner={message.winner} />
              <p className="assistant-note">Let me know if you want code-level implementation for the winner.</p>
            </div>
          </>
        ) : (
          <div className="message-bubble assistant">{content}</div>
        )}
      </div>
    </div>
  );
}

export function ChatMessages({ messages, isLoading = false, onGuide }) {
  if (isLoading) {
    return <div className="history-loader">Loading chat messages...</div>;
  }

  if (!messages.length) {
    return null;
  }

  return (
    <div className="messages-list">
      {messages.map((message) =>
        message.role === "user" ? (
          <UserMessage key={message.id} message={message} />
        ) : (
          <AssistantMessage key={message.id} message={message} onGuide={onGuide} />
        )
      )}
    </div>
  );
}
