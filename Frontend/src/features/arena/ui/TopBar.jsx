import { useArena } from "../hooks/useArena";
import { IconChevron, IconMenu, IconShare } from "./Icons";

export function TopBar() {
  const { setIsSidebarOpen } = useArena();

  return (
    <header className="topbar">
      <button className="icon-btn mobile-only" type="button" aria-label="Open sidebar" onClick={() => setIsSidebarOpen(true)}>
        <IconMenu />
      </button>

      <button className="title-dropdown" type="button">
        Problem
        <span className="dropdown-icon">
          <IconChevron />
        </span>
      </button>

      <button className="icon-btn" type="button" aria-label="Share and export">
        <IconShare />
      </button>
    </header>
  );
}
