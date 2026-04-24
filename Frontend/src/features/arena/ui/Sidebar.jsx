import { useUser } from "@clerk/clerk-react";
import { useArena } from "../hooks/useArena";
import {
  IconDots,
  IconHistory,
  IconPlus,
  IconSparkleLogo,
} from "./Icons";

function HistoryItem({ item, onSelect }) {
  return (
    <button className="history-item" type="button" onClick={() => onSelect(item)}>
      <span className="history-text">{item.title}</span>
      <span className="history-time">{item.timestamp}</span>
    </button>
  );
}

export function Sidebar() {
  const { historyItems, startNewProblem, selectHistoryItem, isSidebarOpen, setIsSidebarOpen } = useArena();
  const { user } = useUser();

  const initials = user?.firstName
    ? user.firstName[0].toUpperCase()
    : user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() ?? "U";

  const displayName = user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress ?? "User";

  return (
    <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
      <div className="sidebar-top">
        {/* Brand */}
        <div className="brand-row">
          <span className="brand-icon">
            <IconSparkleLogo />
          </span>
          <span className="brand-name">LLM Arena</span>
        </div>

        {/* New chat */}
        <button className="new-problem-btn" type="button" onClick={startNewProblem}>
          <span className="btn-icon">
            <IconPlus />
          </span>
          New Chat
        </button>

        {/* History */}
        <div className="history-section">
          <div className="history-heading">
            <span className="heading-icon">
              <IconHistory />
            </span>
            Recent
          </div>

          <div className="history-list">
            {historyItems.length === 0 ? (
              <p style={{ padding: "6px 4px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                No history yet
              </p>
            ) : (
              historyItems.map((item) => (
                <HistoryItem key={item.id} item={item} onSelect={selectHistoryItem} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="sidebar-bottom">
        <button className="pro-card" type="button">
          <div className="pro-title">Upgrade to Pro</div>
          <div className="pro-subtitle">Unlock more models &amp; history</div>
        </button>

        <div className="user-row">
          <div className="avatar">{initials}</div>
          <div className="user-name">{displayName}</div>
          <button className="icon-btn mini" type="button" aria-label="Profile options">
            <IconDots />
          </button>
        </div>
      </div>

      <button
        className="sidebar-overlay"
        type="button"
        aria-label="Close sidebar"
        onClick={() => setIsSidebarOpen(false)}
      />
    </aside>
  );
}
