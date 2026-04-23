import { useArena } from "../hooks/useArena";
import { ChatMessages } from "./ChatMessages";
import { MessageComposer } from "./MessageComposer";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function ArenaPage() {
  const { messages, setDraft, error, isLoadingHistory } = useArena();

  const handleGuide = (solutionTitle) => {
    setDraft(`Share a step-by-step implementation guide for ${solutionTitle.toLowerCase()}.`);
  };

  return (
    <div className="solvemate-layout">
      <Sidebar />

      <main className="main-panel">
        <TopBar />

        {error && <div className="error-banner">{error}</div>}

        <section className="chat-scroll">
          <ChatMessages messages={messages} isLoading={isLoadingHistory} onGuide={handleGuide} />
        </section>

        <footer className="composer-wrap">
          <MessageComposer />
          <p className="disclaimer">SolveMate can make mistakes. Double-check important decisions.</p>
        </footer>
      </main>
    </div>
  );
}
