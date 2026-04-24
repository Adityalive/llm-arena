import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { IconCopy, IconSpark, IconGear, IconThumbDown, IconThumbUp } from "./Icons";

function getAccentIcon(accent) {
  if (accent === "purple") {
    return <IconGear />;
  }
  return <IconSpark />;
}

export function SolutionCard({ solution, onGuide }) {
  const [reaction, setReaction] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(solution.body);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <article className={`solution-card ${solution.accent} ${solution.winner ? "winner" : ""}`}>
      <div className="solution-head">
        <div className={`solution-icon ${solution.accent}`}>
          {getAccentIcon(solution.accent)}
        </div>

        <div className="solution-title-wrap">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h3 className="solution-title">{solution.title}</h3>
            {solution.winner && (
              <span className="winner-indicator">Winner</span>
            )}
          </div>
          {typeof solution.score === "number" && (
            <span className="solution-score">{solution.score}/10</span>
          )}
        </div>

        <div className="solution-actions">
          <button
            className="icon-btn tiny"
            type="button"
            aria-label="Copy solution"
            onClick={handleCopy}
          >
            <IconCopy />
          </button>
          <button
            className={`icon-btn tiny ${reaction === "up" ? "active" : ""}`}
            type="button"
            aria-label="Like solution"
            onClick={() => setReaction((v) => (v === "up" ? "" : "up"))}
          >
            <IconThumbUp />
          </button>
          <button
            className={`icon-btn tiny ${reaction === "down" ? "active" : ""}`}
            type="button"
            aria-label="Dislike solution"
            onClick={() => setReaction((v) => (v === "down" ? "" : "down"))}
          >
            <IconThumbDown />
          </button>
        </div>
      </div>

      <div className="solution-content">
        <div className="markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {solution.body}
          </ReactMarkdown>
        </div>

        {solution.bullets?.length > 0 && (
          <ul className="solution-bullets">
            {solution.bullets.map((bullet, index) => (
              <li key={`${solution.id}-bullet-${index}`}>{bullet}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="solution-footer">
        <button className="guide-btn" type="button" onClick={() => onGuide(solution.title)}>
          Implementation guide →
        </button>
        {copied && <span className="copied-text">Copied</span>}
      </div>
    </article>
  );
}
