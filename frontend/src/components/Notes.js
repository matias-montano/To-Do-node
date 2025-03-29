import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getToken } from '../services/authService';
import './Styles/Notes.css';
import { FaPlus, FaSearch, FaFilter } from 'react-icons/fa';

const NotesList = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  
  const [notes, setNotes] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    status: '',
    tag: '',
    search: ''
  });

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
    fetchNotes();
  }, [projectId]);

  useEffect(() => {
    if (!loading) {
      fetchNotes();
    }
  }, [filter.status, filter.tag]);

  const fetchProject = async () => {
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:4000/api/v1/projects/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      }
    } catch (error) {
      console.error('Error al obtener proyecto:', error);
    }
  };

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      let url = 'http://localhost:4000/api/v1/notes?';
      if (projectId) url += `projectId=${projectId}&`;
      if (filter.status) url += `status=${filter.status}&`;
      if (filter.tag) url += `tags=${filter.tag}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      } else {
        throw new Error('Error al obtener notas');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = () => {
    navigate(projectId ? `/projects/${projectId}/notes/new` : '/notes/new');
  };

  const handleNoteClick = (noteId) => {
    navigate(`/notes/${noteId}`);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter(prev => ({ ...prev, [name]: value }));
  };

  const filterNotesBySearch = (notes) => {
    if (!filter.search) return notes;
    
    return notes.filter(note => 
      note.title.toLowerCase().includes(filter.search.toLowerCase()) ||
      note.content.toLowerCase().includes(filter.search.toLowerCase())
    );
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;

  const filteredNotes = filterNotesBySearch(notes);
  
  // Extraer tags únicos de todas las notas
  const uniqueTags = [...new Set(notes.flatMap(note => note.tags || []))];

  return (
    <div className="notes-container">
      <div className="notes-header">
        <h1>
          {project ? `Notas: ${project.name}` : 'Mis Notas'}
        </h1>
        <button className="create-note-button" onClick={handleCreateNote}>
          <FaPlus /> Nueva Nota
        </button>
      </div>

      <div className="filters-container">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            name="search"
            value={filter.search}
            onChange={handleFilterChange}
            placeholder="Buscar notas..."
          />
        </div>
        
        <div className="filter-selects">
          <select
            name="status"
            value={filter.status}
            onChange={handleFilterChange}
          >
            <option value="">Todos los estados</option>
            <option value="draft">Borradores</option>
            <option value="published">Publicadas</option>
            <option value="archived">Archivadas</option>
          </select>
          
          <select
            name="tag"
            value={filter.tag}
            onChange={handleFilterChange}
          >
            <option value="">Todas las etiquetas</option>
            {uniqueTags.map(tag => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="no-notes">
          <p>No hay notas disponibles</p>
        </div>
      ) : (
        <div className="notes-grid">
          {filteredNotes.map(note => (
            <div 
              key={note._id} 
              className={`note-card ${note.pinned ? 'pinned' : ''} status-${note.status}`}
              onClick={() => handleNoteClick(note._id)}
            >
              <h3 className="note-title">{note.title}</h3>
              <p className="note-preview">
                {note.content.length > 100 
                  ? note.content.substring(0, 100) + '...' 
                  : note.content}
              </p>
              <div className="note-footer">
                <div className="note-tags">
                  {note.tags && note.tags.map(tag => (
                    <span key={tag} className="note-tag">{tag}</span>
                  ))}
                </div>
                <div className="note-meta">
                  <span className="note-author">
                    Por: {note.author ? `${note.author.firstName || ''} ${note.author.lastName || ''}` : 'Usuario desconocido'}
                  </span>
                  <span className="note-date">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotesList;