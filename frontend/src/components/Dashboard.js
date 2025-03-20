import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getTasks } from '../services/taskService';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    }

    const fetchTasks = async () => {
      const data = await getTasks();
      setTasks(data);
    };

    fetchTasks();
  }, []);

  return (
    <div>
      <h1>Bienvenido, {user?.username}</h1>
      {user?.role === 'admin' && <button>Crear Tarea</button>}
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            {task.title} - {task.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;