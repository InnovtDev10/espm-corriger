import React, { useState, useEffect } from "react";
import "../Styles/Note.css";
import Swal from "sweetalert2";
import axios from "axios";

function AbsenceEtu() {
  const [raison, setRaison] = useState("");
  const [matricule, setMatricule] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [niveau, setNiveau] = useState("");
  const [filiere, setFiliere] = useState("");
  const [motif, setMotif] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [heureEntree, setHeureEntree] = useState("");
  const [heureArrivee, setHeureArrivee] = useState("");
  const [students, setStudents] = useState([]);
  const [decision, setDecision] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Etat de chargement
  const [filteredStudents, setFilteredStudents] = useState([]);
  const url = import.meta.env.VITE_API_URL;

  // Charger la liste des étudiants
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `${url}/api/etudiant/tous`,
          {
            headers: {
              'Cache-Control': 'no-cache'
            }
          }
        );
        setStudents(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des étudiants :", error);
      }
    };

    fetchStudents();
  }, []);

  // Filtrer les suggestions en fonction de la saisie du matricule
  const handleMatriculeChange = (e) => {
    const value = e.target.value;
    setMatricule(value);

    if (value.length > 0) {
      const filtered = students.filter((student) =>
        student.matricule.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents([]);
    }
  };

  // Sélectionner un étudiant dans la liste des suggestions
  const handleSelectMatricule = (selectedMatricule) => {
    setMatricule(selectedMatricule);
    setFilteredStudents([]);

    // Trouver l'étudiant correspondant
    const student = students.find(
      (student) => student.matricule === selectedMatricule
    );
    if (student) {
      setNom(student.nom);
      setPrenom(student.prenom);
      setNiveau(student.niveau);
      setFiliere(student.filiere);
    }
  };

  // Mettre à jour les informations de l'étudiant lorsqu'un matricule est sélectionné
  useEffect(() => {
    if (matricule) {
      const student = students.find(
        (student) => student.matricule === matricule
      );
      if (student) {
        setNom(student.nom);
        setPrenom(student.prenom);
        setNiveau(student.niveau);
        setFiliere(student.filiere);
      }
    }
  }, [matricule, students]);

  // Gérer la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Active le mode "chargement"

    const data = {
      matricule,
      nom,
      prenom,
      niveau,
      filiere,
      raison,
      motif,
      decision: raison === "Sanction" ? decision : undefined,
      dateDebut: raison === "Absence" ? dateDebut : undefined,
      dateFin: raison === "Absence" ? dateFin : undefined,
      heureEntree: raison === "Retard" ? heureEntree : undefined,
      heureArrivee: raison === "Retard" ? heureArrivee : undefined,
    };

    try {
      const response = await axios.post(
        `${url}/api/pointage/etudiant/add`,
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
      setNiveau("");
      setFiliere("");
      setRaison("");
      setMotif("");
      setDecision("");
      setDateDebut("");
      setDateFin("");
      setHeureEntree("");
      setHeureArrivee("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: error.response.data.error || "Une erreur est survenue.",
      });
    } finally {
      setIsLoading(false); // Désactive le mode "chargement"
    }
  };

  return (
    <div className="article p-3">
      <h5 className="title">Absence-Retard-Avertissement ?</h5>
      <div className="hr mt-0"></div>

      <div className="form-container mt-3 p-4 border rounded shadow-sm">
        <form>
          {/* 🔹 Input avec suggestions dynamiques */}
          <div style={{ position: "relative" }}>
            <input
              type="text"
              className="form-control mb-3"
              value={matricule}
              onChange={handleMatriculeChange}
              placeholder="Entrer un matricule"
            />
            {filteredStudents.length > 0 && (
              <ul
                className="list-group"
                style={{
                  position: "absolute",
                  width: "100%",
                  zIndex: 10,
                  background: "white",
                  border: "1px solid #ddd",
                  maxHeight: "150px",
                  overflowY: "auto",
                }}
              >
                {filteredStudents.map((student) => (
                  <li
                    key={student.matricule}
                    className="list-group-item list-group-item-action"
                    onClick={() => handleSelectMatricule(student.matricule)}
                    style={{ cursor: "pointer" }}
                  >
                    {student.matricule}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <input
            type="text"
            value={nom}
            placeholder="Nom"
            className="form-input mb-3"
            required
            readOnly
          />
          <input
            type="text"
            value={prenom}
            placeholder="Prénom(s)"
            className="form-input mb-3"
            required
            readOnly
          />
          <input
            type="text"
            value={niveau}
            placeholder="Niveau"
            className="form-input mb-3"
            required
            readOnly
          />
          <input
            type="text"
            value={filiere}
            placeholder="Filière"
            className="form-input mb-3"
            required
            readOnly
          />

          <select
            className="form-control mb-3"
            value={raison}
            onChange={(e) => setRaison(e.target.value)}
          >
            <option value="">Raison</option>
            <option value="Retard">Retard</option>
            <option value="Absence">Absence</option>
            <option value="Sanction">Avertissement</option>
          </select>

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
              <label>Heure d'arriver :</label>
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
            name="motif"
            value={motif}
            onChange={(e) => setMotif(e.target.value)}
            placeholder="Motif"
            className="form-input mb-3"
            required
          />

          {raison === "Sanction" && (
            <>
              <label>Décision prise :</label>
              <input
                type="text"
                className="form-input mb-3"
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
                required
              />
            </>
          )}

          <button
            type="submit"
            className="btn-submit"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Enregistrement..." : "Enregistrer"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AbsenceEtu;
