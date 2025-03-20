import React, { useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import Welcome from './components/Welcome';
import Main from './components/Main';
import Navbar from './components/Navbar'; // Importa el componente Navbar

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState({
    name: 'Usuario',
    image: '/images/ProfilePlaceholder.png', // Imagen de ejemplo
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/'; // Redirigir manualmente a la página de inicio
  };

  const location = useLocation(); // Hook para obtener la ruta actual

  // Rutas donde no se debe mostrar el Navbar
  const hideNavbarRoutes = ['/login', '/register', '/'];

  return (
    <>
      {/* Renderiza el Navbar solo si la ruta actual no está en hideNavbarRoutes */}
      {!hideNavbarRoutes.includes(location.pathname) && (
        <Navbar user={user} onLogout={handleLogout} />
      )}
      <Routes>
        <Route
          path="/"
          element={<Navigate to={isLoggedIn ? '/main' : '/'} replace />}
        />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/main" element={<Main onLogout={handleLogout} />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;