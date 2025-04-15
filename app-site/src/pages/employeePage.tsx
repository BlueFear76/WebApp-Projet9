import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import '../styles/employeePageStyles.css'

interface Employee {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
}


const EmployeePage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://localhost:3001/employees', {
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

    fetchEmployees();
  }, []);

  return (
    <div className="employeePage">
      <h1 className="title">EMPLOYÉS</h1>

      {loading && <p>Chargement en cours...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <table className="employees-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Prénom</th>
              <th>Nom</th>
              <th>Login</th>
              <th>Téléphone</th>
              <th>Permission</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.firstname}</td>
                <td>{employee.lastname}</td>
                <td>{employee.email}</td>
                <td> A venir </td>
                <td>{employee.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmployeePage;
