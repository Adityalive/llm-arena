import { useArena } from "../hooks/useArena";
import { IconPaperclip, IconSend } from "./Icons";

export function MessageComposer() {
  const { draft, setDraft, submitProblem, isSubmitting } = useArena();

  const handleSubmit = (event) => {
    event.preventDefault();
    submitProblem(draft);
  };

  return (
    <form className="composer" onSubmit={handleSubmit}>
      <button className="icon-btn composer-side" type="button" aria-label="Attach context">
        <IconPaperclip />
      </button>

      <input
        className="composer-input"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Ask anything about your problem..."
        disabled={isSubmitting}
      />

      <button className="send-btn" type="submit" disabled={isSubmitting || !draft.trim()} aria-label="Send problem">
        <IconSend />
      </button>
    </form>
  );
}
