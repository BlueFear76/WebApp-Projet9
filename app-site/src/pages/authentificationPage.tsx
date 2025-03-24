import React from 'react';
import { Link } from 'react-router-dom';
import {TextField } from '@mui/material';
import '../styles/authentificationPageStyle.css'
import { useNavigate } from 'react-router-dom';

export default function Authentification() {

  const navigate = useNavigate(); // Hook de navigation

  // Fonction pour changer de page lors du clic
  const handleClick = () => {
    navigate('/home'); // Redirige vers la page /about
  };


  return (
    <div className="loginPage">
        <h1> AUTHENTIFICATION </h1>
        <div className='fields'>
          <TextField label="Identifiant"></TextField>
          <TextField label ="Mot de Passe"></TextField>
        </div>
        <button className='button' onClick={handleClick}>Se Connecter</button>
    </div>
  );
}