import mongoose from 'mongoose';
import User from './models/User.js'; 
import Task from './models/taskModel.js'; 
import dbConfig from './config/dbConfig.js'; 
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'mongodb';

const { GridFSBucket } = pkg;
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Conectar a MongoDB
mongoose.connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true });

// Configuración de GridFS
let gfs;
mongoose.connection.once('open', () => {
  gfs = new GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads'
  });
});

// Función para subir una imagen a GridFS
const uploadImageToGridFS = (filePath, filename) => {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(filePath);
    const uploadStream = gfs.openUploadStream(filename);
    
    readStream.pipe(uploadStream);
    
    uploadStream.on('finish', () => {
      resolve(uploadStream.id);
    });
    
    uploadStream.on('error', (error) => {
      reject(error);
    });
  });
};

const seedDatabase = async () => {
  try {
    // Limpiar la base de datos
    await User.deleteMany();
    await Task.deleteMany();
    
    // Eliminar archivos existentes en GridFS
    const files = await mongoose.connection.db.collection('uploads.files').find({}).toArray();
    for (const file of files) {
      await gfs.delete(file._id);
    }

    // Subir imagen de perfil para admin
    const adminImagePath = path.join(__dirname, '../frontend/public/images/profiles/boss.jpg');
    const adminImageId = await uploadImageToGridFS(adminImagePath, 'boss.jpg');
    console.log('Imagen del admin subida con éxito, ID:', adminImageId);

    // Crear usuarios de ejemplo
    const users = [
      { username: 'admin', password: 'password', image: adminImageId, role: 'admin' },
      { username: 'user1', password: 'password', role: 'user' },
    ];

    // Encriptar contraseñas y guardar usuarios
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = new User({ ...user, password: hashedPassword });
      await newUser.save();
      console.log(`Usuario ${user.username} creado con éxito.`);
    }

    // Crear tareas de ejemplo
    const tasks = [
      { title: 'Tarea 1', description: 'Descripción de la tarea 1', status: 'pending' },
      { title: 'Tarea 2', description: 'Descripción de la tarea 2', status: 'completed' },
    ];

    // Guardar tareas
    for (const task of tasks) {
      const newTask = new Task(task);
      await newTask.save();
    }

    console.log('Tareas creadas con éxito.');
    console.log('Base de datos sembrada correctamente.');
  } catch (error) {
    console.error('Error al sembrar la base de datos:', error);
  } finally {
    // Cerrar la conexión después de 1 segundo para asegurar que todas las operaciones se completaron
    setTimeout(() => {
      mongoose.connection.close();
      console.log('Conexión a la base de datos cerrada.');
    }, 1000);
  }
};

// Ejecutar el seeder
seedDatabase();