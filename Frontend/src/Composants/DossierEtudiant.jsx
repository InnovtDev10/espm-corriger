import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEye, FaEdit, FaFilePdf } from "react-icons/fa";
import { Modal, Button, Row, Col } from "react-bootstrap";
import "../Styles/Etudiant.css";
import StudentEditModal from "./StudentEditModal";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";
import Navbar from "../Composants/Navbar";
import Sidebar from "../Composants/Sidebar";
import { useNavigate } from "react-router-dom";

const StudentTableDossier = ({
  searchMatricule,
  selectedFiliere,
  selectedNiveau,
  selectedMois,
  selectedAnnee,
}) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const navigate = useNavigate(); // Définition de navigate

  const naviguerVersMatieres = () => {
    navigate("/etudiant");
  };
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

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  // Fonction pour gérer les modifications des checkboxes
  const handleCheckboxChange = async (student, field) => {
    const newValue = !student[field];

    const result = await Swal.fire({
      title: "Confirmation",
      text: `Voulez-vous vraiment modifier l'état de ${field.replace(
        "_",
        " "
      )} pour ${student.nom} ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui",
      cancelButtonText: "Non",
    });

    if (result.isConfirmed) {
      try {
        await axios.put(
          `http://localhost:5000/api/etudiant/update/by/${student.matricule}`,
          { [field]: newValue }
        );

        // Mettre à jour l'état local des étudiants après la mise à jour
        setStudents((prevStudents) =>
          prevStudents.map((s) =>
            s.matricule === student.matricule ? { ...s, [field]: newValue } : s
          )
        );

        Swal.fire(
          "Modifié!",
          "L'état a été mis à jour avec succès.",
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

  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    let titre = "Liste des Étudiants";
    if (selectedFiliere) titre += ` - Parcours: ${selectedFiliere}`;
    if (selectedNiveau) titre += ` - Niveau: ${selectedNiveau}`;
    if (selectedMois) titre += ` - Mois: ${selectedMois}`;
    if (selectedAnnee) titre += ` - Année: ${selectedAnnee}`;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    const pageWidth = doc.internal.pageSize.width;
    doc.text(titre, pageWidth / 2 - doc.getTextWidth(titre) / 2, 15);

    autoTable(doc, {
      startY: 25,
      head: [
        [
          "Matricule",
          "Nom",
          "Prénom",
          "Acte naissance",
          "CIN",
          "Photo",
          "Mariage",
          "Transfert",
          "Carton",
          "Chemise",
          "Enveloppe",
          "Gant",
          "Alcool",
        ],
      ],
      body: filteredStudents.map((student) => [
        student.matricule,
        student.nom,
        student.prenom,
        student.acte_naissance ? "✔" : "",
        student.photocopie_cin ? "✔" : "",
        student.photo_identite ? "✔" : "",
        student.acte_mariage ? "✔" : "",
        student.fiche_transfert ? "✔" : "",
        student.carton ? "✔" : "",
        student.enveloppe ? "✔" : "",
        student.gant ? "✔" : "",
        student.alcool ? "✔" : "",
      ]),
      styles: { fontSize: 8, cellPadding: 4, halign: "center" },
      headStyles: {
        fillColor: [44, 62, 80],
        textColor: 255,
        fontSize: 10,
        fontStyle: "bold",
      },
      alternateRowStyles: { fillColor: [220, 220, 220] },
      margin: { top: 30 },
    });

    doc.save("Liste_Etudiants.pdf");
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
          <h4 className="fw-bold">Dossier étudiants</h4>
          <div className="d-flex justify-content-end align-items-center">
            <button
              className="btn btn-success mt-0"
              onClick={naviguerVersMatieres} // Correction ici
            >
              Retour
            </button>
          </div>
          <div className="hr mt-2"></div>
          <div className="table2-responsive mt-4">
            <div className="d-flex justify-content-end mb-2">
              <FaFilePdf
                onClick={exportToPDF}
                className="export-pdf-icon"
                title="Exporter en PDF"
              />
            </div>

            {/* Conteneur avec scroll */}
            <div className="tabledossier-container">
              <table className="tabledossier">
                <thead>
                  <tr>
                    <th>Matricule</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Parcours</th>
                    <th>Niveau</th>
                    <th>D.Bacc</th>
                    <th>C. Résidence</th>
                    <th>Règlement Intérieur</th>
                    <th>Acte de naissance</th>
                    <th>Photocopie CIN</th>
                    <th>Photo d'identité</th>
                    <th>Acte de mariage</th>
                    <th>Fiche de transfert</th>
                    <th>Carton chemise</th>
                    <th>Enveloppe</th>
                    <th>Gant</th>
                    <th>Alcool</th>
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
                        <td>
                          <input
                            type="checkbox"
                            checked={student.diplome_bacc}
                            style={{ width: "20px", height: "20px" }}
                            onChange={() =>
                              handleCheckboxChange(student, "diplome_bacc")
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            checked={student.certificat_residence}
                            style={{ width: "20px", height: "20px" }}
                            onChange={() =>
                              handleCheckboxChange(
                                student,
                                "certificat_residence"
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            checked={student.reglement_interieur}
                            style={{ width: "20px", height: "20px" }}
                            onChange={() =>
                              handleCheckboxChange(
                                student,
                                "reglement_interieur"
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            checked={student.acte_de_naissance}
                            style={{ width: "20px", height: "20px" }}
                            onChange={() =>
                              handleCheckboxChange(student, "acte_de_naissance")
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            checked={student.photocopie_cin}
                            style={{ width: "20px", height: "20px" }}
                            onChange={() =>
                              handleCheckboxChange(student, "photocopie_cin")
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            checked={student.photo_identite}
                            style={{ width: "20px", height: "20px" }}
                            onChange={() =>
                              handleCheckboxChange(student, "photo_identite")
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            checked={student.acte_de_mariage}
                            style={{ width: "20px", height: "20px" }}
                            onChange={() =>
                              handleCheckboxChange(student, "acte_de_mariage")
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            checked={student.fiche_de_transfert}
                            style={{ width: "20px", height: "20px" }}
                            onChange={() =>
                              handleCheckboxChange(
                                student,
                                "fiche_de_transfert"
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            checked={student.carton_chemise}
                            style={{ width: "20px", height: "20px" }}
                            onChange={() =>
                              handleCheckboxChange(student, "carton_chemise")
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            checked={student.enveloppe}
                            style={{ width: "20px", height: "20px" }}
                            onChange={() =>
                              handleCheckboxChange(student, "enveloppe")
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            checked={student.gant}
                            style={{ width: "20px", height: "20px" }}
                            onChange={() =>
                              handleCheckboxChange(student, "gant")
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            checked={student.alcool}
                            style={{ width: "20px", height: "20px" }}
                            onChange={() =>
                              handleCheckboxChange(student, "alcool")
                            }
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="17" className="text-center">
                        Aucun étudiant trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default StudentTableDossier;
