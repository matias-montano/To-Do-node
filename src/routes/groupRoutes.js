import express from 'express';
import { isAdmin } from '../middleware/adminCheck.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import {
  createGroup,
  getGroups,
  updateGroup,
  deleteGroup,
  addMember
} from '../controllers/groupController.js';

const router = express.Router();

// Rutas públicas (requieren autenticación)
router.get('/', verifyToken, getGroups); // Añadir verifyToken aquí

// Rutas solo para admin
router.post('/', isAdmin, createGroup);
router.put('/:id', isAdmin, updateGroup);
router.delete('/:id', isAdmin, deleteGroup);
router.post('/:groupId/members', isAdmin, addMember);

export default router;