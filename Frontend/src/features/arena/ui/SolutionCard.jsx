import { useState } from "react";
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
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <article className={`solution-card ${solution.accent} ${solution.winner ? "winner" : ""}`}>
      <div className="solution-head">
        <div className={`solution-icon ${solution.accent}`}>{getAccentIcon(solution.accent)}</div>
        <div className="solution-title-wrap">
          <h3 className="solution-title">{solution.title}</h3>
          {typeof solution.score === "number" ? <span className="solution-score">Score: {solution.score}/10</span> : null}
        </div>

        <div className="solution-actions">
          <button className="icon-btn tiny" type="button" aria-label="Copy solution" onClick={handleCopy}>
            <IconCopy />
          </button>
          <button
            className={`icon-btn tiny ${reaction === "up" ? "active" : ""}`}
            type="button"
            aria-label="Like solution"
            onClick={() => setReaction((value) => (value === "up" ? "" : "up"))}
          >
            <IconThumbUp />
          </button>
          <button
            className={`icon-btn tiny ${reaction === "down" ? "active" : ""}`}
            type="button"
            aria-label="Dislike solution"
            onClick={() => setReaction((value) => (value === "down" ? "" : "down"))}
          >
            <IconThumbDown />
          </button>
        </div>
      </div>

      <p className="solution-description">{solution.body.slice(0, 180)}{solution.body.length > 180 ? "..." : ""}</p>

      <ul className="solution-bullets">
        {solution.bullets.map((bullet, index) => (
          <li key={`${solution.id}-bullet-${index}`}>{bullet}</li>
        ))}
      </ul>

      <div className="solution-footer">
        <button className="guide-btn" type="button" onClick={() => onGuide(solution.title)}>
          See implementation guide
          <span aria-hidden="true">→</span>
        </button>
        {copied ? <span className="copied-text">Copied</span> : null}
      </div>
    </article>
  );
}
