import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h2>MeinCMS</h2>
        <p className="sidebar-subtitle">Admin Panel</p>
      </div>

      <div className="sidebar-menu">
        <div className="menu-section">
          <div className="menu-section-title">Übersicht</div>
          <Link
            to="/admin"
            className={`menu-item ${isActive('/admin') ? 'active' : ''}`}
          >
            <span className="menu-icon">📊</span>
            <span>Dashboard</span>
          </Link>
        </div>

        <div className="menu-section">
          <div className="menu-section-title">Content</div>
          <Link
            to="/admin/posts"
            className={`menu-item ${isActive('/admin/posts') ? 'active' : ''}`}
          >
            <span className="menu-icon">📝</span>
            <span>Posts</span>
          </Link>
          <Link
            to="/admin/categories"
            className={`menu-item ${isActive('/admin/categories') ? 'active' : ''}`}
          >
            <span className="menu-icon">📁</span>
            <span>Kategorien</span>
          </Link>
        </div>

        <div className="menu-section">
          <div className="menu-section-title">Verwaltung</div>
          <Link
            to="/admin/users"
            className={`menu-item ${isActive('/admin/users') ? 'active' : ''}`}
          >
            <span className="menu-icon">👥</span>
            <span>Benutzer</span>
          </Link>
        </div>

        <div className="menu-section">
          <div className="menu-section-title">System</div>
          <Link
            to="/admin/settings"
            className={`menu-item ${isActive('/admin/settings') ? 'active' : ''}`}
          >
            <span className="menu-icon">⚙️</span>
            <span>Einstellungen</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
