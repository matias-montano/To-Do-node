import express from 'express';
import { getAllTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js';
import { verifyToken, verifyRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas protegidas
router.get('/', verifyToken, getAllTasks); // Cualquier usuario autenticado puede ver las tareas
router.post('/', verifyToken, verifyRole(['admin']), createTask); // Solo los administradores pueden crear tareas
router.put('/:id', verifyToken, verifyRole(['admin']), updateTask); // Solo los administradores pueden actualizar tareas
router.delete('/:id', verifyToken, verifyRole(['admin']), deleteTask); // Solo los administradores pueden eliminar tareas

export default router;