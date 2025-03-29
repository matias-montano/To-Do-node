import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getToken } from '../services/authService';
import './Styles/NoteDetail.css';

const NoteDetail = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNoteDetails();
  }, [noteId]);

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
        setNote(data);
      } else {
        throw new Error('Error al obtener detalles de la nota');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Está seguro de que desea eliminar esta nota?')) {
      return;
    }
    
    try {
      const token = getToken();
      const response = await fetch(`http://localhost:4000/api/v1/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        navigate('/notes');
      } else {
        throw new Error('Error al eliminar la nota');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!note) return <div className="not-found">Nota no encontrada</div>;

  return (
    <div className="note-detail-container">
      <div className="note-header">
        <h1>{note.title}</h1>
        <div className="note-meta">
          <span className="note-author">
            Por: {note.author ? `${note.author.firstName || ''} ${note.author.lastName || ''}` : 'Usuario desconocido'}
          </span>
          <span className="note-date">
            {new Date(note.createdAt).toLocaleDateString()}
          </span>
          <span className={`note-status status-${note.status}`}>
            {note.status === 'published' ? 'Publicada' : note.status === 'draft' ? 'Borrador' : 'Archivada'}
          </span>
        </div>
        {note.tags && note.tags.length > 0 && (
          <div className="note-tags">
            {note.tags.map(tag => (
              <span key={tag} className="note-tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
      
      <div className="note-content">
        {note.contentFormat === 'markdown' ? (
          <div className="markdown-content">
            {/* Ideally you would use a markdown renderer here */}
            <pre>{note.content}</pre>
          </div>
        ) : (
          <p>{note.content}</p>
        )}
      </div>
      
      <div className="note-actions">
        <button 
          onClick={() => navigate('/notes')}
          className="back-button"
        >
          Volver a la lista
        </button>
        <button 
          onClick={() => navigate(`/notes/${noteId}/edit`)}
          className="edit-button"
        >
          Editar
        </button>
        <button 
          onClick={handleDelete}
          className="delete-button"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default NoteDetail;