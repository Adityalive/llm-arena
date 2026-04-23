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
  return (
    <div className="message-row assistant fade-in">
      <div className="assistant-avatar">
        <IconSparkleLogo />
      </div>
      <div className="assistant-content">
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
      </div>
    </div>
  );
}

export function ChatMessages({ messages, onGuide }) {
  if (!messages.length) {
    return (
      <div className="empty-state">
        <h2>Ask a problem and compare two model solutions instantly.</h2>
        <p>SolveMate evaluates both responses and highlights the winner with reasoning.</p>
      </div>
    );
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
