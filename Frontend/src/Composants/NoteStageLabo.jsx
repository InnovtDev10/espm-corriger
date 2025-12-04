import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Composants/Navbar";
import Sidebar from "../Composants/Sidebar";
import "../Styles/NoteStage.css";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

function NoteStageLabo() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState({});
  const [heures, setHeures] = useState({});
  const [credits, setCredits] = useState({});
  const [rapportDeStage, setRapportDeStage] = useState({});
  const [rapportDeGarde, setRapportDeGarde] = useState({});
  const [rapportDeStageSub, setRapportDeStageSub] = useState({});
  const [rapportDeGardeSub, setRapportDeGardeSub] = useState({});

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

  const stageOptions = [
    { nom: "Ematologie", duree: "30 Jours (toute la journée)" },
    { nom: "Immunologie", duree: "30 Jours (toute la journée)" },
    { nom: "Biochimie", duree: "30 Jours (toute la journée)" },
    {
      nom: "Microbiologie",
      sousCategories: ["Bactériologie", "Parasitologie", "Virologie"],
    },
    { nom: "MSP", duree: null, noCheckbox: true },
    { nom: "RAPPORT DE STAGE", duree: null, noCheckbox: true },
    { nom: "MOYENNE MEMOIRE", duree: null, noCheckbox: true },
  ];

  // Fonction pour mettre à jour les valeurs des inputs
  const handleChange = (stateSetter, key, value) => {
    stateSetter((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleNoteChange = (stage, value) => {
    // S'assurer que la valeur est bien un nombre entre 0 et 20
    const noteValue = Math.max(0, Math.min(20, parseFloat(value) || 0));

    setNotes((prevNotes) => {
      const updatedNotes = { ...prevNotes, [stage]: noteValue };

      // Calculer le total et la moyenne après la modification des notes
      const filteredNotes = Object.entries(updatedNotes).filter(
        ([key]) => key !== "MOYENNE MEMOIRE"
      );

      return updatedNotes;
    });
  };

  // Calculs des totaux
  const totalHeures = Object.values(heures).reduce(
    (acc, curr) => acc + (parseFloat(curr) || 0),
    0
  );
  const totalCredits = Object.values(credits).reduce(
    (acc, curr) => acc + (parseFloat(curr) || 0),
    0
  );
  const totalNotes = Object.values(notes).reduce(
    (sum, note) => sum + (parseFloat(note) || 0),
    0
  );
  const moyenne =
    Object.keys(notes).length > 0 ? totalNotes / Object.keys(notes).length : 0;

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

  const handleToggleRapportDeStageSub = (sub) => {
    setRapportDeStageSub((prev) => ({
      ...prev,
      [sub]: prev[sub] === "Oui" ? "Non" : "Oui",
    }));
  };

  const handleToggleRapportDeGardeSub = (sub) => {
    setRapportDeGardeSub((prev) => ({
      ...prev,
      [sub]: prev[sub] === "Oui" ? "Non" : "Oui",
    }));
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
            Notes pratique pour Bio Technicien Laboratoire
          </h4>
          <div className="hr mt-2"></div>

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
                <strong>Département :</strong> {departementNote} -{" "}
                <strong>Service :</strong> {serviceNote}
              </p>
              <p>
                <strong>Année Universitaire :</strong> {anneeUnivNote}
              </p>
            </div>
          </div>

          <div className="note1-container">
            <h5>Évaluation des Stages et Comportements</h5>
            <div
              className="table1-wrapper"
              style={{
                maxHeight: "600px",
                overflowY: "auto",
                overflowX: "auto",
              }}
            >
              <table className="table1 note-table">
                <thead>
                  <tr>
                    <th style={{ width: "20%" }}>Nature de Stage</th>
                    <th style={{ width: "15%" }}>Durée</th>
                    <th style={{ width: "15%" }}>Heures</th>
                    <th style={{ width: "15%" }}>Crédits</th>
                    <th style={{ width: "15%" }}>Note (/20)</th>
                    <th style={{ width: "10%" }}>Rapport de Stage</th>
                    <th style={{ width: "10%" }}>Rapport d'évaluation</th>
                  </tr>
                </thead>
                <tbody>
                  {stageOptions.map((stage, index) => {
                    if (stage.sousCategories) {
                      return (
                        <React.Fragment key={index}>
                          <tr className="stage-header">
                            <td
                              colSpan="7"
                              style={{ textAlign: "left", width: "100%" }}
                            >
                              <strong>
                                {stage.nom} -{" "}
                                <span style={{ fontWeight: "normal" }}>
                                  30 jours (toute la journée)
                                </span>
                              </strong>
                            </td>
                          </tr>
                          {stage.sousCategories.map((sub, subIndex) => (
                            <tr key={`${index}-${subIndex}`}>
                              <td style={{ width: "20%" }}>{sub}</td>
                              <td style={{ width: "15%" }}>-</td>
                              <td style={{ width: "15%" }}>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={heures[sub] || ""}
                                  onChange={(e) =>
                                    handleChange(setHeures, sub, e.target.value)
                                  }
                                />
                              </td>
                              <td style={{ width: "15%" }}>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={credits[sub] || ""}
                                  onChange={(e) =>
                                    handleChange(
                                      setCredits,
                                      sub,
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                              <td style={{ width: "15%" }}>
                                <input
                                  type="number"
                                  className="form-control note-input"
                                  placeholder="Note/20"
                                  value={notes[sub] || ""}
                                  onChange={(e) =>
                                    handleNoteChange(sub, e.target.value)
                                  }
                                  min="0"
                                  max="20"
                                />
                              </td>
                              {index <= 3 ? (
                                <>
                                  <td style={{ width: "10%" }}>
                                    <input
                                      type="checkbox"
                                      checked={rapportDeStageSub[sub] === "Oui"}
                                      onChange={() =>
                                        handleToggleRapportDeStageSub(sub)
                                      }
                                    />
                                  </td>
                                  <td style={{ width: "10%" }}>
                                    <input
                                      type="checkbox"
                                      checked={rapportDeGardeSub[sub] === "Oui"}
                                      onChange={() =>
                                        handleToggleRapportDeGardeSub(sub)
                                      }
                                    />
                                  </td>
                                </>
                              ) : (
                                <td colSpan="2"></td>
                              )}
                            </tr>
                          ))}
                          <tr className="separator">
                            <td
                              colSpan="7"
                              style={{ borderTop: "2px solid black" }}
                            ></td>
                          </tr>
                        </React.Fragment>
                      );
                    } else {
                      return (
                        <tr key={index}>
                          <td style={{ width: "20%" }}>
                            <strong>{stage.nom}</strong>
                          </td>
                          <td style={{ width: "15%" }}>{stage.duree || "-"}</td>
                          <td style={{ width: "15%" }}>
                            {stage.duree && (
                              <input
                                type="number"
                                className="form-control"
                                value={heures[stage.nom] || ""}
                                onChange={(e) =>
                                  handleChange(
                                    setHeures,
                                    stage.nom,
                                    e.target.value
                                  )
                                }
                              />
                            )}
                          </td>
                          <td style={{ width: "15%" }}>
                            {stage.duree && (
                              <input
                                type="number"
                                className="form-control"
                                value={credits[stage.nom] || ""}
                                onChange={(e) =>
                                  handleChange(
                                    setCredits,
                                    stage.nom,
                                    e.target.value
                                  )
                                }
                              />
                            )}
                          </td>
                          <td style={{ width: "15%" }}>
                            <input
                              type="number"
                              className="form-control note-input"
                              placeholder="Note/20"
                              value={notes[stage.nom] || ""}
                              onChange={(e) =>
                                handleChange(
                                  setNotes,
                                  stage.nom,
                                  e.target.value
                                )
                              }
                              min="0"
                              max="20"
                            />
                          </td>
                          {index <= 3 ? (
                            <>
                              <td style={{ width: "10%" }}>
                                <input
                                  type="checkbox"
                                  checked={rapportDeStage[stage.nom] === "Oui"}
                                  onChange={() =>
                                    handleToggleRapportDeStage(stage.nom)
                                  }
                                />
                              </td>
                              <td style={{ width: "10%" }}>
                                <input
                                  type="checkbox"
                                  checked={rapportDeGarde[stage.nom] === "Oui"}
                                  onChange={() =>
                                    handleToggleRapportDeGarde(stage.nom)
                                  }
                                />
                              </td>
                            </>
                          ) : (
                            <td colSpan="2"></td>
                          )}
                        </tr>
                      );
                    }
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Total et Moyenne des notes pratiques */}
          <div className="total-moyenne-container d-flex justify-content-between align-items-center mt-3">
            <div className="total-moyenne-info d-flex flex-grow-1">
              <p className="me-4">
                <strong className="stage-name">
                  TOTAL DES NOTES PRATIQUES :
                </strong>{" "}
                {totalNotes} / 180
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
        </section>
      </main>
    </>
  );
}

export default NoteStageLabo;
