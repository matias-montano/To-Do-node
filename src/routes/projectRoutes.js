import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminCheck.js';
import { 
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
  createSprint,
  updateSprintStatus
} from '../controllers/projectController.js';

const router = express.Router();

// Rutas accesibles para usuarios autenticados
router.get('/', verifyToken, getProjects);
router.get('/:id', verifyToken, getProjectById);

// Rutas que requieren privilegios de administrador
router.post('/', verifyToken, isAdmin, createProject);
router.put('/:id', verifyToken, isAdmin, updateProject);
router.delete('/:id', verifyToken, isAdmin, deleteProject);

// Gestión de miembros del proyecto (solo admin)
router.post('/:projectId/members', verifyToken, isAdmin, addProjectMember);
router.delete('/:projectId/members/:userId', verifyToken, isAdmin, removeProjectMember);

// Gestión de sprints (solo admin)
router.post('/:projectId/sprints', verifyToken, isAdmin, createSprint);
router.patch('/:projectId/sprints/:sprintId', verifyToken, isAdmin, updateSprintStatus);

export default router;