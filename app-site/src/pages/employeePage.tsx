import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import '../styles/homePageStyle.css'


const EmployeePage: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Récupère le token depuis le localStorage

    if (token) {
      const decoded: any = jwtDecode(token); // Décoder le token pour obtenir le payload
      setUserData(decoded); // Mettre à jour les données utilisateur avec le payload
    }
  }, []);

  return (
    <div className='homePage'>
      <h1>Bienvenue {userData ? userData.email : 'Utilisateur'}</h1>
      <p>Rôle: {userData ? userData.role : 'Inconnu'}</p>
      <p>ID: {userData ? userData.sub : 'Inconnu'}</p>
    </div>
  );
};

export default EmployeePage;
