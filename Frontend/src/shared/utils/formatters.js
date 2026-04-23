export function formatHistoryTimestamp(dateInput) {
  const date = new Date(dateInput);
  const now = new Date();

  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay) {
    return "Today";
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays > 1 && diffDays < 7) {
    return `${diffDays} days ago`;
  }

  return date.toLocaleDateString();
}

export function truncateText(text, max = 38) {
  if (text.length <= max) {
    return text;
  }

  return `${text.slice(0, max - 3)}...`;
}

export function toBulletPoints(text, limit = 3) {
  const cleaned = text
    .replace(/\r/g, "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^[-*\d.)\s]+/, ""));

  const fromSentences = cleaned.join(" ").split(/(?<=[.!?])\s+/);
  const points = (cleaned.length ? cleaned : fromSentences).filter(Boolean).slice(0, limit);

  if (!points.length && text.trim()) {
    return [text.trim()];
  }

  return points;
}
