import React, { useState, useCallback } from 'react';
import '../styles/toolPageStyle.css';
import { Autocomplete, TextField, Button, Modal, Box } from '@mui/material';

interface Tool {
  id_tool: number;
  status: string;
  type: string;
  last_known_location_id: string;
  tag_id: number;
  mission_id: string;
}

let fakeTools: Tool[] = [
  { id_tool: 1, status: "active", type: "Pelle", last_known_location_id: "Versailles", tag_id: 201, mission_id: "1" },
  { id_tool: 2, status: "maintenance", type: "Tronçonneuse", last_known_location_id: "Evry-Garden", tag_id: 202, mission_id: "2" },
  { id_tool: 3, status: "active", type: "Tondeuse", last_known_location_id: "Paris", tag_id: 203, mission_id: "3" }
];

export default function Tool() {
  const [showForm, setShowForm] = useState(false);
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [modifiedToolId, setModifiedToolId] = useState<number | null>(null); // ID de l'outil modifié


  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), []);

  const existingToolTypes = Array.from(new Set(fakeTools.map(tool => tool.type)));

  const onSaveTool = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    const type = (form.elements.namedItem('type') as HTMLInputElement).value;
    const status = (form.elements.namedItem('status') as HTMLInputElement).value;
    const tag_id = parseInt((form.elements.namedItem('tag_id') as HTMLInputElement).value);

    const newTool: Tool = {
      id_tool: fakeTools.length + 1,
      type,
      status,
      last_known_location_id: "Non défini",
      tag_id,
      mission_id: "0",
    };

    fakeTools.push(newTool);
    form.reset();
    setShowForm(false); // Ferme le formulaire après l'ajout
    forceUpdate();
  };

  const onUpdateTool = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
  
    const type = (form.elements.namedItem('type') as HTMLInputElement).value;
    const status = (form.elements.namedItem('status') as HTMLInputElement).value;
    const tag_id = parseInt((form.elements.namedItem('tag_id') as HTMLInputElement).value);
  
    if (editingTool) {
      const updatedTool = { ...editingTool, type, status, tag_id };
      fakeTools = fakeTools.map(tool => tool.id_tool === editingTool.id_tool ? updatedTool : tool);
      forceUpdate();
      setEditingTool(null);
      setOpenModal(false); // Fermer le modal après la mise à jour
  
      // Mettre à jour l'ID de l'outil modifié
      setModifiedToolId(editingTool.id_tool);
  
      // Réinitialiser l'ID modifié après un délai (par exemple, 2 secondes)
      setTimeout(() => {
        setModifiedToolId(null); // Réinitialiser après 2 secondes
      }, 2000);
    }
  };

  const onEditTool = (tool: Tool) => {
    setEditingTool(tool);
    setOpenModal(true); // Ouvrir le modal pour modifier l'outil
  };

  const onDeleteTool = (toolId: number) => {
    fakeTools = fakeTools.filter(tool => tool.id_tool !== toolId);
    forceUpdate();
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
              renderInput={(params) => <TextField {...params} label="Type" name="type" required slotProps={{ inputLabel: { required: false } }}/>}
            />

            <TextField
              label="Status"
              name="status"
              required slotProps={{ inputLabel: { required: false } }}
            />
            <TextField
              label="ID Tag"
              name="tag_id"
              type="number"
              required slotProps={{ inputLabel: { required: false } }}
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
    {fakeTools.map((tool) => (
      <tr
        key={tool.id_tool}
        className={tool.id_tool === modifiedToolId ? 'modified' : ''}
      >
        <td>{tool.id_tool}</td>
        <td>{tool.status}</td>
        <td>{tool.type}</td>
        <td>{tool.last_known_location_id}</td>
        <td>{tool.tag_id}</td>
        <td>{tool.mission_id}</td>
        <td>
          <button onClick={() => onEditTool(tool)}>Éditer</button>
          <button onClick={() => onDeleteTool(tool.id_tool)}>Supprimer</button>
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
              options={existingToolTypes}
              value={editingTool?.type || ''}
              renderInput={(params) => <TextField {...params} label="Type" name="type" defaultValue={editingTool?.type || ''} required slotProps={{ inputLabel: { required: false } }}/>}
            />
            <TextField
              label="Status"
              name="status"
              defaultValue={editingTool?.status || ''}
              required slotProps={{ inputLabel: { required: false } }}
            />
            <TextField
              label="ID Tag"
              name="tag_id"
              type="number"
              defaultValue={editingTool?.tag_id || ''}
              required slotProps={{ inputLabel: { required: false } }}
            />
            <div className="form-actions">
              <button className='save-button'>Mettre à jour</button>
              <button className='cancel-button' onClick={() => setOpenModal(false)} >Annuler</button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
