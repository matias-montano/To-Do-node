import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'; 
import taskRoutes from './routes/taskRoutes.js';
import authRoutes from './routes/authRoutes.js'; 
import dbConfig from './config/dbConfig.js';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import path from 'path';


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
app.use('/tasks', taskRoutes); // tareas
app.use('/auth', authRoutes); // autenticación

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