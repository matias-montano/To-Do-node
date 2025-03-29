import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../services/authService';
import './Styles/CreateProject.css';

const CreateProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  
  const [project, setProject] = useState({
    name: '',
    description: '',
    group: '',
    methodology: 'scrum',
    status: 'planning',
    priority: 'medium',
    targetEndDate: '',
    tags: '',
    // Campos avanzados 
    kanbanColumns: [
      { name: 'Por hacer', order: 1, wipLimit: 10 },
      { name: 'En progreso', order: 2, wipLimit: 5 },
      { name: 'En revisión', order: 3, wipLimit: 3 },
      { name: 'Completado', order: 4, wipLimit: 0 }
    ],
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
    fetchGroups();
    fetchUsers();
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
      console.error('Error fetching groups:', error);
      setError('Error al cargar grupos');
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
      } else {
        throw new Error('Error al obtener usuarios');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
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

  const addMember = (userId, role = 'developer') => {
    if (selectedMembers.some(member => member.user === userId)) {
      return; // Evitar duplicados
    }
    
    setSelectedMembers([
      ...selectedMembers,
      { user: userId, role }
    ]);
  };

  const removeMember = (userId) => {
    setSelectedMembers(selectedMembers.filter(member => member.user !== userId));
  };

  const updateMemberRole = (userId, newRole) => {
    setSelectedMembers(
      selectedMembers.map(member => 
        member.user === userId 
          ? { ...member, role: newRole } 
          : member
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Preparar datos para enviar
      const projectData = {
        ...project,
        tags: project.tags ? project.tags.split(',').map(tag => tag.trim()) : [],
        members: selectedMembers
      };
      
      const token = getToken();
      const response = await fetch('http://localhost:4000/api/v1/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
      });

      if (response.ok) {
        navigate('/projects'); // Redirigir a la lista de proyectos
      } else {
        const data = await response.json();
        throw new Error(data.message || 'Error al crear el proyecto');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/projects');
  };

  return (
    <div className="create-project-container">
      <h1>Crear Nuevo Proyecto</h1>

      <div className="form-navigation">
        <button 
          className={activeSection === 'basic' ? 'active' : ''} 
          onClick={() => setActiveSection('basic')}
        >
          Información Básica
        </button>
        <button 
          className={activeSection === 'members' ? 'active' : ''} 
          onClick={() => setActiveSection('members')}
        >
          Miembros del Proyecto
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
              <label htmlFor="status">Estado Inicial</label>
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

        {/* SECCIÓN: MIEMBROS DEL PROYECTO */}
        <div className={`form-section ${activeSection === 'members' ? 'active' : ''}`}>
          <h2>Miembros del Proyecto</h2>
          
          <div className="members-selection">
            <div className="available-users">
              <h3>Usuarios Disponibles</h3>
              <div className="users-list">
                {users.map(user => (
                  <div key={user._id} className="user-item">
                    <div className="user-info">
                      <img src={user.image ? `http://localhost:4000/api/v1/auth/images/${user.image}` : '/default-avatar.png'} 
                           alt={user.username} className="user-avatar" />
                      <span>{user.firstName} {user.lastName} ({user.role})</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => addMember(user._id)}
                      disabled={selectedMembers.some(member => member.user === user._id)}
                    >
                      Añadir
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="selected-members">
              <h3>Miembros Seleccionados</h3>
              <div className="members-list">
                {selectedMembers.length === 0 ? (
                  <p>No hay miembros seleccionados</p>
                ) : (
                  selectedMembers.map(member => {
                    const user = users.find(u => u._id === member.user);
                    return user ? (
                      <div key={member.user} className="member-item">
                        <div className="member-info">
                          <img src={user.image ? `http://localhost:4000/api/v1/auth/images/${user.image}` : '/default-avatar.png'} 
                               alt={user.username} className="user-avatar" />
                          <span>{user.firstName} {user.lastName}</span>
                        </div>
                        <div className="member-role">
                          <select
                            value={member.role}
                            onChange={(e) => updateMemberRole(member.user, e.target.value)}
                          >
                            <option value="product-owner">Product Owner</option>
                            <option value="scrum-master">Scrum Master</option>
                            <option value="developer">Desarrollador</option>
                            <option value="tester">Tester</option>
                            <option value="stakeholder">Stakeholder</option>
                          </select>
                          <button type="button" onClick={() => removeMember(member.user)}>
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ) : null;
                  })
                )}
              </div>
            </div>
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
                  className="remove-column-button"
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
          <button type="submit" disabled={loading}>
            {loading ? 'Creando...' : 'Crear Proyecto'}
          </button>
          <button type="button" onClick={handleCancel}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;