import React, { useState, useEffect } from 'react';
import { getToken } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import './Styles/GroupManagement.css';

const GroupManagement = ({ user }) => {
  const navigate = useNavigate();
  const [editingGroup, setEditingGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    visibility: 'private'
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const token = getToken();
      const response = await fetch('http://localhost:4000/api/v1/groups', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setGroups(data);
      } else {
        throw new Error('Error al obtener grupos');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditGroup = async (groupId) => {
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:4000/api/v1/groups/${groupId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editingGroup.name,
          description: editingGroup.description,
          visibility: editingGroup.visibility
        })
      });

      if (response.ok) {
        await fetchGroups();
        setEditingGroup(null);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    if (window.confirm('¿Estás seguro de eliminar este grupo?')) {
      try {
        const token = getToken();
        const response = await fetch(`http://localhost:4000/api/v1/groups/${groupId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          await fetchGroups();
        }
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      const response = await fetch('http://localhost:4000/api/v1/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newGroup)
      });

      if (response.ok) {
        await fetchGroups();
        setShowCreateForm(false);
        setNewGroup({ name: '', description: '', visibility: 'private' });
      } else {
        throw new Error('Error al crear grupo');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // Función para navegar a la gestión de miembros
  const goToMemberManagement = (groupId) => {
    navigate(`/groups/members/${groupId}`);
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="group-management-container">
      <h1>Gestión de Grupos</h1>
      
      <button 
        className="create-group-button"
        onClick={() => setShowCreateForm(!showCreateForm)}
      >
        {showCreateForm ? 'Cancelar' : 'Crear Nuevo Grupo'}
      </button>
  
      {/* Formulario de Crear/Editar */}
      {(showCreateForm || editingGroup) && (
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            editingGroup ? handleEditGroup(editingGroup._id) : handleCreateGroup(e);
          }} 
          className="create-group-form"
        >
          <h3>{editingGroup ? 'Editar Grupo' : 'Crear Nuevo Grupo'}</h3>
          <input
            type="text"
            placeholder="Nombre del grupo"
            value={editingGroup ? editingGroup.name : newGroup.name}
            onChange={(e) => editingGroup ? 
              setEditingGroup({...editingGroup, name: e.target.value}) :
              setNewGroup({...newGroup, name: e.target.value})
            }
            required
          />
          <textarea
            placeholder="Descripción"
            value={editingGroup ? editingGroup.description : newGroup.description}
            onChange={(e) => editingGroup ?
              setEditingGroup({...editingGroup, description: e.target.value}) :
              setNewGroup({...newGroup, description: e.target.value})
            }
          />
          <select
            value={editingGroup ? editingGroup.visibility : newGroup.visibility}
            onChange={(e) => editingGroup ?
              setEditingGroup({...editingGroup, visibility: e.target.value}) :
              setNewGroup({...newGroup, visibility: e.target.value})
            }
          >
            <option value="private">Privado</option>
            <option value="public">Público</option>
          </select>
          <div className="form-buttons">
            <button type="submit">
              {editingGroup ? 'Guardar Cambios' : 'Crear Grupo'}
            </button>
            <button 
              type="button" 
              onClick={() => {
                setEditingGroup(null);
                setShowCreateForm(false);
              }}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
  
      {/* Lista de Grupos */}
      <div className="groups-grid">
        {groups.map(group => (
          <div key={group._id} className="group-card">
            <h3>{group.name}</h3>
            <p className="group-description">{group.description}</p>
            <div className="group-info">
              <span className={`visibility-badge ${group.visibility}`}>
                {group.visibility === 'private' ? 'Privado' : 'Público'}
              </span>
              <span className="members-count">
                Miembros: {group.members.length}
              </span>
            </div>
            <div className="group-actions">
              <button 
                className="edit-button"
                onClick={() => setEditingGroup(group)}
              >
                Editar
              </button>
              <button 
                className="members-button"
                onClick={() => goToMemberManagement(group._id)}
              >
                Miembros
              </button>
              <button 
                className="delete-button"
                onClick={() => handleDeleteGroup(group._id)}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupManagement;