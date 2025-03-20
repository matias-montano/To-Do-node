import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import './Styles/Welcome.css'; 

const Welcome = () => {
  const navigate = useNavigate(); // Hook para redirigir

  const handleCardClick = () => {
    navigate('/login'); // Redirige a la página de inicio de sesión
  };

  const handleRegisterClick = () => {
    navigate('/register'); // Redirige a la página de registro
  };

  return (
    <div className="welcome-container">
      <div className="card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
        <img
          className="card-image"
          src="/images/others/LogoProyecto.png" // Asegúrate de que la ruta sea correcta
          alt="Logo del Proyecto"
        />
        <div className="card-content">
          <h2 className="default-text">Bienvenido a To-Do App</h2>
          <h2 className="hovered-text">Haz clic para continuar</h2>
          <p className="default-text">
            Este es un sistema de gestión de tareas. Organiza tus pendientes de manera eficiente.
          </p>
          <p className="hovered-text">Haz clic para iniciar sesión</p>
        </div>
      </div>
      {/* Texto para redirigir al registro */}
      <div className="register-link" style={{ marginTop: '10px', textAlign: 'center' }}>
        <p>
          ¿No registrado?{' '}
          <span
            onClick={handleRegisterClick}
            style={{ color: '#4caf50', cursor: 'pointer', textDecoration: 'underline' }}
          >
            Haga clic aquí para registrarse
          </span>
        </p>
      </div>
    </div>
  );
};

export default Welcome;