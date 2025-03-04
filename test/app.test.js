import request from 'supertest';
import mongoose from 'mongoose';
import { app, startServer, closeServer } from '../src/app.js';
import Task from '../src/models/taskModel.js';

describe('Tasks API', () => {
  beforeAll(async () => {
    startServer();
    await Task.deleteMany({});
  });

  afterEach(async () => {
    await Task.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
    closeServer();
  });

  it('should get all tasks', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBe(0);
  });

  it('should create a new task', async () => {
    const task = {
      title: 'Nueva tarea',
      description: 'Descripción de la nueva tarea'
    };
    const res = await request(app).post('/tasks').send(task);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('title', 'Nueva tarea');
    expect(res.body).toHaveProperty('description', 'Descripción de la nueva tarea');
    expect(res.body).toHaveProperty('status', 'pending');
  });

  it('should update a task', async () => {
    const task = new Task({
      title: 'Tarea existente',
      description: 'Descripción de la tarea existente',
      status: 'pending'
    });
    await task.save();

    const res = await request(app).put(`/tasks/${task.id}`).send({ status: 'completed' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'completed');
  });

  it('should delete a task', async () => {
    const task = new Task({
      title: 'Tarea a eliminar',
      description: 'Descripción de la tarea a eliminar',
      status: 'pending'
    });
    await task.save();

    const res = await request(app).delete(`/tasks/${task.id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'Task deleted');
  });
});