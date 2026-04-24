import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

function FeatureIcon({ children }) {
  return (
    <div className="feature-card-icon">
      <svg viewBox="0 0 24 24" aria-hidden="true">{children}</svg>
    </div>
  );
}

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
                Get Started
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
        <span className="landing-kicker">Battle-test your AI models</span>

        <h1 className="landing-title">
          The arena where AI models compete.
        </h1>

        <p className="landing-subtitle">
          Submit a problem, compare responses from multiple models side by side,
          and decide which answer wins. Track your history and refine your prompts.
        </p>

        <div className="landing-cta-row">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="landing-btn landing-btn-primary landing-btn-large" type="button">
                Start comparing →
              </button>
            </SignInButton>
            <Link to="/sign-up" className="landing-btn landing-btn-ghost landing-btn-large">
              Create account
            </Link>
          </SignedOut>

          <SignedIn>
            <Link to="/arena" className="landing-btn landing-btn-primary landing-btn-large">
              Enter Arena →
            </Link>
          </SignedIn>
        </div>
      </main>

      <section className="landing-features" aria-label="Features">
        <div className="feature-card">
          <FeatureIcon>
            <path d="M12 2 9.8 8.8 3 11l6.8 2.2L12 20l2.2-6.8L21 11l-6.8-2.2L12 2Z" fill="currentColor" />
          </FeatureIcon>
          <h3>Side-by-side comparison</h3>
          <p>See two model responses rendered next to each other for instant comparison.</p>
        </div>

        <div className="feature-card">
          <FeatureIcon>
            <path d="M12 4a8 8 0 1 1-7.7 10.2h2.1A6 6 0 1 0 12 6a6 6 0 0 0-4.2 1.7L10 10H4V4l2.4 2.4A8 8 0 0 1 12 4Zm-1 4h2v4h3v2h-5V8Z" fill="currentColor" />
          </FeatureIcon>
          <h3>Chat history</h3>
          <p>All your past competitions are saved and searchable from the sidebar.</p>
        </div>

        <div className="feature-card">
          <FeatureIcon>
            <path d="M9.4 21H5a2 2 0 0 1-2-2v-7.3a2 2 0 0 1 2-2h4.4V21Zm1.6 0v-9.6l3.6-6a1.5 1.5 0 0 1 2.8.8l-.4 3.3h2.7A2.3 2.3 0 0 1 22 12a2.4 2.4 0 0 1-.1.8l-1.4 5.7a3 3 0 0 1-2.9 2.5H11Z" fill="currentColor" />
          </FeatureIcon>
          <h3>Vote & decide</h3>
          <p>Rate each solution and request implementation guides from the winner.</p>
        </div>
      </section>
    </div>
  );
}
