import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/Programme.css";
import { MdOutlineEditCalendar } from "react-icons/md";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import autoTable from "jspdf-autotable";
import { FaFilePdf } from "react-icons/fa";
import jsPDF from "jspdf";
function ProgrammeTable() {
  const [programmes, setProgrammes] = useState([]);
  const [filteredProgrammes, setFilteredProgrammes] = useState([]);
  const [selectedProgramme, setSelectedProgramme] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [Heure, setHeure] = useState("");
  const [filters, setFilters] = useState({
    filiere: "",
    niveau: "",
    semestre: "",
    uniteEnseignement: "",
    matiere: "",
  });

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

  const unitesEtMatieresSFIG = {
    "SCIENCES HUMAINES": [
      "Psychologie et psychiatrie",
      "Psychopathologie",
      "Sociologie",
    ],
    "SANTÉ PUBLIQUE": [
      "Gestion d’un service",
      "Gestions de la ressource",
      "Formation des personnels",
      "Développement de l’esprit d’équipe",
      "Démarche qualité",
    ],
    MÉDECINE: ["Maladie cardio-vasculaire", "Maladie de l’appareil digestif"],
    CHIRURGIE: ["Chirurgie", "Chirurgie dentaire"],
    "GYNÉCOLOGIQUE-OBSTÉTRIQUE": [
      "Santé de la reproduction",
      "Gynécologie et obstétrique",
    ],
    PÉDIATRIE: ["Pédiatrie", "Puériculture", "Santé infantile", "PCIME"],
    PHARMACOLOGIE: [
      "Médicaments essentiels",
      "Différentes classes des médicaments",
    ],
    LÉGISLATION: ["Législation", "Déontologie"],
    NURSING: ["Soins infirmiers en médecine", "Soins infirmiers en chirurgie"],
    "DÉMARCHE DE SOINS": [
      "SMN",
      "SONU",
      "Soins infirmiers en obstétrique",
      "Soins d’urgence",
    ],
    MÉTHODOLOGIE: ["Réalisation TFE"],
  };
  const unitesEtMatieresBTL = {
    HÉMATOLOGIE: ["Hématologie", "Hémostase"],
    BIOCHIMIE: ["Biochimie clinique", "PCA-PCG"],
    "ASSURANCE QUALITÉ": ["Assurance qualité", "Entretien"],
    IMMUNOLOGIE: ["Immunologie", "Technique de Prélèvement"],
    VIROLOGIE: ["Virologie", "Biologie moléculaire"],
    PARASITOLOGIE: ["Parasitologie", "Transfusion sanguine"],
    BACTÉRIOLOGIE: ["Bactériologie", "Pratique Bactériologie"],
    MYCOLOGIE: ["Mycologie"],
    ANGLAIS: ["Anglais"],
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const filterProgrammes = () => {
    const filtered = programmes.filter((programme) => {
      const matchesFiliere = filters.filiere
        ? programme.filiere === filters.filiere
        : true;
      const matchesNiveau = filters.niveau
        ? programme.niveau === filters.niveau
        : true;
      const matchesSemestre = filters.semestre
        ? programme.semestre === filters.semestre
        : true;
      const matchesUnite = filters.uniteEnseignement
        ? programme.uniteEnseignement === filters.uniteEnseignement
        : true;
      const matchesMatiere = filters.matiere
        ? programme.matiere === filters.matiere
        : true;

      return (
        matchesFiliere &&
        matchesNiveau &&
        matchesSemestre &&
        matchesUnite &&
        matchesMatiere
      );
    });

    setFilteredProgrammes(filtered);
  };

  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/programme/all"
        );
        setProgrammes(response.data);
        setFilteredProgrammes(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des programmes :", error);
      }
    };
    fetchProgrammes();
  }, []);

  useEffect(() => {
    filterProgrammes();
  }, [filters]);

  const handleOpenModal = (programme) => {
    setSelectedProgramme(programme);
    setHeure("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProgramme(null);
    setHeure("");
  };

  const handleUpdateVolumeHoraire = async () => {
    if (!selectedProgramme) return;

    if (Heure === "") {
      Swal.fire({
        icon: "warning",
        title: "Aucune valeur entrée",
        text: "Veuillez entrer un volume horaire.",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/programme/update/${selectedProgramme.id}`,
        {
          volumeHoraireEffectuer: parseInt(Heure, 10),
        }
      );

      setProgrammes((prevProgrammes) =>
        prevProgrammes.map((prog) =>
          prog.id === selectedProgramme.id ? response.data : prog
        )
      );

      setShowModal(false);

      Swal.fire({
        icon: "success",
        title: "Mise à jour réussie",
        text: "Le volume horaire a été mis à jour avec succès.",
        confirmButtonText: "OK",
      });
    } catch (error) {
      console.error(
        "Erreur lors de la mise à jour :",
        error.response?.data?.error || error.message
      );

      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: error.response?.data?.error || "Une erreur est survenue.",
        confirmButtonText: "OK",
      });
    }
  };
  const unitesMatieres =
    filters.filiere === "Tourisme"
      ? unitesEtMatieresBTL
      : unitesEtMatieresSFIG;
  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape", // Mode paysage pour meilleure lisibilité
      unit: "mm",
      format: "a4",
    });

    // Titre dynamique basé sur les filtres sélectionnés
    let titre = "Liste des Programmes";
    if (filters.filiere) titre += ` - Filière: ${filters.filiere}`;
    if (filters.niveau) titre += ` - Niveau: ${filters.niveau}`;
    if (filters.semestre) titre += ` - Semestre: ${filters.semestre}`;
    if (filters.uniteEnseignement)
      titre += ` - Unité d'Enseignement: ${filters.uniteEnseignement}`;
    if (filters.matiere) titre += ` - Matière: ${filters.matiere}`;

    // Centrage du titre
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    const pageWidth = doc.internal.pageSize.width;
    const titleWidth = doc.getTextWidth(titre);
    doc.text(titre, (pageWidth - titleWidth) / 2, 15);

    // Ajouter un tableau amélioré
    // Ajouter un tableau amélioré avec les absences et retards dans le PDF
    autoTable(doc, {
      startY: 25,
      head: [
        [
          "Filière",
          "Niveau",
          "Semestre",
          "Unité d'Enseignement",
          "Matière",
          "Professeur",
          "Volume Horaire Effectué",
          "Volume Horaire Total",
          "Crédit",
          "Année Académique",
        ],
      ],
      body: filteredProgrammes.map((programme) => [
        programme.filiere,
        programme.niveau,
        programme.semestre,
        programme.uniteEnseignement,
        programme.matiere,
        programme.professeur,
        `${programme.volumeHoraireEffectuer} Heures`,
        `${programme.volumeHoraireTotal} Heures`,
        programme.credit,
        programme.anneeAcademique,
      ]),
      styles: {
        fontSize: 8, // Réduire la taille de la police pour améliorer l'aspect
        cellPadding: 4,
        halign: "center",
      },
      headStyles: {
        fillColor: [44, 62, 80], // Bleu foncé
        textColor: 255, // Texte blanc
        fontSize: 10,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [220, 220, 220], // Gris clair pour les lignes alternées
      },
      margin: { top: 30 }, // Laisser de l’espace sous le titre
    });

    // Ajouter un footer avec la date et pagination
    const dateExport = new Date().toLocaleDateString();
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(
        `Exporté le ${dateExport}`,
        14,
        doc.internal.pageSize.height - 10
      );
      doc.text(
        `Page ${i} / ${pageCount}`,
        pageWidth - 30,
        doc.internal.pageSize.height - 10
      );
    }

    // Sauvegarder le PDF
    doc.save(`Liste_Programme_${dateExport}.pdf`);
  };
  return (
    <div className="programme-table">
      <div className="programme-table">
        <div className="filtre center mb-3 mt-3">
          {/* Filtre Filière */}
          <select
            name="filiere"
            value={filters.filiere}
            onChange={handleFilterChange}
            className="form-control"
          >
            <option value="">Tous les Filières</option>
            {filieres.map((filiere) => (
              <option key={filiere} value={filiere}>
                {filiere}
              </option>
            ))}
          </select>

          {/* Filtre Niveau */}
          <select
            name="niveau"
            value={filters.niveau}
            onChange={handleFilterChange}
            className="form-control"
          >
            <option value="">Tous Niveaux</option>
            {niveaux.map((niveau) => (
              <option key={niveau} value={niveau}>
                {niveau}
              </option>
            ))}
          </select>

          {/* Filtre Semestre */}
          <select
            name="semestre"
            value={filters.semestre}
            onChange={handleFilterChange}
            className="form-control"
          >
            <option value="">Semestre</option>
            {(niveauxSemestres[filters.niveau] || []).map((semestre) => (
              <option key={semestre} value={semestre}>
                {semestre}
              </option>
            ))}
          </select>

          {/* Filtre Unité d'Enseignement */}
          <select
            name="uniteEnseignement"
            value={filters.uniteEnseignement}
            onChange={handleFilterChange}
            className="form-control"
          >
            <option value="">Unité d'Enseignement</option>
            {Object.keys(unitesMatieres).map((unite) => (
              <option key={unite} value={unite}>
                {unite}
              </option>
            ))}
          </select>

          {/* Filtre Matière */}
          <select
            name="matiere"
            value={filters.matiere}
            onChange={handleFilterChange}
            className="form-control"
          >
            <option value="">Matière</option>
            {(unitesMatieres[filters.uniteEnseignement] || []).map(
              (matiere) => (
                <option key={matiere} value={matiere}>
                  {matiere}
                </option>
              )
            )}
          </select>
        </div>
      </div>
      <div
        className="d-flex justify-content-end"
        style={{ marginBottom: "10px", marginTop: "10px" }}
      >
        <FaFilePdf
          onClick={exportToPDF}
          className="export-pdf-icon"
          title="Exporter en PDF"
        />
      </div>

      <table className="tableProgramme mt-4">
        <thead>
          <tr>
            <th>Filière</th>
            <th>Niveau</th>
            <th>Semestre</th>
            <th>Unité d'Enseignement</th>
            <th>Matière</th>
            <th>Professeur</th>
            <th>Volume Horaire Effectué</th>
            <th>Volume Horaire Restant</th>
            <th>Volume Horaire Total</th>
            <th>Crédit</th>
            <th>Année Académique</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredProgrammes.length > 0 ? (
            filteredProgrammes.map((programme, index) => (
              <tr key={index}>
                <td>{programme.filiere}</td>
                <td>{programme.niveau}</td>
                <td>{programme.semestre}</td>
                <td>{programme.uniteEnseignement}</td>
                <td>{programme.matiere}</td>
                <td>{programme.professeur}</td>
                <td>{programme.volumeHoraireEffectuer} Heures</td>
                <td>
                  {programme.volumeHoraireTotal -
                    programme.volumeHoraireEffectuer}
                  Heures
                </td>
                <td>{programme.volumeHoraireTotal} Heures</td>

                <td>{programme.credit}</td>
                <td>{programme.anneeAcademique}</td>
                <td>
                  <MdOutlineEditCalendar
                    style={{
                      cursor: "pointer",
                      color: "blue",
                      fontSize: "30px",
                      transition: "transform 0.3s, color 0.3s",
                    }}
                    onClick={() => handleOpenModal(programme)}
                    title="Ajouter les heures effectuées"
                    onMouseEnter={(e) =>
                      (e.target.style.transform = "scale(1.2)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.transform = "scale(1)")
                    }
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" style={{ textAlign: "center" }}>
                Aucun programme trouvé
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal Bootstrap */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier le Volume Horaire</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProgramme && (
            <div className="container">
              <div className="row">
                <div className="col-md-6">
                  <p>
                    <strong>Filière :</strong> {selectedProgramme.filiere} -{" "}
                    <strong>Niveau :</strong> {selectedProgramme.niveau}
                  </p>
                  <p>
                    <strong>Semestre :</strong> {selectedProgramme.semestre}
                  </p>
                  <p>
                    <strong>Unité d'Enseignement :</strong>{" "}
                    {selectedProgramme.uniteEnseignement}
                  </p>
                  <p>
                    <strong>Matière :</strong> {selectedProgramme.matiere}
                  </p>
                  <p>
                    <strong>Crédit :</strong> {selectedProgramme.credit}
                  </p>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>Professeur :</strong> {selectedProgramme.professeur}
                  </p>
                  <p>
                    <strong>Année Académique :</strong>{" "}
                    {selectedProgramme.anneeAcademique}
                  </p>
                  <p>
                    <strong>Volume horaire total :</strong>{" "}
                    {selectedProgramme.volumeHoraireTotal} Heures
                  </p>
                  <p>
                    <strong>Volume horaire effectué :</strong>{" "}
                    {selectedProgramme.volumeHoraireEffectuer} Heures
                  </p>
                </div>
              </div>
            </div>
          )}
          <Form>
            <Form.Group>
              <Form.Label>Volume Horaire Effectué :</Form.Label>
              <Form.Control
                type="number"
                value={Heure}
                onChange={(e) => setHeure(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fermer
          </Button>
          <Button variant="primary" onClick={handleUpdateVolumeHoraire}>
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ProgrammeTable;
