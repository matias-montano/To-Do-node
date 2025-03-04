import express from 'express';
import mongoose from 'mongoose';
import taskRoutes from './routes/taskRoutes.js';
import dbConfig from './config/dbConfig.js';

const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use('/tasks', taskRoutes);

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