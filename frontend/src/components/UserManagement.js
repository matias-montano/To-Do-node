import React, { useState, useEffect } from 'react';
import { getToken } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import './Styles/UserManagement.css';

const UserManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    fetchUsers();
    fetchCurrentUser();
  }, []);
  
  const fetchUsers = async () => {
    try {
      const token = getToken();
      const response = await fetch('http://localhost:4000/api/v1/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        throw new Error('Error al obtener usuarios');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCurrentUser = async () => {
    try {
      const token = getToken();
      const response = await fetch('http://localhost:4000/api/v1/auth/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data);
      }
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
    }
  };
  
  const handleSaveUser = async (e) => {
    e.preventDefault();
    
    try {
      // Si el usuario está editando su propia cuenta
      if (currentUser && editingUser._id === currentUser.id) {
        // No permitir cambiar el rol ni el estado si es administrador editándose a sí mismo
        if (currentUser.role === 'admin' && 
            (editingUser.role !== currentUser.role || editingUser.status !== 'active')) {
          setError("Como administrador, no puedes cambiar tu propio rol o desactivar tu cuenta");
          return;
        }
      }
      
      const token = getToken();
      const response = await fetch(`http://localhost:4000/api/v1/admin/users/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editingUser)
      });
      
      if (response.ok) {
        await fetchUsers();
        setEditingUser(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar usuario');
      }
    } catch (error) {
      setError(error.message);
    }
  };
  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        const token = getToken();
        const response = await fetch(`http://localhost:4000/api/v1/admin/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          await fetchUsers();
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al eliminar usuario');
        }
      } catch (error) {
        setError(error.message);
      }
    }
  };
  
  // Verificar si el usuario actual puede editar al usuario seleccionado
  const canEditUser = (user) => {
    // Si el usuario seleccionado es admin y no es el usuario actual, no puede editarlo
    return !(user.role === 'admin' && currentUser && user._id !== currentUser.id);
  };
  
  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;
  
  return (
    <div className="user-management-container">
      <h1>Gestión de Usuarios</h1>
      
      {/* Formulario de edición */}
      {editingUser && (
        <div className="edit-form-container">
          <h2>Editar Usuario</h2>
          <form onSubmit={handleSaveUser}>
            <div className="form-group">
              <label>Nombre de Usuario</label>
              <input
                type="text"
                value={editingUser.username}
                onChange={(e) => setEditingUser({...editingUser, username: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={editingUser.email}
                onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                value={editingUser.firstName || ''}
                onChange={(e) => setEditingUser({...editingUser, firstName: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Apellido</label>
              <input
                type="text"
                value={editingUser.lastName || ''}
                onChange={(e) => setEditingUser({...editingUser, lastName: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Cargo</label>
              <input
                type="text"
                value={editingUser.position || ''}
                onChange={(e) => setEditingUser({...editingUser, position: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Departamento</label>
              <input
                type="text"
                value={editingUser.department || ''}
                onChange={(e) => setEditingUser({...editingUser, department: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Rol</label>
              <select
                value={editingUser.role}
                onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                disabled={editingUser.role === 'admin'}
              >
                <option value="user">Usuario</option>
                <option value="fullstack-dev">Desarrollador Full Stack</option>
                <option value="frontend-dev">Desarrollador Frontend</option>
                <option value="backend-dev">Desarrollador Backend</option>
                <option value="designer">Diseñador</option>
                <option value="qa-engineer">QA Engineer</option>
                <option value="devops-engineer">DevOps Engineer</option>
                <option value="team-lead">Team Lead</option>
                <option value="project-manager">Project Manager</option>
                <option value="product-owner">Product Owner</option>
              </select>
              {editingUser.role === 'admin' && (
                <p className="admin-note">No se puede cambiar el rol de un administrador</p>
              )}
            </div>
            
            <div className="form-group">
              <label>Estado</label>
              <select
                value={editingUser.status}
                onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
              >
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
                <option value="on-leave">De licencia</option>
              </select>
            </div>
            
            <div className="form-buttons">
              <button type="submit" className="save-button">Guardar cambios</button>
              <button 
                type="button" 
                className="cancel-button"
                onClick={() => setEditingUser(null)}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Tabla de usuarios */}
      <table className="users-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Email</th>
            <th>Nombre</th>
            <th>Cargo</th>
            <th>Departamento</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} className={user.role === 'admin' ? 'admin-row' : ''}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{`${user.firstName || ''} ${user.lastName || ''}`}</td>
              <td>{user.position || '-'}</td>
              <td>{user.department || '-'}</td>
              <td>
                <span className={`role-badge ${user.role}`}>{user.role}</span>
              </td>
              <td>
                <span className={`status-badge ${user.status}`}>{user.status}</span>
              </td>
              <td className="actions-cell">
                {canEditUser(user) ? (
                  <button 
                    className="edit-button"
                    onClick={() => setEditingUser(user)}
                  >
                    Editar
                  </button>
                ) : (
                  <button 
                    className="edit-button disabled"
                    disabled
                    title="No puedes editar a otro administrador"
                  >
                    Editar
                  </button>
                )}
                {user.role !== 'admin' && (
                  <button 
                    className="delete-button"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Eliminar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;