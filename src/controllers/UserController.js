import User from '../models/User.js';

// Controlador para obtener datos del usuario actual
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Devolver datos del usuario, incluyendo ID de imagen
    res.json({
      id: user._id,
      username: user.username,
      role: user.role,
      imageId: user.image
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
  }
};