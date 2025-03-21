import express from 'express';
import { register, login } from '../controllers/authController.js';
import upload from '../config/gridFsConfig.js';
import mongoose from 'mongoose';
import pkg from 'mongodb';
import { verifyToken } from '../middleware/authMiddleware.js';
import { getCurrentUser } from '../controllers/UserController.js';

const { GridFSBucket } = pkg;

const router = express.Router();

// Configuración de GridFS para leer archivos
let gfs;
mongoose.connection.once('open', () => {
  gfs = new GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads'
  });
});

// Ruta para obtener imágenes
router.get('/images/:id', (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const downloadStream = gfs.openDownloadStream(id);
    
    downloadStream.on('error', () => {
      return res.status(404).json({ message: 'Imagen no encontrada' });
    });
    
    downloadStream.pipe(res);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la imagen', error: error.message });
  }
});

// Rutas existentes
router.post('/register', register);
router.post('/login', login);
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No se subió ninguna imagen.' });
  }
  res.status(201).json({ message: 'Imagen subida con éxito.', fileId: req.file.id });
});

// Ruta para obtener información del usuario actual
router.get('/user', verifyToken, getCurrentUser);

export default router;