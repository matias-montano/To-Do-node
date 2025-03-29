import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  contentFormat: {
    type: String,
    enum: ['text', 'markdown'],
    default: 'markdown'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  sprint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sprint'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [String],
  attachments: [{
    name: String,
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'uploads' // Referencia a GridFS como en User.js
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    mimeType: String // Para identificar el tipo de archivo
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  pinned: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Esto crea automáticamente createdAt y updatedAt
});

// Índices para mejoras de rendimiento
noteSchema.index({ project: 1, createdAt: -1 });
noteSchema.index({ sprint: 1 });
noteSchema.index({ author: 1 });
noteSchema.index({ tags: 1 });

const Note = mongoose.model('Note', noteSchema);

export default Note;