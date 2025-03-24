import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Authentification from './pages/authentificationPage';
import Home from './pages/homePage';
import Tool from './pages/toolPage';

function App() {
  return (
    <Router>
        <div className="nav-links">
          <Link to="/tools">
            <span className="page-text">Tools</span>
          </Link>
          <Link to="/home">
            <span className="page-text">Home</span>
          </Link>
          <Link to="/">
            <span className="page-text">Se Deconnecter</span>
          </Link>
        </div>

      {/* Contenu principal décalé */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Authentification />} />
          <Route path="/home" element={<Home />} />
          <Route path="/tools" element={<Tool />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
