import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { getToken } from '../services/authService';
import './Styles/Main.css';

const Main = ({ onLogout, user }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getToken();
        // Updated URL to include /api/v1/ prefix
        const response = await fetch('http://localhost:4000/api/v1/auth/user', {
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
                // Updated URL to include /api/v1/ prefix
                src={`http://localhost:4000/api/v1/auth/images/${userData.imageId}`}
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
        {/* Nuevo botón para Notas */}
        <button 
          className="navigation-button button-standard"
          onClick={() => navigate('/notes')}
        >
          <span className="button-icon">📒</span>
          <span className="button-text">Mis Notas</span>
        </button>
        <button className="navigation-button button-standard">
          <span className="button-icon">📅</span>
          <span className="button-text">Calendario</span>
        </button>
        <button 
          className="navigation-button button-admin"
          onClick={() => navigate('/groups')}
        >
          <span className="button-icon">👥</span>
          <span className="button-text">Gestión de Grupos</span>
        </button>
      </div>
      <button 
        className="navigation-button button-standard"
        onClick={() => navigate('/groups-list')}
      >
        <span className="button-icon">🔍</span>
        <span className="button-text">Ver Grupos</span>
      </button>
      <button 
        className="navigation-button button-admin"
        onClick={() => navigate('/admin/users')}
      >
        <span className="button-icon">👤🔍</span>
        <span className="button-text">Gestión de Usuarios</span>
      </button>
      
      {userData?.role === 'admin' && (
        <button 
          className="navigation-button button-admin"
          onClick={() => navigate('/projects')}
        >
          <span className="button-icon">📊</span>
          <span className="button-text">Gestión de Proyectos</span>
        </button>
      )}
    </div>
  );
};

export default Main;