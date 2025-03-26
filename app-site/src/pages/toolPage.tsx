import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface Tool {
  id_tool: number;
  status: string;
  type: string;
  last_known_location_id: string;
  tag_id: number;
  mission_id: string;
}

export default function Tool() {
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/tools')
      .then(response => response.json())
      .then(data => setTools(data))
      .catch(error => console.error('Erreur de chargement des outils:', error));
  }, []);

  return (
    <div>
      <h1>TOOL PAGE</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black'}}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Type</th>
            <th>Dernière Localisation</th>
            <th>Tag_id</th>
            <th>Mission_id</th>
          </tr>
        </thead>
        <tbody>
          {tools.map((tool) => (
            <tr key={tool.id_tool}>
              <td>{tool.id_tool}</td>
              <td>{tool.status}</td>
              <td>{tool.type}</td>
              <td>{tool.last_known_location_id}</td>
              <td>{tool.tag_id}</td>
              <td>{tool.mission_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}