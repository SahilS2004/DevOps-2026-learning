import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import UserPage from './components/UserPage';
import AdminPage from './components/AdminPage';
import { Book, LayoutDashboard, Library } from 'lucide-react';

function NavLinks() {
  const location = useLocation();
  return (
    <div className="nav-links">
      <Link to="/" className="nav-link" data-active={location.pathname === "/"}>
        <Library size={20} /> Browse Library
      </Link>
      <Link to="/admin" className="nav-link" data-active={location.pathname === "/admin"}>
        <LayoutDashboard size={20} /> Admin Panel
      </Link>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <aside className="sidebar">
          <div>
            <div className="brand">
              <Book size={32} color="#38bdf8" /> DevLibrary
            </div>
            <NavLinks />
          </div>
          <div className="sidebar-footer">
            <p>&copy; 2026 DevLibrary</p>
          </div>
        </aside>
        
        <main className="main-content">
          <div className="content-wrapper">
            <Routes>
              <Route path="/" element={<UserPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
