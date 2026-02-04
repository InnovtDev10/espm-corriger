import React, { useState, useEffect } from "react";
import "../Styles/PaiementProfesseurs.css";
import Swal from "sweetalert2";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

function PaiementTable({ searchName, searchMatricule, selectedStatut, selectedMois, selectedAnnee }) {
  const [paiements, setPaiements] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPaiements = async () => {
      try {
        const response = await fetch(
          `${url}/api/paiement/salaire/all`,
          {
            cache: 'no-store'
          }
        );
        if (!response.ok)
          throw new Error("Erreur lors de la récupération des paiements");
        const data = await response.json();
        setPaiements(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPaiements();
  }, []);

  // Fonction pour formater la date en format français
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "short", // Jour de la semaine
      year: "numeric",
      month: "long", // Mois en format texte
      day: "numeric", // Jour du mois
    });
  };

  // Filtrer les paiements en fonction des critères sélectionnés
  const filteredPaiements = paiements.filter(paiement => {
    // Extraire mois et année de la date de paiement
    const paiementDate = new Date(paiement.createdAt);
    const paiementMois = `${paiementDate.getFullYear()}-${(paiementDate.getMonth() + 1).toString().padStart(2, '0')}`;
    const paiementAnnee = paiementDate.getFullYear();

    // Appliquer les filtres
    return (
      (selectedStatut === '' || paiement.statut === selectedStatut) &&
      (selectedMois === '' || paiementMois === selectedMois) &&
      (selectedAnnee === '' || paiementAnnee === parseInt(selectedAnnee)) &&
      (paiement.nom.toLowerCase().includes(searchName.toLowerCase())) &&
      (paiement.matricule.includes(searchMatricule))
    );
  });

  if (loading) return <p>Chargement des paiements...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div className="table-container">
      <table className="paiement-table">
        <thead>
          <tr>
            <th>Matricule</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Mois</th>
            <th>Montant</th>
            <th>Mode de Paiement</th>
            <th>Date de Paiement</th>
          </tr>
        </thead>
        <tbody>
          {filteredPaiements.length === 0 ? (
            <tr><td colSpan="7">Aucun paiement trouvé pour ces critères.</td></tr>
          ) : (
            filteredPaiements.map(paiement => (
              <tr key={paiement.matricule}>
                <td>{paiement.matricule}</td>
                <td>{paiement.nom}</td>
                <td>{paiement.prenom}</td>
                <td>{paiement.mois}</td>
                <td>{paiement.montant} Ar</td>
                <td>{paiement.modePaiement}</td>
                <td>{paiement.createdAt ? formatDate(paiement.createdAt) : 'Non payé'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PaiementTable;
