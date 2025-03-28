import React, { useState, useEffect } from 'react';
import { getToken } from '../services/authService';
import './Styles/Main.css';

const Main = ({ onLogout, user }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getToken();
        const response = await fetch('http://localhost:4000/auth/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } catch (error) {
        console.error('Error al obtener datos de usuario:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const getInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : '?';
  };
  
  return (
    <div className="main-container">
      <h1 className="main-title">Panel Principal</h1>
      
      {userData && (
        <div className="user-profile-container">
          <div className="user-avatar-container">
            {userData.imageId ? (
              <img 
                src={`http://localhost:4000/auth/images/${userData.imageId}`}
                alt="Perfil de usuario"
                className="user-avatar-image"
              />
            ) : (
              <div className="user-avatar-placeholder">
                {getInitials(userData.username)}
              </div>
            )}
          </div>
          <div className="user-info">
            <h2>{userData.username}</h2>
            <p>{userData.email}</p>
            <p className={`role-${userData.role?.toLowerCase() || 'user'}`}>
              {userData.role || 'Usuario'}
            </p>
          </div>
        </div>
      )}

      <div className="navigation-grid">
        {userData?.role === 'admin' && (
          <button className="navigation-button button-admin">
            <span className="button-icon">⚙️</span>
            <span className="button-text">Admin Panel</span>
          </button>
        )}
        <button className="navigation-button button-standard">
          <span className="button-icon">📝</span>
          <span className="button-text">Mis Tareas</span>
        </button>
        <button className="navigation-button button-standard">
          <span className="button-icon">📅</span>
          <span className="button-text">Calendario</span>
        </button>
        <button className="navigation-button button-standard">
          <span className="button-icon">👥</span>
          <span className="button-text">Equipo</span>
        </button>
      </div>
    </div>
  );
};

export default Main;