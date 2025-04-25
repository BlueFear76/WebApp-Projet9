import React, { useState , useCallback, useEffect } from 'react';
import { Mission , UpdateMissionDTO } from '../models/Mission';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import '../styles/missionPageStyle.css';
import moment from 'moment';  // Importer moment.js
import 'moment/locale/fr';  // Importer la locale française de moment
import CustomCalendar from '../components/calendar/customCalendar';
//to have a responsive table
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import { Tool } from '../models/Tool';
import { Customer } from '../models/Customer';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';

// Icons
import ListIcon from '../images/list.svg'
import CalendarIcon from '../images/mission.svg'
import EditIcon from '../images/edit.svg'
import { Autocomplete, Box, FormControl, InputLabel, MenuItem, Modal, Select, TextField } from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';


export default function MissionPage() {
  const [missionView, setMissionView] = useState('list'); // 'list' pour liste, 'calendar' pour calendrier
  const [selectedTools, setSelectedTools] = useState<Tool[] | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);
  const [openModal, setOpenModal] = useState(false);
  // Form state
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | string>('');
  const [address, setAddress] = useState<string>('');
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());

  const navigate = useNavigate();

  // Get logged-in user from local storage
  const storedUser = localStorage.getItem('userLogged');
  const userLogged = storedUser ? JSON.parse(storedUser) : null;

  // Utility to force re-render (not used often)
  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), []);


  // Load all missions from backend
  const fetchMissions = async () => {
    try {
      const response = await fetch('https://tool-tracking-production.up.railway.app/missions');
      const data = await response.json();
      console.log("Missions reçues :", data);
      setMissions(data);
    } catch (err) {
      console.error('Erreur lors du chargement des missions :', err);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  // Load customers
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch('https://tool-tracking-production.up.railway.app/customers');
        const data = await res.json();
        setCustomers(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des clients :", error);
      }
    };
  
    fetchCustomers();
  }, []);

  // Convert missions to FullCalendar-compatible events
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

  // Delete a mission
  const onDeleteMission = async (missionId: number) => {
    const response = await fetch(`https://tool-tracking-production.up.railway.app/missions/${missionId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setMissions(missions.filter(mission => mission.id !== missionId));
      forceUpdate();
    }
  };

  const handleDeleteClick = () => {
    if (editingMission) {
      const confirmDelete = window.confirm(`Voulez-vous vraiment supprimer cet outil ?`);
        if (confirmDelete) {
        onDeleteMission(editingMission.id);
        setOpenModal(false); // Fermer le modal après suppression
        setEditingMission(null); // Réinitialiser l'état
      }
    }
  };

  // Show list of tools assigned to a mission
  const handleShowTools = async (toolIds: string[]) => {
    try {
      const response = await fetch('https://tool-tracking-production.up.railway.app/tools');
      const allTools = await response.json(); 
      console.log(allTools);
  
      // Filter tools by ID
      const selected = allTools.filter((tool: Tool) => toolIds.includes(tool.rfidTagId || 'no RFID TAG'));
      console.log(selected);
      setSelectedTools(selected);
    } catch (error) {
      console.error('Erreur lors du chargement des outils :', error);
    }
  };

  const handleCloseModal = () => {
    setSelectedTools(null);
  };

  // Handle updating a mission (form submit)
  const onUpdateMission = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const description = (form.elements.namedItem('description') as HTMLInputElement).value;

    if (!startDate || !endDate) {
      alert('Veuillez sélectionner une date de début et de fin.');
      return;
    }

    if (!selectedCustomerId) {
      alert('Veuillez sélectionner un client.');
      return;
    };

    if (editingMission) {
      const updatedMissionObject: UpdateMissionDTO = {
        name,
        description,
        address: editingMission.address,
        startDate: editingMission.startDate,
        endDate: editingMission.endDate,
        customerId: Number(selectedCustomerId),
      };

        // Update the tool via the API (example with fetch)
        const response = await fetch(`https://tool-tracking-production.up.railway.app/missions/${editingMission.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedMissionObject),
        });
        console.log(updatedMissionObject);
  
        if (response.ok) {
          // After updating, re-fetch the tools to get the most recent list
          fetchMissions(); // Retrieve updated tools from the backend
          setEditingMission(null);
          setOpenModal(false); // Close the modal after updating
        }
      }
    };

  // Open edit modal and fill in form fields
  const onEditMission = (mission : Mission) => {
      setEditingMission(mission);
      setOpenModal(true); // Open the modal to edit the tool
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
            <th className='actionColumn'/>
            
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
              <td>
                {(userLogged.role === "admin" || userLogged.role === "superAdmin") && (
                  <button className='editButton' onClick={() => onEditMission(mission)}>
                    <img src={EditIcon} alt="Éditer" style={{ width: '20px', height: '20px' }} />
                  </button>
                )}
              </td>
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
      
      {/* Toggle view (list/calendar) */}
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

      {/* Modal for viewing tools */}
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


      {/* Modal for editing a mission */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box className="modal-content">
          <button className='cancel-button' onClick={() => setOpenModal(false)}>&times; </button>
          <h2 id="modal-title">Modifier une Mission</h2>
          <form className='form-zone' onSubmit={onUpdateMission}>
          <TextField
                    label="Nom"
                    name="name"
                    type="text"
                    required
                />
                <TextField
                    label="Description"
                    name="description"
                    type="text"
                    required
                />
                <FormControl fullWidth required>
                    <InputLabel id="customer-label">Client</InputLabel>
                    <Select
                        labelId="customer-label"
                        id="customer"
                        name="customer"
                        value={selectedCustomerId}
                        onChange={(e) => setSelectedCustomerId(e.target.value)}
                        label="Client"
                    >
                        {customers.map((customer) => (
                            <MenuItem key={customer.id} value={customer.id}>
                                {customer.companyName
                                    ? customer.companyName
                                    : `${customer.firstName ?? ''} ${customer.lastName ?? ''}`}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Adresse"
                    name="address"
                    type="text"
                    value={editingMission?.address ?? ''}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
                    <DateTimePicker
                        label="Début"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        minutesStep={15}
                    />
                    <DateTimePicker
                        label="Fin"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        minutesStep={15}
                    />
                </LocalizationProvider>
            <div className="form-actions">
              <button type="submit" className='save-button'>Mettre à jour</button>
              <button className='save-button' onClick={handleDeleteClick}>Supprimer</button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
