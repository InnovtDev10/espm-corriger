import React, { useState, useEffect } from "react";
import "../Styles/Note.css";
import Swal from "sweetalert2";
import axios from "axios";

function AbsenceProf() {
  const [raison, setRaison] = useState("");
  const [matricule, setMatricule] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [departement, setDepartement] = useState("");
  const [motif, setMotif] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [heureEntree, setHeureEntree] = useState("");
  const [heureArrivee, setHeureArrivee] = useState("");
  const [profs, setProfs] = useState([]);

  // Charger la liste des professeurs
  useEffect(() => {
    const fetchProfs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/prof/tous");
        setProfs(response.data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des professeurs :",
          error
        );
      }
    };

    fetchProfs();
  }, []);

  // Mettre à jour les informations du professeur lorsqu'un matricule est sélectionné
  useEffect(() => {
    if (matricule) {
      const prof = profs.find((prof) => prof.matricule === matricule);
      if (prof) {
        setNom(prof.nom);
        setPrenom(prof.prenom);
        setDepartement(prof.departement);
      }
    }
  }, [matricule, profs]);

  // Gérer la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      matricule,
      nom,
      prenom,
      departement,
      raison,
      motif,
      dateDebut: raison === "Absence" ? dateDebut : undefined,
      dateFin: raison === "Absence" ? dateFin : undefined,
      heureEntree: raison === "Retard" ? heureEntree : undefined,
      heureArrivee: raison === "Retard" ? heureArrivee : undefined,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/pointage/prof/add",
        data
      );
      Swal.fire({
        icon: "success",
        title: "Pointage ajouté",
        text: response.data.message,
      });
      setMatricule("");
      setNom("");
      setPrenom("");
      setDepartement("");
      setRaison("");
      setMotif("");
      setDateDebut("");
      setDateFin("");
      setHeureEntree("");
      setHeureArrivee("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: error.response?.data?.error || "Une erreur est survenue.",
      });
    }
  };

  return (
    <div className="article p-3">
      <h5 className="title">Absence ou Retard ?</h5>
      <div className="hr mt-4"></div>

      <div className="form-container mt-3 p-4 border rounded shadow-sm">
        <form>
          {/* Select pour le matricule */}
          <select
            className="form-control mb-3"
            value={matricule}
            onChange={(e) => setMatricule(e.target.value)}
            required
          >
            <option value="">Sélectionner un matricule</option>
            {profs.map((prof) => (
              <option key={prof.matricule} value={prof.matricule}>
                {prof.matricule}
              </option>
            ))}
          </select>

          {/* Affichage des informations du professeur */}
          <input
            type="text"
            value={nom}
            placeholder="Nom"
            className="form-input mb-3"
            readOnly
          />
          <input
            type="text"
            value={prenom}
            placeholder="Prénom(s)"
            className="form-input mb-3"
            readOnly
          />
          <input
            type="text"
            value={departement}
            placeholder="Département"
            className="form-input mb-3"
            readOnly
          />

          {/* Sélection de la raison */}
          <select
            className="form-control mb-3"
            value={raison}
            onChange={(e) => setRaison(e.target.value)}
          >
            <option value="">Raison</option>
            <option value="Retard">Retard</option>
            <option value="Absence">Absence</option>
          </select>

          {/* Champs supplémentaires en fonction de la raison */}
          {raison === "Absence" && (
            <>
              <label>Date de début :</label>
              <input
                type="date"
                className="form-input mb-3"
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                required
              />
              <label>Date de fin :</label>
              <input
                type="date"
                className="form-input mb-3"
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
                required
              />
            </>
          )}

          {raison === "Retard" && (
            <>
              <label>Heure d'entrée :</label>
              <input
                type="time"
                className="form-input mb-3"
                value={heureEntree}
                onChange={(e) => setHeureEntree(e.target.value)}
                required
              />
              <label>Heure d'arrivée :</label>
              <input
                type="time"
                className="form-input mb-3"
                value={heureArrivee}
                onChange={(e) => setHeureArrivee(e.target.value)}
                required
              />
            </>
          )}

          <input
            type="text"
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            placeholder="Motif"
            className="form-input mb-3"
            required
          />

          <button type="submit" className="btn-submit" onClick={handleSubmit}>
            Enregistrer
          </button>
        </form>
      </div>
    </div>
  );
}

export default AbsenceProf;
