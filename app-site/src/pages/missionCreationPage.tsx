import React, { useState, useEffect } from 'react';
import { Mission, MissionDTO } from '../models/Mission';
import { TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../styles/missionCreationPageStyle.css'

export default function MissionCreationPage() {
    const [newMission, setNewMission] = useState<Mission>();
    const navigate = useNavigate();

    const onAddMission = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const name = (form.elements.namedItem('name') as HTMLInputElement).value;
        const description = (form.elements.namedItem('description') as HTMLInputElement).value;
        const address = (form.elements.namedItem('address') as HTMLInputElement).value;
        const startDateValue = (form.elements.namedItem('startDate') as HTMLInputElement).value;
        const startDate = new Date(startDateValue);
        const endDateValue = (form.elements.namedItem('endDate') as HTMLInputElement).value;
        const endDate = new Date(endDateValue);
        const durationHours = Math.abs(
          new Date(endDate).getTime() - new Date(startDate).getTime()
        ) / (1000 * 60 * 60);
      
        const newMissionObject: MissionDTO = {
            name,
            description,
            address,
            startDate,
            endDate,
        };
        
        fetch('http://localhost:3001/missions', {
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
              return response.json(); // si ton backend retourne la mission créée
            })
            .then(data => {
              console.log('Mission créée :', data);
              navigate('/missions'); // Redirection après succès
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
                <TextField
                    label="Adresse"
                    name="address"
                    type="text"
                    required
                />
                <TextField
                    label="Début"
                    name="startDate"
                    type="datetime-local"
                    required
                    slotProps={{ inputLabel: { shrink: true } }}
                />
                <TextField
                    label="Fin"
                    name="endDate"
                    type="datetime-local"
                    required
                    slotProps={{ inputLabel: { shrink: true } }}
                />
                <div className="form-actions">
                    <button className="button" type="submit">Enregistrer</button>
                    <button className='button' type="button" onClick={() => navigate('/missions')}>Annuler</button>
                </div>
            </form>
        </div>
    );
}
