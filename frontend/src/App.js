import React, { useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import Welcome from './components/Welcome';
import Main from './components/Main';
import Navbar from './components/Navbar';
import Profile from './components/Profile';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState({
    name: 'Usuario',
    image: '/images/ProfilePlaceholder.png',
  });

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/register', '/'];

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && (
        <Navbar user={user} onLogout={handleLogout} />
      )}
      <Routes>
        {/* Fixed Welcome route */}
        <Route path="/" element={isLoggedIn ? <Navigate to="/main" replace /> : <Welcome />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/main" element={
              isLoggedIn ? <Main onLogout={handleLogout} user={user} /> : <Navigate to="/login" replace />

        } />
        <Route 
          path="/profile" 
          element={isLoggedIn ? <Profile /> : <Navigate to="/login" replace />} 
        />
        <Route path="/dashboard" element={
          isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />
        } />
      </Routes>
    </>
  );
}

export default App;