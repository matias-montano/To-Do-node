import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/Navbar.css'; // Archivo CSS para estilos

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    onLogout(); // Llama a la función de logout pasada como prop
    navigate('/'); // Redirige a la página de inicio
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="navbar-logo" onClick={() => navigate('/main')}>
          <img
            src="/images/others/miniLogoProyecto.png" // Ruta correcta desde la raíz del servidor
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
                src={user.image || '/images/ProfilePlaceholder.png'} // Imagen del usuario o placeholder
                alt="Avatar"
                className="navbar-user-avatar"
              />
              <span className="navbar-user-name">{user.name}</span>
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