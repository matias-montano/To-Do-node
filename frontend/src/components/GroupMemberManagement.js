import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getToken } from '../services/authService';
import './Styles/GroupMemberManagement.css';

const GroupMemberManagement = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('member');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGroupDetails();
    fetchUsers();
  }, [groupId]);

  const fetchGroupDetails = async () => {
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:4000/api/v1/groups/${groupId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setGroup(data);
      } else {
        throw new Error('Error al obtener detalles del grupo');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

const fetchUsers = async () => {
  try {
    const token = getToken();
    // Usar la ruta correcta para obtener usuarios
    const response = await fetch('http://localhost:4000/api/v1/auth/users', {
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
    console.error('Error fetching users:', error);
    setError('Error al obtener usuarios');
  }
};

  const addMember = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const token = getToken();
      const response = await fetch(`http://localhost:4000/api/v1/groups/${groupId}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: selectedUser,
          role: selectedRole
        })
      });

      if (response.ok) {
        fetchGroupDetails();
        setSelectedUser('');
        setSelectedRole('member');
      } else {
        throw new Error('Error al añadir miembro');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const removeMember = async (userId) => {
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:4000/api/v1/groups/${groupId}/members/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchGroupDetails();
      } else {
        throw new Error('Error al eliminar miembro');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const updateMemberRole = async (userId, newRole) => {
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:4000/api/v1/groups/${groupId}/members/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          role: newRole
        })
      });

      if (response.ok) {
        fetchGroupDetails();
      } else {
        throw new Error('Error al actualizar rol del miembro');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!group) return <div className="error-message">Grupo no encontrado</div>;

  // Filtrar usuarios que no están ya en el grupo
  const availableUsers = users.filter(
    user => !group.members.some(member => member.user._id === user._id)
  );

  return (
    <div className="member-management-container">
      <div className="header">
        <button className="back-button" onClick={() => navigate('/groups')}>
          Volver a Grupos
        </button>
        <h1>Gestión de Miembros: {group.name}</h1>
      </div>

      <div className="add-member-form">
        <h3>Añadir Nuevo Miembro</h3>
        <form onSubmit={addMember}>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            required
          >
            <option value="">Seleccionar Usuario</option>
            {availableUsers.map(user => (
              <option key={user._id} value={user._id}>
                {user.username} ({user.email})
              </option>
            ))}
          </select>
          
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="member">Miembro</option>
            <option value="admin">Administrador</option>
          </select>
          
          <button type="submit" disabled={!selectedUser}>
            Añadir Miembro
          </button>
        </form>
      </div>

      <div className="members-list">
        <h3>Miembros Actuales</h3>
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Fecha de Ingreso</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {group.members.map(member => (
              <tr key={member.user._id}>
                <td>{member.user.username}</td>
                <td>{member.user.email}</td>
                <td>
                  <select
                    value={member.role}
                    onChange={(e) => updateMemberRole(member.user._id, e.target.value)}
                  >
                    <option value="member">Miembro</option>
                    <option value="admin">Administrador</option>
                  </select>
                </td>
                <td>{new Date(member.joinedAt).toLocaleDateString()}</td>
                <td>
                  <button 
                    className="remove-button"
                    onClick={() => removeMember(member.user._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GroupMemberManagement;