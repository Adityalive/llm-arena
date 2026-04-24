import { useArena } from "../hooks/useArena";
import { IconChevron, IconMenu, IconShare } from "./Icons";

export function TopBar() {
  const { setIsSidebarOpen } = useArena();

  return (
    <header className="topbar">
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button
          className="icon-btn mobile-only"
          type="button"
          aria-label="Open sidebar"
          onClick={() => setIsSidebarOpen(true)}
        >
          <IconMenu />
        </button>

        <button className="title-dropdown" type="button">
          New conversation
          <span className="dropdown-icon">
            <IconChevron />
          </span>
        </button>
      </div>

      <div className="model-tags">
        <span className="model-tag">
          <span className="model-dot" />
          claude-sonnet-4
        </span>
        <span className="model-tag">
          <span className="model-dot purple" />
          gpt-5.4-mini
        </span>
      </div>

      <div className="topbar-right">
        <button className="icon-btn" type="button" aria-label="Share">
          <IconShare />
        </button>
      </div>
    </header>
  );
}
