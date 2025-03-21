import React, { useState, useEffect } from 'react';
import { getToken } from '../services/authService';
import './Styles/Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    skills: ''
  });
  const [error, setError] = useState('');

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

  

  const handleEdit = () => {
    setEditForm({
      password: '',
      email: userData?.email || '',
      phoneNumber: userData?.phoneNumber || '',
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      dateOfBirth: userData?.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split('T')[0] : '',
      skills: userData?.skills?.join(', ') || '',
      image: null // Para el archivo de imagen
    });
    setIsEditing(true);
  };
  


  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditForm(prev => ({...prev, image: file}));
      // Crear URL para la vista previa
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Limpiar la URL de la vista previa cuando se desmonte el componente
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const token = getToken();
      const formData = new FormData();
      
      // Agregar imagen si se seleccionó una
      if (editForm.image) {
        formData.append('image', editForm.image);
        const imageResponse = await fetch('http://localhost:4000/auth/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
  
        if (imageResponse.ok) {
          const imageData = await imageResponse.json();
          editForm.imageId = imageData.fileId;
        }
      }
  
      // Actualizar datos del usuario
      const response = await fetch('http://localhost:4000/auth/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          password: editForm.password || undefined, // Solo enviar si hay cambio
          email: editForm.email,
          phoneNumber: editForm.phoneNumber,
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          dateOfBirth: editForm.dateOfBirth,
          skills: editForm.skills.split(',').map(skill => skill.trim()).filter(Boolean),
          imageId: editForm.imageId // ID de la imagen si se subió una nueva
        })
      });
  
      if (response.ok) {
        const updatedUser = await response.json();
        setUserData(updatedUser);
        setIsEditing(false);
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      setError('Error al actualizar el perfil: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <div className="profile-loading">Cargando...</div>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        {!isEditing ? (
          <>
            <div className="profile-header">
              <img
                src={userData?.imageId ? `http://localhost:4000/auth/images/${userData.imageId}` : '/images/ProfilePlaceholder.png'}
                alt="Perfil"
                className="profile-avatar"
              />
              <h1>{userData?.firstName} {userData?.lastName}</h1>
              <h2 className="profile-username">@{userData?.username}</h2>
              <span className="profile-role">{userData?.role}</span>
              <span className="profile-status">{userData?.status}</span>
            </div>
            
            <div className="profile-info">
              <h3>Información Personal</h3>
              <div className="info-section">
                <div className="info-item">
                  <label>Email:</label>
                  <span>{userData?.email}</span>
                </div>
                <div className="info-item">
                  <label>Teléfono:</label>
                  <span>{userData?.phoneNumber || 'No especificado'}</span>
                </div>
                <div className="info-item">
                  <label>Fecha de Nacimiento:</label>
                  <span>{userData?.dateOfBirth ? new Date(userData.dateOfBirth).toLocaleDateString() : 'No especificado'}</span>
                </div>
              </div>

              <h3>Información Profesional</h3>
              <div className="info-section">
                <div className="info-item">
                  <label>Cargo:</label>
                  <span>{userData?.position || 'No especificado'}</span>
                </div>
                <div className="info-item">
                  <label>Departamento:</label>
                  <span>{userData?.department || 'No especificado'}</span>
                </div>
                <div className="info-item">
                  <label>Fecha de Ingreso:</label>
                  <span>{userData?.joinedAt ? new Date(userData.joinedAt).toLocaleDateString() : 'No especificado'}</span>
                </div>
              </div>

              <h3>Habilidades</h3>
              <div className="skills-section">
                {userData?.skills?.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                )) || 'No se han especificado habilidades'}
              </div>

              <button className="edit-button" onClick={handleEdit}>
                Editar Perfil
              </button>
            </div>
          </>
        ) : (
                    <form onSubmit={handleSubmit} className="edit-form">
            <h3>Editar Perfil</h3>
            
            <div className="form-group image-upload">
    <label>Imagen de Perfil:</label>
    <input
      type="file"
      accept="image/*"
      onChange={handleImageChange}
      className="image-input"
    />
    {imagePreview && (
      <div className="image-preview">
        <img src={imagePreview} alt="Vista previa" />
      </div>
    )}
  </div>
          
            <div className="form-group">
              <label>Contraseña Nueva:</label>
              <input
                type="password"
                value={editForm.password}
                onChange={(e) => setEditForm({...editForm, password: e.target.value})}
                placeholder="Dejar en blanco para mantener la actual"
              />
            </div>
          
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                required
              />
            </div>
          
            <div className="form-group">
              <label>Teléfono:</label>
              <input
                type="tel"
                value={editForm.phoneNumber}
                onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
              />
            </div>
          
            <div className="form-group">
              <label>Nombre:</label>
              <input
                type="text"
                value={editForm.firstName}
                onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
              />
            </div>
          
            <div className="form-group">
              <label>Apellido:</label>
              <input
                type="text"
                value={editForm.lastName}
                onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
              />
            </div>
          
            <div className="form-group">
              <label>Fecha de Nacimiento:</label>
              <input
                type="date"
                value={editForm.dateOfBirth}
                onChange={(e) => setEditForm({...editForm, dateOfBirth: e.target.value})}
              />
            </div>
          
            <div className="form-group">
              <label>Habilidades (separadas por comas):</label>
              <input
                type="text"
                value={editForm.skills}
                onChange={(e) => setEditForm({...editForm, skills: e.target.value})}
                placeholder="ej: JavaScript, React, Node.js"
              />
            </div>
          
            {error && <div className="error-message">{error}</div>}
            
            <div className="button-group">
              <button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button type="button" onClick={() => setIsEditing(false)}>
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// Agregar la exportación por defecto
export default Profile;