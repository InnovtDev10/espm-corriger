import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/Stage.css";
import { Modal, Button, Form } from "react-bootstrap";
import { FaCommentDots } from "react-icons/fa";
import jsPDF from "jspdf";
import { FaFilePdf } from "react-icons/fa";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";

function StageHistorique() {
  const [stages, setStages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState(null);
  const [updatedObservation, setUpdatedObservation] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedEtablissement, setSelectedEtablissement] = useState("");
  const [selectedFiliere, setSelectedFiliere] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const url = import.meta.env.VITE_API_URL;
  const moisNoms = [
    { valeur: "01", nom: "Janvier" },
    { valeur: "02", nom: "Février" },
    { valeur: "03", nom: "Mars" },
    { valeur: "04", nom: "Avril" },
    { valeur: "05", nom: "Mai" },
    { valeur: "06", nom: "Juin" },
    { valeur: "07", nom: "Juillet" },
    { valeur: "08", nom: "Août" },
    { valeur: "09", nom: "Septembre" },
    { valeur: "10", nom: "Octobre" },
    { valeur: "11", nom: "Novembre" },
    { valeur: "12", nom: "Décembre" },
  ];

  useEffect(() => {
    const fetchStages = async () => {
      try {
        const response = await axios.get(`${url}/api/stage/all`, {
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        if (Array.isArray(response.data)) {
          setStages(response.data);
        } else {
          console.error(
            "Les données reçues ne sont pas un tableau :",
            response.data
          );
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des stages :", error);
      }
    };

    fetchStages();
  }, []);

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("fr-FR");
  };

  const handleShowModal = (stage) => {
    setSelectedStage(stage);
    setUpdatedObservation(stage.observation);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStage(null);
    setUpdatedObservation("");
  };

  const handleUpdateObservation = async () => {
    if (!updatedObservation) return;
    try {
      await axios.put(
        `${url}/api/stage/update/${selectedStage.id}`,
        { observation: updatedObservation }
      );
      setStages((prevStages) =>
        prevStages.map((stage) =>
          stage.id === selectedStage.id
            ? { ...stage, observation: updatedObservation }
            : stage
        )
      );
      handleCloseModal();
      Swal.fire({
        icon: "success",
        title: "Succès",
        text: "Observation mise à jour avec succès",
        confirmButtonColor: "#3085d6",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'observation :", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur s'est produite lors de la mise à jour.",
        confirmButtonColor: "#d33",
      });
    }
  };

  // Récupérer les valeurs uniques pour les filtres
  const niveaux = [...new Set(stages.map((stage) => stage.niveau))];
  const anneesUniversitaires = [
    ...new Set(stages.map((stage) => stage.anneeUniv)),
  ];
  const etablissements = [
    ...new Set(stages.map((stage) => stage.etablissementAcceuil)),
  ];
  const filieres = [...new Set(stages.map((stage) => stage.filiere))];
  const moisDisponibles = [
    ...new Set(stages.map((stage) => new Date(stage.dateDebut).getMonth() + 1)),
  ].sort((a, b) => a - b);

  // Filtrage des stages
  const filteredStages = stages.filter(
    (stage) =>
      (stage.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stage.matricule.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedLevel === "" || stage.niveau === selectedLevel) &&
      (selectedYear === "" || stage.anneeUniv === selectedYear) &&
      (selectedEtablissement === "" ||
        stage.etablissementAcceuil === selectedEtablissement) &&
      (selectedFiliere === "" || stage.filiere === selectedFiliere) &&
      (selectedMonth === "" ||
        new Date(stage.dateDebut).getMonth() + 1 === parseInt(selectedMonth))
  );

  // Fonction pour exporter en PDF
  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape", // Mode paysage pour meilleure lisibilité
      unit: "mm",
      format: "a4",
    });

    // Générer un titre basé sur les filtres
    let title = "Historique des stages";
    if (selectedLevel) title += ` - Niveau: ${selectedLevel}`;
    if (selectedYear) title += ` - Année: ${selectedYear}`;
    if (selectedEtablissement)
      title += ` - Établissement: ${selectedEtablissement}`;
    if (selectedFiliere) title += ` - Filière: ${selectedFiliere}`;

    // Ajouter le titre au PDF
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    const pageWidth = doc.internal.pageSize.width;
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (pageWidth - titleWidth) / 2, 15);

    autoTable(doc, {
      startY: 25,
      head: [
        [
          "Matricule",
          "Nom",
          "Niveau",
          "Spécialité",
          "Établissement",
          "Département",
          "Service",
          "Date Début",
          "Date Fin",
          "Année Universitaire",
          "Observation",
        ],
      ],
      body: filteredStages.map((stage) => [
        stage.matricule,
        stage.nom,
        stage.niveau,
        stage.filiere,
        stage.etablissementAcceuil,
        stage.departement,
        stage.service,
        formatDate(stage.dateDebut),
        formatDate(stage.dateFin),
        stage.anneeUniv,
        stage.observation || "-",
        // Afficher le nombre de retards
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
    // Générer le tableau

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
    doc.save(`Liste_Etudiants_Stages${dateExport}.pdf`);
  };

  return (
    <div className="historique-table mt-2">
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="fw-bold">
          Historique des stages ({filteredStages.length} étudiants)
        </h5>
        <div className="d-flex align-items-center">
          <span className="me-5 fw-bold">
            Total étudiants en stage: {filteredStages.length}
          </span>

          <FaFilePdf
            onClick={exportToPDF}
            className="export-pdf-icon mb-2"
            title="Exporter en PDF"
          />
        </div>
      </div>
      {/* Filtres */}
      <div className="filters ">
        <input
          type="text"
          placeholder="Rechercher par nom ou matricule..."
          className="filter-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="filter-select"
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
        >
          <option value="">Tous les niveaux</option>
          {niveaux.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>

        <input
          type="text"
          list="annees"
          className="filter-select"
          placeholder="Année universitaire"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        />
        <select
          className="filter-select"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">Tous les mois</option>
          {moisNoms.map((mois) => (
            <option key={mois.valeur} value={mois.valeur}>
              {mois.nom}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={selectedEtablissement}
          onChange={(e) => setSelectedEtablissement(e.target.value)}
        >
          <option value="">Tous les établissements</option>
          {etablissements.map((etablissement) => (
            <option key={etablissement} value={etablissement}>
              {etablissement}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={selectedFiliere}
          onChange={(e) => setSelectedFiliere(e.target.value)}
        >
          <option value="">Toutes les filières</option>
          {filieres.map((filiere) => (
            <option key={filiere} value={filiere}>
              {filiere}
            </option>
          ))}
        </select>
      </div>

      {/* Tableau */}
      <div className="table-responsive">
        <table className="noteo-table">
          <thead>
            <tr>
              <th>Matricule</th>
              <th>Nom</th>
              <th>Niveau</th>
              <th>Spécialité</th>
              <th>Établissement</th>
              <th>Département</th>
              <th>Service</th>
              <th>Date Début</th>
              <th>Date Fin</th>
              <th>Année Universitaire</th>
              <th>Observation</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStages.length > 0 ? (
              filteredStages.map((stage, index) => (
                <tr key={index}>
                  <td>{stage.matricule}</td>
                  <td>{stage.nom}</td>
                  <td>{stage.niveau}</td>
                  <td>{stage.filiere}</td>
                  <td>{stage.etablissementAcceuil}</td>
                  <td>{stage.departement}</td>
                  <td>{stage.service}</td>
                  <td>{formatDate(stage.dateDebut)}</td>
                  <td>{formatDate(stage.dateFin)}</td>
                  <td>{stage.anneeUniv}</td>
                  <td className="observation-cell">{stage.observation}</td>
                  <td>
                    <td>
                      <button
                        className="obsbtn"
                        onClick={() => handleShowModal(stage)}
                      >
                        <FaCommentDots className="obs" />
                      </button>
                    </td>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center">
                  Aucune donnée trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedStage && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Détails du Stage</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Matricule:</strong> {selectedStage.matricule}
            </p>
            <p>
              <strong>Nom:</strong> {selectedStage.nom} <strong>Prénom:</strong>{" "}
              {selectedStage.prenom}
            </p>
            <p>
              <strong>Niveau:</strong> {selectedStage.niveau}{" "}
              <strong>Spécialité:</strong> {selectedStage.filiere}
            </p>
            <p>
              <strong>Établissement:</strong>{" "}
              {selectedStage.etablissementAcceuil}
            </p>
            <p>
              <strong>Date Début:</strong> {formatDate(selectedStage.dateDebut)}{" "}
              <strong>Date Fin:</strong> {formatDate(selectedStage.dateFin)}
            </p>
            <p>
              <strong>Année Universitaire:</strong> {selectedStage.anneeUniv}
            </p>
            <Form.Group className="mt-3">
              <Form.Label>
                <strong>Observation</strong>
              </Form.Label>
              <Form.Control
                as="input"
                rows={3}
                value={updatedObservation}
                onChange={(e) => setUpdatedObservation(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Fermer
            </Button>
            <Button variant="primary" onClick={handleUpdateObservation}>
              Enregistrer
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default StageHistorique;
