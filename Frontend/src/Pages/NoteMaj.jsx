import React, { useState, useEffect } from "react";
import Navbar from "../Composants/Navbar";
import Sidebar from "../Composants/Sidebar";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import "../Styles/Note.css";

function NoteMaj() {
  const [matricule, setMatricule] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [niveau, setNiveau] = useState("");
  const [specialite, setSpecialite] = useState("");
  const [semestre, setSemestre] = useState("");
  const [anneeUniv, setAnneeUniv] = useState("");
  const [notes, setNotes] = useState({});
  const [students, setStudents] = useState([]);
  const [filiere, setFiliere] = useState("");
  const [totalNotes, setTotalNotes] = useState(0);
  const [moyenne, setMoyenne] = useState(0);
  const [matieresData, setMatieresData] = useState([]);
  const [matieres, setMatieres] = useState({});
  const [heures, setHeures] = useState({});
  const [credits, setCredits] = useState({});
  const [totalHeures, setTotalHeures] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const url = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();

  {
    /*const unitesEtMatieresSFIG = {
        "SCIENCES HUMAINES": ["Psychologie et psychiatrie", "Psychopathologie", "Sociologie"],
        "SANTÉ PUBLIQUE": ["Gestion d’un service", "Gestions de la ressource", "Formation des personnels", "Développement de l’esprit d’équipe", "Démarche qualité"],
        "MÉDECINE": ["Maladie cardio-vasculaire", "Maladie de l’appareil digestif"],
        "CHIRURGIE": ["Chirurgie", "Chirurgie dentaire"],
        "GYNÉCOLOGIQUE-OBSTÉTRIQUE": ["Santé de la reproduction", "Gynécologie et obstétrique"],
        "PÉDIATRIE": ["Pédiatrie", "Puériculture", "Santé infantile", "PCIME"],
        "PHARMACOLOGIE": ["Médicaments essentiels", "Différentes classes des médicaments"],
        "LÉGISLATION": ["Législation", "Déontologie"],
        "NURSING": ["Soins infirmiers en médecine", "Soins infirmiers en chirurgie"],
        "DÉMARCHE DE SOINS": ["SMN", "SONU", "Soins infirmiers en obstétrique", "Soins d’urgence"],
        "MÉTHODOLOGIE": ["Réalisation TFE"]
    }; 
     const matieres = filiere === "Bio Technicien d'analyse Médicales" ? unitesEtMatieresBTL : unitesEtMatieresSFIG;
    const unitesEtMatieresBTL = {
        "HÉMATOLOGIE": ["Hématologie", "Hémostase"],
        "BIOCHIMIE": ["Biochimie clinique", "PCA-PCG"],
        "ASSURANCE QUALITÉ": ["Assurance qualité", "Entretien"],
        "IMMUNOLOGIE": ["Immunologie", "Technique de Prélèvement"],
        "VIROLOGIE": ["Virologie", "Biologie moléculaire"],
        "PARASITOLOGIE": ["Parasitologie", "Transfusion sanguine"],
        "BACTÉRIOLOGIE": ["Bactériologie", "Pratique Bactériologie"],
        "MYCOLOGIE": ["Mycologie"],
        "ANGLAIS": ["Anglais"]
    };*/
  }
  const [validations, setValidations] = useState({});
  const handleValidationChange = (ue, value) => {
    setValidations((prev) => ({ ...prev, [ue]: value }));
  };

  const niveauxSemestres = {
    L1: ["S1", "S2"],
    L2: ["S3", "S4"],
    L3: ["S5", "S6"],
  };

  useEffect(() => {
    if (filiere) {
      const filiereData = matieresData.find((item) => item.filiere === filiere);
      if (filiereData) {
        setMatieres(filiereData.matieres);
      } else {
        setMatieres({});
      }
    }
  }, [filiere, matieresData]);

  const formatMatiereData = (data) => {
    return data.map((filiere) => ({
      filiere: filiere.filiere,
      matieres: filiere.matieres.reduce((acc, matiere) => {
        acc[matiere.nom] = matiere.matieres;
        return acc;
      }, {}),
    }));
  };

  useEffect(() => {
    const fetchMatieres = async () => {
      try {
        const response = await axios.get(
          `${url}/api/matiere/tous`,
          {
            headers: {
              'Cache-Control': 'no-cache'
            }
          }
        );
        const formattedData = formatMatiereData(response.data);
        setMatieresData(formattedData);
      } catch (error) {
        console.error("Erreur lors de la récupération des matières :", error);
      }
    };
    fetchMatieres();
  }, []);

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

  useEffect(() => {
    if (matricule) {
      const student = students.find((s) => s.matricule === matricule);
      if (student) {
        setNom(student.nom);
        setPrenom(student.prenom);
        setNiveau(student.niveau);
        setSpecialite(student.filiere);
        setFiliere(student.filiere);
      }
    }
  }, [matricule, students]);

  const updateTotalHeures = (updatedHeures) => {
    const total = Object.values(updatedHeures).reduce(
      (sum, h) => sum + (parseInt(h) || 0),
      0
    );
    setTotalHeures(total);
  };

  const updateTotalCredits = (updatedCredits) => {
    const total = Object.values(updatedCredits).reduce(
      (sum, c) => sum + (parseInt(c) || 0),
      0
    );
    setTotalCredits(total);
  };

  const handleNoteChange = (matiere, value) => {
    const numericValue = Math.max(0, Math.min(20, value));
    setNotes((prevNotes) => {
      const updatedNotes = { ...prevNotes, [matiere]: numericValue };
      updateTotalAndAverage(updatedNotes);
      return updatedNotes;
    });
  };

  const handleHeureChange = (ue, value) => {
    const numericValue = Math.max(0, parseInt(value) || 0);
    setHeures((prevHeures) => {
      const updatedHeures = { ...prevHeures, [ue]: numericValue };
      updateTotalHeures(updatedHeures);
      return updatedHeures;
    });
  };

  const handleCreditChange = (ue, value) => {
    const numericValue = Math.max(0, parseInt(value) || 0);
    setCredits((prevCredits) => {
      const updatedCredits = { ...prevCredits, [ue]: numericValue };
      updateTotalCredits(updatedCredits);
      return updatedCredits;
    });
  };

  const updateTotalAndAverage = (updatedNotes) => {
    const total = Object.values(updatedNotes).reduce(
      (sum, note) => sum + note,
      0
    );
    const count = Object.values(updatedNotes).length;
    setTotalNotes(total);
    setMoyenne(count > 0 ? (total / count).toFixed(2) : 0);
  };

  const handleSubmit = async () => {
    if (
      !matricule ||
      !anneeUniv ||
      !semestre ||
      Object.values(notes).some((note) => note === "")
    ) {
      Swal.fire({
        icon: "warning",
        title: "Oups...",
        text: "Veuillez remplir tous les champs.",
      });
      return;
    }

    // Ajout du semestre, du total et de la moyenne aux notes
    const notesCompletes = {
      ...notes,
      Semestre: semestre,
      "Total des notes théoriques": totalNotes,
      "Moyenne théorique": moyenne,
      "Total heures": totalHeures,
      "Total crédits": totalCredits,
    };

    // Ajout des heures, crédits et validations par UE
    Object.keys(matieres).forEach((ue) => {
      matieres[ue].forEach((matiere) => {
        if (heures[matiere]) {
          notesCompletes[`Heures - ${matiere}`] = heures[matiere];
        }
        if (credits[matiere]) {
          notesCompletes[`Crédits - ${matiere}`] = credits[matiere];
        }
        if (validations[matiere]) {
          notesCompletes[`Validation - ${matiere}`] = validations[matiere];
        }
      });
    });

    // Création de l'objet à envoyer
    const data = {
      matricule,
      nom,
      prenom,
      niveau,
      filiere,
      notes: notesCompletes,
      anneeUniv,
    };

    try {
      await axios.post(`${url}/api/note/add`, data);
      Swal.fire({
        icon: "success",
        title: "Succès",
        text: "Notes enregistrées avec succès !",
      }).then(() => {
        navigate("/note");
      });
      setNotes({});
      setTotalNotes(0);
      setMoyenne(0);
    } catch (error) {
      console.error("Erreur lors de l'ajout des notes :", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Erreur lors de l'ajout des notes.",
      });
    }
  };

  useEffect(() => {
    if (matricule && anneeUniv && niveau) {
      const fetchNotesForStudent = async () => {
        try {
          const response = await axios.get(
            `${url}/api/note/all`,
            {
              headers: {
                'Cache-Control': 'no-cache'
              }
            }
          );
          const studentNotes = response.data.filter(
            (note) =>
              note.matricule === matricule &&
              note.anneeUniv === anneeUniv &&
              note.niveau === niveau
          );

          if (studentNotes.length > 0) {
            // Extraire les semestres déjà utilisés dans les notes
            const usedSemesters = studentNotes.map(
              (note) => note.notes.Semestre
            );
            // Filtrer les semestres disponibles en excluant ceux déjà utilisés
            const availableSemesters = niveauxSemestres[niveau].filter(
              (sem) => !usedSemesters.includes(sem)
            );
            // Si un semestre disponible, le mettre par défaut dans le select
            if (availableSemesters.length > 0) {
              setSemestre(availableSemesters[0]); // Assigner le premier semestre non pris
            }
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des notes :", error);
        }
      };

      fetchNotesForStudent();
    }
  }, [matricule, anneeUniv, niveau]);

  const handleCancel = () => {
    navigate("/note");
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
        <section className="contenu2 mt-3 p-4">
          <h4 className="fw-bold">Attribution des notes</h4>
          <div className="hr mt-2"></div>

          <div className="Note">
            <div className="note-container">
              <div className="form-container">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Entrer un matricule"
                    value={matricule}
                    onChange={(e) => setMatricule(e.target.value)}
                    list="matricule-list"
                  />

                  <datalist id="matricule-list">
                    {students.map((student) => (
                      <option key={student.matricule} value={student.matricule}>
                        {student.matricule}
                      </option>
                    ))}
                  </datalist>

                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nom"
                    value={nom}
                    readOnly
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Prénom"
                    value={prenom}
                    readOnly
                  />
                </div>

                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Niveau"
                    value={niveau}
                    readOnly
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Spécialité"
                    value={specialite}
                    readOnly
                  />
                </div>

                <div className="input-group">
                  <select
                    className="form-control"
                    value={semestre}
                    onChange={(e) => setSemestre(e.target.value)}
                    disabled={semestre !== ""}
                  >
                    <option value="">Sélectionner un semestre</option>
                    {(niveauxSemestres[niveau] || []).map((sem) => (
                      <option key={sem} value={sem}>
                        {sem}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Année Académique"
                    value={anneeUniv}
                    onChange={(e) => setAnneeUniv(e.target.value)}
                  />
                </div>
              </div>

              <div className="table-wrapper">
                <table className="note-table">
                  <thead>
                    <tr>
                      <th>Unité d'Enseignement</th>
                      <th>Éléments constitutifs</th>
                      <th>Note /20</th>
                      <th>Heure</th>
                      <th>Crédit</th>
                      <th>Validation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(matieres).map((ue, index) => {
                      const elements = matieres[ue];
                      return (
                        <React.Fragment key={index}>
                          {elements.map((matiere, i) => (
                            <tr key={`${ue}-${i}`}>
                              {/* Affichage de l'UE en rowspan seulement sur la première ligne */}
                              {i === 0 && (
                                <td rowSpan={elements.length}>{ue}</td>
                              )}
                              <td>{matiere}</td>

                              {/* Champ note pour chaque élément constitutif */}
                              <td>
                                <input
                                  type="number"
                                  className="form-control note-input"
                                  value={notes[matiere] || ""}
                                  onChange={(e) =>
                                    handleNoteChange(matiere, e.target.value)
                                  }
                                />
                              </td>
                              {/* Heure et Crédit uniquement pour la première ligne de l'UE */}
                              {i === 0 && (
                                <>
                                  <td rowSpan={elements.length}>
                                    <input
                                      type="number"
                                      className="form-control"
                                      value={heures[matiere] || ""}
                                      onChange={(e) =>
                                        handleHeureChange(
                                          matiere,
                                          e.target.value
                                        )
                                      }
                                      min="0"
                                    />
                                  </td>
                                  <td rowSpan={elements.length}>
                                    <input
                                      type="number"
                                      className="form-control"
                                      value={credits[matiere] || ""}
                                      onChange={(e) =>
                                        handleCreditChange(
                                          matiere,
                                          e.target.value
                                        )
                                      }
                                      min="0"
                                    />
                                  </td>
                                </>
                              )}

                              {/* Validation uniquement pour la première ligne de l'UE */}
                              {i === 0 && (
                                <td rowSpan={elements.length}>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={validations[matiere] || ""}
                                    onChange={(e) =>
                                      handleValidationChange(
                                        matiere,
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                              )}
                            </tr>
                          ))}
                        </React.Fragment>
                      );
                    })}

                    {/* Total et Moyenne */}
                    <tr>
                      <td colSpan="4">
                        <strong>TOTAL HEURES </strong>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={totalHeures}
                          readOnly
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="4">
                        <strong>TOTAL CRÉDITS </strong>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={totalCredits}
                          readOnly
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="4">
                        <strong>TOTAL DES NOTES THÉORIQUES</strong>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={totalNotes}
                          readOnly
                        />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="4">
                        <strong>MOYENNE DES NOTES THÉORIQUES</strong>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={moyenne}
                          readOnly
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="buttons mt-2">
                <button className="btn success" onClick={handleSubmit}>
                  Enregistrer les notes
                </button>
                <button className="btn primary" onClick={handleCancel}>
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer></footer>
    </>
  );
}

export default NoteMaj;
