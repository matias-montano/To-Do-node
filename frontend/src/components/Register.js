import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password || !image) {
      setError('Todos los campos son obligatorios');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      // Paso 1: Subir la imagen
      const imageFormData = new FormData();
      imageFormData.append('image', image);
      
      const imageResponse = await fetch('http://localhost:4000/auth/upload', {
        method: 'POST',
        body: imageFormData,
      });

      const imageData = await imageResponse.json();
      
      if (!imageResponse.ok) {
        throw new Error(imageData.message || 'Error al subir la imagen');
      }

      // Paso 2: Registrar el usuario con el ID de la imagen
      const registerResponse = await fetch('http://localhost:4000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          image: imageData.fileId // Usar el ID de archivo devuelto
        }),
      });

      const registerData = await registerResponse.json();
      
      if (registerResponse.ok) {
        navigate('/login');
      } else {
        setError(registerData.message || 'Error al registrarse');
      }
    } catch (err) {
      setError('Error: ' + (err.message || 'Error al conectar con el servidor'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Registro</h1>
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
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Register;