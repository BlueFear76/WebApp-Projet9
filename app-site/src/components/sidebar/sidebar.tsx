import React from 'react';
import { Link } from 'react-router-dom';
import './sidebarStyle.css'; // Ajoute ce fichier CSS pour styliser la sidebar
import { useState } from 'react';

const Sidebar: React.FC = () => {

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  return (
    <div className="sidebar">
      <h2>Navigation</h2>
      <ul>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/missions">Missions</Link></li>
        <li><Link to="/tools">Outils</Link></li>
        <li><Link to="/" onClick={() => setIsAuthenticated(false)}>Déconnexion</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;