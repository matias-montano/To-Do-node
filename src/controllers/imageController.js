import mongoose from 'mongoose';
import pkg from 'mongodb';

const { GridFSBucket } = pkg;

// Referencia global a GridFS
let gfs;
mongoose.connection.once('open', () => {
  gfs = new GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads'
  });
});

// Subir imagen
export const uploadImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se subió ninguna imagen.' });
    }
    console.log('Imagen subida con ID:', req.file.id);
    res.status(201).json({ 
      message: 'Imagen subida con éxito.', 
      fileId: req.file.id 
    });
  } catch (error) {
    console.error('Error en uploadImage:', error);
    res.status(500).json({ 
      message: 'Error al subir la imagen', 
      error: error.message 
    });
  }
};

// Obtener imagen
export const getImage = (req, res) => {
  try {
    const id = new mongoose.Types.ObjectId(req.params.id);
    const downloadStream = gfs.openDownloadStream(id);
    
    downloadStream.on('error', (error) => {
      console.error('Error al obtener imagen:', error);
      return res.status(404).json({ message: 'Imagen no encontrada' });
    });
    
    downloadStream.pipe(res);
  } catch (error) {
    console.error('Error en getImage:', error);
    res.status(500).json({ 
      message: 'Error al obtener la imagen', 
      error: error.message 
    });
  }
};