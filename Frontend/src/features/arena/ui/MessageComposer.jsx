import { useRef, useEffect } from "react";
import { useArena } from "../hooks/useArena";
import { IconPaperclip, IconSend } from "./Icons";

export function MessageComposer() {
  const { draft, setDraft, submitProblem, isSubmitting } = useArena();
  const textareaRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [draft]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!draft.trim() || isSubmitting) return;
    submitProblem(draft);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }
  };

  return (
    <form className="composer" onSubmit={handleSubmit}>
      <button
        className="composer-side icon-btn tiny"
        type="button"
        aria-label="Attach context"
      >
        <IconPaperclip />
      </button>

      <textarea
        ref={textareaRef}
        className="composer-input"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything — compare two AI models..."
        disabled={isSubmitting}
        rows={1}
      />

      <button
        className="send-btn"
        type="submit"
        disabled={isSubmitting || !draft.trim()}
        aria-label="Send"
      >
        <IconSend />
      </button>
    </form>
  );
}
