import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <div className="landing-shell">
      <header className="landing-header">
        <div className="landing-brand">LLM Arena</div>
        <SignedOut>
          <div className="landing-auth-actions">
            <SignInButton mode="modal">
              <button className="landing-btn landing-btn-ghost" type="button">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="landing-btn landing-btn-primary" type="button">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        </SignedOut>
        <SignedIn>
          <div className="landing-user-block">
            <UserButton afterSignOutUrl="/" />
          </div>
        </SignedIn>
      </header>

      <main className="landing-main">
        <p className="landing-kicker">Solve. Compare. Decide.</p>
        <h1 className="landing-title">Put multiple AI models in one arena and choose the best answer.</h1>
        <p className="landing-subtitle">
          Sign in to submit a problem, compare responses side by side, and track your chat history.
        </p>

        <div className="landing-cta-row">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="landing-btn landing-btn-primary landing-btn-large" type="button">
                Sign In to Continue
              </button>
            </SignInButton>
            <Link to="/sign-up" className="landing-btn landing-btn-ghost landing-btn-large">
              Create Account
            </Link>
          </SignedOut>

          <SignedIn>
            <Link to="/arena" className="landing-btn landing-btn-primary landing-btn-large">
              Enter Arena
            </Link>
          </SignedIn>
        </div>
      </main>
    </div>
  );
}
