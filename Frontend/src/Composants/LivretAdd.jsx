import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

function LivretAdd() {
  const [matricule, setMatricule] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [niveau, setNiveau] = useState("");
  const [filiere, setFiliere] = useState("");
  const [typesDocuments, setTypesDocuments] = useState(["Livret"]);
  const [typeDocument, setTypeDocument] = useState("");
  const [description, setDescription] = useState("");
  const [dateReception, setDateReception] = useState("");
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [anneeUniv, setAnneeUniv] = useState("");
  // États pour le champ d’entrée dynamique
  const [showNewTypeInput, setShowNewTypeInput] = useState(false);
  const [newTypeDocument, setNewTypeDocument] = useState("");

  // 🔹 Charger la liste des étudiants au montage
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/etudiant/tous"
        );
        setStudents(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des étudiants :", error);
      }
    };
    fetchStudents();
  }, []);

  // 🔹 Filtrer les suggestions en fonction de la saisie du matricule
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

  // 🔹 Sélectionner un étudiant depuis les suggestions
  const handleSelectMatricule = (selectedMatricule) => {
    setMatricule(selectedMatricule);
    setFilteredStudents([]);

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

  // 🔹 Ajouter un nouveau type de document à la liste
  const handleAddNewType = () => {
    if (newTypeDocument.trim() !== "") {
      setTypesDocuments([...typesDocuments, newTypeDocument]);
      setTypeDocument(newTypeDocument);
      setNewTypeDocument("");
      setShowNewTypeInput(false);
    }
  };

  // 🔹 Soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const data = {
      matricule,
      nom,
      prenom,
      niveau,
      filiere,
      typeDocument,
      description,
      dateReception,
      anneeUniv,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/livret/add",
        data
      );
      Swal.fire({
        icon: "success",
        title: "Document enregistré",
        text: response.data.message,
      });
      window.location.reload();

      // Réinitialisation du formulaire
      setMatricule("");
      setNom("");
      setPrenom("");
      setNiveau("");
      setFiliere("");
      setTypeDocument("");
      setDescription("");
      setDateReception("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: error.response?.data?.error || "Une erreur est survenue.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="article p-3">
      <h5 className="title">Livrets & Autres</h5>
      <div className="hr mt-4"></div>

      <div className="form-container mt-3 p-4 border rounded shadow-sm">
        <form>
          {/* 🔹 Input matricule avec suggestions dynamiques */}
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

          {/* 🔹 Infos étudiant (lecture seule) */}
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
            value={niveau}
            placeholder="Niveau"
            className="form-input mb-3"
            readOnly
          />
          <input
            type="text"
            value={filiere}
            placeholder="Filière"
            className="form-input mb-3"
            readOnly
          />

          {/* 🔹 Sélecteur du type de document */}
          <select
            className="form-control mb-2"
            value={typeDocument}
            onChange={(e) => {
              if (e.target.value === "autre") {
                setShowNewTypeInput(true);
              } else {
                setTypeDocument(e.target.value);
                setShowNewTypeInput(false);
              }
            }}
          >
            <option value="">Sélectionner le type</option>
            {typesDocuments.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
            <option value="autre">Autre...</option>
          </select>

          {/* 🔹 Champ d'entrée dynamique pour le nouveau type */}
          {showNewTypeInput && (
            <div className="d-flex gap-2 mt-2 mb-2">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Nom du type"
                value={newTypeDocument}
                onChange={(e) => setNewTypeDocument(e.target.value)}
                style={{ maxWidth: "300px", fontSize: "12px", padding: "3px" }}
              />
              <button
                className="btn btn-primary btn-sm"
                onClick={handleAddNewType}
                type="button"
                style={{ fontSize: "12px", padding: "3px 6px" }}
              >
                Ajouter
              </button>
            </div>
          )}

          {/* 🔹 Description */}
          <textarea
            className="form-control mb-3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            required
          ></textarea>

          {/* 🔹 Date de réception */}
          <label>Date de réception :</label>
          <input
            type="date"
            className="form-control mb-3"
            value={dateReception}
            onChange={(e) => setDateReception(e.target.value)}
            required
          />
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Année Universitaire"
            value={anneeUniv}
            onChange={(e) => setAnneeUniv(e.target.value)}
            required
          />

          {/* 🔹 Bouton de soumission */}
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

export default LivretAdd;
