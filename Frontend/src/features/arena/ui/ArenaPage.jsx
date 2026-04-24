import { useArena } from "../hooks/useArena";
import { ChatMessages } from "./ChatMessages";
import { MessageComposer } from "./MessageComposer";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { IconSparkleLogo } from "./Icons";

function EmptyState({ onChipClick }) {
  const chips = [
    "Compare React vs Vue for a dashboard app",
    "Best database for a real-time chat app?",
    "Monolith vs microservices for a startup",
    "Redis vs Memcached for session storage",
    "REST vs GraphQL for a mobile API",
    "Docker vs Kubernetes — when to use each",
  ];

  return (
    <div className="empty-state fade-in">
      <div className="empty-state-icon">
        <IconSparkleLogo />
      </div>
      <h2>Compare AI responses side by side</h2>
      <p>
        Submit a problem and see two models compete. Pick the best answer.
      </p>
      <div className="empty-state-chips">
        {chips.map((chip) => (
          <button
            key={chip}
            className="empty-chip"
            type="button"
            onClick={() => onChipClick(chip)}
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ArenaPage() {
  const { messages, setDraft, error, isLoadingHistory, isSubmitting } = useArena();

  const handleGuide = (solutionTitle) => {
    setDraft(`Share a step-by-step implementation guide for ${solutionTitle.toLowerCase()}.`);
  };

  const handleChipClick = (text) => {
    setDraft(text);
  };

  return (
    <div className="solvemate-layout">
      <Sidebar />

      <main className="main-panel">
        <TopBar />

        {error && <div className="error-banner">{error}</div>}

        <section className="chat-scroll">
          {messages.length === 0 && !isLoadingHistory ? (
            <EmptyState onChipClick={handleChipClick} />
          ) : (
            <ChatMessages
              messages={messages}
              isLoading={isLoadingHistory}
              isSubmitting={isSubmitting}
              onGuide={handleGuide}
            />
          )}
        </section>

        <footer className="composer-wrap">
          <MessageComposer />
          <p className="disclaimer">
            Arena can make mistakes. Verify important decisions independently.
          </p>
        </footer>
      </main>
    </div>
  );
}
