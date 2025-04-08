import React from 'react';
import { Link } from 'react-router-dom';
import {TextField } from '@mui/material';
import '../styles/authentificationPageStyle.css'
import { useNavigate } from 'react-router-dom';


interface AuthProps {
  onLogin: () => void;
}

const Authentification: React.FC<AuthProps> = ({ onLogin }) => {

  const navigate = useNavigate();

  const handleLogin = () => {
    onLogin();
    navigate('/home');
  };


  return (
    <div className="loginPage">
        <h1> AUTHENTIFICATION </h1>
        <div className='fields'>
          <TextField label="Identifiant"></TextField>
          <TextField label ="Mot de Passe"></TextField>
        </div>
        <button className='button' onClick={handleLogin}>Se Connecter</button>
    </div>
  );
}

export default Authentification;