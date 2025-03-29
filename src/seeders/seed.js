import mongoose from 'mongoose';
import dbConfig from '../config/dbConfig.js';
import dotenv from 'dotenv';
import { seedUsers } from './userSeeder.js';
import { seedGroups } from './groupSeeder.js';
import { seedProjects } from './projectSeeder.js';
import { cleanGridFS } from './utils/gridfs.js';

dotenv.config();

// Ejecutar el seeder después de conectarse a la base de datos
const seedDatabase = async () => {
  try {
    // Conectar a MongoDB primero
    await mongoose.connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Successfully connected to MongoDB');
    
    console.log('Starting database seeding...');
    
    // Clean GridFS files
    await cleanGridFS();
    
    // Seed in order to maintain dependencies
    const users = await seedUsers();
    const groups = await seedGroups(users);
    const projects = await seedProjects(users, groups);
    
    console.log('Database seeded successfully!');
    console.log(`Created ${users.length} users`);
    console.log(`Created ${groups.length} groups`);
    console.log(`Created ${projects.length} projects`);
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close connection after all operations complete
    setTimeout(() => {
      mongoose.connection.close();
      console.log('Database connection closed.');
    }, 1000);
  }
};

// Execute the seeder
seedDatabase();