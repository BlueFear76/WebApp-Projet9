import React, { useState, useCallback, useEffect } from 'react';
import '../styles/toolPageStyle.css';
import { Autocomplete, TextField, Button, Modal, Box } from '@mui/material';

import editIcon from '../images/edit.svg'

interface Tool {
  id: number;
  status?: string;
  name: string;
  lastKnownLocation?: string;
  rfidTagId?: string;
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
  const [tools, setTools] = useState<Tool[]>([]); // Liste des outils
  const [sortField, setSortField] = useState<keyof Tool | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const storedUser = localStorage.getItem('userLogged');
  const userLogged = storedUser ? JSON.parse(storedUser) : null;

  console.log(userLogged);

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

  const sortedTools = [...tools].sort((a, b) => {
    if (!sortField) return 0;

    const fieldA = a[sortField];
    const fieldB = b[sortField];

    if (fieldA === undefined || fieldB === undefined) return 0;

    if (typeof fieldA === 'number' && typeof fieldB === 'number') {
      return sortDirection === 'asc' ? fieldA - fieldB : fieldB - fieldA;
    }

    return sortDirection === 'asc'
      ? String(fieldA).localeCompare(String(fieldB))
      : String(fieldB).localeCompare(String(fieldA));
  });

  const handleSort = (field: keyof Tool) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderSortIcons = (field: keyof Tool) => {
    const isActive = sortField === field;
    return (
      <span style={{ marginLeft: 8 }}>
        <span style={{ color: isActive && sortDirection === 'asc' ? 'black' : '#ccc' }}>▲</span>
        <span style={{ color: isActive && sortDirection === 'desc' ? 'black' : '#ccc' }}>▼</span>
      </span>
    );
  };

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

  const handleDeleteClick = () => {
    if (editingTool) {
      const confirmDelete = window.confirm(`Voulez-vous vraiment supprimer cet outil ?`);
        if (confirmDelete) {
        onDeleteTool(editingTool.id);
        setOpenModal(false); // Fermer le modal après suppression
        setEditingTool(null); // Réinitialiser l'état
      }
    }
  };

  return (
    <div className="toolPage">
      <h1 className="title">OUTILS</h1>
      {/* Bouton pour afficher le formulaire d'ajout d'un outil */}
      {(userLogged.role === "admin"||userLogged.role==="superAdmin") &&
      (<button className='add-button' onClick={() => setShowForm(!showForm)}>
        Nouvel Outil
      </button>)
      }
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
              <button className='save-button' onClick={() => setShowForm(false)}>Annuler</button>
            </div>
          </form>
        </div>
      )}

      {/* Table avec la liste des outils */}
      <table className="tools-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('id')} style={{ cursor: 'pointer' }}>ID {renderSortIcons('id')}</th>
            <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>Status {renderSortIcons('status')}</th>
            <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>Type {renderSortIcons('name')}</th>
            <th onClick={() => handleSort('lastKnownLocation')} style={{ cursor: 'pointer' }}>Dernière Localisation {renderSortIcons('lastKnownLocation')}</th>
            <th onClick={() => handleSort('rfidTagId')} style={{ cursor: 'pointer' }}>Tag_id {renderSortIcons('rfidTagId')}</th>
            <th className='actionColumn'/>
          </tr>
        </thead>
        <tbody>
          {sortedTools.map((tool) => (
            <tr key={tool.id}>
              <td>{tool.id}</td>
              <td>{tool.status}</td>
              <td>{tool.name}</td>
              <td>{tool.lastKnownLocation}</td>
              <td>{tool.rfidTagId}</td>
              <td>
              {(userLogged.role === "admin"||userLogged.role==="superAdmin") && (
                <button className='editButton' onClick={() => onEditTool(tool)}>
                  <img src={editIcon} alt="Éditer" style={{ width: '20px', height: '20px' }} />
                </button>
              )}
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
          <button className='cancel-button' onClick={() => setOpenModal(false)}>&times; </button>
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
              <button className='save-button' onClick={handleDeleteClick}>Supprimer</button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
