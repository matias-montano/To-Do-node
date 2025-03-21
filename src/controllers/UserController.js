import User from '../models/User.js';

// Controlador para obtener datos del usuario actual
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      position: user.position,
      department: user.department,
      dateOfBirth: user.dateOfBirth,
      skills: user.skills,
      role: user.role,
      status: user.status,
      joinedAt: user.joinedAt,
      imageId: user.image
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
  }
};

// actualizar usuario
export const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      firstName, 
      lastName, 
      dateOfBirth, 
      skills,
      email,       
      phoneNumber,
      imageId  
    } = req.body;

    // Verificar si el email ya existe para otro usuario
    if (email) {
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: userId } 
      });
      if (existingUser) {
        return res.status(400).json({ 
          message: 'El email ya está en uso por otro usuario' 
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        skills,
        email,        
        phoneNumber,
        image: imageId || undefined  
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      position: updatedUser.position,
      department: updatedUser.department,
      dateOfBirth: updatedUser.dateOfBirth,
      skills: updatedUser.skills,
      role: updatedUser.role,
      status: updatedUser.status,
      joinedAt: updatedUser.joinedAt,
      imageId: updatedUser.image 
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al actualizar el usuario', 
      error: error.message 
    });
  }
};