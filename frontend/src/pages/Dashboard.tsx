import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { AdminLayout } from '../components/AdminLayout';

export const Dashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const statsRes = await adminAPI.getStats();
        setStats(statsRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin, navigate]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Lädt Dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p className="dashboard-subtitle">Willkommen zurück, {user?.username}!</p>
        </div>

        {stats && (
          <div className="stats-grid">
            <div className="stat-card users">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>Benutzer</h3>
                <p className="stat-number">{stats.stats.totalUsers}</p>
                <span className="stat-label">Gesamt registriert</span>
              </div>
            </div>
            <div className="stat-card posts">
              <div className="stat-icon">📝</div>
              <div className="stat-content">
                <h3>Beiträge</h3>
                <p className="stat-number">{stats.stats.totalPosts}</p>
                <span className="stat-label">Veröffentlicht</span>
              </div>
            </div>
            <div className="stat-card categories">
              <div className="stat-icon">📁</div>
              <div className="stat-content">
                <h3>Kategorien</h3>
                <p className="stat-number">{stats.stats.totalCategories}</p>
                <span className="stat-label">Aktiv</span>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: '3rem', background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Schnellzugriff</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <button
              onClick={() => navigate('/admin/posts')}
              style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'transform 0.2s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <span style={{ fontSize: '2rem' }}>📝</span>
              Posts verwalten
            </button>
            <button
              onClick={() => navigate('/admin/categories')}
              style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'transform 0.2s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <span style={{ fontSize: '2rem' }}>📁</span>
              Kategorien
            </button>
            <button
              onClick={() => navigate('/admin/users')}
              style={{
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'transform 0.2s ease',
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-3px)')}
              onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <span style={{ fontSize: '2rem' }}>👥</span>
              Benutzer
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
