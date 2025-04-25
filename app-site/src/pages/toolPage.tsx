import React, { useState, useCallback, useEffect } from 'react';
import '../styles/toolPageStyle.css';
import { Autocomplete, TextField, Button, Modal, Box } from '@mui/material';
import { Tool } from '../models/Tool';

import editIcon from '../images/edit.svg'
import API_BASE_URL from '../config';

interface ToolDTO{
  rfidTagId?: string;
  name: string;
  note?: string;
  assignationDate?: Date;
}

export default function ToolPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [tools, setTools] = useState<Tool[]>([]); // Liste des outils
  const [sortField, setSortField] = useState<keyof Tool | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const storedUser = localStorage.getItem('userLogged');
  const userLogged = storedUser ? JSON.parse(storedUser) : null;

  console.log(userLogged);

  // Use useCallback to force a re-render when necessary
  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), []);

  // Fetch tools from the API
  const fetchTools = async () => {
    const response = await fetch(`${API_BASE_URL}/tools`);
    const data = await response.json();
    setTools(data);
  };

  // Fetch tools when the component mounts
  useEffect(() => {
    fetchTools(); // Load tools on first render
  }, []);

  // Deduplicate tool types to avoid duplicates
  const existingToolTypes = Array.from(new Set(tools.map(tool => tool.name)));

  // Sort tools based on the selected field and direction
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

  // Handle the sorting of tools when clicking on table headers
  const handleSort = (field: keyof Tool) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Render sorting icons next to each column header
  const renderSortIcons = (field: keyof Tool) => {
    const isActive = sortField === field;
    return (
      <span style={{ marginLeft: 8 }}>
        <span style={{ color: isActive && sortDirection === 'asc' ? 'black' : '#ccc' }}>▲</span>
        <span style={{ color: isActive && sortDirection === 'desc' ? 'black' : '#ccc' }}>▼</span>
      </span>
    );
  };

  // Handle saving a new tool
  const onSaveTool = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    // Using 'FormData' to retrieve form data
    const formData = new FormData(form);
    const name = formData.get('name') as string;
    const status = formData.get('status') as string;
    const rfidTagId = formData.get('rfidTagId') as string;

    // Check that all values ​​are correctly retrieved
    if (!name || !rfidTagId) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    const newTool: ToolDTO = {
      name,
      rfidTagId
    };
  
    // Register the tool via an API (example with fetch)
    const response = await fetch('https://tool-tracking-production.up.railway.app/tools', {
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
      setShowForm(false); // Close the form after saving the tool
      forceUpdate();
    }
  };

  // Handle updating an existing tool
  const onUpdateTool = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const status = (form.elements.namedItem('status') as HTMLInputElement).value;
    const tag_id = (form.elements.namedItem('rfidTagId') as HTMLInputElement).value;

    if (editingTool) {
      const updatedTool = { ...editingTool, name, status, rfidTagId : tag_id };
      
      // Update the tool through the API
      const response = await fetch(`https://tool-tracking-production.up.railway.app/tools/${editingTool.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTool),
      });
      console.log(updatedTool);

      if (response.ok) {
        // After updating, re-fetch the tools to get the most recent list
        fetchTools(); // Retrieve updated tools from the backend
        setEditingTool(null);
        setOpenModal(false); // Close the modal after updating
      }
    }
  };

  // Handle editing a tool
  const onEditTool = (tool: Tool) => {
    setEditingTool(tool);
    setOpenModal(true); // Open the modal to edit the tool
  };

  // Handle deleting a too
  const onDeleteTool = async (toolId: number) => {
    const response = await fetch(`${API_BASE_URL}/tools/${toolId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setTools(tools.filter(tool => tool.id !== toolId));
      forceUpdate();
    }
  };

  // Handle delete confirmation in the modal
  const handleDeleteClick = () => {
    if (editingTool) {
      const confirmDelete = window.confirm(`Voulez-vous vraiment supprimer cet outil ?`);
        if (confirmDelete) {
        onDeleteTool(editingTool.id);
        setOpenModal(false); // Close the modal after deletion
        setEditingTool(null); /// Reset the editing tool state
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
