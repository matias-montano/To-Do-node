import React, { useState, useEffect } from 'react';
import { getToken } from '../services/authService';

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
  
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Bienvenido al Main</h1>
      <p>Esta es la página principal después de iniciar sesión.</p>
      <p>Esta es la página principal después de iniciar sesión.</p>
      {userData && (
        <div style={{ marginTop: '20px' }}>
          <h2>Perfil de Usuario</h2>
          <p>Usuario: {userData.username}</p>
          {userData.imageId && (
            <img 
              src={`http://localhost:4000/auth/images/${userData.imageId}`}
              alt="Perfil de usuario"
              style={{ width: '150px', height: '150px', borderRadius: '50%', marginTop: '10px' }}
            />
          )}
        </div>
      )}
      
      <button
        onClick={onLogout}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Main;