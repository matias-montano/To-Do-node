import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // Datos básicos
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  image: { type: mongoose.Schema.Types.ObjectId, ref: 'uploads' },
  
  // Datos profesionales
  position: { type: String }, // Cargo/Puesto
  department: { type: String }, // Departamento
  role: { 
    type: String, 
    enum: ['user', 'admin', 'team-lead', 'project-manager', 'backend-dev', 'frontend-dev', 'fullstack-dev', 'designer', 'qa-engineer', 'devops-engineer', 'data-scientist', 'product-owner'],
    default: 'user' 
  },
  
  // Datos personales adicionales
  firstName: { type: String },
  lastName: { type: String },
  dateOfBirth: { type: Date },

  // Datos profesionales adicionales
  skills: [{ type: String }], // Habilidades/tecnologías
  teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
  
  // Metadatos
  joinedAt: { type: Date, default: Date.now },
  lastActive: { type: Date },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on-leave'],
    default: 'active'
  }
}, {
  timestamps: true // Añade createdAt y updatedAt automáticamente
});

const User = mongoose.model('User', userSchema);

export default User;