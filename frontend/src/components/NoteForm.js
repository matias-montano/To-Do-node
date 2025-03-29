import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getToken } from '../services/authService';
import './Styles/NoteForm.css';

const NoteForm = () => {
  const { projectId, noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState({
    title: '',
    content: '',
    contentFormat: 'markdown',
    project: projectId || '',
    tags: '',
    status: 'published',
    isPublic: false
  });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(!!noteId);

  useEffect(() => {
    fetchProjects();
    if (noteId) {
      fetchNoteDetails();
    }
  }, [noteId]);

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
        
        // If no projectId was specified and we have projects, set the first one as default
        if (!projectId && data.length > 0 && !note.project) {
          setNote(prev => ({ ...prev, project: data[0]._id }));
        }
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchNoteDetails = async () => {
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:4000/api/v1/notes/${noteId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNote({
          title: data.title,
          content: data.content,
          contentFormat: data.contentFormat || 'markdown',
          project: data.project._id,
          tags: data.tags ? data.tags.join(', ') : '',
          status: data.status,
          isPublic: data.isPublic
        });
      } else {
        throw new Error('Error al obtener detalles de la nota');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNote(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const token = getToken();
      
      // Format tags as array
      const formattedNote = {
        ...note,
        tags: note.tags ? note.tags.split(',').map(tag => tag.trim()) : []
      };
      
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing 
        ? `http://localhost:4000/api/v1/notes/${noteId}`
        : 'http://localhost:4000/api/v1/notes';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formattedNote)
      });
      
      if (response.ok) {
        const savedNote = await response.json();
        navigate(`/notes/${savedNote._id}`);
      } else {
        throw new Error(`Error al ${isEditing ? 'actualizar' : 'crear'} la nota`);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="note-form-container">
      <h1>{isEditing ? 'Editar Nota' : 'Nueva Nota'}</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Título</label>
          <input
            type="text"
            id="title"
            name="title"
            value={note.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Contenido</label>
          <textarea
            id="content"
            name="content"
            value={note.content}
            onChange={handleChange}
            rows="10"
            required
          ></textarea>
        </div>
        
        <div className="form-group">
          <label htmlFor="project">Proyecto</label>
          <select
            id="project"
            name="project"
            value={note.project}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un proyecto</option>
            {projects.map(project => (
              <option key={project._id} value={project._id}>{project.name}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="tags">Etiquetas (separadas por coma)</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={note.tags}
            onChange={handleChange}
            placeholder="documentación, api, desarrollo"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Estado</label>
            <select
              id="status"
              name="status"
              value={note.status}
              onChange={handleChange}
            >
              <option value="draft">Borrador</option>
              <option value="published">Publicada</option>
            </select>
          </div>
          
          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              id="isPublic"
              name="isPublic"
              checked={note.isPublic}
              onChange={handleChange}
            />
            <label htmlFor="isPublic">Nota pública</label>
          </div>
        </div>
        
        <div className="form-buttons">
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            className="cancel-button"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="save-button"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar Nota'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteForm;