import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import '../styles/homePageStyle.css'



interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  sub: string;
}

interface HomePageProps {
  user: User | null;
}

const HomePage: React.FC<HomePageProps> = ({user}) => {

  console.log(user);

  return (
    <div className='homePage'>
      <h1>Mes Informations</h1>
      <h3>{user ? user.firstName : 'Inconnu'} {user ? user.lastName : 'Inconnu'}</h3>
      <p>{user ? user.email : 'Utilisateur'}</p>

      <div className='info'>
        <div className='missions'>
          <h2>Prochaines Missions</h2>
        </div>
        <div className='alerte'>
          <h2>Alertes</h2>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
