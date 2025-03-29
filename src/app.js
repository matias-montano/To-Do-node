import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'; 
import taskRoutes from './routes/taskRoutes.js';
import authRoutes from './routes/authRoutes.js'; 
import dbConfig from './config/dbConfig.js';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import path from 'path';
import groupRoutes from './routes/groupRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import projectRoutes from './routes/projectRoutes.js'; 




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const port = process.env.PORT || 3000;

// Conectar a MongoDB
mongoose.connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(cors());
app.use(express.json()); 
app.use(bodyParser.json()); 
app.use(express.static('src/public'));


// Ruta raíz para servir el archivo index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// Rutas
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/groups', groupRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/projects', projectRoutes); 

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

let server;

export const startServer = () => {
  server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

export const closeServer = () => {
  if (server) {
    server.close();
  }
};

export { app };

if (process.env.NODE_ENV !== 'test') {
  startServer();
}