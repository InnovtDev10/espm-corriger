import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import "../Styles/Note.css";
import axios from "axios";

function ProgrammeModal() {
  const [filiere, setFiliere] = useState("");
  const [niveau, setNiveau] = useState("");
  const [semestre, setSemestre] = useState("");
  const [uniteEnseignement, setUniteEnseignement] = useState("");
  const [matiere, setMatiere] = useState("");
  const [professeur, setProfesseur] = useState("");
  const [volumeHoraireTotal, setVolumeHoraireTotal] = useState("");
  const [anneeAcademique, setAnneeAcademique] = useState("");
  const [credit, setCredit] = useState("");
  const [show, setShow] = useState(false);
  const [professeurs, setProfesseurs] = useState([]);
  const [filteredProfesseurs, setFilteredProfesseurs] = useState([]);
  const [matieresData, setMatieresData] = useState([]);
  const [matieres, setMatieres] = useState({});

  // Générer dynamiquement toutes les années académiques à partir de 2024
  const anneesAcademiques = [];
  const startYear = 2024;
  const currentYear = new Date().getFullYear(); // Année actuelle

  for (
    let anneeDebut = startYear;
    anneeDebut <= currentYear + 10;
    anneeDebut++
  ) {
    const anneeFin = anneeDebut + 1;
    anneesAcademiques.push(`${anneeDebut}-${anneeFin}`);
  }
  const filieres = [
    "Gestion",
    "Commerce",
    "Tourisme",
  ];
  const niveaux = ["L1", "L2", "L3","M1","M2"];
  const niveauxSemestres = {
    L1: ["S1", "S2"],
    L2: ["S3", "S4"],
    L3: ["S5", "S6"],
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
  };*/
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

  const getUnites = () => {
    return Object.keys(matieres);
  };

  const getMatieres = () => {
    return matieres[uniteEnseignement] || [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedProf = professeurs.find((p) => p.id === parseInt(professeur));
    if (!selectedProf) {
      Swal.fire(
        "Erreur",
        "Veuillez sélectionner un professeur valide",
        "error"
      );
      return;
    }

    const newProgramme = {
      filiere,
      niveau,
      semestre,
      uniteEnseignement,
      matiere,
      professeur: `${selectedProf.nom} ${selectedProf.prenom}`,
      anneeAcademique,
      volumeHoraireTotal: Number(volumeHoraireTotal),
      volumeHoraireEffectuer: 0,
      credit: Number(credit),
    };

    try {
      const response = await fetch("http://localhost:5000/api/programme/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProgramme),
      });

      if (response.ok) {
        Swal.fire("Succès", "Programme ajouté avec succès !", "success");
        setShow(false);
        window.location.reload();
      } else {
        const data = await response.json();
        Swal.fire("Erreur", data.error || "Une erreur s'est produite", "error");
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      Swal.fire("Erreur", "Impossible d'ajouter le programme", "error");
    }
  };

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

  return (
    <>
      <div className="d-flex justify-content-end mb-3">
        <Button className="btn-success" onClick={() => setShow(true)}>
          Ajouter un Programme
        </Button>
      </div>

      <Modal show={show} onHide={() => setShow(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un Programme</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Select
                  value={filiere}
                  onChange={(e) => setFiliere(e.target.value)}
                  required
                >
                  <option value="">Sélectionner une filière</option>
                  {filieres.map((f, index) => (
                    <option key={index} value={f}>
                      {f}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Select
                  value={niveau}
                  onChange={(e) => setNiveau(e.target.value)}
                  required
                >
                  <option value="">Sélectionner un niveau</option>
                  {niveaux.map((n, index) => (
                    <option key={index} value={n}>
                      {n}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Select
                  value={semestre}
                  onChange={(e) => setSemestre(e.target.value)}
                  required
                  disabled={!niveau}
                >
                  <option value="">Sélectionner un semestre</option>
                  {niveau &&
                    niveauxSemestres[niveau]?.map((s, index) => (
                      <option key={index} value={s}>
                        {s}
                      </option>
                    ))}
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Select
                  value={uniteEnseignement}
                  onChange={(e) => setUniteEnseignement(e.target.value)}
                  required
                  disabled={!filiere}
                >
                  <option value="">
                    Sélectionner une unité d'enseignement
                  </option>
                  {getUnites().map((u, index) => (
                    <option key={index} value={u}>
                      {u}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Select
                  value={matiere}
                  onChange={(e) => setMatiere(e.target.value)}
                  required
                  disabled={!uniteEnseignement}
                >
                  <option value="">Sélectionner un élément constitutif</option>
                  {getMatieres().map((m, index) => (
                    <option key={index} value={m}>
                      {m}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={6}>
                <Form.Select
                  value={professeur}
                  onChange={(e) => setProfesseur(e.target.value)}
                  required
                >
                  <option value="">Sélectionner un professeur</option>
                  {professeurs.map((p, index) => (
                    <option key={index} value={p.id}>
                      {p.nom} {p.prenom}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Select
                  value={anneeAcademique}
                  onChange={(e) => setAnneeAcademique(e.target.value)}
                  required
                >
                  <option value="">Sélectionner une année académique</option>
                  {anneesAcademiques.map((annee, index) => (
                    <option key={index} value={annee}>
                      {annee}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Control
                  type="number"
                  placeholder="Volume horaire total"
                  value={volumeHoraireTotal}
                  onChange={(e) => setVolumeHoraireTotal(e.target.value)}
                  required
                />
              </Col>
              <Col md={6}>
                <Form.Control
                  type="number"
                  placeholder="Crédit"
                  value={credit}
                  onChange={(e) => setCredit(e.target.value)}
                  required
                />
              </Col>
            </Row>

            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={() => setShow(false)}>
                Annuler
              </Button>
              <Button variant="success" type="submit">
                Enregistrer
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ProgrammeModal;
