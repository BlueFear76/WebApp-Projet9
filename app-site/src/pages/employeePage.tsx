import React, { useState, useCallback, useEffect } from 'react';
import { Autocomplete, TextField, Button, Modal, Box, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import '../styles/employeePageStyles.css'

import editIcon from '../images/edit.svg'
import API_BASE_URL from '../config';

// Interfaces for type checking
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
  // States to manage component behavior
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  // Logged-in user from localStorage
  const storedUser = localStorage.getItem('userLogged');
  const userLogged = storedUser ? JSON.parse(storedUser) : null;

  const [, updateState] = useState({});
  const forceUpdate = useCallback(() => updateState({}), []);

  // Fetch employee data from the API
  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`, {
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

  // Load employees on initial render
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Add a new employee (POST request)
  const onSaveEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    // Using 'FormData' to retrieve form data
    const formData = new FormData(form);
    const firstname = formData.get('firstname') as string;
    const lastname = formData.get('lastname') as string;
    const email = formData.get('email') as string;

    // Check that all values ​​are correctly retrieved
    if (!firstname || !lastname || !email) {
      alert('Veuillez remplir tous les champs.');
      return;
    }

    const newEmployee: EmployeeDTO = {
      firstname,
      lastname,
      email
    };

    // Register the tool via an API (example with fetch)
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
      setShowForm(false); // Close the form
      forceUpdate();
    }
  };

  // Open the modal with selected employee data
  const onEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setOpenModal(true); // Open the modal to edit the tool
  };

  // Update an existing employee (PATCH request)
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

      
      // Update the tool via the API (example with fetch)
      const response = await fetch(`https://tool-tracking-production.up.railway.app/employees/${editingEmployee.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeUpdate),
      });
      console.log(employeeUpdate);

      if (response.ok) {
        // After updating, re-fetch the tools to get the most recent list
        fetchEmployees(); //Retrieve updated tools from the backend
        setEditingEmployee(null);
        setOpenModal(false); // Close the modal after updating
      }
    }
  };

  // Delete an employee (DELETE request)
  const onDeleteEmployee = async (employeeId: number) => {
    const response = await fetch(`${API_BASE_URL}/employees/${employeeId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      setEmployees(employees.filter(employee => employee.id !== employeeId));
      forceUpdate();
    }
  };

  // Handle confirmation before deletion
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

  // Translate internal role value to readable label
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
            <h2>Ajouter un Employé</h2>
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
