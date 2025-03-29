import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../services/authService';
import './Styles/ProjectManagement.css';

const ProjectManagement = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = getToken();
      const response = await fetch('http://localhost:4000/api/v1/projects', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      } else {
        throw new Error('Error al obtener proyectos');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('¿Estás seguro de eliminar este proyecto?')) {
      try {
        const token = getToken();
        const response = await fetch(`http://localhost:4000/api/v1/projects/${projectId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          await fetchProjects();
        } else {
          throw new Error('Error al eliminar proyecto');
        }
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const navigateToProjectDetails = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const navigateToCreateProject = () => {
    navigate('/projects/create');
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

  const formatDate = (dateString) => {
    if (!dateString) return 'No definida';
    
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses empiezan en 0
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };
  
  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="project-management-container">
      <h1>Gestión de Proyectos</h1>
      
      <button 
        className="create-project-button"
        onClick={navigateToCreateProject}
      >
        Crear Nuevo Proyecto
      </button>
      
      <div className="projects-grid">
        {projects.length === 0 ? (
          <p className="no-projects">No hay proyectos disponibles</p>
        ) : (
          projects.map(project => (
            <div key={project._id} className={`project-card status-${project.status}`}>
              <h3 className="project-name">{project.name}</h3>
              <div className="project-meta">
                <span className={`project-status status-${project.status}`}>
                  {getStatusLabel(project.status)}
                </span>
                <span className={`project-methodology methodology-${project.methodology}`}>
                  {getMethodologyLabel(project.methodology)}
                </span>
              </div>
              <p className="project-description">{project.description}</p>
              <div className="project-details">
                <div className="project-detail">
                  <span className="detail-label">Grupo:</span>
                  <span className="detail-value">{project.group?.name || 'No asignado'}</span>
                </div>
                <div className="project-detail">
                  <span className="detail-label">Inicio:</span>
                  <span className="detail-value">{formatDate(project.startDate)}</span>
                </div>
                <div className="project-detail">
                  <span className="detail-label">Finalización:</span>
                  <span className="detail-value">{formatDate(project.targetEndDate)}</span>
                </div>
                <div className="project-detail">
                  <span className="detail-label">Miembros:</span>
                  <span className="detail-value">{project.members?.length || 0}</span>
                </div>
                {project.sprints && (
                  <div className="project-detail">
                    <span className="detail-label">Sprints:</span>
                    <span className="detail-value">{project.sprints.length}</span>
                  </div>
                )}
              </div>
              <div className="project-actions">
                <button
                  className="view-button"
                  onClick={() => navigateToProjectDetails(project._id)}
                >
                  Ver Detalles
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteProject(project._id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectManagement;