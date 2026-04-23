import { useContext } from "react";
import { ArenaContext } from "../context/ArenaContextValue";

export function useArena() {
  const context = useContext(ArenaContext);

  if (!context) {
    throw new Error("useArena must be used inside ArenaProvider");
  }

  return context;
}
