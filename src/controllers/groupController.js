import Group from '../models/Group.js';
import User from '../models/User.js';

// Crear un nuevo grupo (solo admin)
export const createGroup = async (req, res) => {
  try {
    const { name, description, visibility, icon } = req.body;

    const group = new Group({
      name,
      description,
      visibility,
      icon,
      createdBy: req.user.id,
      members: [{ 
        user: req.user.id, 
        role: 'owner' 
      }]
    });

    await group.save();
    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener todos los grupos (filtrado por visibilidad)
export const getGroups = async (req, res) => {
  try {
    console.log('Buscando grupos para usuario:', req.user);
    
    // Primero verificamos que req.user exista
    if (!req.user || !req.user.id) {
      console.error('Usuario no encontrado en la petición');
      return res.status(401).json({ message: 'Usuario no autenticado correctamente' });
    }

    const groups = await Group.find({
      $or: [
        { visibility: 'public' },
        { 'members.user': req.user.id }
      ]
    }).populate('members.user', 'username email');
    
    console.log('Grupos encontrados:', groups.length);
    res.json(groups);
  } catch (error) {
    console.error('Error al obtener grupos:', error);
    res.status(500).json({ message: error.message });
  }
};

// Actualizar grupo (solo admin)
export const updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, visibility, icon } = req.body;

    const group = await Group.findByIdAndUpdate(
      id,
      { name, description, visibility, icon },
      { new: true }
    );

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json(group);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar grupo (solo admin)
export const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const group = await Group.findByIdAndDelete(id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Eliminar referencia del grupo en los usuarios
    await User.updateMany(
      { groups: id },
      { $pull: { groups: id } }
    );

    res.json({ message: 'Group deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Agregar miembro al grupo (solo admin)
export const addMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId, role = 'member' } = req.body;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Verificar si el usuario ya es miembro
    if (group.members.some(member => member.user.toString() === userId)) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    group.members.push({ user: userId, role });
    await group.save();

    // Agregar grupo al usuario
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { groups: groupId } }
    );

    res.json(group);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};