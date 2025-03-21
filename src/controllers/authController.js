// controlador de registro
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

export const register = async (req, res) => {
  try {
    const {
      username,
      password,
      email,
      phoneNumber,
      image,
      position,
      department,
      firstName,
      lastName,
      dateOfBirth,
      skills
    } = req.body;

    // Validar campos requeridos
    if (!username || !password || !email) {
      return res.status(400).json({ 
        message: 'Usuario, contraseña y email son requeridos' 
      });
    }

    // Verificar si el usuario o email ya existen
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'El nombre de usuario o email ya están en uso' 
      });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario con todos los campos
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      phoneNumber,
      image,
      position,
      department,
      firstName,
      lastName,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      skills: skills || [],
      role: 'user',
      status: 'active',
      joinedAt: new Date()
    });

    // Guardar usuario
    await newUser.save();

    res.status(201).json({ 
      message: 'Usuario registrado exitosamente',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        imageId: newUser.image,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        position: newUser.position,
        department: newUser.department
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ 
      message: 'Error al registrar usuario', 
      error: error.message 
    });
  }
};

// Iniciar sesión
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Usuario o contraseña incorrectos' });
    }

    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, SECRET_KEY, {
      expiresIn: '1h',
    });

    res.json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
};