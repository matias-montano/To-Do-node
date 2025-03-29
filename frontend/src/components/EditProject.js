import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getToken } from '../services/authService';
import './Styles/CreateProject.css'; // Reutilizamos los estilos del formulario de creación

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [groups, setGroups] = useState([]);
  
  // Estado para almacenar los datos del proyecto
  const [project, setProject] = useState({
    name: '',
    description: '',
    group: '',
    methodology: 'scrum',
    status: 'planning',
    priority: 'medium',
    targetEndDate: '',
    tags: '',
    kanbanColumns: [],
    artifacts: {
      productBacklog: '',
      sprintBacklog: '',
      burndownChart: '',
      definition: ''
    }
  });

  // Mostrar diferentes secciones del formulario
  const [activeSection, setActiveSection] = useState('basic');

  useEffect(() => {
    fetchProjectDetails();
    fetchGroups();
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
        
        // Adaptar los datos al formato del formulario
        setProject({
          name: data.name || '',
          description: data.description || '',
          group: data.group?._id || '',
          methodology: data.methodology || 'scrum',
          status: data.status || 'planning',
          priority: data.priority || 'medium',
          targetEndDate: data.targetEndDate ? new Date(data.targetEndDate).toISOString().split('T')[0] : '',
          tags: data.tags ? data.tags.join(', ') : '',
          kanbanColumns: data.kanbanColumns || [],
          artifacts: {
            productBacklog: data.artifacts?.productBacklog || '',
            sprintBacklog: data.artifacts?.sprintBacklog || '',
            burndownChart: data.artifacts?.burndownChart || '',
            definition: data.artifacts?.definition || '',
          }
        });
      } else {
        throw new Error('Error al obtener detalles del proyecto');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
      console.error('Error fetching groups:', error);
    }
  };

  const handleProjectChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const handleNestedChange = (parent, field, value) => {
    setProject({
      ...project,
      [parent]: {
        ...project[parent],
        [field]: value
      }
    });
  };

  const handleKanbanColumnChange = (index, field, value) => {
    const updatedColumns = [...project.kanbanColumns];
    updatedColumns[index] = {
      ...updatedColumns[index],
      [field]: field === 'wipLimit' || field === 'order' ? Number(value) : value
    };
    setProject({ ...project, kanbanColumns: updatedColumns });
  };

  const addKanbanColumn = () => {
    const newColumn = {
      name: '',
      order: project.kanbanColumns.length + 1,
      wipLimit: 5
    };
    setProject({ ...project, kanbanColumns: [...project.kanbanColumns, newColumn] });
  };

  const removeKanbanColumn = (index) => {
    const updatedColumns = project.kanbanColumns.filter((_, i) => i !== index);
    setProject({ ...project, kanbanColumns: updatedColumns });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      // Preparar datos para enviar
      const projectData = {
        ...project,
        tags: project.tags ? project.tags.split(',').map(tag => tag.trim()) : []
      };
      
      const token = getToken();
      const response = await fetch(`http://localhost:4000/api/v1/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
      });

      if (response.ok) {
        navigate(`/projects/${id}`); // Redirigir a los detalles del proyecto
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Error al actualizar el proyecto');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/projects/${id}`);
  };

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="create-project-container">
      <div className="header">
        <button className="back-button" onClick={handleCancel}>
          Cancelar Edición
        </button>
        <h1>Editar Proyecto: {project.name}</h1>
      </div>

      <div className="form-navigation">
        <button 
          className={activeSection === 'basic' ? 'active' : ''} 
          onClick={() => setActiveSection('basic')}
        >
          Información Básica
        </button>
        <button 
          className={activeSection === 'kanban' ? 'active' : ''} 
          onClick={() => setActiveSection('kanban')}
        >
          Configuración Kanban
        </button>
        <button 
          className={activeSection === 'artifacts' ? 'active' : ''} 
          onClick={() => setActiveSection('artifacts')}
        >
          Artefactos
        </button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="create-project-form">
        {/* SECCIÓN: INFORMACIÓN BÁSICA */}
        <div className={`form-section ${activeSection === 'basic' ? 'active' : ''}`}>
          <h2>Información Básica</h2>
          
          <div className="form-group">
            <label htmlFor="name">Nombre del Proyecto *</label>
            <input
              id="name"
              name="name"
              type="text"
              value={project.name}
              onChange={handleProjectChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Descripción *</label>
            <textarea
              id="description"
              name="description"
              value={project.description}
              onChange={handleProjectChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="group">Grupo Asignado *</label>
            <select
              id="group"
              name="group"
              value={project.group}
              onChange={handleProjectChange}
              required
            >
              <option value="">Seleccionar Grupo</option>
              {groups.map(group => (
                <option key={group._id} value={group._id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="methodology">Metodología</label>
            <select
              id="methodology"
              name="methodology"
              value={project.methodology}
              onChange={handleProjectChange}
            >
              <option value="scrum">Scrum</option>
              <option value="kanban">Kanban</option>
              <option value="xp">Extreme Programming</option>
              <option value="lean">Lean</option>
              <option value="other">Otra</option>
            </select>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Estado</label>
              <select
                id="status"
                name="status"
                value={project.status}
                onChange={handleProjectChange}
              >
                <option value="planning">Planificación</option>
                <option value="active">Activo</option>
                <option value="on-hold">En espera</option>
                <option value="completed">Completado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="priority">Prioridad</label>
              <select
                id="priority"
                name="priority"
                value={project.priority}
                onChange={handleProjectChange}
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="critical">Crítica</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="targetEndDate">Fecha Estimada de Finalización</label>
            <input
              id="targetEndDate"
              name="targetEndDate"
              type="date"
              value={project.targetEndDate}
              onChange={handleProjectChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="tags">Etiquetas (separadas por comas)</label>
            <input
              id="tags"
              name="tags"
              type="text"
              value={project.tags}
              onChange={handleProjectChange}
              placeholder="desarrollo, frontend, api, ..."
            />
          </div>
        </div>

        {/* SECCIÓN: CONFIGURACIÓN KANBAN */}
        <div className={`form-section ${activeSection === 'kanban' ? 'active' : ''}`}>
          <h2>Configuración del Tablero Kanban</h2>
          
          <div className="kanban-columns">
            {project.kanbanColumns.map((column, index) => (
              <div key={index} className="kanban-column">
                <div className="form-group">
                  <label>Nombre de la columna</label>
                  <input
                    type="text"
                    value={column.name}
                    onChange={(e) => handleKanbanColumnChange(index, 'name', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Orden</label>
                  <input
                    type="number"
                    min="1"
                    value={column.order}
                    onChange={(e) => handleKanbanColumnChange(index, 'order', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Límite WIP</label>
                  <input
                    type="number"
                    min="0"
                    value={column.wipLimit}
                    onChange={(e) => handleKanbanColumnChange(index, 'wipLimit', e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => removeKanbanColumn(index)}
                >
                  Eliminar Columna
                </button>
              </div>
            ))}
            
            <button
              type="button"
              className="add-column-button"
              onClick={addKanbanColumn}
            >
              Añadir Columna
            </button>
          </div>
        </div>

        {/* SECCIÓN: ARTEFACTOS */}
        <div className={`form-section ${activeSection === 'artifacts' ? 'active' : ''}`}>
          <h2>Artefactos del Proyecto</h2>
          
          <div className="form-group">
            <label htmlFor="productBacklog">URL del Product Backlog</label>
            <input
              id="productBacklog"
              type="url"
              value={project.artifacts.productBacklog}
              onChange={(e) => handleNestedChange('artifacts', 'productBacklog', e.target.value)}
              placeholder="https://example.com/product-backlog"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="sprintBacklog">URL del Sprint Backlog</label>
            <input
              id="sprintBacklog"
              type="url"
              value={project.artifacts.sprintBacklog}
              onChange={(e) => handleNestedChange('artifacts', 'sprintBacklog', e.target.value)}
              placeholder="https://example.com/sprint-backlog"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="burndownChart">URL del Burndown Chart</label>
            <input
              id="burndownChart"
              type="url"
              value={project.artifacts.burndownChart}
              onChange={(e) => handleNestedChange('artifacts', 'burndownChart', e.target.value)}
              placeholder="https://example.com/burndown"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="definition">Definition of Done / Ready</label>
            <textarea
              id="definition"
              value={project.artifacts.definition}
              onChange={(e) => handleNestedChange('artifacts', 'definition', e.target.value)}
              placeholder="El código debe pasar todas las pruebas unitarias, estar revisado por pares, etc."
            />
          </div>
        </div>

        <div className="form-buttons">
          <button type="submit" disabled={submitting}>
            {submitting ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          <button type="button" onClick={handleCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProject;