import Note from '../models/Note.js';
import mongoose from 'mongoose';

// Obtener todas las notas (filtradas según permisos)
export const getNotes = async (req, res) => {
  try {
    const { projectId, sprintId, authorId, tags, status } = req.query;
    const filter = {};
    
    // Filtros opcionales
    if (projectId) filter.project = projectId;
    if (sprintId) filter.sprint = sprintId;
    if (authorId) filter.author = authorId;
    if (tags) {
      const tagArray = tags.split(',');
      filter.tags = { $in: tagArray };
    }
    if (status) filter.status = status;
    
    // Si no es admin, solo puede ver notas públicas o propias
    if (req.user.role !== 'admin') {
      filter.$or = [
        { author: req.user.id },
        { isPublic: true }
      ];
    }
    
    try {
      // Remove the sprint population which is causing the error
      const notes = await Note.find(filter)
        .populate('author', 'username firstName lastName image')
        .populate('project', 'name')
        // Remove this line: .populate('sprint', 'name')
        .sort({ createdAt: -1 });
        
      res.json(notes);
    } catch (populateError) {
      console.error('Error populating notes:', populateError);
      // Fall back to returning notes without population
      const notes = await Note.find(filter).sort({ createdAt: -1 });
      res.json(notes);
    }
  } catch (error) {
    console.error('Error in getNotes:', error);
    res.status(500).json({ message: error.message });
  }
};


// Obtener una nota específica por ID
export const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de nota inválido' });
    }
    
    const note = await Note.findById(id)
      .populate('author', 'username firstName lastName image')
      .populate('project', 'name');
      // Remove this line: .populate('sprint', 'name');
    
    if (!note) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }
    
    // Verificar permisos: el usuario es admin, autor de la nota o la nota es pública
    if (req.user.role !== 'admin' && 
        note.author._id.toString() !== req.user.id && 
        !note.isPublic) {
      return res.status(403).json({ message: 'No tienes permiso para ver esta nota' });
    }
    
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear una nueva nota
export const createNote = async (req, res) => {
  try {
    const { 
      title, 
      content, 
      contentFormat, 
      project, 
      sprint,
      tags,
      status,
      pinned,
      isPublic
    } = req.body;
    
    // Crear la nueva nota
    const note = new Note({
      title,
      content,
      contentFormat: contentFormat || 'markdown',
      project,
      sprint,
      author: req.user.id,
      tags: tags ? (typeof tags === 'string' ? tags.split(',') : tags) : [],
      status: status || 'published',
      pinned: pinned || false,
      isPublic: isPublic || false
    });
    
    await note.save();
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar una nota
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // No permitir actualizar el autor
    const { author, ...safeUpdates } = updates;
    
    // Si tenemos tags como string, convertirlos a array
    if (typeof safeUpdates.tags === 'string') {
      safeUpdates.tags = safeUpdates.tags.split(',');
    }
    
    const note = await Note.findById(id);
    
    if (!note) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }
    
    // Solo el autor o un admin pueden actualizar la nota
    if (note.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para actualizar esta nota' });
    }
    
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      safeUpdates,
      { new: true, runValidators: true }
    );
    
    res.json(updatedNote);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar una nota
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    
    const note = await Note.findById(id);
    
    if (!note) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }
    
    // Solo el autor o un admin pueden eliminar la nota
    if (note.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta nota' });
    }
    
    await Note.findByIdAndDelete(id);
    
    res.json({ message: 'Nota eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Añadir archivo adjunto a una nota
export const addAttachment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, fileId, mimeType } = req.body;
    
    const note = await Note.findById(id);
    
    if (!note) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }
    
    // Solo el autor o un admin pueden añadir archivos
    if (note.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para actualizar esta nota' });
    }
    
    note.attachments.push({
      name,
      fileId,
      mimeType,
      uploadedAt: new Date()
    });
    
    await note.save();
    
    res.json(note);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar un archivo adjunto de una nota
export const removeAttachment = async (req, res) => {
  try {
    const { id, attachmentId } = req.params;
    
    const note = await Note.findById(id);
    
    if (!note) {
      return res.status(404).json({ message: 'Nota no encontrada' });
    }
    
    // Solo el autor o un admin pueden eliminar archivos
    if (note.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permiso para actualizar esta nota' });
    }
    
    note.attachments = note.attachments.filter(
      attachment => attachment._id.toString() !== attachmentId
    );
    
    await note.save();
    
    res.json(note);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};