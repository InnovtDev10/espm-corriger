import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Styles/Note.css";
import axios from "axios";

function SortieHistoriqueTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortiesFournitures, setSortiesFournitures] = useState([]);
  const url = import.meta.env.VITE_API_URL;

  // Récupérer les sorties de fournitures depuis l'API
  useEffect(() => {
    axios
      .get(`${url}/api/sortiemateriel/all`)
      .then((response) => {
        setSortiesFournitures(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des sorties : ", error);
      });
  }, []);

  // Filtrer les résultats selon la recherche
  const filteredSorties = sortiesFournitures.filter((sortie) =>
    ["designation", "quantite", "prixUnitaire"].some((key) =>
      String(sortie[key]).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="container mt-4">
      <h5 className="fw-bold">Historique des Sorties de Fournitures</h5>

      {/* Champ de recherche */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher par désignation, quantité, prix..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tableau des sorties */}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="note-table">
            <tr>
              <th>Désignation</th>
              <th>Quantité Sortie</th>
              <th>Nom</th>
              <th>Nature Sortie</th>
              <th>Prix Unitaire</th>
              <th>Prix Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredSorties.length > 0 ? (
              filteredSorties.map((sortie, index) => (
                <tr key={sortie.id || index}>
                  <td>{sortie.designation}</td>
                  <td>{sortie.quantite}</td>
                  <td>{sortie.nomPersonne}</td>
                  <td>{sortie.natureSortie}</td>
                  <td>{sortie.prixUnitaire} Ar</td>
                  <td>{sortie.prixTotal} Ar</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  Aucune sortie trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SortieHistoriqueTable;
