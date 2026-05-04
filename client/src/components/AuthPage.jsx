import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, LogIn, Mail, Lock, ShieldCheck } from 'lucide-react';
import { API_BASE_URL } from '../lib/api';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const url = `${API_BASE_URL}/auth/${isLogin ? 'login' : 'signup'}`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      if (isLogin) {
        localStorage.setItem('user_session', JSON.stringify(data.user));
        setSuccess('Logged in successfully! Redirecting...');
        setTimeout(() => {
          navigate('/browse');
          window.dispatchEvent(new Event('storage'));
        }, 1500);
      } else {
        setSuccess('Account created successfully! Switching to Login...');
        setIsLogin(true);
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_session');
    setSuccess('Logged out successfully.');
    setEmail('');
    setPassword('');
    window.dispatchEvent(new Event('storage'));
  };

  const activeUser = JSON.parse(localStorage.getItem('user_session') || 'null');

  if (activeUser) {
    return (
      <div
        className="auth-card"
        style={{ maxWidth: '480px', margin: '4rem auto', textAlign: 'center' }}
      >
        <div className="auth-header">
          <ShieldCheck size={48} color="#38bdf8" style={{ margin: '0 auto 1rem auto' }} />
          <h2>Welcome, {activeUser.email}</h2>
          <p>You are already signed in to your account.</p>
        </div>
        <button onClick={handleLogout} className="btn-logout-auth">
          Sign Out of Account
        </button>
      </div>
    );
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            <LogIn size={18} /> Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            <UserPlus size={18} /> Create Account
          </button>
        </div>

        <div className="auth-body">
          <h3>{isLogin ? 'Welcome Back' : 'Get Started with DevLibrary'}</h3>
          <p>
            {isLogin
              ? 'Sign in to access your digital library.'
              : 'Sign up to read complete documents.'}
          </p>

          <form onSubmit={handleAuth} className="auth-form">
            <div className="input-group-auth">
              <label>Email Address</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="input-group-auth">
              <label>Password</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && <div className="auth-message error">{error}</div>}
            {success && <div className="auth-message success">{success}</div>}

            <button type="submit" disabled={loading} className="btn-auth-submit">
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
