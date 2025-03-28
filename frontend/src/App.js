import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import Welcome from './components/Welcome';
import Main from './components/Main';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import GroupManagement from './components/GroupManagement';
import GroupList from './components/GroupList'; 
import { getToken } from './services/authService';
import GroupMemberManagement from './components/GroupMemberManagement';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (isLoggedIn) {
        try {
          const token = getToken();
          const response = await fetch('http://localhost:4000/api/v1/auth/user', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // Si hay error en la autenticación, hacer logout
            handleLogout();
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          handleLogout();
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, [isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = '/';
  };

  const location = useLocation();
  const hideNavbarRoutes = ['/login', '/register', '/'];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {!hideNavbarRoutes.includes(location.pathname) && (
        <Navbar user={user} onLogout={handleLogout} />
      )}
      <Routes>
        <Route 
          path="/" 
          element={isLoggedIn ? <Navigate to="/main" replace /> : <Welcome />} 
        />
        <Route 
          path="/login" 
          element={<Login onLogin={handleLogin} />} 
        />
        <Route 
          path="/register" 
          element={<Register />} 
        />
        <Route 
          path="/main" 
          element={
            isLoggedIn ? 
              <Main onLogout={handleLogout} user={user} /> : 
              <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/profile" 
          element={
            isLoggedIn ? 
              <Profile user={user} setUser={setUser} /> : 
              <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isLoggedIn ? 
              <Dashboard user={user} /> : 
              <Navigate to="/login" replace />
          } 
        />
        <Route 
          path="/groups" 
          element={
            isLoggedIn && user?.role === 'admin' ? 
              <GroupManagement user={user} /> : 
              <Navigate to="/main" replace />
          } 
        />
        <Route 
          path="/groups/members/:groupId" 
          element={
            isLoggedIn && user?.role === 'admin' ? 
              <GroupMemberManagement /> : 
              <Navigate to="/main" replace />
          } 
        />
        <Route 
          path="/groups-list" 
          element={
            isLoggedIn ? 
              <GroupList /> : 
              <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </>
  );
}

export default App;