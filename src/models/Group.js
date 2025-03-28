import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  // Información básica del grupo
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  description: { 
    type: String 
  },
  icon: { 
    type: String // Para almacenar un ícono
  },

  // Miembros y roles
  members: [{
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    role: { 
      type: String, 
      enum: ['admin', 'member'], 
      default: 'member' 
    },
    joinedAt: { 
      type: Date, 
      default: Date.now 
    }
  }],

  // Configuración del grupo
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'private'
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
  }
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento de las búsquedas
groupSchema.index({ name: 1 });
groupSchema.index({ 'members.user': 1 });

const Group = mongoose.model('Group', groupSchema);

export default Group;