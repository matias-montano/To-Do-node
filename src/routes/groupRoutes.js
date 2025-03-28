import express from 'express';
import { isAdmin } from '../middleware/adminCheck.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import { 
  createGroup, 
  getGroups, 
  getGroupById, 
  updateGroup, 
  deleteGroup, 
  addMember,
  removeMember,  
  updateMemberRole  
} from '../controllers/groupController.js';

const router = express.Router();

// Rutas públicas (requieren autenticación)
router.get('/', verifyToken, getGroups);

// Rutas solo para admin
router.post('/', isAdmin, createGroup);
router.put('/:id', isAdmin, updateGroup);
router.delete('/:id', isAdmin, deleteGroup);
router.get('/:id', verifyToken, getGroupById);

// Rutas para gestión de miembros
router.post('/:groupId/members', isAdmin, addMember);
router.delete('/:groupId/members/:userId', isAdmin, removeMember); 
router.put('/:groupId/members/:userId', isAdmin, updateMemberRole); 

export default router;