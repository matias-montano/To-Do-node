import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { 
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  addAttachment,
  removeAttachment
} from '../controllers/noteController.js';

const router = express.Router();

// Rutas para notas (todas requieren autenticación)
router.get('/', verifyToken, getNotes);
router.get('/:id', verifyToken, getNoteById);
router.post('/', verifyToken, createNote);
router.put('/:id', verifyToken, updateNote);
router.delete('/:id', verifyToken, deleteNote);

// Rutas para archivos adjuntos
router.post('/:id/attachments', verifyToken, addAttachment);
router.delete('/:id/attachments/:attachmentId', verifyToken, removeAttachment);

export default router;