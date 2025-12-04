import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaEdit ,FaInfo} from "react-icons/fa";
import { Modal, Button, Row, Col } from "react-bootstrap";
import "../Styles/Etudiant.css";
import StudentEditModal from "./StudentEditModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaFilePdf } from "react-icons/fa";
import Swal from "sweetalert2";
import { FaInfoCircle } from "react-icons/fa";


const StudentTable = ({
  searchName,
  searchMatricule,
  selectedFiliere,
  selectedNiveau,
  selectedMois,
  selectedAnnee,
}) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [showAbsenceModal, setShowAbsenceModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [absenceData, setAbsenceData] = useState({});
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [nombreAbsences, setNombreAbsences] = useState(0);
  const [nombreRetards, setNombreRetards] = useState(0);
  const [pointage, setPointage] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/etudiant/tous"
        );
        setStudents(response.data);
        setFilteredStudents(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des étudiants :", error);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    setFilteredStudents(
      students.filter(
        (student) =>
          (!searchName || student.nom?.includes(searchName)) &&
          (!searchMatricule || student.matricule?.includes(searchMatricule)) &&
          (!selectedFiliere || student.filiere === selectedFiliere) &&
          (!selectedNiveau || student.niveau === selectedNiveau) &&
          (!selectedMois ||
            new Date(student.date_inscription).toISOString().slice(0, 7) ===
              selectedMois) &&
          (!selectedAnnee || student.annee_scolaire === selectedAnnee)
      )
    );
  }, [
    searchName,
    searchMatricule,
    selectedFiliere,
    selectedNiveau,
    selectedMois,
    selectedAnnee,
    students,
  ]);

  // Ouvrir le modal d'édition
  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };
  const handleViewDetails = (student) => {
    setSelectedStudent(student); // Stocke l'étudiant sélectionné
    setShowDetailsModal(true); // Ouvre le modal
  };
  const generateStudentCard = async (student) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85.6, 53.98]
    });
  
    const primaryColor = [41, 128, 185];
    const secondaryColor = [52, 152, 219];
    const textColor = [44, 62, 80];
    const accentColor = [230, 126, 34];
  
    // RECTO
    doc.setFillColor(245, 245, 245);
    doc.rect(0, 0, 85.6, 53.98, 'F');
  
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 85.6, 12, 'F');
  
    doc.setFillColor(...accentColor);
    doc.circle(8, 6, 3, 'F');
    doc.setFillColor(255, 255, 255);
    doc.circle(8, 6, 2, 'F');
  
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.text("INSTITUT SUPÉRIEUR PRIVÉ", 15, 4);
    doc.text("MADAGASCAR DÉVELOPPEMENT FORMATION", 15, 7);
    doc.setFontSize(6);
    doc.text("CARTE D'ÉTUDIANT", 15, 10);
  
    doc.setTextColor(...textColor);
    doc.setFontSize(6);
    doc.text("Année scolaire : 2024 - 2025", 60, 4);
  
    doc.setFillColor(255, 255, 255);
    doc.rect(2, 14, 81.6, 37, 'F');
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.rect(2, 14, 81.6, 37, 'S');
  
    // === PHOTOS ===
    await loadStudentPhoto(doc, student.photo);
  
    // Infos étudiant
    doc.setTextColor(...textColor);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
  
    doc.text("Nom :", 28, 19);
    doc.setFont("helvetica", "normal");
    doc.text(`${student.nom}`, 40, 19);
  
    doc.setFont("helvetica", "bold");
    doc.text("Prénom :", 28, 23);
    doc.setFont("helvetica", "normal");
    doc.text(`${student.prenom}`, 40, 23);
  
    doc.setFont("helvetica", "bold");
    doc.text("Matricule :", 28, 27);
    doc.setFont("helvetica", "normal");
    doc.text(`${student.matricule}`, 45, 27);
  
    doc.setFont("helvetica", "bold");
    doc.text("Filière :", 28, 31);
    doc.setFont("helvetica", "normal");
    doc.text(`${student.filiere}`, 40, 31);
  
    doc.setFont("helvetica", "bold");
    doc.text("Niveau :", 28, 35);
    doc.setFont("helvetica", "normal");
    doc.text(`${student.niveau}`, 40, 35);
  
    doc.setFont("helvetica", "bold");
    doc.text("Né(e) le :", 28, 39);
    doc.setFont("helvetica", "normal");
    const dateNaissance = new Date(student.date_naissance).toLocaleDateString('fr-FR');
    doc.text(`${dateNaissance}`, 40, 39);
  
    doc.setFont("helvetica", "bold");
    doc.text("À :", 28, 43);
    doc.setFont("helvetica", "normal");
    doc.text(`${student.lieu_naissance}`, 32, 43);
  
    // Statut
    doc.setFillColor(...secondaryColor);
    doc.rect(60, 17, 20, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text("STATUT", 65, 19);
    doc.text(`${student.statut.toUpperCase()}`, 65, 21.5);
  
    doc.setFillColor(...primaryColor);
    doc.rect(0, 48, 85.6, 6, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(5);
    doc.text("Tél: 034 29 34 52 email: jtaliatraindro@gmail.com", 3, 50.5);
    doc.text("Lot 05 G 47 Isotaka - Antananarivo 101", 3, 52.5);
  
    // === VERSO ===
    doc.addPage();
    doc.setFillColor(245, 245, 245);
    doc.rect(0, 0, 85.6, 53.98, 'F');
  
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 85.6, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text("INFORMATIONS ADMINISTRATIVES", 5, 5);
  
    doc.setFillColor(255, 255, 255);
    doc.rect(2, 10, 81.6, 35, 'F');
    doc.setDrawColor(...primaryColor);
    doc.rect(2, 10, 81.6, 35, 'S');
  
    doc.setTextColor(...textColor);
    doc.setFontSize(6);
  
    let yPos = 15;
    doc.setFont("helvetica", "bold");
    doc.text("N° CIN :", 5, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(`${student.numeroCIN}`, 20, yPos);
  
    yPos += 4;
    doc.setFont("helvetica", "bold");
    doc.text("Date délivrance :", 5, yPos);
    doc.setFont("helvetica", "normal");
    const dateDelivrance = new Date(student.dateDelivranceCIN).toLocaleDateString('fr-FR');
    doc.text(`${dateDelivrance}`, 25, yPos);
  
    yPos += 4;
    doc.setFont("helvetica", "bold");
    doc.text("Adresse :", 5, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(`${student.adresse}`, 20, yPos);
  
    yPos += 4;
    doc.setFont("helvetica", "bold");
    doc.text("Téléphone :", 5, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(`${student.telephone}`, 22, yPos);
  
    yPos += 4;
    doc.setFont("helvetica", "bold");
    doc.text("Email :", 5, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(`${student.email}`, 15, yPos);
  
    yPos += 4;
    doc.setFont("helvetica", "bold");
    doc.text("Nationalité :", 5, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(`${student.nationalite}`, 22, yPos);
  
    yPos += 4;
    doc.setFont("helvetica", "bold");
    doc.text("Date inscription :", 5, yPos);
    doc.setFont("helvetica", "normal");
    const dateInscription = new Date(student.date_inscription).toLocaleDateString('fr-FR');
    doc.text(`${dateInscription}`, 25, yPos);
  
    // Signature et cachet
    doc.setFillColor(250, 250, 250);
    doc.rect(50, 20, 30, 20, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(50, 20, 30, 20, 'S');
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(6);
    doc.text("Signature et cachet", 55, 25);
    doc.text("de l'établissement", 55, 28);
  
    doc.setFillColor(...primaryColor);
    doc.rect(0, 47, 85.6, 7, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(5);
    doc.text("Cette carte est strictement personnelle et doit être présentée à toute réquisition", 3, 49);
    doc.text("Validité : Année académique 2024-2025", 3, 51.5);
  
    // Sauvegarde finale
    doc.save(`Carte_Etudiant_${student.nom}_${student.prenom}.pdf`);
  };
  
  // === Fonction de chargement de l'image ===
  async function loadStudentPhoto(doc, filename) {
    const photoURL = `http://localhost:5000/uploads/${filename}`;
  
    try {
      const response = await fetch(photoURL);
      if (!response.ok) throw new Error('Image introuvable');
  
      const blob = await response.blob();
      const mimeType = blob.type; // "image/png"
      const format = mimeType.split('/')[1].toUpperCase(); // "PNG", "JPEG", etc.
  
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onload = () => {
          doc.addImage(reader.result, format, 5, 17, 20, 25);
          resolve();
        };
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      console.warn("Erreur chargement photo, affichage placeholder :", err);
      drawPhotoPlaceholder(doc);
    }
  }
  
  function drawPhotoPlaceholder(doc) {
    doc.setFillColor(220, 220, 220);
    doc.rect(5, 17, 20, 25, 'F');
    doc.setDrawColor(180, 180, 180);
    doc.rect(5, 17, 20, 25, 'S');
    doc.setTextColor(150, 150, 150);
    doc.setFontSize(8);
    doc.text("PHOTO", 10, 30);
  }
  const handleCard=(student)=>{
    setSelectedStudent(student);
    console.log(student)
    generateStudentCard(student)
  }

  // Ouvrir le modal d'absences
  const handleOpenAbsenceModal = async (matricule) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/pointage/etudiant/get/${matricule}`
      );
      let data = response.data;
      console.log("Donnée retard absence et sanction:", data);
      if (data && data.length > 0) {
        const absences = data.filter(
          (pointage) => pointage.raison === "Absence"
        );
        const retards = data.filter((pointage) => pointage.raison === "Retard");
        const sanctions = data.filter(
          (pointage) => pointage.raison === "Sanction"
        );

        setAbsenceData({
          matricule: data[0].matricule || "Non renseigné",
          nom: data[0].nom || "Non renseigné",
          prenom: data[0].prenom || "Non renseigné",
          niveau: data[0].niveau || "Non renseigné",
          filiere: data[0].filiere || "Non renseigné",
          absences: absences,
          retards: retards,
          sanctions: sanctions,
        });
        console.log("Sanctions:", absenceData.sanctions);

        setShowAbsenceModal(true);
      } else {
        setAbsenceData({
          matricule: "Non renseigné",
          nom: "Non renseigné",
          prenom: "Non renseigné",
          niveau: "Non renseigné",
          filiere: "Non renseigné",
          absences: [],
          retards: [],
          sanctions: [],
        });
        setShowAbsenceModal(true);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des pointages :", error);
    }
  };

  useEffect(() => {
    const fetchPointageParMois = async () => {
      try {
        let url = "http://localhost:5000/api/pointage/etudiant/mois";

        if (selectedMois && selectedAnnee) {
          url += `?mois=${selectedMois}&annee=${selectedAnnee}`;
        }

        const response = await axios.get(url);
        const data = response.data;

        setPointage(data);

        // Comptage des absences et retards
        const nbAbsences = data.filter((p) => p.raison === "Absence").length;
        const nbRetards = data.filter((p) => p.raison === "Retard").length;

        setNombreAbsences(nbAbsences);
        setNombreRetards(nbRetards);

        // Mettre à jour les filteredStudents avec les pointages
        const updatedStudents = students.map((student) => {
          const studentPointage = data.find(
            (p) => p.matricule === student.matricule
          );
          if (studentPointage) {
            // On met à jour les absences et retards en fonction du pointage
            return {
              ...student,
              absences: studentPointage.raison === "Absence" ? 1 : 0,
              retards: studentPointage.raison === "Retard" ? 1 : 0,
            };
          }
          return student;
        });

        setFilteredStudents(updatedStudents);
      } catch (error) {
        console.error(
          "🚨 Erreur lors de la récupération des pointages filtrés :",
          error
        );
      }
    };

    fetchPointageParMois();
  }, [selectedMois, selectedAnnee, students]);

  // Fonction pour mettre à jour les checkbox
  const handleCheckboxChange = async (student, checkboxType) => {
    const isDiplomeChecked =
      checkboxType === "diplome_bacc"
        ? !student.diplome_bacc
        : student.diplome_bacc;
    const isResidenceChecked =
      checkboxType === "certificat_residence"
        ? !student.certificat_residence
        : student.certificat_residence;

    const confirmationMessage = `Voulez-vous vraiment modifier l'état du ${
      checkboxType === "diplome_bacc"
        ? "Diplôme Bacc"
        : "Certificat de Résidence"
    } de ${student.nom} ?`;

    const result = await Swal.fire({
      title: "Confirmation",
      text: confirmationMessage,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui",
      cancelButtonText: "Non",
    });

    if (result.isConfirmed) {
      try {
        // Mettre à jour les cases à cocher dans la base de données
        await axios.put(
          `http://localhost:5000/api/etudiant/update/${student.id}`,
          {
            [checkboxType]:
              checkboxType === "diplome_bacc"
                ? isDiplomeChecked
                : isResidenceChecked,
          }
        );

        // Mettre à jour l'état local des étudiants après la mise à jour
        setStudents((prevStudents) =>
          prevStudents.map((s) =>
            s.id === student.id
              ? {
                  ...s,
                  [checkboxType]:
                    checkboxType === "diplome_bacc"
                      ? isDiplomeChecked
                      : isResidenceChecked,
                }
              : s
          )
        );

        Swal.fire(
          "Modifié!",
          `L'état du ${
            checkboxType === "diplome_bacc"
              ? "Diplôme Bacc"
              : "Certificat de Résidence"
          } a été mis à jour avec succès.`,
          "success"
        );
      } catch (error) {
        Swal.fire(
          "Erreur",
          "Une erreur est survenue lors de la mise à jour.",
          "error"
        );
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "short",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape", // Mode paysage pour meilleure lisibilité
      unit: "mm",
      format: "a4",
    });

    // Titre dynamique basé sur les filtres sélectionnés
    let titre = "Liste des Étudiants";
    if (selectedFiliere) titre += ` - Filière: ${selectedFiliere}`;
    if (selectedNiveau) titre += ` - Niveau: ${selectedNiveau}`;
    if (selectedMois) titre += ` - Mois: ${selectedMois}`;
    if (selectedAnnee) titre += ` - Année: ${selectedAnnee}`;

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
          "Matricule",
          "Nom",
          "Prénom",
          "Sexe",
          "Filière",
          "Niveau",
          "Téléphone",
        ],
      ],
      body: filteredStudents.map((student) => [
        student.matricule,
        student.nom,
        student.prenom,
        student.sexe,
        student.filiere,
        student.niveau,
        student.telephone,

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
    doc.save(`Liste_Etudiants_${dateExport}.pdf`);
  };

  const moisNom = selectedMois
    ? new Date(0, parseInt(selectedMois, 10) - 1).toLocaleString("fr", {
        month: "long",
      })
    : "Tous les mois";

  return (
    <div className="table2-responsive">
      <div
        className="d-flex justify-content-end"
        style={{
          marginBottom: "10px",
          marginTop: "10px",
          alignItems: "center",
        }}
      >
   
        <FaFilePdf
          onClick={exportToPDF}
          className="export-pdf-icon"
          title="Exporter en PDF"
        />
      </div>
      <table className="noteo-table">
        <thead>
          <tr>
            <th>Matricule</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Sexe</th>
            <th>Filière</th>
            <th>Niveau</th>
            <th>Téléphone</th>
            <th>Email</th>
            <th>Action</th>
            <th>Pointage</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student, index) => (
              <tr key={index}>
                <td>{student.matricule}</td>
                <td>{student.nom}</td>
                <td>{student.prenom}</td>
                <td>{student.sexe}</td>
                <td>{student.filiere}</td>
                <td>{student.niveau}</td>
                <td>{student.telephone}</td>
                <td>{student.email}</td>
                <td className="action-cell">
                  <FaEdit
                    className="icon edit-icon"
                    title="Modifier l'étudiant"
                    onClick={() => handleEditStudent(student)}
                    style={{ cursor: "pointer", color: "#28a745" }}
                  />
                  <FaInfoCircle
                    className="icon details-icon"
                    title="Voir Détails"
                    onClick={() => handleViewDetails(student)}
                    style={{
                      cursor: "pointer",
                      color: "#007bff",
                      marginLeft: "15px",
                    }}
                  />
                  {/*<FaInfo
                    className="icon details-icon"
                    title="Voir Détails"
                    onClick={() => handleCard(student)}
                    style={{
                      cursor: "pointer",
                      color: "#007bff",
                      marginLeft: "15px",
                    }}
                  />*/}
                </td>

                <td className="presence-cell">
                  <FaEye
                    className="icon presence-icon"
                    title="Voir Absence et Retard"
                    onClick={() => handleOpenAbsenceModal(student.matricule)}
                    style={{ cursor: "pointer", color: "#007bff" }}
                  />
                  {student.absences >= 5 && (
                    <span
                      className={`alert-point ${
                        student.absences >= 10 ? "red" : "yellow"
                      }`}
                    ></span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                Aucun étudiant trouvé
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal d'édition */}
      {selectedStudent && (
        <StudentEditModal
          student={selectedStudent}
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
        />
      )}

      {/* Modal d'absences */}
      <Modal
        show={showAbsenceModal}
        onHide={() => setShowAbsenceModal(false)}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Absences-Retards-Avertissements</Modal.Title>
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
              <strong>Niveau :</strong> {absenceData.niveau}
            </p>
            <p>
              <strong>Filière :</strong> {absenceData.filiere}
            </p>

            <Row>
              {/* Section Absences */}
              <Col md={4} className="absence-box">
                <h5 className="fw-bold">
                  Absences ({absenceData.absences?.length || 0})
                </h5>
                {absenceData.absences?.map((absence, index) => (
                  <div key={index} className="absence-item">
                    <p>
                      <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                        Date début :
                      </span>{" "}
                      {formatDate(absence.dateDebut)}
                    </p>
                    <p>
                      <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                        Date Fin :
                      </span>{" "}
                      {formatDate(absence.dateFin)}
                    </p>
                    <p>
                      <strong>Motif :</strong> {absence.motif}
                    </p>
                  </div>
                ))}
              </Col>

              {/* Section Retards */}
              <Col md={4} className="retard-box">
                <h5 className="fw-bold">
                  Retards ({absenceData.retards?.length || 0})
                </h5>
                {absenceData.retards?.map((retard, index) => (
                  <div key={index} className="retard-item">
                    <p>
                      <span style={{ fontSize: "20px", fontWeight: "bold" }}>
                        Date :
                      </span>{" "}
                      {formatDate(retard.createdAt)}
                    </p>
                    <p>
                      <strong>Heure :</strong> {retard.heureArrivee}
                    </p>
                    <p>
                      <strong>Motif :</strong> {retard.motif}
                    </p>
                  </div>
                ))}
              </Col>
              {/* Section Sanctions */}
              <Col md={4} className="sanction-box">
                <h5 className="fw-bold">
                  Sanctions ({absenceData.sanctions?.length || 0})
                </h5>
                {absenceData.sanctions?.length > 0 ? (
                  absenceData.sanctions.map(
                    (sanction, index) => (
                      console.log("Sanction:", sanction),
                      (
                        <div key={index} className="sanction-item">
                          <p>
                            <span
                              style={{ fontSize: "18px", fontWeight: "bold" }}
                            >
                              Date :
                            </span>{" "}
                            {formatDate(sanction.createdAt)}
                          </p>
                          <p>
                            <strong>Motif :</strong> {sanction.motif}
                          </p>
                          <p>
                            <strong>Décision :</strong> {sanction.decision}
                          </p>
                        </div>
                      )
                    )
                  )
                ) : (
                  <p>Aucune sanction</p>
                )}
              </Col>
            </Row>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary "
            onClick={() => setShowAbsenceModal(false)}
          >
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Détails de l'étudiant</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedStudent && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              {/* Colonne de gauche */}
              <div
                style={{
                  flex: "1 1 45%",
                  padding: "15px",
                  backgroundColor: "#f4f6f8",
                  borderRadius: "8px",
                }}
              >
                <p>
                  <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                    Matricule :
                  </span>{" "}
                  {selectedStudent.matricule}
                </p>
                <p>
                  <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                    Nom :
                  </span>{" "}
                  {selectedStudent.nom}
                </p>
                <p>
                  <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                    Prénom :
                  </span>{" "}
                  {selectedStudent.prenom}
                </p>
                <p>
                  <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                    Sexe :
                  </span>{" "}
                  {selectedStudent.sexe}
                </p>
                <p>
                  <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                    Filière :
                  </span>{" "}
                  {selectedStudent.filiere}
                </p>
                <p>
                  <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                    Niveau :
                  </span>{" "}
                  {selectedStudent.niveau}
                </p>
                <p>
                  <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                    Email :
                  </span>{" "}
                  {selectedStudent.email}
                </p>
                <p>
                  <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                    Date de naissance :
                  </span>{" "}
                  {new Date(
                    selectedStudent.date_naissance
                  ).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p>
                <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                   Lieu de naissance :
                  </span>{" "}
                  {selectedStudent.lieu_naissance}
                </p>
              </div>

              {/* Colonne de droite */}
              <div
                style={{
                  flex: "1 1 45%",
                  padding: "15px",
                  backgroundColor: "#f4f6f8",
                  borderRadius: "8px",
                }}
              >
                 <p>
                  <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                    Téléphone :
                  </span>{" "}
                  {selectedStudent.telephone}
                </p>
                <p>
                  <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                    Téléphone :
                  </span>{" "}
                  {selectedStudent.telephone}
                </p>
                <p>
                  <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                    Adresse :
                  </span>{" "}
                  {selectedStudent.adresse}
                </p>
                <p>
                  <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                    Nationalité :
                  </span>{" "}
                  {selectedStudent.nationalite}
                </p>
                <p>
                  <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                    Date d'inscription :
                  </span>{" "}
                  {new Date(
                    selectedStudent.date_inscription
                  ).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                <p>
                  <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                    Père :
                  </span>{" "}
                  {selectedStudent.nomPrenomPere} - {selectedStudent.telPere}
                </p>
                <p>
                  <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                    Mère :
                  </span>{" "}
                  {selectedStudent.nomPrenomMere} - {selectedStudent.telMere}
                </p>
                <p>
                  <span style={{ fontSize: "18px", fontWeight: "bold" }}>
                    CIN :
                  </span>{" "}
                  {selectedStudent.numeroCIN}
                  (Délivrée le:{" "}
                  {new Date(
                    selectedStudent.dateDelivranceCIN
                  ).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  )
                </p>
              </div>
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDetailsModal(false)}
          >
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StudentTable;
