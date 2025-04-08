import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import './App.css';
import Authentification from './pages/authentificationPage';
import Home from './pages/homePage';
import Tool from './pages/toolPage';
import MissionPage from './pages/missonPage';


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  return (
    <Router>
      {isAuthenticated && (
        <div className="sidebar">
              <h2>Navigation</h2>
              <ul>
                <li><Link to="/home">Home</Link></li>
                <li><Link to="/missions">Missions</Link></li>
                <li><Link to="/tools">Outils</Link></li>
                <li><Link to="/" onClick={() => setIsAuthenticated(false)}>Déconnexion</Link></li>
              </ul>
            </div>
      )}

      <div className="main-content">
        <Routes>
          <Route 
            path="/" 
            element={<Authentification onLogin={() => setIsAuthenticated(true)} />} 
          />
          <Route 
            path="/home" 
            element={isAuthenticated ? <Home /> : <Navigate to="/" />} 
          />
          <Route 
            path="/tools" 
            element={isAuthenticated ? <Tool /> : <Navigate to="/" />} 
          />
          <Route 
            path="/missions" 
            element={isAuthenticated ? <MissionPage /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;