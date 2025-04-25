import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../styles/authentificationPageStyle.css';
import { jwtDecode } from 'jwt-decode';
import API_BASE_URL from '../config';

// Props interface for the component
interface AuthProps {
  onLogin: (userData: User) => void;
}

// User data interface
interface User {
  firstname: string;
  lastname: string;
  email: string;
  role: string;
}

// Authentification component definition
const Authentification: React.FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Function called when user clicks the login button
  const handleLogin = async () => {
    // Sending POST request to the login endpoint
    const response = await fetch('https://tool-tracking-production.up.railway.app/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    // If login is successful
    if (response.ok) {
      const data = await response.json();
      const decoded: any = jwtDecode(data.access_token);// Decoding the JWT token
      console.log(decoded);// Logging the decoded token (for debugging)

      // Storing user info in local storage
      localStorage.setItem('userLogged', JSON.stringify(decoded));
      
      // Calling the onLogin function with user data
      onLogin({
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        role: data.role,
      });
      // Redirecting to the home page
      navigate('/home');
    } else {// If login fails, show an alert
      alert('Erreur de connexion');
    }
  };

  // JSX returned by the componen
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
