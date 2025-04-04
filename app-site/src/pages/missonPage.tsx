import React, { useState } from 'react';
import { Mission } from '../models/Mission';
import { Link } from 'react-router-dom';
import '../styles/missionPageStyle.css';
import moment from 'moment';  // Importer moment.js
import 'moment/locale/fr';  // Importer la locale française de moment
import CustomCalendar from '../components/customCalendar';

export default function MissionPage() {
  const [missionView, setMissionView] = useState('list'); // 'list' pour liste, 'calendar' pour calendrier

  // Données fictives des missions (à remplacer par les données réelles)
  const fakeMissions: Mission[] = [
    {
      id: 1,
      description: "Entretien du parc municipal de Versailles",
      start_time: "2025-03-25T08:00:00Z",
      end_time: "2025-03-25T12:00:00Z",
      duration: 4,
      adress: "Place d'Armes, 78000 Versailles",
      longitude: 2.1204,
      latitude: 48.8049,
      tools: [
        {
          id: 101,
          type: "Tondeuse thermique",
          status: "active",
          last_known_latitude: 48.8052,
          last_known_longitude: 2.1210,
          last_scan_time: "2024-03-24T15:00:00Z",
          tag: { id: 201, status: "active", assignation_date: "2024-03-20T10:00:00Z" }
        }
      ],
      cars: [
        { licence_plate: "AB-456-EF", car_type: "Camion benne", readers: [] }
      ],
      employees: [
        { id: 1, permission: "CHEF_EQUIPE", first_name: "Jean", last_name: "Martin", phone_number: "0601020304", login: "jmartin" }
      ],
      travel: { id: 10, missions: [] }
    },
    {
      id: 2,
      description: "Plantation d’arbres dans un lotissement résidentiel",
      start_time: "2025-03-04T14:00:00Z",
      end_time: "2025-03-04T18:00:00Z",
      duration: 4,
      adress: "12 Rue des Jardins, 91000 Évry",
      longitude: 2.4412,
      latitude: 48.6329,
      tools: [
        { id: 103, type: "Pelle mécanique", status: "active", last_known_latitude: 48.6325, last_known_longitude: 2.4410, last_scan_time: "2024-03-25T17:30:00Z", tag: { id: 203, status: "active", assignation_date: "2024-03-22T11:00:00Z" } }
      ],
      cars: [{ licence_plate: "XY-789-ZT", car_type: "Fourgon", readers: [] }],
      employees: [{ id: 3, permission: "CHEF_EQUIPE", first_name: "Paul", last_name: "Lemoine", phone_number: "0698765432", login: "plemoine" }],
      travel: { id: 11, missions: [] }
    }
  ];

  const convertMissionsToEvents = (missions: Mission[]) => {
    return missions.map(mission => ({
      id: mission.id.toString(),  // ID unique de l'événement
      title: mission.description,  // Le titre de l'événement
      start: moment(mission.start_time).toISOString(),  // Date de début formatée
      end: moment(mission.end_time).toISOString(),  // Date de fin formatée
      extendedProps: {
        description: mission.description,  // Description de la mission
        location: mission.adress,  // Adresse de la mission
        duration: mission.duration  // Durée de la mission
      },
    }));
  };


  // Fonction pour gérer l'affichage en fonction de la vue choisie
  const renderMissions = () => {
    if (missionView === 'list') {
      return (
        <table className="missions-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Début</th>
            <th>Fin</th>
            <th>Durée</th>
            <th>Groupe Mission</th>
            <th>Adresse</th>
            <th>Outils</th>
          </tr>
        </thead>
        <tbody>
          {fakeMissions.map((mission) => (
            <tr key={mission.id}>
              <td>{mission.id}</td>
              <td>{mission.description}</td>
              <td>{new Date(mission.start_time).toLocaleString()}</td>
              <td>{new Date(mission.end_time).toLocaleString()}</td>
              <td>{mission.duration} heures</td>
              <td>{mission.travel?.id}</td>
              <td>{mission.adress}</td>
              <td>
                {mission.tools.map((tool, index) => (
                  <div key={index}>
                    <span>{tool.type}</span>
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      );
    } else if (missionView === 'calendar') {
      return (
        <CustomCalendar events={convertMissionsToEvents(fakeMissions)}/>
      );
    }
  };

  return (
    <div className="missionPage">
      <h1 className='title'>MISSIONS</h1>
      <div className="view-toggle">
        <button className='button' onClick={() => setMissionView('list')}>Vue Liste</button>
        <button className='button' onClick={() => setMissionView('calendar')}>Vue Calendrier</button>
      </div>
      <div className="missions-content">
        {renderMissions()}
      </div>
    </div>
  );
}
