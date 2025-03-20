import React from 'react';

function Home() {
  return (
    <div className="Home">
      <header className="Home-header">
        <h1>Bienvenido a To-Do App</h1>
        <p>Organiza tus tareas de manera eficiente y sencilla.</p>
        <div className="Home-buttons">
          <button onClick={() => window.location.href = '/tasks'}>Ver Tareas</button>
          <button onClick={() => alert('Funcionalidad próximamente')}>Crear Nueva Tarea</button>
        </div>
      </header>
    </div>
  );
}

export default Home;