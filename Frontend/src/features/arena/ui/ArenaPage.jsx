import { useArena } from "../hooks/useArena";
import { useChat } from "../../chat/hooks/useChat";
import { ChatMessages } from "./ChatMessages";
import { MessageComposer } from "./MessageComposer";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function ArenaPage() {
  const { messages, setDraft, error } = useArena();
  const { chatError } = useChat();

  const handleGuide = (solutionTitle) => {
    setDraft(`Share a step-by-step implementation guide for ${solutionTitle.toLowerCase()}.`);
  };

  return (
    <div className="solvemate-layout">
      <Sidebar />

      <main className="main-panel">
        <TopBar />

        {(error || chatError) && (
          <div className="error-banner">{error || chatError}</div>
        )}

        <section className="chat-scroll">
          <ChatMessages messages={messages} onGuide={handleGuide} />
        </section>

        <footer className="composer-wrap">
          <MessageComposer />
          <p className="disclaimer">SolveMate can make mistakes. Double-check important decisions.</p>
        </footer>
      </main>
    </div>
  );
}
