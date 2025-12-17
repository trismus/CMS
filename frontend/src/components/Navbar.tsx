import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h1>MeinCMS</h1>
        </div>

        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <div className="user-info">
                <span className="username">{user?.username}</span>
                <span className="user-role">{user?.role}</span>
              </div>
              <button onClick={handleLogout} className="btn-logout">
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => navigate('/')} className="btn-login">
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
