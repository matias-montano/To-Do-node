import Note from '../models/Note.js';

export const seedNotes = async (users, projects) => {
  console.log('Seeding notes...');
  
  
   // Limpiar notas existentes
   await Note.deleteMany({});
  
   // Obtener IDs necesarios
   const adminUser = users.find(user => user.role === 'admin');
   const devUser = users.find(user => user.role === 'fullstack-dev');
   
   // Check if required users exist
   if (!adminUser || !devUser) {
     console.log('No se encontraron los usuarios necesarios para crear notas');
     return [];
   }
   
   if (!projects || projects.length === 0) {
     console.log('No hay proyectos disponibles para asociar con las notas');
     return [];
   }
  
  // Usar el primer proyecto disponible
  const project = projects[0];
  
  // Crear algunas notas de ejemplo
  const notes = [
    {
      title: 'Documentación del API',
      content: `# Documentación del API REST

## Endpoints principales

### Autenticación
- POST /api/v1/auth/login - Inicio de sesión
- POST /api/v1/auth/register - Registro de nuevo usuario

### Proyectos
- GET /api/v1/projects - Listar todos los proyectos
- POST /api/v1/projects - Crear un nuevo proyecto

## Consideraciones para desarrollo
- Usar JWT para autenticación
- Todas las respuestas deben ser en formato JSON
- Documentar todos los endpoints con Swagger`,
      contentFormat: 'markdown',
      project: project._id,
      sprint: project.sprints[0]._id,
      author: adminUser._id,
      tags: ['documentación', 'api', 'desarrollo'],
      status: 'published',
      pinned: true,
      isPublic: true
    },
    {
      title: 'Planificación del Sprint 3',
      content: `## Objetivos del Sprint
- Implementar módulo de notificaciones
- Completar CRUD de notas
- Mejorar UI/UX en la vista de proyectos
- Optimizar rendimiento del backend

## Tareas asignadas
- @JohnDoe: Implementación de WebSockets para notificaciones en tiempo real
- @SamSmith: Diseño de UI para las notificaciones
- @JanaDoe: Revisión del código y optimización de consultas

## Enlaces útiles
- [Mockups](https://figma.com/mockups)
- [Backlog del sprint](https://jira.com/sprint-3)`,
      contentFormat: 'markdown',
      project: project._id,
      sprint: project.sprints[2]._id,
      author: devUser._id,
      tags: ['planificación', 'sprint', 'tareas'],
      status: 'published',
      pinned: false,
      isPublic: false
    }
  ];

  try {
    const createdNotes = await Note.insertMany(notes);
    console.log(`${createdNotes.length} notas creadas correctamente`);
    return createdNotes;
  } catch (error) {
    console.error('Error al crear notas:', error);
    return [];
  }
};