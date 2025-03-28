import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import pkg from 'mongodb';
const { GridFSBucket } = pkg;

// Limpiar archivos GridFS existentes
export const cleanGridFS = async () => {
  console.log('Cleaning GridFS files...');
  try {
    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads'
    });
    
    // Obtener todos los archivos
    const files = await bucket.find().toArray();
    
    // Eliminar cada archivo
    for (const file of files) {
      await bucket.delete(file._id);
    }
    
    console.log(`Deleted ${files.length} files from GridFS`);
  } catch (error) {
    console.error('Error cleaning GridFS:', error);
  }
};

// Función para subir una imagen a GridFS
export const uploadImageToGridFS = async (filePath, filename) => {
  try {
    const bucket = new GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads'
    });
    
    const uploadStream = bucket.openUploadStream(filename);
    const readStream = fs.createReadStream(filePath);
    
    return new Promise((resolve, reject) => {
      readStream.pipe(uploadStream)
        .on('error', (error) => {
          console.error(`Error uploading ${filename}:`, error);
          reject(error);
        })
        .on('finish', () => {
          console.log(`Uploaded ${filename} to GridFS`);
          resolve(uploadStream.id);
        });
    });
  } catch (error) {
    console.error(`Error in uploadImageToGridFS for ${filename}:`, error);
    throw error;
  }
};