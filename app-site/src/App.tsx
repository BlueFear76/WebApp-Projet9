import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import './App.css';
import Authentification from './pages/authentificationPage';
import Home from './pages/homePage';
import Tool from './pages/toolPage';
import MissionPage from './pages/missonPage';
import EmployeePage from './pages/employeePage';

import profilImage from './images/profil.svg'
import userEvent from '@testing-library/user-event';

interface User {
  firstname: string;
  lastname: string;
  email: string;
  role: string;
}

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const storedUser = localStorage.getItem('userLogged');
  const userLogged = storedUser ? JSON.parse(storedUser) : null;

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  return (
    <Router>
      {isAuthenticated && (
        <div className="sidebar">
          <div className='profilImage'>
            <img src={profilImage} height={"150px"}/>
          </div>
          <h2>{userLogged.firstName} {userLogged.lastName}</h2>
          <ul>
            <div className="page-nav">
              <li><Link to="/home">Home</Link></li>
              <li><Link to="/missions">Missions</Link></li>
              <li><Link to="/tools">Outils</Link></li>
              {userLogged.role==="superAdmin" && (<li><Link to="/employees">Employés</Link></li>)}
            </div>
            <div className='disconnect'>
              <li><Link to="/" onClick={() => setIsAuthenticated(false)}>Déconnexion</Link></li>
            </div>
            
            
          </ul>
        </div>
      )}

      <div className="main-content">
        <Routes>
          <Route 
            path="/" 
            element={<Authentification onLogin={handleLogin} />} 
          />
          <Route 
            path="/home" 
            element={isAuthenticated ? <Home/> : <Navigate to="/" />} 
          />
          <Route 
            path="/tools" 
            element={isAuthenticated ? <Tool /> : <Navigate to="/" />} 
          />
          <Route 
            path="/missions" 
            element={isAuthenticated ? <MissionPage /> : <Navigate to="/" />} 
          />
          <Route
            path="/employees"
            element={isAuthenticated ? <EmployeePage /> : <Navigate to="/"/>}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
