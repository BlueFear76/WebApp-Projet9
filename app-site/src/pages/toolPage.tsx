import React, { useEffect, useState } from 'react';
import '../styles/toolPageStyle.css';
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
  //const [tools, setTools] = useState<Tool[]>([]);
/*
  useEffect(() => {
    fetch('http://localhost:3001/tools')
      .then(response => response.json())
      .then(data => setTools(data))
      .catch(error => console.error('Erreur de chargement des outils:', error));
  }, []);
  */

  //Données fictives des outils (à remplacer par les données réelles)
  const fakeTools: Tool[] = [
    {
      id_tool: 1,
      status: "active",
      type: "Pelle",
      last_known_location_id: "Place d'Armes, 78000 Versailles",
      tag_id: 201,
      mission_id: "1",
    },
    {
      id_tool: 2,
      status: "maintenance",
      type: "Tronçonneuse",
      last_known_location_id: "Evry-Garden-12",
      tag_id: 202,
      mission_id: "2",
    },
  ];


  return (
    <div className="toolPage">
      <h1 className="title">TOOL PAGE</h1>
      <table className="tools-table">
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
          {fakeTools.map((tool) => (
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