import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/Note.css";
import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function NoteTable({ matricule }) {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchNotes = async () => {
      if (matricule) {
        try {
          const response = await axios.get(
            `${url}/api/note/get/${matricule}`,
            {
              headers: {
                'Cache-Control': 'no-cache'
              }
            }
          );
          setNotes(response.data);
        } catch (error) {
          console.error("Erreur lors de la récupération des notes:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchNotes();
  }, [matricule]);

  const groupedNotes = notes.reduce((acc, note) => {
    const semestre = note.notes.Semestre || "Non défini";
    const key = `${note.matricule}-${note.nom}-${note.prenom}-${note.filiere}-${note.niveau}-${note.anneeUniv}-${semestre}`;

    if (!acc[key]) {
      acc[key] = { ...note, semestre, matieres: [] };
    }

    acc[key].matieres.push(note.notes);
    return acc;
  }, {});

  const handleEdit = (student) => {
    Swal.fire({
      title: "Modifier les informations",
      text: `Modifier ${student.matricule} - Semestre ${student.semestre}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, modifier !",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/modifier-note", { state: student });
      }
    });
  };

  return (
    <div className="note-table-container">
      <div className="table-responsive">
        <table className="note-table">
          <thead>
            <tr>
              <th>Matricule</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Filière</th>
              <th>Niveau</th>
              <th>Année</th>
              <th>Semestre</th>
              <th>Matière</th>
              <th>Note</th>
              <th>Heures</th>
              <th>Crédits</th>
              <th>Validation</th>
              <th>Total Note</th>
              <th>Total Heures</th>
              <th>Total Crédits</th>
              <th>Moyenne</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="17" className="text-center">
                  Faites la recherche pour afficher les données
                </td>
              </tr>
            ) : Object.values(groupedNotes).length > 0 ? (
              Object.values(groupedNotes).map((student, studentIndex, array) => {
                const matieres = student.matieres.flatMap(matiere => 
                  Object.entries(matiere)
                    .filter(([key]) => 
                      !key.startsWith("Heures -") && 
                      !key.startsWith("Crédits -") && 
                      !key.startsWith("Validation -") &&
                      !["Semestre", "Total des notes théoriques", "Moyenne théorique", "Total heures", "Total crédits"].includes(key)
                    )
                );

                const totals = {
                  totalNotes: student.matieres[0]?.["Total des notes théoriques"] || "",
                  totalHeures: student.matieres[0]?.["Total heures"] || "",
                  totalCredits: student.matieres[0]?.["Total crédits"] || "",
                  moyenne: student.matieres[0]?.["Moyenne théorique"] || ""
                };

                return (
                  <React.Fragment key={studentIndex}>
                    {matieres.map(([matiereNom, noteValue], index) => (
                      <tr key={`${student.matricule}-${index}`}>
                        {index === 0 && (
                          <>
                            <td rowSpan={matieres.length}>{student.matricule}</td>
                            <td rowSpan={matieres.length}>{student.nom}</td>
                            <td rowSpan={matieres.length}>{student.prenom}</td>
                            <td rowSpan={matieres.length}>{student.filiere}</td>
                            <td rowSpan={matieres.length}>{student.niveau}</td>
                            <td rowSpan={matieres.length}>{student.anneeUniv}</td>
                            <td rowSpan={matieres.length}>{student.semestre}</td>
                          </>
                        )}
                        <td>{matiereNom}</td>
                        <td>{noteValue}</td>
                        <td>{student.matieres[0][`Heures - ${matiereNom}`] || ""}</td>
                        <td>{student.matieres[0][`Crédits - ${matiereNom}`] || ""}</td>
                        <td>{student.matieres[0][`Validation - ${matiereNom}`] || ""}</td>
                        {index === 0 && (
                          <>
                            <td rowSpan={matieres.length}>{totals.totalNotes}</td>
                            <td rowSpan={matieres.length}>{totals.totalHeures}</td>
                            <td rowSpan={matieres.length}>{totals.totalCredits}</td>
                            <td rowSpan={matieres.length}>{totals.moyenne}</td>
                     
<td rowSpan={matieres.length}>
  <button
    className="btn-modern-edit"
    onClick={() => handleEdit(student)}
  >
    <FaEdit className="icon-edit" />

  </button>
</td>
                          </>
                        )}
                      </tr>
                    ))}
                    {studentIndex < array.length - 1 && (
                      <tr>
                        <td colSpan="17" className="separator-row"></td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
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
  );
}

export default NoteTable;