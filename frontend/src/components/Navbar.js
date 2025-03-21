import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Always use placeholder images
  const placeholderImage = '/images/ProfilePlaceholder.png';
  const logoPlaceholder = '/images/others/miniLogoProyecto.png';

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

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
                src={placeholderImage}
                alt="Avatar"
                className="navbar-user-avatar"
              />
              <span className="navbar-user-name">{user.name || "Usuario"}</span>
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

            {/* Menú desplegable */}
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