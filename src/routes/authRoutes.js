import express from 'express';
import { register, login } from '../controllers/authController.js';
import upload from '../config/gridFsConfig.js';
import mongoose from 'mongoose';
import pkg from 'mongodb';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getCurrentUser, updateUser } from '../controllers/UserController.js';
import { uploadImage, getImage } from '../controllers/imageController.js'; // Importar controladores de imágenes

const { GridFSBucket } = pkg;

const router = express.Router();

// Configuración de GridFS para leer archivos
let gfs;
mongoose.connection.once('open', () => {
  gfs = new GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads'
  });
});

// Rutas de imágenes
router.get('/images/:id', getImage);
router.post('/upload', upload.single('image'), uploadImage);

// Rutas existentes
router.post('/register', register);
router.post('/login', login);

// Ruta para obtener información del usuario actual
router.get('/user', verifyToken, getCurrentUser);


// ruta para actualizar usuario
router.put('/user/update', verifyToken, updateUser);

export default router;