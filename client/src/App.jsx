import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import UserPage from './components/UserPage';
import AdminPage from './components/AdminPage';
import AuthPage from './components/AuthPage';
import { Book, LayoutDashboard, Library, LogOut } from 'lucide-react';

function NavLinks() {
  const location = useLocation();
  return (
    <div className="nav-links">
      <Link to="/browse" className="nav-link" data-active={location.pathname === '/browse'}>
        <Library size={20} /> Browse Library
      </Link>
      <Link to="/admin" className="nav-link" data-active={location.pathname === '/admin'}>
        <LayoutDashboard size={20} /> Admin Panel
      </Link>
    </div>
  );
}

function LayoutWrapper() {
  const location = useLocation();
  const [activeUser, setActiveUser] = useState(null);

  const fetchSession = () => {
    const s = localStorage.getItem('user_session');
    if (s) setActiveUser(JSON.parse(s));
    else setActiveUser(null);
  };

  useEffect(() => {
    fetchSession();
    window.addEventListener('storage', fetchSession);
    return () => window.removeEventListener('storage', fetchSession);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_session');
    fetchSession();
    window.dispatchEvent(new Event('storage'));
  };

  const isLandingPage = location.pathname === '/';

  if (isLandingPage) {
    return (
      <div className="public-app-container">
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div>
          <div className="brand">
            <Book size={32} color="#38bdf8" /> DevLibrary
          </div>
          <NavLinks />
        </div>
        <div className="sidebar-footer">
          {activeUser ? (
            <div className="session-sidebar-card">
              <p className="session-user-email">Logged in as {activeUser.email}</p>
              <button onClick={handleLogout} className="btn-logout-sidebar">
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <p>&copy; 2026 DevLibrary</p>
          )}
        </div>
      </aside>

      <main className="main-content">
        <div className="content-wrapper">
          <Routes>
            <Route path="/browse" element={<UserPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LayoutWrapper />
    </BrowserRouter>
  );
}

export default App;
