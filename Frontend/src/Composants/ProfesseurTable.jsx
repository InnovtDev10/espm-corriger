import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaEdit } from "react-icons/fa";
import { Modal, Button, Row, Col } from "react-bootstrap";
import "../Styles/Professeur.css";
import ProfEdit from "./ProfEditModal";
import { FaFilePdf } from "react-icons/fa";

const ProfesseurTable = ({
  searchName,
  searchMatricule,
  selectedDepartement,
  selectedSpecialite,
  selectedStatut,
  selectedMoisEmbauche,
  selectedAnneeEmbauche,
}) => {
  const [professeurs, setProfesseurs] = useState([]);
  const [filteredProfesseurs, setFilteredProfesseurs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [absenceData, setAbsenceData] = useState({});
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProf, setSelectedProf] = useState(null);
  const handleEditClick = (prof) => {
    setSelectedProf(prof);
    setShowEditModal(true);
  };
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProfesseurs = async () => {
      try {
        const response = await axios.get(`${url}/api/prof/tous`, {
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
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

  useEffect(() => {
    setFilteredProfesseurs(
      professeurs.filter(
        (prof) =>
          (!searchMatricule || prof.matricule?.includes(searchMatricule)) &&
          (!searchName ||
            prof.nom?.toLowerCase().includes(searchName.toLowerCase())) &&
          (!selectedDepartement || prof.departement === selectedDepartement) &&
          (!selectedSpecialite || prof.specialite === selectedSpecialite) &&
          (!selectedStatut || prof.statut === selectedStatut) &&
          (!selectedMoisEmbauche ||
            new Date(prof.date_embauche).toISOString().slice(0, 7) ===
              selectedMoisEmbauche) &&
          (!selectedAnneeEmbauche ||
            prof.annee_embauche === selectedAnneeEmbauche)
      )
    );
  }, [
    searchName,
    searchMatricule,
    selectedDepartement,
    selectedSpecialite,
    selectedStatut,
    selectedMoisEmbauche,
    selectedAnneeEmbauche,
    professeurs,
  ]);

  const handleOpenModal = async (matricule) => {
    try {
      const response = await axios.get(
        `${url}/api/pointage/prof/get/${matricule}`,
        {
          headers: {
            'Cache-Control': 'no-cache'
          }
        }
      );
      const data = response.data;

      // Vérifier si `data` contient des informations valides pour un professeur
      if (data && data.length > 0) {
        // Séparer les absences et retards
        const absences = data.filter(
          (pointage) => pointage.raison === "Absence"
        );
        const retards = data.filter((pointage) => pointage.raison === "Retard");

        // Mise à jour des états avec toutes les absences et retards du professeur
        setAbsenceData({
          matricule: data[0].matricule || "Non renseigné",
          nom: data[0].nom || "Non renseigné",
          prenom: data[0].prenom || "Non renseigné",
          departement: data[0].departement || "Non renseigné",
          specialite: data[0].specialite || "Non renseigné",
          absences: absences,
          retards: retards,
        });

        setShowModal(true);
      } else {
        console.error(
          "Aucune donnée de pointage disponible pour ce professeur"
        );
        setAbsenceData({
          matricule: "Non renseigné",
          nom: "Non renseigné",
          prenom: "Non renseigné",
          departement: "Non renseigné",
          specialite: "Non renseigné",
          absences: [],
          retards: [],
        });
        setShowModal(true);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des pointages :", error);
    }
  };

  // Fonction pour formater la date en format français
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="table2-responsive mt-4">
      <table className="noteo-table">
        <thead>
          <tr>
            <th>Matricule</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Département</th>
            <th>Spécialité</th>
            <th>Email</th>
            <th>Telephone</th>
            <th>Statut</th>
            <th>CV</th>
            <th>LM</th>
            <th>Diplôme</th>
            <th>Action</th>
            <th>Pointage</th>
          </tr>
        </thead>
        <tbody>
          {filteredProfesseurs.length > 0 ? (
            filteredProfesseurs.map((prof, index) => (
              <tr key={index}>
                <td>{prof.matricule}</td>
                <td>{prof.nom}</td>
                <td>{prof.prenom}</td>
                <td>{prof.departement}</td>
                <td>{prof.specialite}</td>
                <td>{prof.email}</td>
                <td>{prof.telephone}</td>
                <td>{prof.statut}</td>
                <td>
                  {prof.cv ? (
                    <FaFilePdf
                      className="pdf_icon"
                      onClick={() =>
                        window.open(
                          prof.cv.startsWith("http")
                            ? prof.cv
                            : `${url}/uploads/${prof.cv}`,
                          "_blank"
                        )
                      }
                      style={{ cursor: "pointer", color: "red" }}
                    />
                  ) : (
                    "Aucun CV"
                  )}
                </td>
                <td>
                  {prof.lm ? (
                    <FaFilePdf
                      className="pdf_icon"
                      onClick={() =>
                        window.open(
                          prof.lm.startsWith("http")
                            ? prof.lm
                            : `${url}/uploads/${prof.lm}`,
                          "_blank"
                        )
                      }
                      style={{ cursor: "pointer", color: "red" }}
                    />
                  ) : (
                    "Aucune LM"
                  )}
                </td>
                <td>
                  {prof.lm ? (
                    <FaFilePdf
                      className="pdf_icon"
                      onClick={() =>
                        window.open(
                          prof.diplome.startsWith("http")
                            ? prof.diplome
                            : `${url}/uploads/${prof.diplome}`,
                          "_blank"
                        )
                      }
                      style={{ cursor: "pointer", color: "red" }}
                    />
                  ) : (
                    "Aucune Diplôme"
                  )}
                </td>
                <td>
                  <FaEdit
                    className="icon edit-icon"
                    title="Modifier"
                    onClick={() => handleEditClick(prof)}
                    style={{ cursor: "pointer", color: "#28a745" }}
                  />
                </td>
                <td className="presence-cell">
                  <FaEye
                    className="icon presence-icon"
                    title="Voir Absence"
                    onClick={() => handleOpenModal(prof.matricule)}
                    style={{ cursor: "pointer", color: "#007bff" }}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                Aucun professeur trouvé
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <ProfEdit
        professeur={selectedProf}
        showModal={showEditModal}
        handleClose={() => setShowEditModal(false)}
      />

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Absences & Retards</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body-scroll">
          <div className="modal-content-custom">
            <p>
              <strong>Matricule :</strong> {absenceData.matricule}
            </p>
            <p>
              <strong>Nom :</strong> {absenceData.nom} {absenceData.prenom}
            </p>
            <p>
              <strong>Département :</strong> {absenceData.departement}
            </p>
            <p>
              <strong>Spécialité :</strong> {absenceData.specialite}
            </p>

            <Row>
              <Col md={6} className="absence-box">
                <h5>Absences ({absenceData.absences?.length || 0})</h5>
                {absenceData.absences?.map((absence, index) => (
                  <div key={index} className="absence-item">
                    <p>
                      <strong>Date Début :</strong>{" "}
                      {formatDate(absence.dateDebut)}
                    </p>
                    <p>
                      <strong>Date Fin :</strong> {formatDate(absence.dateFin)}
                    </p>
                    <p>
                      <strong>Motif :</strong> {absence.motif}
                    </p>
                  </div>
                ))}
              </Col>

              <Col md={6} className="retard-box">
                <h5>Retards ({absenceData.retards?.length || 0})</h5>
                {absenceData.retards?.map((retard, index) => (
                  <div key={index} className="retard-item">
                    <p>
                      <strong>Date:</strong> {formatDate(retard.createdAt)}
                    </p>
                    <p>
                      <strong>Heure Entrée :</strong> {retard.heureEntree}
                    </p>
                    <p>
                      <strong>Heure Arrivée :</strong> {retard.heureArrivee}
                    </p>
                    <p>
                      <strong>Motif :</strong> {retard.motif}
                    </p>
                  </div>
                ))}
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProfesseurTable;
