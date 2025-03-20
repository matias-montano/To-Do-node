import mongoose from 'mongoose';
import User from './models/User.js'; 
import Task from './models/taskModel.js'; 
import dbConfig from './config/dbConfig.js'; 
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

// Conectar a MongoDB
mongoose.connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true });

const seedDatabase = async () => {
  try {
    // Limpiar la base de datos (opcional)
    await User.deleteMany();
    await Task.deleteMany();

    // Crear usuarios de ejemplo
    const users = [
      { username: 'admin', password: 'password', image: 'https://via.placeholder.com/150', role: 'admin' },
      { username: 'user1', password: 'password', image: 'https://via.placeholder.com/150', role: 'user' },
    ];

    // Encriptar contraseñas y guardar usuarios
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10); // Encriptar la contraseña
      const newUser = new User({ ...user, password: hashedPassword }); // Guardar la contraseña encriptada
      await newUser.save();
    }

    console.log('Usuarios creados con éxito.');

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

    // Cerrar la conexión
    mongoose.connection.close();
  } catch (error) {
    console.error('Error al sembrar la base de datos:', error);
    mongoose.connection.close();
  }
};

// Ejecutar el seeder
seedDatabase();