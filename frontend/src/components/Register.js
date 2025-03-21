import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Styles/Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Crear una URL para la vista previa
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Si no hay imagen, registrar sin imagen
      if (!image) {
        return await registerUser(null);
      }

      // Paso 1: Subir la imagen
      const imageFormData = new FormData();
      imageFormData.append('image', image);
      
      const imageResponse = await fetch('http://localhost:4000/auth/upload', {
        method: 'POST',
        body: imageFormData,
      });

      if (!imageResponse.ok) {
        throw new Error('Error al subir la imagen');
      }

      const imageData = await imageResponse.json();
      console.log('Imagen subida:', imageData); // Para debug

      // Paso 2: Registrar usuario con la imagen
      await registerUser(imageData.fileId);
      
    } catch (err) {
      console.error('Error completo:', err); // Para debug
      setError('Error: ' + (err.message || 'Error al conectar con el servidor'));
      setLoading(false);
    }
  };

  const registerUser = async (imageId) => {
    try {
      const registerResponse = await fetch('http://localhost:4000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          image: imageId
        }),
      });

      const registerData = await registerResponse.json();
      console.log('Registro completado:', registerData);
      
      if (registerResponse.ok) {
        navigate('/login');
      } else {
        setError(registerData.message || 'Error al registrarse');
      }
    } catch (err) {
      console.error('Error al registrar:', err);
      setError('Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Registro</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group image-upload">
          <label htmlFor="image-input">Foto de perfil</label>
          <input
            id="image-input"
            type="file"
            onChange={handleImageChange}
            accept="image/*"
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Vista previa" />
            </div>
          )}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Register;