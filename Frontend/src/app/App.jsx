import { SignedIn, SignedOut, SignIn, SignUp } from "@clerk/clerk-react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ChatProvider } from "../features/chat/context/ChatContext";
import { ArenaProvider } from "../features/arena/context/ArenaContext";
import { ArenaPage } from "../features/arena/ui/ArenaPage";
import { LandingPage } from "../features/auth/ui/LandingPage";

function ArenaShell() {
  return (
    <ChatProvider>
      <ArenaProvider>
        <ArenaPage />
      </ArenaProvider>
    </ChatProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/sign-in/*"
          element={
            <div className="auth-screen">
              <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" forceRedirectUrl="/arena" />
            </div>
          }
        />
        <Route
          path="/sign-up/*"
          element={
            <div className="auth-screen">
              <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" forceRedirectUrl="/arena" />
            </div>
          }
        />
        <Route
          path="/arena"
          element={
            <>
              <SignedIn>
                <ArenaShell />
              </SignedIn>
              <SignedOut>
                <Navigate to="/" replace />
              </SignedOut>
            </>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
