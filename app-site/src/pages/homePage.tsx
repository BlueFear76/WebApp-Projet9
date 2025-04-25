import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import '../styles/homePageStyle.css'
import { Alert } from '../models/Alert';
import API_BASE_URL from '../config';


// Interface for user props
interface User {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  sub: string;
}

// Props expected by this component
interface HomePageProps {
  user: User | null;
}

const HomePage: React.FC<HomePageProps> = ({ user }) => {
  // State to store alerts fetched from backend
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Fetch alerts from backend API when component mounts
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/alerts`);
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des alertes');
        }
        const data = await response.json();
        setAlerts(data);// Store fetched alerts in state
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    fetchAlerts();// Call function on mount
  }, []);

  // Function to delete an alert by its ID
  const deleteAlert = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/alerts/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'alerte");
      }
      // Remove the deleted alert from local state
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    } catch (error) {
      console.error('Erreur :', error);
    }
  };

  return (
    <div className='homePage'>
      <h1 className='title'>Mes Informations</h1>
      <h3>{user ? user.firstName : 'Inconnu'} {user ? user.lastName : 'Inconnu'}</h3>
      <p>{user ? user.email : 'Utilisateur'}</p>

      <div className='info'>
        <div className='missions'>
          <h2>Prochaines Missions</h2>
        </div>
        <div className='alerte'>
          <h2>Alertes</h2>
          {alerts.length === 0 ? (
            <p>Aucune alerte.</p>
          ) : (
            <ul className="alertList">
                {alerts.map((alert) =>
                  alert.message ? (
                    <li key={alert.id} className="alertItem">
                      <div className="alertContent">
                        <span className="missionTag">[Mission {alert.mission.id}]</span>
                        <span>{alert.message}</span>
                      </div>
                      <button onClick={() => deleteAlert(alert.id)} className="deleteButton">
                        Récupéré
                      </button>
                    </li>
                  ) : null
                )}
              </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;