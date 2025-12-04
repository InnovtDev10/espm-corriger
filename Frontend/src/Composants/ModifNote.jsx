import React, { useState, useEffect } from "react";
import Navbar from "../Composants/Navbar";
import Sidebar from "../Composants/Sidebar";
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import "../Styles/Note.css";
import axios from "axios";

function ModifNote() {
  const location = useLocation();
  const navigate = useNavigate();
  const studentData = location.state || {};

  const [id, setId] = useState(studentData.id || "");
  const [matricule, setMatricule] = useState(studentData.matricule || "");
  const [nom, setNom] = useState(studentData.nom || "");
  const [prenom, setPrenom] = useState(studentData.prenom || "");
  const [niveau, setNiveau] = useState(studentData.niveau || "");
  const [semestre, setSemestre] = useState(studentData.semestre || "");
  const [anneeUniv, setAnneeUniv] = useState(studentData.anneeUniv || "");
  const [filiere, setFiliere] = useState(studentData.filiere || "");
  const [notes, setNotes] = useState(
    studentData.matieres &&
      Array.isArray(studentData.matieres) &&
      studentData.matieres.length > 0
      ? studentData.matieres[0]
      : {}
  );
  const [totalNotes, setTotalNotes] = useState(0);
  const [moyenne, setMoyenne] = useState(0);
  const [matieresData, setMatieresData] = useState([]);
  const [matieres, setMatieres] = useState({});

  const calculerTotalEtMoyenne = () => {
    const matieresListe = Object.values(matieres).flat(); // toutes les matières affichées
    const notesValides = matieresListe
      .map((matiere) => {
        const valeur = parseFloat(notes[matiere]);
        return !isNaN(valeur) ? valeur : null;
      })
      .filter((note) => note !== null);

    const total = notesValides.reduce((acc, note) => acc + note, 0);
    const moyenne = notesValides.length > 0 ? total / notesValides.length : 0;

    setTotalNotes(total.toFixed(2));
    setMoyenne(moyenne.toFixed(2));
  };

  useEffect(() => {
    if (Object.keys(matieres).length > 0 && Object.keys(notes).length > 0) {
      calculerTotalEtMoyenne();
    }
  }, [matieres, notes]);

  const handleNoteChange = (matiere, value) => {
    const floatValue = parseFloat(value);
    if (value === "" || (floatValue >= 0 && floatValue <= 20)) {
      setNotes((prevNotes) => ({
        ...prevNotes,
        [matiere]: value,
      }));
    } else {
      Swal.fire({
        icon: "warning",
        title: "Note invalide",
        text: `Veuillez entrer une note entre 0 et 20 pour ${matiere}.`,
      });
    }
  };

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
    };

const matieres = filiere === "Tourisme" ? unitesEtMatieresBTL : unitesEtMatieresSFIG;*/
  }

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
          "http://localhost:5000/api/matiere/tous"
        );
        const formattedData = formatMatiereData(response.data);
        setMatieresData(formattedData);
      } catch (error) {
        console.error("Erreur lors de la récupération des matières :", error);
      }
    };
    fetchMatieres();
  }, []);

  const handleSubmit = async () => {
    // Vérifier que tous les champs sont remplis
    if (
      !id ||
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

    console.log("📋 Notes actuelles par matière :");
    Object.entries(notes).forEach(([matiere, valeur]) => {
      console.log(`- ${matiere}: ${valeur}`);
    });

    // Clés à ne pas convertir mais à garder
    const champsNonNotes = [
      "Semestre",
      "Total des notes théoriques",
      "Moyenne théorique",
      "Total heures",
      "Total crédits",
    ];

    const notesEntieres = Object.keys(notes).reduce((acc, matiere) => {
      if (
        champsNonNotes.includes(matiere) ||
        matiere.startsWith("Heures -") ||
        matiere.startsWith("Crédits -") ||
        matiere.startsWith("Validation -")
      ) {
        // ✅ On conserve la valeur telle quelle
        acc[matiere] = notes[matiere];
        return acc;
      }

      // Tentative de conversion en nombre
      const note = parseFloat(notes[matiere], 10);
      if (isNaN(note)) {
        acc[matiere] = "";
        Swal.fire({
          icon: "warning",
          title: "Note invalide",
          text: `La note de ${matiere} n'est pas valide. Veuillez saisir un nombre.`,
        });
      } else {
        acc[matiere] = note;
      }

      return acc;
    }, {});

    // Vérifier si toutes les notes sont valides avant de soumettre
    if (Object.values(notesEntieres).includes("")) {
      return; // Si une note est vide (non valide), on arrête le processus
    }

    // Préparer les données à envoyer
    const notesCompletes = {
      ...notesEntieres,
      Semestre: semestre,
      "Total des notes théoriques": totalNotes,
      "Moyenne théorique": moyenne,
    };

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

    console.log("Données à mettre à jour :", notesCompletes);

    // Envoi de la requête PUT pour mettre à jour les notes avec Axios
    try {
      const response = await axios.put(
        `http://localhost:5000/api/note/update/${id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Succès",
          text: "Notes mises à jour avec succès !",
        }).then(() => {
          navigate("/note");
        });
      } else {
        throw new Error("Erreur lors de la mise à jour des notes.");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: error.message,
      });
    }
  };

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
          <h4 className="fw-bold">Mise à jour des notes</h4>
          <div className="hr mt-2"></div>

          <div className="Note">
            <div className="note-container">
              <div className="form-container">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Matricule"
                    value={matricule}
                    onChange={(e) => setMatricule(e.target.value)}
                    disabled
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nom"
                    value={nom}
                    readOnly
                    disabled
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Prénom"
                    value={prenom}
                    readOnly
                    disabled
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Niveau"
                    value={niveau}
                    readOnly
                    disabled
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Filière"
                    value={filiere}
                    readOnly
                    disabled
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Semestre"
                    value={semestre}
                    readOnly
                    disabled
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Année Academique"
                    value={anneeUniv}
                    readOnly
                    disabled
                  />
                </div>
              </div>

              <div className="table-wrapper">
                <table className="note-table">
                  <thead>
                    <tr>
                      <th>Unité d'Enseignement</th>
                      <th>Matière</th>
                      <th>Note /20</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(matieres).map((ue, index) => (
                      <React.Fragment key={index}>
                        {matieres[ue].map((matiere, i) => {
                          const note =
                            notes[matiere] !== undefined ? notes[matiere] : "";
                          return (
                            <tr key={i}>
                              <td>{ue}</td>
                              <td>{matiere}</td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control note-input"
                                  value={note}
                                  onChange={(e) =>
                                    handleNoteChange(matiere, e.target.value)
                                  }
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    ))}

                    <tr>
                      <td colSpan="2">
                        <strong>TOTAL DES NOTES THEORIQUES</strong>
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
                      <td colSpan="2">
                        <strong>MOYENNE DES NOTES THEORIQUES</strong>
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

export default ModifNote;
