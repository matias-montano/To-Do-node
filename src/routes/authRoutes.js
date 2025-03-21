import express from 'express';
import { register, login } from '../controllers/authController.js';
import upload from '../config/gridFsConfig.js';
import mongoose from 'mongoose';
import pkg from 'mongodb';
const { GridFSBucket } = pkg;

const router = express.Router();

// Configuración de GridFS para leer archivos
let gfs;
mongoose.connection.once('open', () => {
  gfs = new GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads'
  });
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

// Nueva ruta para servir imágenes (AÑADIR ESTO)
router.get('/images/:id', (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    
    // Buscar el archivo por ID
    gfs.find({ _id: id }).toArray((err, files) => {
      if (err || !files || files.length === 0) {
        return res.status(404).json({ message: 'Imagen no encontrada' });
      }
      
      // Configurar headers
      res.set('Content-Type', files[0].contentType);
      
      // Crear stream de lectura
      const readStream = gfs.openDownloadStream(id);
      readStream.pipe(res);
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la imagen', error });
  }
});

export default router;