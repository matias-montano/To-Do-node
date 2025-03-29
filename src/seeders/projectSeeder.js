import Project from '../models/Project.js';
import User from '../models/User.js';
import Group from '../models/Group.js';

export const seedProjects = async (users, groups) => {
  console.log('Seeding projects...');
  
  // Limpiar proyectos existentes
  await Project.deleteMany({});
  
  // Obtener IDs necesarios
  const adminUser = users.find(user => user.role === 'admin');
  const devUser = users.find(user => user.role === 'fullstack-dev');
  const designerUser = users.find(user => user.role === 'designer');
  
  // Verificar si existen grupos
  if (groups.length === 0) {
    console.log('No hay grupos para asignar a proyectos');
    return [];
  }
  
  const engineeringGroup = groups.find(group => group.name === 'Ingeniería') || groups[0];
  
  // Crear proyectos de ejemplo
  const projects = [
    {
      name: 'Sistema de Gestión de Tareas',
      description: 'Plataforma para gestionar tareas, asignaciones y seguimiento de proyectos en metodologías ágiles.',
      group: engineeringGroup._id,
      status: 'active',
      startDate: new Date(2023, 0, 15),
      targetEndDate: new Date(2023, 5, 30),
      methodology: 'scrum',
      createdBy: adminUser._id,
      priority: 'high',
      tags: ['desarrollo', 'gestión', 'productividad'],
      members: [
        {
          user: adminUser._id,
          role: 'product-owner',
          joinedAt: new Date(2023, 0, 15)
        },
        {
          user: devUser._id,
          role: 'developer',
          joinedAt: new Date(2023, 0, 17)
        }
      ],
      sprints: [
        {
          name: 'Sprint 1 - Configuración inicial',
          startDate: new Date(2023, 0, 20),
          endDate: new Date(2023, 1, 3),
          goal: 'Configurar entorno y crear estructuras básicas',
          status: 'completed',
          completionPercentage: 100
        },
        {
          name: 'Sprint 2 - Funcionalidades básicas',
          startDate: new Date(2023, 1, 4),
          endDate: new Date(2023, 1, 17),
          goal: 'Implementar login, registro y CRUD básico',
          status: 'completed',
          completionPercentage: 100
        },
        {
          name: 'Sprint 3 - Funcionalidades avanzadas',
          startDate: new Date(2023, 1, 18),
          endDate: new Date(2023, 2, 3),
          goal: 'Implementar notificaciones y reportes',
          status: 'in-progress',
          completionPercentage: 70
        }
      ],
      kanbanColumns: [
        { name: 'Por hacer', order: 1, wipLimit: 10 },
        { name: 'En progreso', order: 2, wipLimit: 5 },
        { name: 'En revisión', order: 3, wipLimit: 3 },
        { name: 'Completado', order: 4, wipLimit: 0 }
      ],
      velocity: 20,
      storyPointsCompleted: 35,
      storyPointsTotal: 50,
      artifacts: {
        productBacklog: 'https://example.com/backlog',
        sprintBacklog: 'https://example.com/sprint-backlog',
        burndownChart: 'https://example.com/burndown',
        definition: 'El código debe pasar pruebas unitarias y estar revisado por pares'
      }
    },
  ];

  try {
    const createdProjects = await Project.insertMany(projects);
    console.log(`${createdProjects.length} proyectos creados correctamente`);
    return createdProjects;
  } catch (error) {
    console.error('Error al crear proyectos:', error);
    return [];
  }
};