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

    // Subir imágenes de perfil
    const adminImagePath = path.join(__dirname, '../frontend/public/images/profiles/boss.jpg');
    const devImagePath = path.join(__dirname, '../frontend/public/images/profiles/dev.jpg');
    const designerImagePath = path.join(__dirname, '../frontend/public/images/profiles/designer.jpg');

    const adminImageId = await uploadImageToGridFS(adminImagePath, 'boss.jpg');
    const devImageId = await uploadImageToGridFS(devImagePath, 'dev.jpg');
    const designerImageId = await uploadImageToGridFS(designerImagePath, 'designer.jpg');

    // Crear usuarios de ejemplo con datos más completos
    const users = [
      {
        username: 'admin',
        password: 'password',
        email: 'admin@company.com',
        phoneNumber: '+1234567890',
        image: adminImageId,
        position: 'Project Manager',
        department: 'Management',
        firstName: 'Jane',
        lastName: 'Doe',
        dateOfBirth: new Date('1985-05-15'),
        skills: ['Leadership', 'Agile', 'Scrum', 'Project Management'],
        role: 'admin',
        status: 'active'
      },
      {
        username: 'developer',
        password: 'password',
        email: 'dev@company.com',
        phoneNumber: '+1234567891',
        image: devImageId,
        position: 'Senior Developer',
        department: 'Engineering',
        firstName: 'John',
        lastName: 'Smith',
        dateOfBirth: new Date('1990-03-20'),
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
        role: 'fullstack-dev',
        status: 'active'
      },
      {
        username: 'designer',
        password: 'password',
        email: 'designer@company.com',
        phoneNumber: '+1234567892',
        image: designerImageId,
        position: 'UI/UX Designer',
        department: 'Design',
        firstName: 'Mike',
        lastName: 'Jordan',
        dateOfBirth: new Date('1988-11-10'),
        skills: ['UI Design', 'UX Research', 'Figma', 'Adobe XD'],
        role: 'designer',
        status: 'active'
      }
    ];

    // Encriptar contraseñas y guardar usuarios
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = new User({ 
        ...user, 
        password: hashedPassword,
        joinedAt: new Date(),
        lastActive: new Date()
      });
      await newUser.save();
      console.log(`Usuario ${user.username} creado con éxito.`);
    }

    // Crear tareas de ejemplo más detalladas
    const tasks = [
      {
        title: 'Diseño de Dashboard',
        description: 'Crear el diseño del dashboard principal con widgets personalizables',
        status: 'pending', // Cambiado de 'in-progress' a 'pending'
        priority: 'high',
        assignee: null,
        storyPoints: 8,
        comments: []
      },
      {
        title: 'Implementar Autenticación',
        description: 'Implementar sistema de autenticación con JWT y roles de usuario',
        status: 'todo',
        priority: 'high',
        assignee: null,
        storyPoints: 5,
        comments: []
      },
      {
        title: 'Optimización de Base de Datos',
        description: 'Optimizar queries y agregar índices para mejor rendimiento',
        status: 'pending',
        priority: 'medium',
        assignee: null,
        storyPoints: 3,
        comments: []
      }
    ];
    
    // ...existing code...

    // Obtener usuarios creados para asignar tareas
    const savedUsers = await User.find();
    
    // Guardar tareas con asignaciones
    for (const task of tasks) {
      // Asignar aleatoriamente a un usuario
      const randomUser = savedUsers[Math.floor(Math.random() * savedUsers.length)];
      const newTask = new Task({
        ...task,
        assignee: randomUser._id,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      await newTask.save();
      console.log(`Tarea "${task.title}" creada y asignada a ${randomUser.username}`);
    }

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