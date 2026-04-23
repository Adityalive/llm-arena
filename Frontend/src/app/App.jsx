import { ChatProvider } from "../features/chat/context/ChatContext";
import { ArenaProvider } from "../features/arena/context/ArenaContext";
import { ArenaPage } from "../features/arena/ui/ArenaPage";

export default function App() {
  return (
    <ChatProvider>
      <ArenaProvider>
        <ArenaPage />
      </ArenaProvider>
    </ChatProvider>
  );
}
