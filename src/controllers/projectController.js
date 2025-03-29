import Project from '../models/Project.js';
import Group from '../models/Group.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Crear nuevo proyecto (solo admin)
export const createProject = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      group, 
      status, 
      startDate,
      targetEndDate,
      methodology,
      members 
    } = req.body;

    // Verificar si el grupo existe
    const groupExists = await Group.findById(group);
    if (!groupExists) {
      return res.status(404).json({ message: 'El grupo no existe' });
    }

    // Crear el proyecto
    const project = new Project({
      name,
      description,
      group,
      status: status || 'planning',
      startDate: startDate || Date.now(),
      targetEndDate,
      methodology: methodology || 'scrum',
      members: members || [],
      createdBy: req.user.id
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener todos los proyectos (filtrados según permisos)
export const getProjects = async (req, res) => {
  try {
    let projects;
    
    // Si es admin, obtiene todos los proyectos
    if (req.user.role === 'admin') {
      projects = await Project.find()
        .populate('group', 'name description')
        .populate('members.user', 'username firstName lastName role');
    } else {
      // Si no es admin, solo obtiene proyectos donde es miembro
      projects = await Project.find({
        'members.user': req.user.id
      })
        .populate('group', 'name description')
        .populate('members.user', 'username firstName lastName role');
    }
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un proyecto específico por ID
export const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de proyecto inválido' });
    }
    
    const project = await Project.findById(id)
      .populate('group', 'name description members')
      .populate('members.user', 'username firstName lastName role image')
      .populate('createdBy', 'username firstName lastName');
    
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    
    // Verificar permisos: es admin o es miembro del proyecto
    if (req.user.role !== 'admin' && 
        !project.members.some(member => member.user._id.toString() === req.user.id)) {
      return res.status(403).json({ message: 'No tienes permiso para ver este proyecto' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar un proyecto (solo admin)
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Excluir campos que no deben ser actualizados directamente
    const { createdBy, ...safeUpdates } = updates;
    
    const project = await Project.findByIdAndUpdate(
      id,
      safeUpdates,
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar un proyecto (solo admin)
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    
    res.json({ message: 'Proyecto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Añadir miembro al proyecto (solo admin)
export const addProjectMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId, role } = req.body;
    
    // Verificar que el proyecto existe
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    
    // Verificar que el usuario existe
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Verificar si el usuario ya es miembro del proyecto
    if (project.members.some(member => member.user.toString() === userId)) {
      return res.status(400).json({ message: 'El usuario ya es miembro de este proyecto' });
    }
    
    // Añadir el usuario al proyecto con el rol especificado
    project.members.push({
      user: userId,
      role: role || 'developer',
      joinedAt: new Date()
    });
    
    await project.save();
    
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Eliminar miembro del proyecto (solo admin)
export const removeProjectMember = async (req, res) => {
  try {
    const { projectId, userId } = req.params;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    
    // Filtrar para eliminar el miembro
    project.members = project.members.filter(
      member => member.user.toString() !== userId
    );
    
    await project.save();
    
    res.json({ message: 'Miembro eliminado correctamente del proyecto' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Crear un sprint en el proyecto (solo admin)
export const createSprint = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { name, startDate, endDate, goal } = req.body;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    
    // Crear el nuevo sprint
    project.sprints.push({
      name,
      startDate: startDate || new Date(),
      endDate,
      goal,
      status: 'planning',
      completionPercentage: 0
    });
    
    await project.save();
    
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar el estado de un sprint (solo admin)
export const updateSprintStatus = async (req, res) => {
  try {
    const { projectId, sprintId } = req.params;
    const { status, completionPercentage } = req.body;
    
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    
    // Encontrar y actualizar el sprint
    const sprintIndex = project.sprints.findIndex(
      s => s._id.toString() === sprintId
    );
    
    if (sprintIndex === -1) {
      return res.status(404).json({ message: 'Sprint no encontrado' });
    }
    
    if (status) {
      project.sprints[sprintIndex].status = status;
    }
    
    if (completionPercentage !== undefined) {
      project.sprints[sprintIndex].completionPercentage = completionPercentage;
    }
    
    await project.save();
    
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};