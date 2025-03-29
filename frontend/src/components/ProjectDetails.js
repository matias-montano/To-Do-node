import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getToken } from '../services/authService';
import './Styles/ProjectDetails.css';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('developer');

  useEffect(() => {
    fetchProjectDetails();
    fetchUsers();
  }, [id]);

  const fetchProjectDetails = async () => {
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:4000/api/v1/projects/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      } else {
        throw new Error('Error al obtener detalles del proyecto');
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
      const response = await fetch('http://localhost:4000/api/v1/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    
    if (!selectedUser) return;
    
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:4000/api/v1/projects/${id}/members`, {
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
        fetchProjectDetails();
        setSelectedUser('');
        setSelectedRole('developer');
        setShowAddMemberForm(false);
      } else {
        throw new Error('Error al añadir miembro');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('¿Estás seguro de eliminar este miembro del proyecto?')) {
      return;
    }
    
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:4000/api/v1/projects/${id}/members/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        fetchProjectDetails();
      } else {
        throw new Error('Error al eliminar miembro');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No definida';
    
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  const getMethodologyLabel = (methodology) => {
    const labels = {
      'scrum': 'Scrum',
      'kanban': 'Kanban',
      'xp': 'Extreme Programming',
      'lean': 'Lean',
      'other': 'Otra'
    };
    return labels[methodology] || methodology;
  };

  const getStatusLabel = (status) => {
    const labels = {
      'planning': 'Planificación',
      'active': 'Activo',
      'on-hold': 'En espera',
      'completed': 'Completado',
      'cancelled': 'Cancelado'
    };
    return labels[status] || status;
  };

  const getRoleLabel = (role) => {
    const labels = {
      'product-owner': 'Product Owner',
      'scrum-master': 'Scrum Master',
      'developer': 'Desarrollador',
      'tester': 'Tester',
      'stakeholder': 'Stakeholder'
    };
    return labels[role] || role;
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!project) return <div className="error">Proyecto no encontrado</div>;

  // Filtrar usuarios que no son miembros actuales del proyecto
  const availableUsers = users.filter(
    user => !project.members.some(member => member.user._id === user._id)
  );

  return (
    <div className="project-details-container">
      
<div className="header">
  <button className="back-button" onClick={() => navigate('/projects')}>
    Volver a Proyectos
  </button>
  <div className="project-title">
    <h1>{project.name}</h1>
    <div className="project-badges">
      <span className={`status-badge status-${project.status}`}>
        {getStatusLabel(project.status)}
      </span>
      <span className={`methodology-badge methodology-${project.methodology}`}>
        {getMethodologyLabel(project.methodology)}
      </span>
      <span className={`priority-badge priority-${project.priority}`}>
        Prioridad: {project.priority}
      </span>
    </div>
  </div>
  <button className="edit-button" onClick={() => navigate(`/projects/edit/${id}`)}>
    Editar Proyecto
  </button>
</div>

      <div className="project-sections">
        {/* Sección de información básica */}
        <section className="project-section">
          <h2>Información Básica</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Descripción:</label>
              <p>{project.description}</p>
            </div>
            <div className="info-item">
              <label>Grupo:</label>
              <p>{project.group?.name || 'No asignado'}</p>
            </div>
            <div className="info-item">
              <label>Fecha de inicio:</label>
              <p>{formatDate(project.startDate)}</p>
            </div>
            <div className="info-item">
              <label>Fecha objetivo:</label>
              <p>{formatDate(project.targetEndDate)}</p>
            </div>
            <div className="info-item">
              <label>Fecha actual de finalización:</label>
              <p>{formatDate(project.actualEndDate) || 'No finalizado'}</p>
            </div>
            {project.tags && project.tags.length > 0 && (
              <div className="info-item">
                <label>Etiquetas:</label>
                <div className="tags-list">
                  {project.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Sección de miembros */}
        <section className="project-section">
          <div className="section-header">
            <h2>Miembros del Proyecto</h2>
            <button 
              className="add-button"
              onClick={() => setShowAddMemberForm(!showAddMemberForm)}
            >
              {showAddMemberForm ? 'Cancelar' : 'Añadir Miembro'}
            </button>
          </div>

          {showAddMemberForm && (
            <form className="add-member-form" onSubmit={handleAddMember}>
              <div className="form-row">
                <div className="form-group">
                  <label>Usuario</label>
                  <select 
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    required
                  >
                    <option value="">Seleccionar Usuario</option>
                    {availableUsers.map(user => (
                      <option key={user._id} value={user._id}>
                        {user.firstName} {user.lastName} ({user.username})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Rol en el Proyecto</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                  >
                    <option value="developer">Desarrollador</option>
                    <option value="product-owner">Product Owner</option>
                    <option value="scrum-master">Scrum Master</option>
                    <option value="tester">Tester</option>
                    <option value="stakeholder">Stakeholder</option>
                  </select>
                </div>
                <button type="submit" className="submit-button">Añadir</button>
              </div>
            </form>
          )}

          <table className="members-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Nombre</th>
                <th>Rol</th>
                <th>Fecha de Unión</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {project.members.map(member => (
                <tr key={member.user._id}>
                  <td>
                    <div className="user-info">
                      {member.user.image ? (
                        <img 
                          src={`http://localhost:4000/api/v1/auth/images/${member.user.image}`}
                          alt={member.user.username}
                          className="user-avatar"
                        />
                      ) : (
                        <div className="user-avatar-placeholder">
                          {member.user.username ? member.user.username.charAt(0).toUpperCase() : '?'}
                        </div>
                      )}
                      <span>{member.user.username}</span>
                    </div>
                  </td>
                  <td>{member.user.firstName} {member.user.lastName}</td>
                  <td>{getRoleLabel(member.role)}</td>
                  <td>{formatDate(member.joinedAt)}</td>
                  <td>
                    <button 
                      className="remove-button"
                      onClick={() => handleRemoveMember(member.user._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Sección de Sprints */}
        {project.methodology === 'scrum' && project.sprints && (
          <section className="project-section">
            <h2>Sprints</h2>
            <div className="sprints-grid">
              {project.sprints.length === 0 ? (
                <p className="no-items">No hay sprints definidos</p>
              ) : (
                project.sprints.map((sprint, index) => (
                  <div key={index} className={`sprint-card status-${sprint.status}`}>
                    <div className="sprint-header">
                      <h3>{sprint.name}</h3>
                      <span className={`status-badge status-${sprint.status}`}>
                        {sprint.status}
                      </span>
                    </div>
                    <div className="sprint-body">
                      <div className="sprint-dates">
                        <span>Inicio: {formatDate(sprint.startDate)}</span>
                        <span>Fin: {formatDate(sprint.endDate)}</span>
                      </div>
                      <p className="sprint-goal">{sprint.goal}</p>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{width: `${sprint.completionPercentage}%`}}
                        >
                          {sprint.completionPercentage}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}

        {/* Sección Kanban */}
        {project.kanbanColumns && project.kanbanColumns.length > 0 && (
          <section className="project-section">
            <h2>Configuración Kanban</h2>
            <div className="kanban-columns-grid">
              {project.kanbanColumns.map((column, index) => (
                <div key={index} className="kanban-column">
                  <h3>{column.name}</h3>
                  <div className="column-info">
                    <span>Orden: {column.order}</span>
                    <span>WIP Limit: {column.wipLimit}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Sección de Artefactos */}
        <section className="project-section">
          <h2>Artefactos</h2>
          <div className="artifacts-list">
            {project.artifacts && Object.keys(project.artifacts).some(key => project.artifacts[key]) ? (
              <ul>
                {project.artifacts.productBacklog && (
                  <li>
                    <span className="artifact-label">Product Backlog:</span>
                    <a href={project.artifacts.productBacklog} target="_blank" rel="noopener noreferrer">
                      {project.artifacts.productBacklog}
                    </a>
                  </li>
                )}
                {project.artifacts.sprintBacklog && (
                  <li>
                    <span className="artifact-label">Sprint Backlog:</span>
                    <a href={project.artifacts.sprintBacklog} target="_blank" rel="noopener noreferrer">
                      {project.artifacts.sprintBacklog}
                    </a>
                  </li>
                )}
                {project.artifacts.burndownChart && (
                  <li>
                    <span className="artifact-label">Burndown Chart:</span>
                    <a href={project.artifacts.burndownChart} target="_blank" rel="noopener noreferrer">
                      {project.artifacts.burndownChart}
                    </a>
                  </li>
                )}
                {project.artifacts.definition && (
                  <li>
                    <span className="artifact-label">Definition of Done/Ready:</span>
                    <p className="definition-text">{project.artifacts.definition}</p>
                  </li>
                )}
              </ul>
            ) : (
              <p className="no-items">No hay artefactos definidos</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProjectDetails;