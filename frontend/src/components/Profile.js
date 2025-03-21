import React, { useState, useEffect } from 'react';
import { getToken } from '../services/authService';
import './Styles/Profile.css';

const Profile = () => {
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

  if (loading) {
    return <div className="profile-loading">Cargando...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img 
            src={userData?.imageId 
              ? `http://localhost:4000/auth/images/${userData.imageId}`
              : '/images/ProfilePlaceholder.png'
            }
            alt="Foto de perfil"
            className="profile-avatar"
          />
          <h1>{userData?.username}</h1>
          <span className="profile-role">{userData?.role}</span>
        </div>
        
        <div className="profile-info">
          <div className="info-item">
            <label>Usuario:</label>
            <span>{userData?.username}</span>
          </div>
          <div className="info-item">
            <label>Rol:</label>
            <span>{userData?.role === 'admin' ? 'Administrador' : 'Usuario'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;