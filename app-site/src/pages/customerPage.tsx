import React, { useState, useEffect } from 'react';
import { TextField, Modal, Box, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import '../styles/customerPageStyles.css';
import { Customer } from '../models/Customer';

import editIcon from '../images/edit.svg';

const CustomerPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:3001/customers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status}`);
      }

      const data = await response.json();
      setCustomers(data);
      console.log('Liste des clients récupérés:', data);
    } catch (err: any) {
      setError('Erreur lors du chargement des clients.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleImportClick = () => {
    setShowImport(!showImport);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:3001/customers', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l’importation du fichier.');
      }

      alert('Importation réussie !');
      fetchCustomers(); // pour rafraîchir la liste après import
      setShowImport(false);
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
      alert('Erreur pendant l’import.');
    }
  };

  return (
    <div className="customerPage">
      <h1 className="title">CLIENTS</h1>
      <button className='add-button' onClick={handleImportClick}>
        Importer
      </button>

      {showImport && (
        <div className="import-section">
          <input className="chooseFileButton" type="file" accept=".csv" onChange={handleFileChange} />
          <button className="button" onClick={handleUpload}>
            Envoyer
          </button>
        </div>
      )}

      {loading && <p>Chargement en cours...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <table className="customers-table">
          <thead>
            <tr>
              <th>Nom Prénom OU Entreprise</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Adresse</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>
                  {customer.companyName 
                    ? `(${customer.companyName})` 
                    : `${customer.firstName} ${customer.lastName}`}
                </td>
                <td>{customer.email}</td>
                <td>{customer.phoneNumber}</td>
                <td>{customer.addresses}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CustomerPage;
