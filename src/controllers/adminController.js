import User from '../models/User.js';
import bcrypt from 'bcrypt';

// Obtener todos los usuarios (para administradores)
export const getAllUsers = async (req, res) => {
  try {
    // Excluir la contraseña de la respuesta
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un usuario específico por ID (para administradores)
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, '-password');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar un usuario (para administradores)
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const adminId = req.user.id;
    
    // Verificar que el usuario a actualizar existe
    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Verificar si el usuario a actualizar es administrador
    if (userToUpdate.role === 'admin' && userId !== adminId) {
      return res.status(403).json({ 
        message: 'No tienes permiso para modificar a otros administradores' 
      });
    }
    
    // Excluir campos sensibles que no deben ser modificados por esta ruta
    const { password, ...updateData } = req.body;
    
    // Actualizar el usuario
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...updateData },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar un usuario (para administradores)
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const adminId = req.user.id;
    
    // No permitir auto-eliminación
    if (userId === adminId) {
      return res.status(400).json({ message: 'No puedes eliminar tu propia cuenta' });
    }
    
    // Verificar si el usuario a eliminar es administrador
    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    if (userToDelete.role === 'admin') {
      return res.status(403).json({ 
        message: 'No tienes permiso para eliminar a otros administradores' 
      });
    }
    
    await User.findByIdAndDelete(userId);
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};