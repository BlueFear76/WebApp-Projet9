import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import './App.css';
import Authentification from './pages/authentificationPage';
import Home from './pages/homePage';
import Tool from './pages/toolPage';
import MissionPage from './pages/missonPage';
import CustomCalendar from './components/customCalendar';


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  return (
    <Router>
      {isAuthenticated && (
        <div className="nav-links">
          <Link to="/tools">
            <span className="page-text">Tools</span>
          </Link>
          <Link to="/home">
            <span className="page-text">Home</span>
          </Link>
          <Link to="/missions">
            <span className="page-text">Mission</span>
          </Link>
          <Link to="/" onClick={() => setIsAuthenticated(false)}>
            <span className="page-text">Se Déconnecter</span>
          </Link>

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