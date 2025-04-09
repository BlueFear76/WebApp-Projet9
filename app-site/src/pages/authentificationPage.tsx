import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../styles/authentificationPageStyle.css';

interface AuthProps {
  onLogin: (userData: User) => void;
}

interface User {
  firstname: string;
  lastname: string;
  email: string;
  role: string;
}

const Authentification: React.FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    // Remplace cette logique par la connexion réelle à ton backend
    const response = await fetch('http://localhost:3001/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      // Appel de onLogin avec les données de l'utilisateur
      onLogin({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        role: data.role,
      });
      navigate('/home');
    } else {
      alert('Erreur de connexion');
    }
  };

  return (
    <div className="loginPage">
      <h1> AUTHENTIFICATION </h1>
      <div className='fields'>
        <TextField label="Identifiant" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Mot de Passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button className='button' onClick={handleLogin}>Se Connecter</button>
    </div>
  );
}

export default Authentification;
