import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import './App.css';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import Authentification from './pages/authentificationPage';
import Home from './pages/homePage';
import ToolPage from './pages/toolPage';
import MissionPage from './pages/missonPage';
import EmployeePage from './pages/employeePage';
import CustomerPage from './pages/customerPage';

import homeIcon from './images/home.svg';
import missionIcon from './images/mission.svg';
import toolIcon from './images/tool.svg';
import employeeIcon from './images/employee.svg';
import logoutIcon from './images/logout.svg';
import MissionCreationPage from './pages/missionCreationPage';
import customerIcon from './images/customer.svg'

// Defining the User interface to specify the structure of the user object
interface User {
  firstname: string;
  lastname: string;
  email: string;
  role: string;
}

const App: React.FC = () => {
  // Setting up the state for authentication, user details, and dialog box for logout
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const storedUser = localStorage.getItem('userLogged');
  const userLogged = storedUser ? JSON.parse(storedUser) : null;
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  // Function to handle login, sets the user data and authentication state
  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Function to handle logout, clears the authentication state and user data
  const handleLogout = () => {
    setLogoutDialogOpen(false);
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('userLogged'); // if you want to clean the localStorage
  };
  
  const openLogoutDialog = () => {
    setLogoutDialogOpen(true);
  };
  
  const closeLogoutDialog = () => {
    setLogoutDialogOpen(false);
  };

  return (
    // Setting up the router for navigation between pages
    <Router>
      {isAuthenticated && (
        // Display the sidebar when the user is authenticated
        <div className="sidebar">
          <ul>
            {/* Navigation links in the sidebar */}
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
            {/* Display 'Clients' page only for users with the 'admin' or 'superAdmin' role */}
            {(userLogged?.role === "admin" || userLogged?.role === "superAdmin") && (
              <li>
                <Link to="/customers">
                  <img src={customerIcon} alt="Customers" className="nav-icon" />
                  <span>Clients</span>
                </Link>
              </li>
            )}
            {/* Display 'Employees' page only for users with the 'superAdmin' role */}
            {userLogged?.role === "superAdmin" && (
              <li>
                <Link to="/employees">
                  <img src={employeeIcon} alt="Employés" className="nav-icon" />
                  <span>Employés</span>
                </Link>
              </li>
            )}
            {/* Logout button */}
            <li className="disconnect">
              <Link to="#" onClick={openLogoutDialog}>
                <img src={logoutIcon} alt="Déconnexion" className="nav-icon" />
                <span>Déconnexion</span>
              </Link>
            </li>
          </ul>
        </div>
      )}

      {/* Main content area for routing */}
      <div className="main-content">
        <Routes>
          {/* Routes for different pages, redirect to login page if not authenticated */}
          <Route path="/" element={<Authentification onLogin={handleLogin} />} />
          <Route path="/home" element={isAuthenticated ? <Home user={userLogged}/> : <Navigate to="/" />} />
          <Route path="/tools" element={isAuthenticated ? <ToolPage /> : <Navigate to="/" />} />
          <Route path="/missions" element={isAuthenticated ? <MissionPage /> : <Navigate to="/" />} />
          <Route path="/employees" element={isAuthenticated ? <EmployeePage /> : <Navigate to="/" />} />
          <Route path="/customers" element={isAuthenticated ? <CustomerPage /> : <Navigate to="/" />} />
          <Route path="/create-mission" element={isAuthenticated ? <MissionCreationPage /> : <Navigate to="/" />} />
        </Routes>
      </div>
      
      {/* Logout confirmation dialog */}
      <Dialog className='logOutDialogBox' open={logoutDialogOpen} onClose={closeLogoutDialog}>
        <DialogTitle>Déconnexion</DialogTitle>
        <DialogContent>
          Êtes-vous sûr(e) de vouloir vous déconnecter ?
        </DialogContent>
        <DialogActions className='logOutDialogButton'>
          <button className="button" onClick={closeLogoutDialog}>
            Annuler
          </button>
          <button className="button" onClick={handleLogout}>
            Se déconnecter
          </button>
        </DialogActions>
      </Dialog>
    </Router>
  );
}

export default App;
