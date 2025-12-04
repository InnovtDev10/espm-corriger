import React, { useEffect, useState } from "react";
import axios from "axios";

import "../Styles/Etudiant.css";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaFilePdf } from "react-icons/fa";

const LivretTable = ({
  searchName,
  searchMatricule,
  selectedFiliere,
  selectedNiveau,
  selectedMois,
  selectedAnnee,
}) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  // Fonction pour formater la date en format français
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "short", // Jour de la semaine
      year: "numeric",
      month: "long", // Mois en format texte
      day: "numeric", // Jour du mois
    });
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/livret/tous"
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
          (!selectedAnnee || student.anneeUniv === selectedAnnee)
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

  return (
    <div className="table2-responsive">
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
      <table className="noteo-table">
        <thead>
          <tr>
            <th>Matricule</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Filière</th>
            <th>Niveau</th>
            <th>Type Document</th>
            <th>Description</th>
            <th>Date Reception</th>
            <th>Année</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student, index) => (
              <tr key={index}>
                <td>{student.matricule}</td>
                <td>{student.nom}</td>
                <td>{student.prenom}</td>
                <td>{student.filiere}</td>
                <td>{student.niveau}</td>
                <td>{student.typeDocument || "N/A"}</td>
                <td>{student.description || "N/A"}</td>

                <td>{formatDate(student.dateReception)}</td>
                <td>{student.anneeUniv || "N/A"}</td>
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
    </div>
  );
};

export default LivretTable;
