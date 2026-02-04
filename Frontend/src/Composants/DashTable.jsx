import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaEdit } from "react-icons/fa";
import { Modal, Button, Row, Col } from "react-bootstrap";
import "../Styles/Etudiant.css";
import StudentEditModal from "./StudentEditModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaFilePdf } from "react-icons/fa";
const DashTable = ({
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
  const url = import.meta.env.VITE_API_URL;

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

  // Ouvrir le modal d'absences
  const handleOpenAbsenceModal = async (matricule) => {
    try {
      const response = await axios.get(
        `${url}/api/pointage/etudiant/get/${matricule}`,
        {
          headers: {
            'Cache-Control': 'no-cache'
          }
        }
      );
      let data = response.data;

      if (data && data.length > 0) {
        let absences = data
          .filter((pointage) => pointage.raison === "Absence")
          .sort((a, b) => new Date(b.dateDebut) - new Date(a.dateDebut));

        setAbsenceData({
          matricule: data[0].matricule || "Non renseigné",
          nom: data[0].nom || "Non renseigné",
          prenom: data[0].prenom || "Non renseigné",
          niveau: data[0].niveau || "Non renseigné",
          filiere: data[0].filiere || "Non renseigné",
          absences: absences,
          retards: data.filter((pointage) => pointage.raison === "Retard"),
        });

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
        });
        setShowAbsenceModal(true);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des pointages :", error);
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape", // Mode paysage pour meilleure lisibilité
      unit: "mm",
      format: "a4",
    });

    // Titre dynamique basé sur les filtres sélectionnés
    let titre = "Liste des Étudiants";
    if (selectedFiliere) titre += ` - Parcours: ${selectedFiliere}`;
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
    autoTable(doc, {
      startY: 25,
      head: [
        [
          "Matricule",
          "Nom",
          "Prénom",
          "Sexe",
          "Parcours",
          "Niveau",
          "Téléphone",
          "Adresse",
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
        student.adresse,
      ]),
      styles: {
        fontSize: 10,
        cellPadding: 4,
        halign: "center",
      },
      headStyles: {
        fillColor: [44, 62, 80], // Bleu foncé
        textColor: 255, // Texte blanc
        fontSize: 12,
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
    <div className="table2-responsive">
      <div
        className="d-flex justify-content-end"
        style={{ marginBottom: "10px", marginTop: "10px" }}
      >
        <div
          className="d-flex align-items-center gap-2 mb-3 me-4
     mt-2"
        >
          <span
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              color: "#2c3e50",
            }}
          >
            Nombre d'étudiants :
          </span>
          <span
            style={{
              backgroundColor: "#3498db",
              color: "#fff",
              padding: "6px 12px",
              borderRadius: "20px",
              fontWeight: "bold",
              fontSize: "15px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            {filteredStudents.length}
          </span>
        </div>

        <FaFilePdf
          onClick={exportToPDF}
          className="export-pdf-icon"
          title="Exporter en PDF"
        />
      </div>


     <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
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
        <th>Adresse</th>
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
            <td>{student.adresse}</td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="8" className="text-center">Aucun étudiant trouvé</td>
        </tr>
      )}
    </tbody>
  </table>
</div>

    </div>
  );
};

export default DashTable;
