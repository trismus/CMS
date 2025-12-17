import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { LoginWidget } from '../components/LoginWidget';
import { Navbar } from '../components/Navbar';

export const Home: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (isAuthenticated && isAdmin) {
    return <Navigate to="/admin" />;
  }

  return (
    <>
      <Navbar />
      <div className="home-page">
        {/* Hero Section */}
        <div className="home-hero">
          <div className="hero-content">
            <div className="hero-badge">🚀 Version 1.0</div>
            <h1>Willkommen bei MeinCMS</h1>
            <p className="hero-subtitle">
              Das moderne Content Management System für professionelle Websites.
              Entwickelt mit React, Node.js und PostgreSQL für maximale Performance und Sicherheit.
            </p>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🔐</div>
                <h3>Sichere Authentifizierung</h3>
                <p>JWT-basierte Auth mit 4 Benutzerrollen und Session-Management</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📧</div>
                <h3>Email-Verifizierung</h3>
                <p>Automatische Verifizierung & Passwort-Reset via E-Mail</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">👥</div>
                <h3>User-Management</h3>
                <p>Vollständiges Admin-Dashboard mit Rechteverwaltung</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3>Modern Stack</h3>
                <p>React 19, TypeScript, Express, PostgreSQL</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">📝</div>
                <h3>Content-Management</h3>
                <p>Intuitive Verwaltung von Posts und Kategorien</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🐳</div>
                <h3>Docker Ready</h3>
                <p>Komplettes Docker Compose Setup für schnellen Start</p>
              </div>
            </div>
          </div>

          <div className="login-section">
            <LoginWidget />
          </div>
        </div>

        {/* Tech Stack Section */}
        <div className="tech-stack-section">
          <div className="container">
            <h2>Moderne Technologien</h2>
            <p className="section-subtitle">Gebaut mit den besten Tools für Web-Entwicklung</p>
            <div className="tech-grid">
              <div className="tech-item">
                <div className="tech-logo">⚛️</div>
                <h4>React 19</h4>
                <p>Moderne UI-Bibliothek</p>
              </div>
              <div className="tech-item">
                <div className="tech-logo">📘</div>
                <h4>TypeScript</h4>
                <p>Type-Safety</p>
              </div>
              <div className="tech-item">
                <div className="tech-logo">🟢</div>
                <h4>Node.js</h4>
                <p>Backend Runtime</p>
              </div>
              <div className="tech-item">
                <div className="tech-logo">🐘</div>
                <h4>PostgreSQL</h4>
                <p>Relationale Datenbank</p>
              </div>
              <div className="tech-item">
                <div className="tech-logo">🔒</div>
                <h4>JWT</h4>
                <p>Sichere Tokens</p>
              </div>
              <div className="tech-item">
                <div className="tech-logo">🐳</div>
                <h4>Docker</h4>
                <p>Containerisierung</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features Detail Section */}
        <div className="features-detail-section">
          <div className="container">
            <div className="feature-detail">
              <div className="feature-detail-content">
                <h2>Leistungsstarke Benutzerverwaltung</h2>
                <p>
                  Verwalte deine Benutzer mit einem intuitiven Dashboard. Erstelle, bearbeite und lösche
                  Benutzer mit verschiedenen Rollen und Berechtigungen.
                </p>
                <ul className="feature-list">
                  <li>✅ 4 Benutzerrollen: Admin, Operator, User, Guest</li>
                  <li>✅ Hierarchisches Rechtesystem</li>
                  <li>✅ Benutzer-Suche und Filterung</li>
                  <li>✅ Email-Verifizierung</li>
                  <li>✅ Passwort-Reset Funktion</li>
                </ul>
              </div>
              <div className="feature-detail-visual">
                <div className="dashboard-preview">
                  <div className="preview-header">
                    <div className="preview-dots">
                      <span></span><span></span><span></span>
                    </div>
                    Admin Dashboard
                  </div>
                  <div className="preview-content">
                    <div className="preview-stats">
                      <div className="preview-stat">
                        <span>👥</span>
                        <div>125 Benutzer</div>
                      </div>
                      <div className="preview-stat">
                        <span>📝</span>
                        <div>48 Posts</div>
                      </div>
                      <div className="preview-stat">
                        <span>📁</span>
                        <div>12 Kategorien</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="feature-detail reverse">
              <div className="feature-detail-content">
                <h2>Content Management leicht gemacht</h2>
                <p>
                  Erstelle und verwalte Inhalte mit einem benutzerfreundlichen Editor.
                  Organisiere deine Posts in Kategorien für bessere Übersicht.
                </p>
                <ul className="feature-list">
                  <li>✅ WYSIWYG Editor</li>
                  <li>✅ Kategorie-Verwaltung</li>
                  <li>✅ Draft & Publish Workflow</li>
                  <li>✅ Medien-Upload</li>
                  <li>✅ SEO-Optimierung</li>
                </ul>
              </div>
              <div className="feature-detail-visual">
                <div className="editor-preview">
                  <div className="preview-header">
                    <div className="preview-dots">
                      <span></span><span></span><span></span>
                    </div>
                    Content Editor
                  </div>
                  <div className="preview-content">
                    <div className="editor-toolbar">
                      <span>B</span><span>I</span><span>U</span><span>≡</span>
                    </div>
                    <div className="editor-text">
                      <div className="editor-line"></div>
                      <div className="editor-line short"></div>
                      <div className="editor-line"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Test Accounts Section */}
        <div className="test-accounts-section">
          <div className="container">
            <h2>Schnellstart mit Demo-Accounts</h2>
            <p className="section-subtitle">Teste alle Features mit vorkonfigurierten Test-Accounts</p>
            <div className="test-accounts">
              <div className="account-card admin-card">
                <div className="account-icon">👑</div>
                <h4>Administrator</h4>
                <p className="account-email">admin@meincms.local</p>
                <span className="password">admin123</span>
                <p className="account-desc">Voller Zugriff auf alle Funktionen</p>
              </div>
              <div className="account-card operator-card">
                <div className="account-icon">⚙️</div>
                <h4>Operator</h4>
                <p className="account-email">operator@meincms.local</p>
                <span className="password">operator123</span>
                <p className="account-desc">Content- und User-Management</p>
              </div>
              <div className="account-card user-card">
                <div className="account-icon">👤</div>
                <h4>User</h4>
                <p className="account-email">user@meincms.local</p>
                <span className="password">user123</span>
                <p className="account-desc">Eingeschränkte Berechtigungen</p>
              </div>
              <div className="account-card guest-card">
                <div className="account-icon">🔓</div>
                <h4>Guest</h4>
                <p className="account-email">guest@meincms.local</p>
                <span className="password">guest123</span>
                <p className="account-desc">Nur Lese-Zugriff</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <div className="container">
            <h2>Bereit loszulegen?</h2>
            <p>Starte jetzt mit MeinCMS und erlebe modernes Content Management</p>
            <div className="cta-buttons">
              <a href="https://github.com/trismus/CMS" target="_blank" rel="noopener noreferrer" className="btn-cta primary">
                📦 Zum GitHub Repo
              </a>
              <a href="#login" className="btn-cta secondary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                🚀 Jetzt testen
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="home-footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-section">
                <h3>MeinCMS</h3>
                <p>Modernes Content Management System</p>
                <p className="footer-version">Version 1.0.0</p>
              </div>
              <div className="footer-section">
                <h4>Features</h4>
                <ul>
                  <li>User Management</li>
                  <li>Content Editor</li>
                  <li>Kategorien</li>
                  <li>Email-System</li>
                </ul>
              </div>
              <div className="footer-section">
                <h4>Technologie</h4>
                <ul>
                  <li>React & TypeScript</li>
                  <li>Node.js & Express</li>
                  <li>PostgreSQL</li>
                  <li>Docker</li>
                </ul>
              </div>
              <div className="footer-section">
                <h4>Links</h4>
                <ul>
                  <li><a href="https://github.com/trismus/CMS" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                  <li><a href="#documentation">Dokumentation</a></li>
                  <li><a href="#api">API Docs</a></li>
                  <li><a href="#support">Support</a></li>
                </ul>
              </div>
            </div>
            <div className="footer-bottom">
              <p>© 2025 MeinCMS. Entwickelt mit Claude Code.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};
