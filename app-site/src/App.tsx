import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import './App.css';
import Authentification from './pages/authentificationPage';
import Home from './pages/homePage';
import Tool from './pages/toolPage';
import MissionPage from './pages/missonPage';
import EmployeePage from './pages/employeePage';

import homeIcon from './images/home.svg';
import missionIcon from './images/mission.svg';
import toolIcon from './images/tool.svg';
import employeeIcon from './images/employee.svg';
import logoutIcon from './images/logout.svg';

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
          <ul>
            <li>
              <Link to="/home">
                <img src={homeIcon} alt="Home" className="nav-icon" />
                <span>Home</span>
              </Link>
            </li>
            <li>
              <Link to="/missions">
                <img src={missionIcon} alt="Missions" className="nav-icon" />
                <span>Missions</span>
              </Link>
            </li>
            <li>
              <Link to="/tools">
                <img src={toolIcon} alt="Outils" className="nav-icon" />
                <span>Outils</span>
              </Link>
            </li>
            {userLogged?.role === "superAdmin" && (
              <li>
                <Link to="/employees">
                  <img src={employeeIcon} alt="Employés" className="nav-icon" />
                  <span>Employés</span>
                </Link>
              </li>
            )}
            <li className="disconnect">
              <Link to="/" onClick={() => setIsAuthenticated(false)}>
                <img src={logoutIcon} alt="Déconnexion" className="nav-icon" />
                <span>Déconnexion</span>
              </Link>
            </li>
          </ul>
        </div>
      )}

      <div className="main-content">
        <Routes>
          <Route path="/" element={<Authentification onLogin={handleLogin} />} />
          <Route path="/home" element={isAuthenticated ? <Home user={userLogged}/> : <Navigate to="/" />} />
          <Route path="/tools" element={isAuthenticated ? <Tool /> : <Navigate to="/" />} />
          <Route path="/missions" element={isAuthenticated ? <MissionPage /> : <Navigate to="/" />} />
          <Route path="/employees" element={isAuthenticated ? <EmployeePage /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
