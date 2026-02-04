import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/Note.css";

function NotePratiqueTable({ matricule }) {
  const [noteData, setNoteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchNotes = async () => {
      if (matricule) {
        try {
          const response = await axios.get(
            `${url}/api/notestage/get/${matricule}`,
            {
              headers: {
                'Cache-Control': 'no-cache'
              }
            }
          );
          setNoteData(response.data.data);
        } catch (error) {
          console.error("Erreur lors de la récupération des notes:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchNotes();
  }, [matricule]);

  return (
    <div className="note-table-container">
      <div className="table-responsive">
        <table className="note-table">
          <thead>
            <tr>
              <th rowSpan="2">Matricule</th>
              <th rowSpan="2">Nom</th>
              <th rowSpan="2">Prénom</th>
              <th rowSpan="2">Filière</th>
              <th rowSpan="2">Niveau</th>
              <th rowSpan="2">Etablissement</th>
              <th rowSpan="2">Année</th>
              <th colSpan="2">Natures</th>
            </tr>
            <tr>
              <th>Evaluations</th>
              <th>Note/Rapport/Heure/Crédit</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="text-center">
                  Faites une recherche pour afficher les données
                </td>
              </tr>
            ) : noteData ? (
              <React.Fragment>
                {Object.entries(noteData.notes).map(([matiere, valeur], index) => (
                  <tr key={`${noteData.id}-${index}`}>
                    {index === 0 && (
                      <>
                        <td rowSpan={Object.keys(noteData.notes).length}>{noteData.matricule}</td>
                        <td rowSpan={Object.keys(noteData.notes).length}>{noteData.nom}</td>
                        <td rowSpan={Object.keys(noteData.notes).length}>{noteData.prenom}</td>
                        <td rowSpan={Object.keys(noteData.notes).length}>{noteData.filiere}</td>
                        <td rowSpan={Object.keys(noteData.notes).length}>{noteData.niveau}</td>
                        <td rowSpan={Object.keys(noteData.notes).length}>{noteData.etablissement}</td>
                        <td rowSpan={Object.keys(noteData.notes).length}>{noteData.anneeUniv}</td>
                      </>
                    )}
                    <td>{matiere}</td>
                    <td>{valeur}</td>
                  </tr>
                ))}
              </React.Fragment>
            ) : (
              <tr>
                <td colSpan="10" className="text-center">
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

export default NotePratiqueTable;