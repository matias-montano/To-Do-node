import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  // Información básica del proyecto
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  
  // Vinculación con grupo
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  
  // Estado del proyecto
  status: {
    type: String,
    enum: ['planning', 'active', 'on-hold', 'completed', 'cancelled'],
    default: 'planning'
  },
  
  // Fechas importantes
  startDate: {
    type: Date,
    default: Date.now
  },
  targetEndDate: Date,
  actualEndDate: Date,
  
  // Metodología ágil
  methodology: {
    type: String,
    enum: ['scrum', 'kanban', 'xp', 'lean', 'other'],
    default: 'scrum'
  },
  
  // Sprints (iteraciones)
  sprints: [{
    name: String,
    startDate: Date,
    endDate: Date,
    goal: String,
    status: {
      type: String,
      enum: ['planning', 'in-progress', 'review', 'completed'],
      default: 'planning'
    },
    completionPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  }],
  
  // Miembros del proyecto (roles específicos del proyecto)
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['product-owner', 'scrum-master', 'developer', 'tester', 'stakeholder'],
      default: 'developer'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Métricas y datos ágiles
  velocity: { 
    type: Number, 
    default: 0 
  },
  storyPointsCompleted: { 
    type: Number, 
    default: 0 
  },
  storyPointsTotal: { 
    type: Number, 
    default: 0 
  },
  
  // Configuración del tablero Kanban (columnas)
  kanbanColumns: [{
    name: String,
    order: Number,
    wipLimit: Number // Límite de trabajo en progreso
  }],
  
  // Artefactos del proyecto (URLs a documentación)
  artifacts: {
    productBacklog: String,
    sprintBacklog: String,
    burndownChart: String,
    definition: String // Definition of Done / Ready
  },
  
  // Metadatos
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  tags: [String]
}, {
  timestamps: true // Añade createdAt y updatedAt automáticamente
});

// Índices para mejorar el rendimiento
projectSchema.index({ name: 1 });
projectSchema.index({ group: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ 'members.user': 1 });

const Project = mongoose.model('Project', projectSchema);

export default Project;