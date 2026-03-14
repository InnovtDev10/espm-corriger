import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Swal from "sweetalert2";
import "../Styles/Professeur.css";
import { RiPassValidLine } from "react-icons/ri";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaFilePdf } from "react-icons/fa";
import ReactApexChart from "react-apexcharts";

const ResultatTable = ({
  searchMatricule,
  niveau,
  semestre,
  filiere,
  moyenneTheorique,
  moyennePratique,
  moyenneMemoire,
  moyenneGenerale,
  anneeUniversitaire,
  status,
}) => {
  const url = import.meta.env.VITE_API_URL;
  const [notesTheoriques, setNotesTheoriques] = useState([]);
  const [notesPratiques, setNotesPratiques] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validatedStudents, setValidatedStudents] = useState([]);
  const [chartData, setChartData] = useState(null);

  const groupNotesByStudent = (notes) => {
    const grouped = {};
    notes.forEach((note) => {
      const key = `${note.matricule}-${note.filiere}-${note.niveau}-${note.anneeUniv}`;
      if (!grouped[key]) grouped[key] = { ...note, totalTheorique: 0 };
      grouped[key].totalTheorique += note.notes["Total des notes théoriques"] || 0;
    });
    return Object.values(grouped);
  };

  const prepareChartData = (theoriques, pratiques) => {
    const annees = [...new Set(theoriques.map(n => n.anneeUniv))].sort();
    const seriesData = { theorique: [], pratique: [], memoire: [], generale: [] };

    annees.forEach(annee => {
      const notesAnnee = theoriques.filter(n => n.anneeUniv === annee);
      let sumT = 0, sumP = 0, sumM = 0, sumG = 0, count = 0;

      notesAnnee.forEach(note => {
        const pratique = pratiques.find(p => p.matricule === note.matricule);
        let moyT = 0;
        if (note.filiere === "Sciences infirmières" || note.filiere === "Maieutique") {
          moyT = note.totalTheorique / 58;
        } else if (note.filiere === "Technicien de laboratoire") {
          moyT = note.totalTheorique / 32;
        }
        const moyP = pratique ? parseFloat(pratique.notes["MOYENNE PRATIQUES"]) || 0 : 0;
        const moyM = pratique ? parseFloat(pratique.notes["MOYENNE MEMOIRE"]) || 0 : 0;
        if (moyT > 0 && moyP > 0 && moyM > 0) {
          sumG += (moyT + moyP + moyM) / 3;
          count++;
        }
        sumT += moyT;
        sumP += moyP;
        sumM += moyM;
      });

      const avg = (sum, cnt = notesAnnee.length) => cnt > 0 ? sum / cnt : 0;
      seriesData.theorique.push(avg(sumT));
      seriesData.pratique.push(avg(sumP));
      seriesData.memoire.push(avg(sumM));
      seriesData.generale.push(avg(sumG, count));
    });

    setChartData({
      options: {
        chart: { type: "line", height: 350, zoom: { enabled: false } },
        stroke: { curve: "smooth", width: [3, 3, 3, 3] },
        markers: { size: 5 },
        xaxis: { categories: annees, title: { text: "Année Universitaire" } },
        yaxis: { title: { text: "Moyenne" }, min: 0, max: 20 },
        legend: { position: "top" },
        colors: ["#008FFB", "#00E396", "#FEB019", "#FF4560"],
      },
      series: [
        { name: "Moyenne Théorique", data: seriesData.theorique },
        { name: "Moyenne Pratique", data: seriesData.pratique },
        { name: "Moyenne Mémoire", data: seriesData.memoire },
        { name: "Moyenne Générale", data: seriesData.generale },
      ],
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [resTheo, resPrat] = await Promise.all([
          axios.get(`${url}/api/note/all`, {headers: {'Cache-Control': 'no-cache'}}),
          axios.get(`${url}/api/notestage/all`, {headers: {'Cache-Control': 'no-cache'}}),
        ]);
        const grouped = groupNotesByStudent(resTheo.data || []);
        setNotesTheoriques(grouped);
        setNotesPratiques(resPrat.data.data || []);
        prepareChartData(grouped, resPrat.data.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredNotes = notesTheoriques.filter((note) => {
    const notePratique = notesPratiques.find(n => n.matricule === note.matricule);
    let moyT = "-";
    if (note.filiere === "Sciences infirmières" || note.filiere === "Maieutique") {
      moyT = (note.totalTheorique / 58).toFixed(2);
    } else if (note.filiere === "Technicien de laboratoire") {
      moyT = (note.totalTheorique / 32).toFixed(2);
    }
    const moyP = notePratique ? parseFloat(notePratique.notes["MOYENNE PRATIQUES"]) || 0 : 0;
    const moyM = notePratique ? parseFloat(notePratique.notes["MOYENNE MEMOIRE"]) || 0 : 0;
    let moyG = "-";
    if (moyT !== "-" && moyP !== 0 && moyM !== 0) {
      moyG = ((parseFloat(moyT) + moyP + moyM) / 3).toFixed(2);
    }
    const statut = moyG !== "-" && parseFloat(moyG) >= 10 ? "Admis" : "Ajourné";

    return (
      (!searchMatricule || note.matricule.includes(searchMatricule)) &&
      (!niveau || note.niveau === niveau) &&
      (!semestre || note.anneeUniv === semestre) &&
      (!filiere || note.filiere === filiere) &&
      (!anneeUniversitaire || note.anneeUniv.includes(anneeUniversitaire)) &&
      (!moyenneTheorique || (moyT !== "-" && parseFloat(moyT) >= parseFloat(moyenneTheorique))) &&
      (!moyennePratique || moyP >= parseFloat(moyennePratique)) &&
      (!moyenneMemoire || moyM >= parseFloat(moyenneMemoire)) &&
      (!moyenneGenerale || (moyG !== "-" && parseFloat(moyG) >= parseFloat(moyenneGenerale))) &&
      (!status || statut === status)
    );
  });

  const getNextLevel = (currentLevel) => {
    const levels = ["L1", "L2", "L3","M1","M2"];
    const index = levels.indexOf(currentLevel);
    return index !== -1 && index < levels.length - 1 ? levels[index + 1] : currentLevel;
  };

  const updateLevel = async (matricule, currentLevel) => {
    const newLevel = getNextLevel(currentLevel);
    const confirmed = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: `Mettre à jour vers ${newLevel} ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Oui",
      cancelButtonText: "Non",
    });

    if (confirmed.isConfirmed) {
      try {
        await axios.put(`${url}/api/etudiant/update?matricule=${encodeURIComponent(matricule)}`, {
          niveau: newLevel,
        });
        Swal.fire("Succès", "Niveau mis à jour", "success");
        setValidatedStudents((prev) => [...prev, matricule]);
        setNotesTheoriques((prev) =>
          prev.map((note) => (note.matricule === matricule ? { ...note, niveau: newLevel } : note))
        );
      } catch (error) {
        Swal.fire("Erreur", "Échec de mise à jour", "error");
      }
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    doc.setFont("helvetica", "bold").setFontSize(16);
    const title = "Liste des Résultats des Étudiants";
    doc.text(title, (doc.internal.pageSize.width - doc.getTextWidth(title)) / 2, 15);

    autoTable(doc, {
      startY: 25,
      head: [[
        "Matricule", "Nom", "Prénom", "Filière", "Niveau",
        "Année Univ.", "Moy. Théorique", "Moy. Pratique", "Moy. Mémoire",
        "Moy. Générale", "Statut"
      ]],
      body: filteredNotes.map(note => {
        const p = notesPratiques.find(n => n.matricule === note.matricule);
        let moyT = "-";
        if (note.filiere === "Sciences infirmières" || note.filiere === "Maieutique") {
          moyT = (note.totalTheorique / 58).toFixed(2);
        } else if (note.filiere === "Technicien de laboratoire") {
          moyT = (note.totalTheorique / 32).toFixed(2);
        }
        const moyP = p ? parseFloat(p.notes["MOYENNE PRATIQUES"]) || 0 : 0;
        const moyM = p ? parseFloat(p.notes["MOYENNE MEMOIRE"]) || 0 : 0;
        let moyG = "-";
        if (moyT !== "-" && moyP !== 0 && moyM !== 0) {
          moyG = ((parseFloat(moyT) + moyP + moyM) / 3).toFixed(2);
        }
        const statut = moyG !== "-" && parseFloat(moyG) >= 10 ? "Admis" : "Ajourné";
        return [
          note.matricule, note.nom, note.prenom, note.filiere, note.niveau,
          note.anneeUniv, moyT, moyP, moyM, moyG, statut
        ];
      })
    });

    doc.save("resultats_etudiants.pdf");
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-danger">Erreur : {error}</p>;
  if (!filteredNotes.length) return <p className="text-warning">Aucun résultat trouvé.</p>;

  return (


<div className="professeur-table-container">
<div className="table-responsive">
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
  <table className="professeur-table">
    <thead>
      <tr>
        <th>Matricule</th>
        <th>Nom</th>
        <th>Prénom</th>
        <th>Filière</th>
        <th>Niveau</th>
        <th>Année Universitaire</th>
        <th>Moyenne Théorique</th>
        <th>Moyenne Pratique</th>
        <th>Moyenne Mémoire</th>
        <th>Moyenne Générale</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {filteredNotes.map((note) => {
        const notePratique = notesPratiques.find(
          (n) => n.matricule === note.matricule
        );
        let moyenneTheorique = "-";

        if (
          note.filiere === "Sciences infirmières" ||
          note.filiere === "Maieutique"
        ) {
          moyenneTheorique = (note.totalTheorique / 58).toFixed(2);
        } else if (
          note.filiere === "Technicien de laboratoire"
        ) {
          moyenneTheorique = (note.totalTheorique / 32).toFixed(2);
        }

        const moyennePratique = notePratique
          ? parseFloat(notePratique.notes["MOYENNE PRATIQUES"]) || 0
          : 0;
        const moyenneMemoire = notePratique
          ? parseFloat(notePratique.notes["MOYENNE MEMOIRE"]) || 0
          : 0;

        let moyenneGenerale = "-";
        if (
          moyenneTheorique !== "-" &&
          moyennePratique !== 0 &&
          moyenneMemoire !== 0
        ) {
          moyenneGenerale = (
            (parseFloat(moyenneTheorique) +
              moyennePratique +
              moyenneMemoire) /
            3
          ).toFixed(2);
        }

        return (
          <tr key={note.matricule}>
            <td>{note.matricule}</td>
            <td>{note.nom}</td>
            <td>{note.prenom}</td>
            <td>{note.filiere}</td>
            <td>{note.niveau}</td>
            <td>{note.anneeUniv}</td>
            <td>{moyenneTheorique}</td>
            <td>
              {notePratique
                ? notePratique.notes["MOYENNE PRATIQUES"] || "-"
                : "-"}
            </td>
            <td>
              {notePratique
                ? notePratique.notes["MOYENNE MEMOIRE"] || "-"
                : "-"}
            </td>
            <td>{moyenneGenerale}</td>
            <td>
              {moyenneGenerale !== "-" &&
              parseFloat(moyenneGenerale) >= 10
                ? "Admis"
                : "Ajourné"}
            </td>
            <td>
              {moyenneGenerale !== "-" &&
                parseFloat(moyenneGenerale) >= 10 &&
                !validatedStudents.includes(note.matricule) && (
                  <button
                    onClick={() =>
                      updateLevel(note.matricule, note.niveau)
                    }
                    className="btnEditNote"
                  >
                    <RiPassValidLine className="icon_valide" />
                  </button>
                )}
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>
<div className="row-count">
  Nombre total de résultats : <strong>{filteredNotes.length}</strong>
  {notesTheoriques.length > 0 && (
    <>
      {" "}
      (soit{" "}
      <strong>
        {((filteredNotes.length / notesTheoriques.length) * 100).toFixed(
          2
        )}
        %
      </strong>{" "}
      des étudiants)
    </>
  )}
</div>
{/* Ajout du graphique en dessous du tableau */}
{chartData && (
  <div className="ChartMoyenne">
    <div className="ChartMoyenne-header">
      <h4 className="ChartMoyenne-title">Évolution des Moyennes par Année Universitaire</h4>
      <p className="ChartMoyenne-subtitle">Analyse comparative des performances académiques</p>
    </div>
    
    <ReactApexChart 
      options={{
        ...chartData.options,
        chart: {
          ...chartData.options.chart,
          toolbar: {
            show: true,
            tools: {
              download: true,
              selection: true,
              zoom: true,
              zoomin: true,
              zoomout: true,
              pan: true,
              reset: true
            }
          },
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800
          }
        },
        tooltip: {
          y: {
            formatter: (value) => `${value.toFixed(2)}/20`
          }
        },
        stroke: {
          curve: 'smooth',
          width: [3, 3, 3, 4],
          dashArray: [0, 0, 0, 5]
        },
        markers: {
          size: 5,
          hover: {
            size: 7
          }
        }
      }}
      series={chartData.series}
      type="line"
      height={350}
    />
    
    <div className="ChartMoyenne-footer">
      <small>Données actualisées le {new Date().toLocaleDateString()}</small>
    </div>
  </div>
)}


</div>

    
   
    
  );
};

ResultatTable.propTypes = {
  searchMatricule: PropTypes.string,
  niveau: PropTypes.string,
  semestre: PropTypes.string,
  filiere: PropTypes.string,
  moyenneTheorique: PropTypes.string,
  moyennePratique: PropTypes.string,
  moyenneMemoire: PropTypes.string,
  moyenneGenerale: PropTypes.string,
  anneeUniversitaire: PropTypes.string,
  status: PropTypes.string,
};

export default ResultatTable;
