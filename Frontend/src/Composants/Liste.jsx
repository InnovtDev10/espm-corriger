import React, { useEffect, useState } from "react";
import axios from "axios";

const Listes = () => {
  const [unites, setUnites] = useState([]);
  const [selectedFiliere, setSelectedFiliere] = useState("");

  useEffect(() => {
    // Récupérer les unités d'enseignement depuis l'API
    axios
      .get("http://localhost:5000/api/matiere/liste")
      .then((response) => {
        setUnites(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des unités :", error);
      });
  }, []);

  return (
    <div className="container mt-4">
      <h5 className="fw-bold">Liste des Unités d'Enseignement et Matières</h5>
      <div className="d-flex justify-content-end mb-3">
        <label className="fw-bold me-2">Filtrer par parcours :</label>
        <select
          className="form-control w-auto"
          value={selectedFiliere}
          onChange={(e) => setSelectedFiliere(e.target.value)}
        >
          <option value="">Toutes</option>
          <option value="Technicien de laboratoire">Technicien de laboratoire</option>
          <option value="Sciences infirmières">Sciences infirmières</option>
          <option value="Maieutique">Maieutique</option>
        </select>
      </div>
      <table className="table table-striped table-bordered text-center shadow-sm">
        <thead>
            <tr>
            <th>Parcours</th>
            <th>Unité d'Enseignement</th>
            <th>Matières</th>
          </tr>
        </thead>
        <tbody>
          {unites
            .filter(
              (unite) => !selectedFiliere || unite.filiere === selectedFiliere
            )
            .map((unite, index) => (
              <tr key={index}>
                <td>{unite.filiere}</td>
                <td>{unite.nom}</td>
                <td>
                  <ul className="list-unstyled">
                    {unite.matieres.map((matiere, i) => (
                      <li key={i}>{matiere}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Listes;
