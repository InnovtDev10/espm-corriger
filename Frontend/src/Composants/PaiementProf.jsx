import React, { useState, useEffect } from "react";
import "../Styles/PaiementProfesseurs.css";
import Swal from "sweetalert2";
import axios from "axios";

function PaiementProfesseur() {
  // États pour gérer le formulaire
  const [professeurs, setProfesseurs] = useState([]);
  const [filteredProfesseurs, setFilteredProfesseurs] = useState([]);
  const [personneType, setPersonneType] = useState("");
  const [matricule, setMatricule] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [departement, setDepartement] = useState("");
  const [montant, setMontant] = useState("");
  const [modePaiement, setModePaiement] = useState("");
  const [mois, setMois] = useState(""); // État pour le mois sélectionné

  useEffect(() => {
    const fetchProfesseurs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/prof/tous");
        setProfesseurs(response.data);
        setFilteredProfesseurs(response.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des professeurs :",
          error
        );
      }
    };

    fetchProfesseurs();
  }, []);

  // Remplir les champs quand un matricule est sélectionné
  useEffect(() => {
    if (personneType === "Professeur" && matricule) {
      const prof = professeurs.find((p) => p.matricule === matricule);
      if (prof) {
        setNom(prof.nom);
        setPrenom(prof.prenom);
        setDepartement(prof.departement);
      }
    } else {
      setNom("");
      setPrenom("");
      setDepartement("");
    }
  }, [matricule, personneType, professeurs]);

  const handlePaiement = async () => {
    if (!nom || !prenom || !departement || !montant || !modePaiement || !mois) {
      Swal.fire({
        icon: "warning",
        title: "Champs requis",
        text: "Veuillez remplir tous les champs obligatoires.",
      });
      return;
    }

    const paiementData = {
      matricule,
      nom,
      prenom,
      departement,
      montant,
      modePaiement,
      mois, // Ajouter le mois à la donnée
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/paiement/salaire/add",
        paiementData
      );

      Swal.fire({
        icon: "success",
        title: "Paiement effectué",
        text: `${prenom} ${nom} a reçu ${montant} Ar via ${modePaiement} pour le mois de ${mois}.`,
      });

      // Réinitialiser le formulaire après envoi
      setPersonneType("");
      setMatricule("");
      setNom("");
      setPrenom("");
      setDepartement("");
      setMontant("");
      setModePaiement("");
      setMois(""); // Réinitialiser le mois
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du paiement :", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Échec de l'enregistrement du paiement.",
      });
    }
  };

  return (
    <div className="article p-3">
      <h5 className="title">Paiement des Salaires</h5>
      <div className="hr mt-4"></div>

      <div className="form-container mt-3 p-4 border rounded shadow-sm">
        <form>
          {/* Sélection du type de personne */}
          <label>Type de bénéficiaire :</label>
          <select
            className="form-control mb-3"
            value={personneType}
            onChange={(e) => setPersonneType(e.target.value)}
          >
            <option value="">Sélectionner un type</option>
            <option value="Professeur">Professeur</option>
            <option value="Autres">Autres</option>
          </select>

          {/* Sélection du matricule si Professeur est choisi */}
          {personneType === "Professeur" && (
            <>
              <label>Matricule du professeur :</label>
              <select
                className="form-control mb-3"
                value={matricule}
                onChange={(e) => setMatricule(e.target.value)}
              >
                <option value="">Sélectionner un matricule</option>
                {professeurs.map((prof) => (
                  <option key={prof.matricule} value={prof.matricule}>
                    {prof.matricule}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* Informations de la personne */}
          <label>Nom :</label>
          <input
            type="text"
            value={nom}
            placeholder="Nom"
            className="form-input mb-3"
            readOnly={personneType === "Professeur"}
            onChange={(e) => setNom(e.target.value)}
          />

          <label>Prénom :</label>
          <input
            type="text"
            value={prenom}
            placeholder="Prénom"
            className="form-input mb-3"
            readOnly={personneType === "Professeur"}
            onChange={(e) => setPrenom(e.target.value)}
          />

          <label>Département :</label>
          <input
            type="text"
            value={departement}
            placeholder="Département"
            className="form-input mb-3"
            readOnly={personneType === "Professeur"}
            onChange={(e) => setDepartement(e.target.value)}
          />

          {/* Montant */}
          <label>Montant :</label>
          <input
            type="number"
            className="form-input mb-3"
            placeholder="Montant (Ar)"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            required
          />

          {/* Sélection du mois */}
          <label>Mois :</label>
          <select
            className="form-control mb-3"
            value={mois}
            onChange={(e) => setMois(e.target.value)}
          >
            <option value="">Sélectionner un mois</option>
            <option value="Janvier">Janvier</option>
            <option value="Février">Février</option>
            <option value="Mars">Mars</option>
            <option value="Avril">Avril</option>
            <option value="Mai">Mai</option>
            <option value="Juin">Juin</option>
            <option value="Juillet">Juillet</option>
            <option value="Août">Août</option>
            <option value="Septembre">Septembre</option>
            <option value="Octobre">Octobre</option>
            <option value="Novembre">Novembre</option>
            <option value="Décembre">Décembre</option>
          </select>

          {/* Mode de paiement */}
          <label>Mode de paiement :</label>
          <select
            className="form-control mb-3"
            value={modePaiement}
            onChange={(e) => setModePaiement(e.target.value)}
          >
            <option value="">Sélectionner un mode de paiement</option>
            <option value="Virement">Virement</option>
            <option value="Chèque">Chèque</option>
            <option value="Espèces">Espèces</option>
          </select>

          {/* Bouton de validation */}
          <button type="button" className="btn-submit" onClick={handlePaiement}>
            Valider le paiement
          </button>
        </form>
      </div>
    </div>
  );
}

export default PaiementProfesseur;
