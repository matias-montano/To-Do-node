import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../services/authService';
import './Styles/Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  
  const logoPlaceholder = '/images/others/miniLogoProyecto.png';

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
      }
    };
    
    fetchUserData();
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  // Determinar qué imagen mostrar
  const avatarSrc = userData?.imageId 
    ? `http://localhost:4000/auth/images/${userData.imageId}`
    : '/images/ProfilePlaceholder.png';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => navigate('/main')}>
          <img
            src={logoPlaceholder}
            alt="Inicio"
            className="navbar-logo-img"
          />
        </div>

        {/* Usuario autenticado */}
        {user && (
          <div className="navbar-user">
            <button
              className="navbar-user-button"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <img
                src={avatarSrc}
                alt="Avatar"
                className="navbar-user-avatar"
              />
              <span className="navbar-user-name">{userData?.username || "Usuario"}</span>
              <svg
                className={`navbar-user-icon ${menuOpen ? 'rotate' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {menuOpen && (
              <div className="navbar-user-menu">
                <button
                  className="navbar-user-menu-item"
                  onClick={() => navigate('/profile')}
                >
                  Mi Perfil
                </button>
                <button
                  className="navbar-user-menu-item"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;