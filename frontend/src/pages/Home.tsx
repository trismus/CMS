import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { LoginWidget } from '../components/LoginWidget';

export const Home: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="hero-content">
          <h1>Willkommen bei MeinCMS</h1>
          <p className="hero-subtitle">
            Ein modernes Content Management System mit React, Node.js und PostgreSQL
          </p>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3>Sichere Authentifizierung</h3>
              <p>JWT-basierte Auth mit 4 Benutzerrollen</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📧</div>
              <h3>Email-Verifizierung</h3>
              <p>Automatische Verifizierung & Passwort-Reset</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>User-Management</h3>
              <p>Vollständiges Admin-Dashboard</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Modern Stack</h3>
              <p>React, TypeScript, Express, PostgreSQL</p>
            </div>
          </div>
        </div>

        <div className="login-section">
          <LoginWidget />
        </div>
      </div>

      <div className="home-info">
        <div className="info-section">
          <h2>Features</h2>
          <ul className="feature-list">
            <li>✅ JWT-Authentifizierung</li>
            <li>✅ Rollenbasierte Zugriffskontrolle (RBAC)</li>
            <li>✅ Email-Verifizierung & Passwort-Reset</li>
            <li>✅ Admin-Dashboard für User-Management</li>
            <li>✅ TypeScript für Type-Safety</li>
            <li>✅ PostgreSQL Datenbank</li>
            <li>✅ Docker-basiertes Deployment</li>
          </ul>
        </div>

        <div className="info-section">
          <h2>Test-Accounts</h2>
          <div className="test-accounts">
            <div className="account-card">
              <h4>Admin</h4>
              <p>admin@meincms.local</p>
              <span className="password">admin123</span>
            </div>
            <div className="account-card">
              <h4>Operator</h4>
              <p>operator@meincms.local</p>
              <span className="password">operator123</span>
            </div>
            <div className="account-card">
              <h4>User</h4>
              <p>user@meincms.local</p>
              <span className="password">user123</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
