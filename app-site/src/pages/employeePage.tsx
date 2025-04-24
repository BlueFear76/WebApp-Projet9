import React, { useState, useCallback, useEffect } from 'react';
import { Autocomplete, TextField, Button, Modal, Box, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import '../styles/employeePageStyles.css'

import editIcon from '../images/edit.svg'

interface Employee {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
}

interface EmployeeDTO {
  firstname: string;
  lastname: string;
  email: string;
}

interface UpdatedEmployeeDTO {
  firstname: string;
  lastname: string;
  email: string;
  role: string;
}

const EmployeePage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const storedUser = localStorage.getItem('userLogged');
  const userLogged = storedUser ? JSON.parse(storedUser) : null;

  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('https://tool-tracking-production.up.railway.app/employees', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status}`);
      }

      const data = await response.json();
      setEmployees(data);
      console.log('Liste des employés récupérés:', data);
    } catch (err: any) {
      setError('Erreur lors du chargement des employés.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const onSaveEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    // Utilisation de 'FormData' pour récupérer les données du formulaire
    const formData = new FormData(form);
    const firstname = formData.get('firstname') as string;
    const lastname = formData.get('lastname') as string;
    const email = formData.get('email') as string;

    // Vérification que toutes les valeurs sont bien récupérées
    if (!firstname || !lastname || !email) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    const newEmployee: EmployeeDTO = {
      firstname,
      lastname,
      email
    };

    // Enregistrer l'outil via une API (exemple avec fetch)
    const response = await fetch('https://tool-tracking-production.up.railway.app/employees/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEmployee),
    });

    if (response.ok) {
      const addedEmployee = await response.json();
      setEmployees([...employees, addedEmployee]);
      form.reset();
      setShowForm(false); // Ferme le formulaire après l'ajout
      forceUpdate();
    }
  };

  const onEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setOpenModal(true); // Ouvrir le modal pour modifier l'outil
  };

  const onUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const firstname = (form.elements.namedItem('firstname') as HTMLInputElement).value;
    const lastname = (form.elements.namedItem('lastname') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const role = (form.elements.namedItem('role') as HTMLInputElement).value;

    const employeeUpdate: UpdatedEmployeeDTO = {
      firstname,
      lastname,
      email,
      role
    }

    if (editingEmployee) {
      const updatedEmployee = { ...editingEmployee, firstname, lastname, email, role };

      // Mettre à jour l'outil via l'API (exemple avec fetch)
      const response = await fetch(`https://tool-tracking-production.up.railway.app/employees/${editingEmployee.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeUpdate),
      });
      console.log(employeeUpdate);

      if (response.ok) {
        // Après la mise à jour, re-fetch les outils pour avoir la liste la plus récente
        fetchEmployees(); // Récupérer les outils mis à jour depuis le backend
        setEditingEmployee(null);
        setOpenModal(false); // Fermer le modal après la mise à jour
      }
    }
  };

  const onDeleteEmployee = async (employeeId: number) => {
    const response = await fetch(`https://tool-tracking-production.up.railway.app/employees/${employeeId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setEmployees(employees.filter(employee => employee.id !== employeeId));
      forceUpdate();
    }
  };

  const handleDeleteClick = () => {
    if (editingEmployee) {
      const confirmDelete = window.confirm(`Voulez-vous vraiment supprimer ${editingEmployee.firstname} ${editingEmployee.lastname} ?`);
      if (confirmDelete) {
        onDeleteEmployee(editingEmployee.id);
        setOpenModal(false); // Fermer le modal après suppression
        setEditingEmployee(null); // Réinitialiser l'état
      }
    }
  };

  const roleTranslation = (role: string): string => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'user':
        return 'User';
      case 'superAdmin':
        return 'Super Admin';
      default:
        return 'Rôle inconnu';
    }
  };



  return (
    <div className="employeePage">
      <h1 className="title">EMPLOYÉS</h1>
      <button className='add-button' onClick={() => setShowForm(!showForm)}>
        Nouvel Employé
      </button>
      {showForm && (
        <div className="form-block">
          <form className="employee-form" onSubmit={onSaveEmployee}>
            <h2>Ajouter un Outil</h2>
            {/* Champ "Type" avec suggestions */}
            <TextField
              label="Prénom"
              name="firstname"
              required
            />
            <TextField
              label="Nom"
              name="lastname"
              required
            />
            <TextField
              label="Email"
              name="email"
              required
            />

            <div className="form-actions">
              <button className='save-button'>Enregistrer</button>
              <button className='save-button' onClick={() => setShowForm(false)}>Annuler</button>
            </div>
          </form>
        </div>
      )}

      {loading && <p>Chargement en cours...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <table className="employees-table">
          <thead>
            <tr>
              <th>Prénom</th>
              <th>Nom</th>
              <th>Login</th>
              <th>Téléphone</th>
              <th>Permission</th>
              <th className='actionColumn' />
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.firstname}</td>
                <td>{employee.lastname}</td>
                <td>{employee.email}</td>
                <td> A venir </td>
                <td>{roleTranslation(employee.role)}</td>
                <td>
                  {userLogged.role === "superAdmin" && (
                    <button className='editButton' onClick={() => onEditEmployee(employee)}>
                      <img src={editIcon} alt="Éditer" style={{ width: '20px', height: '20px' }} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box className="modal-content">
          <button className='cancel-button' onClick={() => setOpenModal(false)}>&times; </button>
          <h2 id="modal-title">Modifier un Employé</h2>
          <form className='form-zone' onSubmit={onUpdateEmployee}>
            <TextField
              label="Prénom"
              name="firstname"
              defaultValue={editingEmployee?.firstname || ''}
              required
            />
            <TextField
              label="Nom"
              name="lastname"
              defaultValue={editingEmployee?.lastname || ''}
              required
            />
            <TextField
              label="Email"
              defaultValue={editingEmployee?.email || ''}
              name="email"
            />
            <FormControl fullWidth required>
              <InputLabel id="role-label">Permission</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                name="role"
                defaultValue={editingEmployee?.role || ''}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="superAdmin">Super Admin</MenuItem>
              </Select>
            </FormControl>
            <div className="form-actions">
              <button type="submit" className='save-button'>Mettre à jour</button>
              <button className='save-button' onClick={handleDeleteClick}>Supprimer</button>
            </div>
          </form>
        </Box>
      </Modal>

    </div>
  );
};

export default EmployeePage;
