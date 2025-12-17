import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { AdminLayout } from '../components/AdminLayout';

export const AdminUsers: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const usersRes = await adminAPI.getUsers({ limit: 50 });
        setUsers(usersRes.data.users);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin, navigate]);

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Möchten Sie diesen Benutzer wirklich löschen?')) return;

    try {
      await adminAPI.deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
    } catch (error) {
      alert('Fehler beim Löschen des Benutzers');
    }
  };

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin': return 'role-badge admin';
      case 'operator': return 'role-badge operator';
      case 'user': return 'role-badge user';
      case 'guest': return 'role-badge guest';
      default: return 'role-badge';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Lädt Benutzer...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="dashboard-container">
        <div className="user-management-section">
          <div className="section-header">
            <div>
              <h2>Benutzerverwaltung</h2>
              <p style={{ color: '#666', marginTop: '0.5rem' }}>
                Verwalte alle registrierten Benutzer
              </p>
            </div>
            <div className="search-box">
              <input
                type="text"
                placeholder="Suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Benutzername</th>
                  <th>Email</th>
                  <th>Rolle</th>
                  <th>Status</th>
                  <th>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="no-results">
                      Keine Benutzer gefunden
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>
                        <div className="user-cell">
                          <span className="user-avatar">{u.username.charAt(0).toUpperCase()}</span>
                          <span>{u.username}</span>
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span className={getRoleBadgeClass(u.role)}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <div className="status-cell">
                          {u.is_active ? (
                            <span className="status-badge active">✓ Aktiv</span>
                          ) : (
                            <span className="status-badge inactive">✗ Inaktiv</span>
                          )}
                          {u.is_verified && (
                            <span className="status-badge verified">✓ Verifiziert</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          disabled={u.id === user?.id}
                          className={`btn-delete ${u.id === user?.id ? 'disabled' : ''}`}
                          title={u.id === user?.id ? 'Sie können sich nicht selbst löschen' : 'Benutzer löschen'}
                        >
                          Löschen
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
