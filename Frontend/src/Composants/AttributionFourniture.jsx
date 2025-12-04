import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/Note.css";
import Swal from "sweetalert2";

function AttributionFourniture() {
  const [designation, setDesignation] = useState("");
  const [quantite, setQuantite] = useState("");
  const [prixUnitaire, setPrixUnitaire] = useState("");
  const [prixTotal, setPrixTotal] = useState(0);
  const [suggestions, setSuggestions] = useState([]); // Ajout d'état pour gérer les suggestions

  // Calcul du prix total lorsque la quantité ou le prix unitaire change
  const handleQuantiteChange = (e) => {
    const qte = Number(e.target.value);
    setQuantite(qte);
    setPrixTotal(qte * Number(prixUnitaire));
  };

  const handlePrixUnitaireChange = (e) => {
    const prix = Number(e.target.value);
    setPrixUnitaire(prix);
    setPrixTotal(Number(quantite) * prix);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Récupérer toutes les fournitures pour vérifier si la désignation existe déjà
      const response = await axios.get(
        "http://localhost:5000/api/materiel/all"
      );
      const fournitures = response.data;

      // Vérifier si la désignation existe déjà dans la BD
      const existingFourniture = fournitures.find(
        (f) => f.designation.toLowerCase() === designation.toLowerCase()
      );

      if (existingFourniture) {
        // Mise à jour de la quantité et de la quantité restante
        const updatedQuantite = existingFourniture.quantite + Number(quantite);
        const updatedQuantiteReste =
          existingFourniture.quantiteReste + Number(quantite);

        // Vérifier si le nouveau prix unitaire est supérieur à l'ancien
        let newPrixUnitaire = existingFourniture.prixUnitaire;
        let newPrixTotal = existingFourniture.prixTotal;

        if (Number(prixUnitaire) > existingFourniture.prixUnitaire) {
          newPrixUnitaire = Number(prixUnitaire);
          newPrixTotal = updatedQuantite * newPrixUnitaire;
        }

        await axios.put(
          `http://localhost:5000/api/materiel/update/${existingFourniture.id}`,
          {
            quantite: updatedQuantite,
            quantiteReste: updatedQuantiteReste,
            prixUnitaire: newPrixUnitaire,
            prixTotal: newPrixTotal,
          }
        );

        Swal.fire({
          icon: "success",
          title: "Mise à jour réussie",
          text: "Quantité mise à jour avec succès !",
        });
        window.location.reload();
      } else {
        // Création d'une nouvelle fourniture
        const newMateriel = {
          designation,
          quantite,
          quantiteReste: quantite,
          prixUnitaire,
          prixTotal: quantite * prixUnitaire,
        };

        await axios.post("http://localhost:5000/api/materiel/add", newMateriel);

        Swal.fire({
          icon: "success",
          title: "Ajout réussi",
          text: "Fourniture ajoutée avec succès !",
        });
        window.location.reload(); // Recharger la page
      }

      // Réinitialiser le formulaire après l'ajout ou la mise à jour
      setDesignation("");
      setQuantite("");
      setPrixUnitaire("");
      setPrixTotal(0);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur est survenue lors de l'ajout ou de la mise à jour du matériel.",
      });
      console.error(error);
    }
  };

  // Fonction pour gérer les suggestions de désignation
  const handleDesignationChange = async (e) => {
    const value = e.target.value;
    setDesignation(value);

    if (value) {
      try {
        // Récupérer les fournitures existantes pour faire des suggestions
        const response = await axios.get(
          "http://localhost:5000/api/materiel/all"
        );
        const fournitures = response.data;

        // Trouver les suggestions basées sur ce que l'utilisateur tape
        const filteredSuggestions = fournitures.filter((fourniture) =>
          fourniture.designation.toLowerCase().includes(value.toLowerCase())
        );

        setSuggestions(filteredSuggestions); // Mettre à jour l'état des suggestions
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des fournitures pour les suggestions:",
          error
        );
      }
    } else {
      setSuggestions([]); // Vider les suggestions si l'input est vide
    }
  };

  // Fonction pour sélectionner une suggestion
  const handleSuggestionClick = (suggestion) => {
    setDesignation(suggestion.designation); // Remplir l'input avec la suggestion sélectionnée
    setSuggestions([]); // Cacher les suggestions après sélection
  };

  return (
    <div className="article p-3">
      <h5 className="title">Ajout des Fournitures</h5>
      <div className="hr mt-4"></div>

      <div className="form-container mt-3 p-4 border rounded shadow-sm">
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="text"
              placeholder="Désignation"
              className="form-input mb-3"
              value={designation}
              onChange={handleDesignationChange} // Changement de la méthode d'input
              required
            />
            {suggestions.length > 0 && (
              <div className="suggestions-list">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)} // Action lors du clic
                  >
                    {suggestion.designation}
                  </div>
                ))}
              </div>
            )}
          </div>

          <input
            type="number"
            placeholder="Quantité"
            className="form-input mb-3"
            value={quantite}
            onChange={handleQuantiteChange}
            required
          />
          <input
            type="number"
            placeholder="Prix Unitaire"
            className="form-input mb-3"
            value={prixUnitaire}
            onChange={handlePrixUnitaireChange}
            required
          />

          <div className="form-input mb-3">
            <strong>Prix Total :</strong> {prixTotal.toFixed(2)} Ar
          </div>

          <button type="submit" className="btn-submit">
            Enregistrer la fourniture
          </button>
        </form>
      </div>
    </div>
  );
}

export default AttributionFourniture;
