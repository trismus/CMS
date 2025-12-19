import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginWidget: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setLoading(true);
    try {
      await login(userEmail, userPassword);
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-widget">
      <h2>Anmelden</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="deine@email.com"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Passwort:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Lädt...' : 'Anmelden'}
        </button>
      </form>

      <div className="quick-login">
        <p>Quick Login (Demo):</p>
        <div className="quick-login-buttons">
          <button
            onClick={() => quickLogin('admin@base.local', 'admin123')}
            className="btn-demo admin"
          >
            Admin
          </button>
          <button
            onClick={() => quickLogin('operator@base.local', 'operator123')}
            className="btn-demo operator"
          >
            Operator
          </button>
          <button
            onClick={() => quickLogin('user@base.local', 'user123')}
            className="btn-demo user"
          >
            User
          </button>
        </div>
      </div>
    </div>
  );
};
