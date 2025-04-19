import React, { useState , useEffect } from 'react';
import { Mission } from '../models/Mission';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import '../styles/missionPageStyle.css';
import moment from 'moment';  // Importer moment.js
import 'moment/locale/fr';  // Importer la locale française de moment
import CustomCalendar from '../components/customCalendar';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { Tool } from '../models/Tool';
import { Customer } from '../models/Customer';

import ListIcon from '../images/list.svg'
import CalendarIcon from '../images/mission.svg'


export default function MissionPage() {
  const [missionView, setMissionView] = useState('list'); // 'list' pour liste, 'calendar' pour calendrier
  const [selectedTools, setSelectedTools] = useState<Tool[] | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const storedUser = localStorage.getItem('userLogged');
  const userLogged = storedUser ? JSON.parse(storedUser) : null;
  const [customers, setCustomers] = useState<Customer[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/missions')
      .then((res) => res.json())
      .then((data) => {
        setMissions(data);
      })
      .catch((err) => {
        console.error('Erreur lors du chargement des missions :', err);
      });
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch('http://localhost:3001/customers');
        const data = await res.json();
        setCustomers(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des clients :", error);
      }
    };
  
    fetchCustomers();
  }, []);

  const convertMissionsToEvents = (missions: Mission[]) => {
    return missions.map(mission => ({
      id: mission.id.toString(),  // ID unique de l'événement
      title: mission.description,  // Le titre de l'événement
      start: moment(mission.startDate).toISOString(),  // Date de début formatée
      end: moment(mission.endDate).toISOString(),  // Date de fin formatée
      extendedProps: {
        description: mission.description,  // Description de la mission
        location: mission.address,  // Adresse de la mission
      },
    }));
  };

  const handleShowTools = async (toolIds: string[]) => {
    try {
      const response = await fetch('http://localhost:3001/tools');
      const allTools = await response.json(); 
      console.log(allTools);
      const toolIdsAsNumbers = toolIds.map(id => Number(id));
  
      // Filtrer les outils par ID
      const selected = allTools.filter((tool: Tool) => toolIdsAsNumbers.includes(tool.id));
      console.log(selected);
      setSelectedTools(selected);
    } catch (error) {
      console.error('Erreur lors du chargement des outils :', error);
    }
  };

  const handleCloseModal = () => {
    setSelectedTools(null);
  };


  const renderMissions = () => {
    if (missionView === 'list') {
      return (
        <Table className="missions-table">
        <Thead>
          <Tr>
            <Th>Description</Th>
            <Th>Client</Th>
            <Th>Début</Th>
            <Th>Fin</Th>
            <Th>Durée</Th>
            <Th>Employés</Th>
            <Th>Adresse</Th>
            <Th>Outils</Th>
          </Tr>
        </Thead>
        <Tbody>
          {missions.map((mission) => (
            <Tr key={mission.id}>
              <Td>{mission.description}</Td>
              <Td>{getCustomerDisplayName(mission.customerId)}</Td>
              <Td>{new Date(mission.startDate).toLocaleString()}</Td>
              <Td>{new Date(mission.endDate).toLocaleString()}</Td>
              <Td>
                {Math.abs(
                  new Date(mission.endDate).getTime() - new Date(mission.startDate).getTime()
                ) / (1000 * 60 * 60)} h
              </Td>
              <Td>{}</Td>
              <Td>{mission.address}</Td>
              <Td>
                {Array.isArray(mission.assignedToolNames) && mission.assignedToolNames.length > 0 ? (
                  <button className='see-button' onClick={() => handleShowTools(mission.assignedToolNames)}>Voir</button>
                ) : (
                  <i>Aucun Outil</i>
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      );
    } else if (missionView === 'calendar') {
      return (
        <CustomCalendar events={convertMissionsToEvents(missions)}/>
      );
    }
  };

  const getCustomerDisplayName = (customerId: number) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return 'Client inconnu';
  
    return customer.companyName
      ? customer.companyName
      : `${customer.firstName ?? ''} ${customer.lastName ?? ''}`.trim();
  };


  return (
    <div className="missionPage">
      <h1 className='title'>MISSIONS</h1>
      {(userLogged.role === "admin" || userLogged.role === "superAdmin")&&
      (<button className='add-button' onClick={() => navigate('/create-mission')}>
        Nouvelle Mission
      </button>)
      }
      <div className="view-toggle">
        <button className="button" onClick={() => setMissionView('list')}>
          <img src={ListIcon} alt="Vue Liste" className="icon-button" />
        </button>
        <button className="button" onClick={() => setMissionView('calendar')}>
          <img src={CalendarIcon} alt="Vue Calendrier" className="icon-button" />
        </button>
      </div>
      <div className={`missions-content ${missionView === 'calendar' ? 'calendar-view' : ''}`}>
        {renderMissions()}
      </div>

      {selectedTools && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Outils Détectés</h2>
            <table className="mission-tools-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>RFID Tag ID</th>
                </tr>
              </thead>
              <tbody>
                {selectedTools.map((tool) => (
                  <tr key={tool.id}>
                    <td>{tool.id}</td>
                    <td>{tool.name}</td>
                    <td>{tool.rfidTagId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className='button' onClick={handleCloseModal}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
}
