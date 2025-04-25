import React, { useState, useEffect } from 'react';
// Importing required types
import { Mission, MissionDTO } from '../models/Mission';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../styles/missionCreationPageStyle.css';
// Date picker components
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import { Customer } from '../models/Customer';
import API_BASE_URL from '../config';

export default function MissionCreationPage() {
    const [newMission, setNewMission] = useState<Mission>();
    const navigate = useNavigate();

    // States for start and end dates
    const [startDate, setStartDate] = useState<Date | null>(new Date());
    const [endDate, setEndDate] = useState<Date | null>(new Date());
    // States for customer selection and customer list
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | string>('');
    // State to hold address based on selected customer
    const [address, setAddress] = useState<string>(''); // <- nouvelle ligne

    // Fetch the list of customers from the backend when component mounts
    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/customers`);
                const data = await res.json();
                setCustomers(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des clients :", error);
            }
        };

        fetchCustomers();
    }, []);

    /// Automatically update address when a customer is selected
    useEffect(() => {
        const selectedCustomer = customers.find(c => c.id === Number(selectedCustomerId));
        if (selectedCustomer?.addresses) {
            setAddress(selectedCustomer.addresses);// Auto-fill address
        } else {
            setAddress('');
        }
    }, [selectedCustomerId, customers]);

    // Function to handle form submission and mission creation
    const onAddMission = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const name = (form.elements.namedItem('name') as HTMLInputElement).value;
        const description = (form.elements.namedItem('description') as HTMLInputElement).value;

        // Validate dates
        if (!startDate || !endDate) {
            alert('Veuillez sélectionner une date de début et de fin.');
            return;
        }

        // Validate customer selection
        if (!selectedCustomerId) {
            alert('Veuillez sélectionner un client.');
            return;
        }

        // Create the mission object to send
        const newMissionObject: MissionDTO = {
            name,
            description,
            address,
            startDate,
            endDate,
            employeeIds: [1,2], // Replace with actual logic for employee assignment
            customerId: Number(selectedCustomerId),
        };

        // Send mission to the backend
        fetch('https://tool-tracking-production.up.railway.app/missions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newMissionObject),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la création de la mission');
                }
                return response.json();
            })
            .then(data => {
                console.log('Mission créée :', data);
                navigate('/missions'); // Navigate to missions page after creation
            })
            .catch(error => {
                console.error('Erreur :', error);
                alert('Une erreur est survenue lors de la création de la mission.');
            });
    };

    return (
        <div className='missionCreationPage'>
            <form className="mission-form" onSubmit={onAddMission}>
                <h2>Créer une nouvelle mission</h2>
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
                    value={address}
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
                    <button className="button" type="submit">Enregistrer</button>
                    <button className='button' type="button" onClick={() => navigate('/missions')}>Annuler</button>
                </div>
            </form>
        </div>
    );
}
