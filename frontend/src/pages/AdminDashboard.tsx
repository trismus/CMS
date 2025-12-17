import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';

export const AdminDashboard: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          adminAPI.getStats(),
          adminAPI.getUsers({ limit: 20 }),
        ]);
        setStats(statsRes.data);
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
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await adminAPI.deleteUser(id);
      setUsers(users.filter((u) => u.id !== id));
    } catch (error) {
      alert('Failed to delete user');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <h1>Admin Dashboard</h1>
        <div>
          <span style={{ marginRight: '20px' }}>Welcome, {user?.username}!</span>
          <button onClick={logout} style={{ padding: '8px 16px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
            <h3>Total Users</h3>
            <p style={{ fontSize: '32px', margin: '10px 0' }}>{stats.stats.totalUsers}</p>
          </div>
          <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
            <h3>Total Posts</h3>
            <p style={{ fontSize: '32px', margin: '10px 0' }}>{stats.stats.totalPosts}</p>
          </div>
          <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
            <h3>Total Categories</h3>
            <p style={{ fontSize: '32px', margin: '10px 0' }}>{stats.stats.totalCategories}</p>
          </div>
        </div>
      )}

      <h2>User Management</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Username</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Role</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
            <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '12px' }}>{u.id}</td>
              <td style={{ padding: '12px' }}>{u.username}</td>
              <td style={{ padding: '12px' }}>{u.email}</td>
              <td style={{ padding: '12px' }}>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: u.role === 'admin' ? '#4CAF50' : '#2196F3',
                  color: 'white',
                  fontSize: '12px',
                }}>
                  {u.role}
                </span>
              </td>
              <td style={{ padding: '12px' }}>
                {u.is_active ? '✓ Active' : '✗ Inactive'}
                {u.is_verified && ' | ✓ Verified'}
              </td>
              <td style={{ padding: '12px' }}>
                <button
                  onClick={() => handleDeleteUser(u.id)}
                  disabled={u.id === user?.id}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: u.id === user?.id ? '#ccc' : '#f44336',
                    color: 'white',
                    border: 'none',
                    cursor: u.id === user?.id ? 'not-allowed' : 'pointer',
                    borderRadius: '4px',
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
