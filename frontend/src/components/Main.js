import React from 'react';

const Main = ({ onLogout }) => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Bienvenido al Main</h1>
      <p>Esta es la página principal después de iniciar sesión.</p>
      <button
        onClick={onLogout} // Llama a la función onLogout pasada como prop
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Main;