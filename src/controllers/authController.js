import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

// Registrar usuarios
export const register = async (req, res) => {
  try {
    const { username, password, image } = req.body;

    // Validar campos requeridos
    if (!username || !password) {
      return res.status(400).json({ message: 'Usuario y contraseña son requeridos' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario con la imagen
    const newUser = new User({
      username,
      password: hashedPassword,
      image: image, // Asignar directamente el ID de la imagen
      role: 'user'
    });

    // Guardar usuario
    await newUser.save();

    console.log('Usuario creado:', {
      id: newUser._id,
      username: newUser.username,
      role: newUser.role,
      imageId: newUser.image
    });

    res.status(201).json({ 
      message: 'Usuario registrado exitosamente',
      user: {
        id: newUser._id,
        username: newUser.username,
        role: newUser.role,
        imageId: newUser.image // Incluir el ID de la imagen en la respuesta
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