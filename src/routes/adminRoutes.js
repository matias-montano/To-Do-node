import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminCheck.js';
import { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser 
} from '../controllers/adminController.js';

const router = express.Router();

// Todas las rutas requieren autenticación y rol de administrador
router.use(verifyToken, isAdmin);

// Rutas de administración de usuarios
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;