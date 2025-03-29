import User from '../models/User.js';
import bcrypt from 'bcrypt';
import fs from 'fs';
import { uploadImageToGridFS } from './utils/gridfs.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name using ECMAScript modules syntax
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const seedUsers = async () => {
  console.log('Seeding users...');
  
  // Clean existing users
  await User.deleteMany({});
  
  // Hash passwords
  const salt = await bcrypt.genSalt(10);
  const adminPassword = await bcrypt.hash('password', salt);
  const developerPassword = await bcrypt.hash('password', salt);
  const designerPassword = await bcrypt.hash('password', salt);
  
  // Rutas correctas a las imágenes
  const adminImagePath = path.join(__dirname, '../public/profiles/boss.jpg');
  const developerImagePath = path.join(__dirname, '../public/profiles/dev.jpg');
  const designerImagePath = path.join(__dirname, '../public/profiles/designer.jpg');
  
  let adminImageId, developerImageId, designerImageId;
  
  try {
    // Verificar si los archivos existen antes de intentar subirlos
    if (fs.existsSync(adminImagePath)) {
      adminImageId = await uploadImageToGridFS(adminImagePath, 'admin_profile.jpg');
      console.log('Admin image uploaded successfully');
    } else {
      console.log('Admin image not found at:', adminImagePath);
    }
    
    if (fs.existsSync(developerImagePath)) {
      developerImageId = await uploadImageToGridFS(developerImagePath, 'developer_profile.jpg');
      console.log('Developer image uploaded successfully');
    } else {
      console.log('Developer image not found at:', developerImagePath);
    }
    
    if (fs.existsSync(designerImagePath)) {
      designerImageId = await uploadImageToGridFS(designerImagePath, 'designer_profile.jpg');
      console.log('Designer image uploaded successfully');
    } else {
      console.log('Designer image not found at:', designerImagePath);
    }
  } catch (error) {
    console.log('Failed to upload images, continuing without profile pictures');
    console.error(error);
  }
  
  // Create users
  const users = [
    {
      username: 'jana',
      email: 'jana.doe@example.com',
      password: adminPassword,
      firstName: 'Jana',
      lastName: 'Doe',
      role: 'admin',
      image: adminImageId,
      position: 'Project Director',
      department: 'Administration',
      phoneNumber: '+1234567890',
      dateOfBirth: new Date(1985, 5, 15),
      skills: ['Leadership', 'Project Management', 'Strategic Planning', 'Team Building'],
      status: 'active',
      lastActive: new Date()
    },
    {
      username: 'john',
      email: 'john.doe@example.com',
      password: developerPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'fullstack-dev',
      image: developerImageId,
      position: 'Senior Developer',
      department: 'Engineering',
      phoneNumber: '+1987654321',
      dateOfBirth: new Date(1990, 7, 22),
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express', 'Docker'],
      status: 'active',
      lastActive: new Date()
    },
    {
      username: 'Sam',
      email: 'Sam.smith@example.com',
      password: designerPassword,
      firstName: 'Sam',
      lastName: 'Smith',
      role: 'designer',
      image: designerImageId,
      position: 'UI/UX Designer',
      department: 'Design',
      phoneNumber: '+1122334455',
      dateOfBirth: new Date(1992, 3, 10),
      skills: ['UI Design', 'UX Research', 'Figma', 'Adobe XD', 'Sketch', 'Prototyping'],
      status: 'active',
      lastActive: new Date()
    }
  ];
  
  const createdUsers = await User.insertMany(users);
  console.log(`${createdUsers.length} users created successfully`);
  
  return createdUsers;
};