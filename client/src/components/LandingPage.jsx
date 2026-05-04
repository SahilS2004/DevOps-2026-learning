import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Shield, Sparkles, Zap, Book } from 'lucide-react';
import UserPage from './UserPage';

export default function LandingPage() {
  return (
    <div className="public-landing-wrapper">
      <header className="landing-navbar">
        <div className="brand" style={{ marginBottom: 0 }}>
          <Book size={32} color="#38bdf8" /> DevLibrary
        </div>
        <div className="landing-nav-links">
          <Link to="/auth" className="btn-landing-login">
            Sign In
          </Link>
          <Link to="/auth" className="btn-landing-signup">
            Get Started
          </Link>
        </div>
      </header>

      <div className="landing-container">
        <div className="landing-hero">
          <div className="landing-badge">
            <Sparkles size={16} /> Welcome to the Future of Reading
          </div>
          <h1 className="landing-title">
            Explore the Ultimate <span>Digital Library</span>
          </h1>
          <p className="landing-subtitle">
            Discover a curated ecosystem of cutting-edge documentation, developer guides, and
            premium resources tailored for engineering excellence.
          </p>

          <div className="landing-cta-group">
            <Link to="/auth" className="btn-primary-cta">
              Explore Now <ArrowRight size={20} />
            </Link>
            <Link to="/auth" className="btn-secondary-cta">
              Create Free Account
            </Link>
          </div>
        </div>

        <div className="landing-features">
          <div className="landing-feature-card">
            <div className="feature-icon-wrapper">
              <BookOpen size={24} />
            </div>
            <h3>Vast Collection</h3>
            <p>
              Read full books and official documentation seamlessly in high definition directly
              within your screen.
            </p>
          </div>

          <div className="landing-feature-card">
            <div className="feature-icon-wrapper">
              <Shield size={24} />
            </div>
            <h3>Secure Authentication</h3>
            <p>
              Create an account to securely access documents, track updates, and view premium
              materials.
            </p>
          </div>

          <div className="landing-feature-card">
            <div className="feature-icon-wrapper">
              <Zap size={24} />
            </div>
            <h3>Live Popup Reader</h3>
            <p>
              Don&apos;t just open links—experience deep focus reading mode inside our responsive
              reading modal.
            </p>
          </div>
        </div>

        {/* Display the library grid below the features for a comprehensive experience */}
        <div className="landing-books-preview" style={{ marginTop: '5rem' }}>
          <UserPage />
        </div>
      </div>
    </div>
  );
}
