// Objetivo: Componente para iniciar sesión
// Nota: Este componente se encarga de mostrar un formulario para iniciar sesión y de enviar los datos al servidor para autenticar al usuario.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redireccionar
import { login } from '../services/authService';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Llamar a la función login del servicio
    const result = await login(username, password);

    // Si recibimos el token, notificar al padre y redirigir
    if (result.token) {
      onLogin(); 
      navigate('/main');
    } else {
      setError(result.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div>
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Iniciar Sesión</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;