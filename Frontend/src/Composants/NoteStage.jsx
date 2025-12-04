import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Composants/Navbar";
import Sidebar from "../Composants/Sidebar";
import "../Styles/NoteStage.css";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

function NoteStage() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState({});
  const [totalNotes, setTotalNotes] = useState(0);
  const [moyenne, setMoyenne] = useState(0);
  const [rapportDeStage, setRapportDeStage] = useState({});
  const [rapportDeGarde, setRapportDeGarde] = useState({});
  const [heures, setHeures] = useState({});
  const [credits, setCredits] = useState({});

  const location = useLocation();
  const {
    matriculeNote,
    nomNote,
    prenomNote,
    niveauNote,
    filiereNote,
    etablissementNote,
    departementNote,
    serviceNote,
    anneeUnivNote,
  } = location.state || {};
  const totalHeures = Object.values(heures).reduce(
    (acc, h) => acc + (Number(h) || 0),
    0
  );
  const totalCredits = Object.values(credits).reduce(
    (acc, c) => acc + (Number(c) || 0),
    0
  );

  const handleToggleRapportDeStage = (stageName) => {
    setRapportDeStage((prev) => ({
      ...prev,
      [stageName]: prev[stageName] === "Oui" ? "Non" : "Oui",
    }));
  };

  const handleToggleRapportDeGarde = (stageName) => {
    setRapportDeGarde((prev) => ({
      ...prev,
      [stageName]: prev[stageName] === "Oui" ? "Non" : "Oui",
    }));
  };
  const handleHeureChange = (stage, value) => {
    const heureValue = Math.max(0, parseInt(value) || 0); // Empêcher les valeurs négatives
    setHeures((prev) => ({ ...prev, [stage]: heureValue }));
  };

  const handleCreditChange = (stage, value) => {
    const creditValue = Math.max(0, parseInt(value) || 0); // Empêcher les valeurs négatives
    setCredits((prev) => ({ ...prev, [stage]: creditValue }));
  };

  // Stages avec intitulé complet pour MSP et PCIME, en excluant "MOYENNE MEMOIRE"
  const stageOptions = [
    { nom: "Assiduité", duree: "30 Jours (toute la journée)" },
    {
      nom: "Rélation avec le personnel",
      duree: "30 Jours (toute la journée)",
    },
    { nom: "Intégration à l'équipes de Travail ", duree: "30 Jours (toute la journée)" },
    { nom: "Autonomie dans le Travail", duree: "30 Jours (toute la journée)" },
    { nom: "Organisation du temps et respect du planning", duree: "30 Jours (toute la journée)" },
    { nom: "Découverte de solution Technique appropriées", duree: null },
    { nom: "Solution Réalisé et exploitable par l'établissement", duree: null },
    { nom: "MOYENNE MEMOIRE", duree: null },
  ];

  const handleNoteChange = (stage, value) => {
    // S'assurer que la valeur est bien un nombre entre 0 et 20
    const noteValue = Math.max(0, Math.min(20, parseFloat(value) || 0));

    setNotes((prevNotes) => {
      const updatedNotes = { ...prevNotes, [stage]: noteValue };

      // Calculer le total et la moyenne après la modification des notes
      const filteredNotes = Object.entries(updatedNotes).filter(
        ([key]) => key !== "MOYENNE MEMOIRE"
      );
      const total = filteredNotes.reduce((sum, [, note]) => sum + note, 0);
      const average =
        filteredNotes.length > 0 ? total / filteredNotes.length : 0;

      setTotalNotes(total);
      setMoyenne(average);

      return updatedNotes;
    });
  };

  const handleEnregistrerNote = async () => {
    const updatedNotes = {
      ...notes,
      "TOTAL NOTES PRATIQUES": totalNotes,
      "MOYENNE PRATIQUES": moyenne.toFixed(2),
      "TOTAL HEURES": totalHeures,
      "TOTAL CRÉDITS": totalCredits,
    };

    // Ajouter les rapports de stage et de garde sous forme de "Oui" ou "Non"
    stageOptions.forEach((stage) => {
      const stageNom = stage.nom.trim(); // Normalisation du nom du stage
      updatedNotes[`Rapport de Stage - ${stageNom}`] =
        rapportDeStage[stageNom] === "Oui" ? "Oui" : "Non";
      updatedNotes[`Rapport d'évaluation - ${stageNom}`] =
        rapportDeGarde[stageNom] === "Oui" ? "Oui" : "Non";
    });

    // Ajouter les heures et crédits
    Object.keys(heures).forEach((stage) => {
      updatedNotes[`Heures - ${stage}`] = heures[stage] || 0;
    });

    Object.keys(credits).forEach((stage) => {
      updatedNotes[`Crédits - ${stage}`] = credits[stage] || 0;
    });

    const noteData = {
      matricule: matriculeNote,
      nom: nomNote,
      prenom: prenomNote,
      niveau: niveauNote,
      filiere: filiereNote,
      etablissement: etablissementNote,
      anneeUniv: anneeUnivNote,
      notes: updatedNotes,
    };

    try {
      const response = await fetch("http://localhost:5000/api/notestage/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(noteData),
      });

      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Succès",
          text: "Notes enregistrées avec succès !",
        });
        navigate("/stage");
      } else {
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: `Erreur lors de l'enregistrement des notes : ${data.message}`,
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des notes : ", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Erreur lors de l'enregistrement des notes",
      });
    }
  };

  return (
    <>
      <header className="pt-3">
        <Navbar />
      </header>
      <main className="center p-3">
        <aside className="p-3">
          <Sidebar />
        </aside>
        <section className="contenu2 mt-4 p-4">
          <h4 className="fw-bold">
            {" "}
            Notes pratique pour Gestion & Sage femme
          </h4>
          <div className="hr mt-2"></div>

          {/* Informations de l'étudiant */}
          <div className="student-card">
            <div className="student-details">
              <p>
                <strong>
                  {nomNote} {prenomNote}
                </strong>{" "}
                - {matriculeNote}
              </p>
              <p>
                <strong>Niveau :</strong> {niveauNote} -{" "}
                <strong>Spécialité :</strong> {filiereNote}
              </p>
              <p>
                <strong>Établissement d'accueil :</strong> {etablissementNote} -{" "}
                <strong>Nature :</strong> {departementNote} -{" "}
                <strong>Service :</strong> {serviceNote}
              </p>
              <p>
                <strong>Année Universitaire :</strong> {anneeUnivNote}
              </p>
            </div>
          </div>

          {/* Formulaire des notes */}
          <div className="note1-container">
            <h5>Évaluation des Stages et Comportements</h5>
            <div className="table1-wrapper">
              <table className="table1 note-table">
                <thead>
                  <tr>
                    <th style={{ width: "20%" }}>Nature de Stage</th>
                    <th style={{ width: "15%" }}>Rapport de Stage</th>
                    <th style={{ width: "15%" }}>Rapport d'évaluation</th>
                    <th style={{ width: "10%" }}>Durée</th>
                    <th style={{ width: "10%" }}>Heures</th>
                    <th style={{ width: "10%" }}>Crédits</th>
                    <th style={{ width: "20%" }}>Note (/20)</th>
                  </tr>
                </thead>
                <tbody>
                  {stageOptions.map((stage, index) => {
                    const stagesSansSaisie = [
                      "MSP",
                      "PCIME",
                      "MOYENNE MEMOIRE",
                    ];

                    const stageNom = stage.nom.trim(); // Normalisation du nom du stage

                    return (
                      <tr key={index}>
                        <td style={{ width: "20%" }} className="stage-name">
                          {stageNom}
                        </td>

                        {/* Checkbox Rapport de Stage */}
                        <td style={{ width: "15%" }}>
                          {!stagesSansSaisie.includes(stageNom) && (
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={rapportDeStage[stageNom] === "Oui"}
                              onChange={() =>
                                handleToggleRapportDeStage(stageNom)
                              }
                            />
                          )}
                        </td>

                        {/* Checkbox Rapport d'évaluation */}
                        <td style={{ width: "15%" }}>
                          {!stagesSansSaisie.includes(stageNom) && (
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={rapportDeGarde[stageNom] === "Oui"}
                              onChange={() =>
                                handleToggleRapportDeGarde(stageNom)
                              }
                            />
                          )}
                        </td>

                        {/* Durée */}
                        <td style={{ width: "10%" }} className="note-duration">
                          {stage.duree || "-"}
                        </td>

                        {/* Heures */}
                        <td style={{ width: "10%" }}>
                          {!stagesSansSaisie.includes(stageNom) && (
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Heures"
                              value={heures[stageNom] || ""}
                              onChange={(e) =>
                                handleHeureChange(stageNom, e.target.value)
                              }
                              min="0"
                            />
                          )}
                        </td>

                        {/* Crédits */}
                        <td style={{ width: "10%" }}>
                          {!stagesSansSaisie.includes(stageNom) && (
                            <input
                              type="number"
                              className="form-control"
                              placeholder="Crédits"
                              value={credits[stageNom] || ""}
                              onChange={(e) =>
                                handleCreditChange(stageNom, e.target.value)
                              }
                              min="0"
                            />
                          )}
                        </td>

                        {/* Note */}
                        <td style={{ width: "20%" }}>
                          <input
                            type="number"
                            className="form-control note-input"
                            placeholder="Note/20"
                            value={notes[stageNom] || ""}
                            onChange={(e) =>
                              handleNoteChange(stageNom, e.target.value)
                            }
                            min="0"
                            max="20"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Total et Moyenne des notes pratiques */}
            <div className="total-moyenne-container d-flex justify-content-between align-items-center ">
              <div className="total-moyenne-info d-flex">
                <p className="me-4">
                  <strong className="stage-name">
                    TOTAL DES NOTES PRATIQUES :
                  </strong>{" "}
                  {totalNotes} / 140
                </p>
                <p className="me-4">
                  <strong className="stage-name">MOYENNE PRATIQUES :</strong>{" "}
                  {moyenne.toFixed(2)} / 20
                </p>
                <p className="me-4">
                  <strong className="stage-name">TOTAL HEURES :</strong>{" "}
                  {totalHeures} h
                </p>
                <p>
                  <strong className="stage-name">TOTAL CRÉDITS :</strong>{" "}
                  {totalCredits} crédits
                </p>
              </div>
              <div className="total-moyenne-actions">
                <button
                  className="btn btn-success btn-lg"
                  onClick={handleEnregistrerNote}
                >
                  Enregistrer
                </button>
                <button
                  className="btn btn-secondary btn-lg ms-2"
                  onClick={() => navigate("/stage")}
                >
                  Annuler
                </button>
              </div>
            </div>
            {/* Boutons d'action */}
            <div className="btn-container"></div>
          </div>
        </section>
      </main>
    </>
  );
}

export default NoteStage;
