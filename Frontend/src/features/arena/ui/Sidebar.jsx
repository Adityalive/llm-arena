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
      <div className="history-text">{item.title}</div>
      <div className="history-time">{item.timestamp}</div>
    </button>
  );
}

export function Sidebar() {
  const { historyItems, startNewProblem, selectHistoryItem, isSidebarOpen, setIsSidebarOpen } = useArena();

  return (
    <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
      <div className="sidebar-top">
        <div className="brand-row">
          <span className="brand-icon">
            <IconSparkleLogo />
          </span>
          <span className="brand-name">SolveMate</span>
        </div>

        <button className="new-problem-btn" type="button" onClick={startNewProblem}>
          <span className="btn-icon">
            <IconPlus />
          </span>
          New Problem
        </button>

        <div className="history-section">
          <div className="history-heading">
            <span className="heading-icon">
              <IconHistory />
            </span>
            History
          </div>
          <div className="history-list">
            {historyItems.map((item) => (
              <HistoryItem key={item.id} item={item} onSelect={selectHistoryItem} />
            ))}
          </div>
        </div>
      </div>

      <div className="sidebar-bottom">
        <button className="pro-card" type="button">
          <div className="pro-title">Upgrade to Pro</div>
          <div className="pro-subtitle">Unlock more features</div>
        </button>

        <div className="user-row">
          <div className="avatar">A</div>
          <div className="user-name">Alex</div>
          <button className="icon-btn mini" type="button" aria-label="Profile options">
            <IconDots />
          </button>
        </div>
      </div>

      <button className="sidebar-overlay" type="button" aria-label="Close sidebar" onClick={() => setIsSidebarOpen(false)} />
    </aside>
  );
}
