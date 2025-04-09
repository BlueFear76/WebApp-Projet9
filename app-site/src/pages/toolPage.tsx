import React, { useState, useCallback, useEffect } from 'react';
import '../styles/toolPageStyle.css';
import { Autocomplete, TextField, Button, Modal, Box } from '@mui/material';

interface Tool {
  id: number;
  status?: string;
  name: string;
  lastKnownLocation?: string;
  rfidTagId?: string;
  mission_id?: string;
}

interface ToolDTO{
  rfidTagId?: string;
  name: string;
  note?: string;
  assignationDate?: Date;
}

export default function Tool() {
  const [showForm, setShowForm] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [modifiedToolId, setModifiedToolId] = useState<number | null>(null); // ID de l'outil modifié
  const [tools, setTools] = useState<Tool[]>([]); // Liste des outils

  // Utilisation du hook useCallback pour forcer le rafraîchissement de la page
  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), []);

  
  const fetchTools = async () => {
    const response = await fetch('http://localhost:3001/tools');
    const data = await response.json();
    setTools(data);
  };

  useEffect(() => {
    fetchTools(); // Charge les outils au premier rendu
  }, []);

  // Dédupliquer les types d'outils pour éviter les doublons
  const existingToolTypes = Array.from(new Set(tools.map(tool => tool.name)));

  const onSaveTool = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
  
    // Utilisation de 'FormData' pour récupérer les données du formulaire
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const status = formData.get('status') as string;
    const rfidTagId = formData.get('rfidTagId') as string;
  
    // Vérification que toutes les valeurs sont bien récupérées
    if (!name || !rfidTagId) {
      alert('Veuillez remplir tous les champs.');
      return;
    }
  
    const newTool: ToolDTO = {
      name,
      rfidTagId
    };
  
    // Enregistrer l'outil via une API (exemple avec fetch)
    const response = await fetch('http://localhost:3001/tools', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTool),
    });
  
    if (response.ok) {
      const addedTool = await response.json();
      setTools([...tools, addedTool]);
      form.reset();
      setShowForm(false); // Ferme le formulaire après l'ajout
      forceUpdate();
    }
  };

  const onUpdateTool = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const status = (form.elements.namedItem('status') as HTMLInputElement).value;
    const tag_id = (form.elements.namedItem('rfidTagId') as HTMLInputElement).value;

    if (editingTool) {
      const updatedTool = { ...editingTool, name, status, rfidTagId : tag_id };
      
      // Mettre à jour l'outil via l'API (exemple avec fetch)
      const response = await fetch(`http://localhost:3001/tools/${editingTool.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTool),
      });
      console.log(updatedTool);

      if (response.ok) {
        // Après la mise à jour, re-fetch les outils pour avoir la liste la plus récente
        fetchTools(); // Récupérer les outils mis à jour depuis le backend
        setEditingTool(null);
        setOpenModal(false); // Fermer le modal après la mise à jour
      }
    }
  };

  const onEditTool = (tool: Tool) => {
    setEditingTool(tool);
    setOpenModal(true); // Ouvrir le modal pour modifier l'outil
  };

  const onDeleteTool = async (toolId: number) => {
    const response = await fetch(`http://localhost:3001/tools/${toolId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setTools(tools.filter(tool => tool.id !== toolId));
      forceUpdate();
    }
  };

  return (
    <div className="toolPage">
      <h1 className="title">TOOL PAGE</h1>
      
      {/* Bouton pour afficher le formulaire d'ajout d'un outil */}
      <button className='add-button' onClick={() => setShowForm(!showForm)}>
        Nouvel Outil
      </button>

      {/* Formulaire d'ajout d'un nouvel outil */}
      {showForm && (
        <div className="form-block">
          <form className="tool-form" onSubmit={onSaveTool}>
            <h2>Ajouter un Outil</h2>

            {/* Champ "Type" avec suggestions */}
            <Autocomplete
              freeSolo
              options={existingToolTypes}
              renderInput={(params) => <TextField {...params} label="Type" name="name" required />}
            />
            <TextField
              label="Status"
              name="status"
              required
            />
            <TextField
              label="ID Tag"
              name="rfidTagId"
              required
            />

            <div className="form-actions">
              <button className='save-button'>Enregistrer</button>
              <button className='cancel-button' onClick={() => setShowForm(false)}>Annuler</button>
            </div>
          </form>
        </div>
      )}

      {/* Table avec la liste des outils */}
      <table className="tools-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Type</th>
            <th>Dernière Localisation</th>
            <th>Tag_id</th>
            <th>Mission_id</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tools.map((tool) => (
            <tr key={tool.id}>
              <td>{tool.id}</td>
              <td>{tool.status}</td>
              <td>{tool.name}</td>
              <td>{tool.lastKnownLocation}</td>
              <td>{tool.rfidTagId}</td>
              <td>{tool.mission_id}</td>
              <td>
                <button onClick={() => onEditTool(tool)}>Éditer</button>
                <button onClick={() => onDeleteTool(tool.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal pour la modification de l'outil */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box className="modal-content">
          <h2 id="modal-title">Modifier un Outil</h2>
          <form className='form-zone' onSubmit={onUpdateTool}>
            <Autocomplete
              freeSolo
              defaultValue={editingTool?.name}
              options={existingToolTypes}
              getOptionLabel={(option) => option}
              renderOption={(props, option, index) => (
                <li {...props} key={`${option}-${index}`}>
                  {option}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Type"
                  name="name"
                  required
                />
              )}
            />
            <TextField
              label="Status"
              name="status"
              defaultValue={editingTool?.status || ''}
              required
            />
            <TextField
              label="ID Tag"
              defaultValue={editingTool?.rfidTagId || ''}
              name="rfidTagId"
            />
            <div className="form-actions">
              <button type="submit" className='save-button'>Mettre à jour</button>
              <button className='cancel-button' onClick={() => setOpenModal(false)} >Annuler</button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
