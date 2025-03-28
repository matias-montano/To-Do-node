import React, { useState, useEffect } from 'react';
import { getToken } from '../services/authService';

const GroupList = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = getToken();
        const response = await fetch('http://localhost:4000/api/v1/groups', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setGroups(data);
        } else {
          throw new Error('Error al obtener los grupos');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  if (loading) return <div>Cargando grupos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Lista de Grupos</h1>
      <ul>
        {groups.map(group => (
          <li key={group._id}>
            <h2>{group.name}</h2>
            <p>{group.description}</p>
            <p>Visibilidad: {group.visibility}</p>
            <p>Miembros: {group.members.length}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GroupList;