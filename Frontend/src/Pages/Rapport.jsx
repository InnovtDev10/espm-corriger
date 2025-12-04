import React, { useState, useEffect } from "react";
import Navbar from "../Composants/Navbar";
import Sidebar from "../Composants/Sidebar";
import "../Styles/Finance.css";
import "chart.js/auto";
import axios from "axios";

function RapportGenerale() {
  const [students, setStudents] = useState([]);
  const [stages, setStages] = useState([]);
  const [selectedMonthPointage, setSelectedMonthPointage] = useState("");
  const [selectedYearPointage, setSelectedYearPointage] = useState("");
  const [selectedMonthStage, setSelectedMonthStage] = useState("");
  const [selectedYearStage, setSelectedYearStage] = useState("");
  const [selectedNiveauPointage, setSelectedNiveauPointage] = useState("");
  const [selectedNiveauStage, setSelectedNiveauStage] = useState("");
  const [selectedRaison, setSelectedRaison] = useState("");
  const [selectedNiveauPaiement, setSelectedNiveauPaiement] = useState("");
  const [selectedMonthPaiement, setSelectedMonthPaiement] = useState("");
  const [selectedYearPaiement, setSelectedYearPaiement] = useState("");
  const [filterStatut, setFilterStatut] = useState("");
  const [paiements, setPaiements] = useState([]);
  const [pointage, setPointage] = useState([]);
  const [filteredPointage, setFilteredPointage] = useState([]); // Données filtrées
  const [filteredStages, setFilteredStages] = useState([]);
  const [filteredPaiements, setFilteredPaiements] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/pointage/etudiant/all").then((res) => {
      setPointage(res.data);
      setFilteredPointage(res.data);
    });
    axios
      .get("http://localhost:5000/api/etudiant/tous")
      .then((res) => setStudents(res.data));
    axios
      .get("http://localhost:5000/api/stage/all")
      .then((res) => setStages(res.data));
  }, []);

  // Fonction pour calculer le nombre d'étudiants par filière
  // Update the calculateTotalStudents function to consider the selected level
  const calculateTotalStudents = (filiere) => {
    let filteredStudents = students.filter(
      (student) => student.filiere === filiere
    );

    // Filter by niveau if selected for pointage
    if (selectedNiveauPointage) {
      filteredStudents = filteredStudents.filter(
        (student) => student.niveau === selectedNiveauPointage
      );
    }

    return filteredStudents.length;
  };

  // Create separate functions for each report section
  const calculateTotalStudentsForPointage = (filiere) => {
    let filteredStudents = students.filter(
      (student) => student.filiere === filiere
    );
    if (selectedNiveauPointage) {
      filteredStudents = filteredStudents.filter(
        (student) => student.niveau === selectedNiveauPointage
      );
    }
    return filteredStudents.length;
  };

  const calculateTotalStudentsForPaiement = (filiere) => {
    let filteredStudents = students.filter(
      (student) => student.filiere === filiere
    );
    if (selectedNiveauPaiement) {
      filteredStudents = filteredStudents.filter(
        (student) => student.niveau === selectedNiveauPaiement
      );
    }
    return filteredStudents.length;
  };

  const calculateTotalStudentsForStage = (filiere) => {
    let filteredStudents = students.filter(
      (student) => student.filiere === filiere
    );
    if (selectedNiveauStage) {
      filteredStudents = filteredStudents.filter(
        (student) => student.niveau === selectedNiveauStage
      );
    }
    return filteredStudents.length;
  };

  // Fonction pour calculer le nombre d'absences ou retards par type de formation
  const calculateAbsenceAndRetard = (filiere) => {
    return filteredPointage.filter((item) => item.filiere === filiere).length;
  };

  const filterData = () => {
    let filteredData = pointage;

    // Filtrage pour Absence & Retard
    if (selectedMonthPointage || selectedYearPointage) {
      filteredData = filteredData.filter((item) => {
        const date = new Date(item.createdAt);
        const itemMonth = String(date.getMonth() + 1).padStart(2, "0");
        const itemYear = String(date.getFullYear());

        // Filtrage par mois et année
        const matchesMonth = selectedMonthPointage
          ? itemMonth === selectedMonthPointage
          : true;
        const matchesYear = selectedYearPointage
          ? itemYear === selectedYearPointage
          : true;

        return matchesMonth && matchesYear;
      });
    }

    if (selectedNiveauPointage) {
      filteredData = filteredData.filter(
        (item) => item.niveau === selectedNiveauPointage
      );
    }

    if (selectedRaison) {
      filteredData = filteredData.filter(
        (item) => item.raison === selectedRaison
      );
    }

    setFilteredPointage(filteredData);
    filterStages(filteredData); // Appeler la fonction de filtrage des stages après
  };

  const filterStages = (filteredData) => {
    let filteredStages = stages;

    // Filtrage pour le Suivi de stage
    if (selectedMonthStage || selectedYearStage) {
      filteredStages = filteredStages.filter((stage) => {
        if (stage.dateDebut && stage.dateFin) {
          const startDate = new Date(stage.dateDebut);
          const endDate = new Date(stage.dateFin);

          const itemMonth = String(selectedMonthStage).padStart(2, "0");
          const itemYear = String(selectedYearStage);

          const startMonth = String(startDate.getMonth() + 1).padStart(2, "0");
          const startYear = String(startDate.getFullYear());

          const endMonth = String(endDate.getMonth() + 1).padStart(2, "0");
          const endYear = String(endDate.getFullYear());

          const isInDateRange =
            (itemYear > startYear ||
              (itemYear === startYear && itemMonth >= startMonth)) &&
            (itemYear < endYear ||
              (itemYear === endYear && itemMonth <= endMonth));

          return isInDateRange;
        }
        return false;
      });
    }

    if (selectedNiveauStage) {
      filteredStages = filteredStages.filter(
        (stage) => stage.niveau === selectedNiveauStage
      );
    }

    setFilteredStages(filteredStages);
  };

  useEffect(() => {
    filterData(); // Re-filtrer les données chaque fois qu'un filtre change
  }, [
    selectedMonthPointage,
    selectedYearPointage,
    selectedMonthStage,
    selectedYearStage,
    selectedNiveauPointage,
    selectedNiveauStage,
    selectedRaison,
  ]);

  useEffect(() => {
    const fetchPaiements = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/paiement/ecolage/all"
        );
        setPaiements(response.data.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des paiements :", error);
      }
    };

    fetchPaiements();
  }, []);

  // Fonction pour filtrer les paiements selon les critères
  useEffect(() => {
    const monthMap = {
      Janvier: "01",
      Février: "02",
      Mars: "03",
      Avril: "04",
      Mai: "05",
      Juin: "06",
      Juillet: "07",
      Août: "08",
      Septembre: "09",
      Octobre: "10",
      Novembre: "11",
      Décembre: "12",
    };

    const filtered = paiements.filter((paiement) => {
      // Filtrage par niveau
      const niveauMatch = selectedNiveauPaiement
        ? paiement.niveau === selectedNiveauPaiement
        : true;

      // Filtrage par année universitaire
      const anneeMatch = selectedYearPaiement
        ? paiement.anneeUniv ===
          `${parseInt(selectedYearPaiement) - 1}-${selectedYearPaiement}`
        : true;

      // Filtrage par mois et statut
      let moisMatch = true;

      if (filterStatut) {
        const mois =
          filterStatut === "Effectuer"
            ? paiement.moisEffectuer ?? []
            : paiement.moisRestant ?? [];

        const moisNumeriques = mois.map((m) => monthMap[m]);

        // Si un mois est sélectionné, vérifier qu'il est inclus
        moisMatch = selectedMonthPaiement
          ? moisNumeriques.includes(selectedMonthPaiement)
          : moisNumeriques.length > 0; // Si aucun mois sélectionné, accepter tous les paiements ayant ce statut
      }

      // Retourner vrai si tous les critères correspondent
      return niveauMatch && moisMatch && anneeMatch;
    });

    // Mettre à jour les paiements filtrés dans l'état
    setFilteredPaiements(filtered);
  }, [
    paiements,
    selectedNiveauPaiement,
    selectedMonthPaiement,
    selectedYearPaiement,
    filterStatut,
  ]);

  const calculateMontantTotal = (filiere) => {
    return filteredPaiements
      .filter((paiement) => paiement.filiere === filiere)
      .reduce((total, paiement) => {
        const montant = parseFloat(paiement.montantParMois || 0);
        return total + montant;
      }, 0);
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
          <div className="header-section">
            <h4 className="fw-bold">Rapport Générale</h4>
          </div>
          {/* 📊 Section d'absence et de retard */}
          <div className="hr mt-2"></div>
          <div className="filters-container mt-2 mb-2">
            <div className="filter-card">
              <select
                value={selectedRaison}
                onChange={(e) => setSelectedRaison(e.target.value)}
              >
                <option value="">Absence ou Retard?</option>
                <option value="Retard">Retard</option>
                <option value="Absence">Absence</option>
              </select>
            </div>
            <div className="filter-card">
              <select
                value={selectedNiveauPointage}
                onChange={(e) => setSelectedNiveauPointage(e.target.value)}
              >
                <option value="">Tous les niveaux</option>
                <option value="L1">L1</option>
                <option value="L2">L2</option>
                <option value="L3">L3</option>
                <option value="M1">M1</option>
            <option value="M2">M2</option>
              </select>
            </div>
            <div className="filter-card">
              <select
                value={selectedMonthPointage}
                onChange={(e) => setSelectedMonthPointage(e.target.value)}
              >
                <option value="">Tous les mois</option>
                <option value="01">Janvier</option>
                <option value="02">Février</option>
                <option value="03">Mars</option>
                <option value="04">Avril</option>
                <option value="05">Mai</option>
                <option value="06">Juin</option>
                <option value="07">Juillet</option>
                <option value="08">Août</option>
                <option value="09">Septembre</option>
                <option value="10">Octobre</option>
                <option value="11">Novembre</option>
                <option value="12">Décembre</option>
              </select>
            </div>
            <div className="filter-card">
              <select
                value={selectedYearPointage}
                onChange={(e) => setSelectedYearPointage(e.target.value)}
              >
                <option value="">Tous les Années</option>
                {Array.from({ length: 10 }, (_, i) => {
                  const currentYear = new Date().getFullYear();
                  return (
                    <option key={i} value={currentYear + i}>
                      {currentYear + i}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          {/* 📊 Rapport d'absence et de retard */}
          <div className="finance-stats-container mt-0 p-4  ">
            <h5> Absence & Retard</h5>
            <div className="finance-rapport-card">
              <h5 className="fw-bold">Gestion</h5>
              <p>
                {calculateAbsenceAndRetard("Gestion")}/
                {calculateTotalStudentsForPointage("Gestion")}
              </p>
            </div>
            <div className="finance-rapport-card">
              <h5 className="fw-bold"> Commerce</h5>
              <p>
                {calculateAbsenceAndRetard("Commerce")}/
                {calculateTotalStudentsForPointage("Commerce")}
              </p>
            </div>
            <div className="finance-rapport-card">
              <h5 className="fw-bold">Tourisme</h5>
              <p>
                {calculateAbsenceAndRetard(
                  "Tourisme"
                )}
                /
                {calculateTotalStudentsForPointage(
                  "Tourisme"
                )}
              </p>
            </div>
          </div>

          {/* 📊 Section rapport de suivi ecolage et montant */}
          <div className="hr mt-2"></div>
          <div className="filters-container mt-2 mb-2   ">
            <div className="filter-card">
              <select
                value={selectedNiveauPaiement}
                onChange={(e) => setSelectedNiveauPaiement(e.target.value)}
              >
                <option value="">Tous les niveaux</option>
                <option value="L1">L1</option>
                <option value="L2">L2</option>
                <option value="L3">L3</option>
                <option value="M1">M1</option>
            <option value="M2">M2</option>
              </select>
            </div>
            <div className="filter-card">
              <select
                value={filterStatut}
                onChange={(e) => setFilterStatut(e.target.value)}
              >
                <option value="">Statut</option>
                <option value="Effectuer">Effectuer</option>
                <option value="Non Effectuer">Non Effectuer</option>
              </select>
            </div>
            <div className="filter-card">
              <select
                value={selectedMonthPaiement}
                onChange={(e) => setSelectedMonthPaiement(e.target.value)}
                disabled={!filterStatut}
              >
                <option value="">Tous les mois</option>
                <option value="01">Janvier</option>
                <option value="02">Février</option>
                <option value="03">Mars</option>
                <option value="04">Avril</option>
                <option value="05">Mai</option>
                <option value="06">Juin</option>
                <option value="07">Juillet</option>
                <option value="08">Août</option>
                <option value="09">Septembre</option>
                <option value="10">Octobre</option>
                <option value="11">Novembre</option>
                <option value="12">Décembre</option>
              </select>
            </div>
            <div className="filter-card">
              <select
                value={selectedYearPaiement}
                onChange={(e) => setSelectedYearPaiement(e.target.value)}
              >
                <option value="">Tous les Années</option>
                {Array.from({ length: 10 }, (_, i) => {
                  const currentYear = new Date().getFullYear();
                  return (
                    <option key={i} value={currentYear + i}>
                      {currentYear + i}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          {/* 📊 Affichage rapport de suivi ecolage et montant */}
          <div className="finance-stats-container mt-0 p-4">
            <h5>Suivi Ecolage</h5>
            <div className="finance-rapport-card">
              <h5 className="fw-bold">Gestion</h5>
              <p>
                {
                  filteredPaiements.filter(
                    (paiement) => paiement.filiere === "Gestion"
                  ).length
                }
                /{calculateTotalStudentsForPaiement("Gestion")}
              </p>
            </div>
            <div className="finance-rapport-card">
              <h5 className="fw-bold"> Commerce</h5>
              <p>
                {
                  filteredPaiements.filter(
                    (paiement) => paiement.filiere === "Commerce"
                  ).length
                }
                /{calculateTotalStudentsForPaiement("Commerce")}
              </p>
            </div>
            <div className="finance-rapport-card">
              <h5 className="fw-bold">Tourisme</h5>
              <p>
                {
                  filteredPaiements.filter(
                    (paiement) =>
                      paiement.filiere === "Tourisme"
                  ).length
                }
                /
                {calculateTotalStudentsForPaiement(
                  "Tourisme"
                )}
              </p>
            </div>
          </div>
          <div className="finance-stats-container mt-0 p-4">
            <h5>Montant Total</h5>
            <div className="finance-rapport-card">
              <h5 className="fw-bold">Gestion</h5>
              <p>
                {calculateMontantTotal(
                  "Gestion"
                ).toLocaleString()}{" "}
                Ar
              </p>
            </div>
            <div className="finance-rapport-card">
              <h5 className="fw-bold"> Commerce</h5>
              <p>{calculateMontantTotal("Commerce").toLocaleString()} Ar</p>
            </div>
            <div className="finance-rapport-card">
              <h5 className="fw-bold">Tourisme</h5>
              <p>
                {calculateMontantTotal(
                  "Tourisme"
                ).toLocaleString()}{" "}
                Ar
              </p>
            </div>
          </div>

          {/* 📊 Section rapport suivi de stage */}
          <div className="hr mt-2"></div>
          <div className="filters-container mt-2 mb-2   ">
            <div className="filter-card">
              <select
                value={selectedNiveauStage}
                onChange={(e) => setSelectedNiveauStage(e.target.value)}
              >
                <option value="">Tous les niveaux</option>
                <option value="L1">L1</option>
                <option value="L2">L2</option>
                <option value="L3">L3</option>
                <option value="M1">M1</option>
            <option value="M2">M2</option>
              </select>
            </div>
            <div className="filter-card">
              <select
                value={selectedMonthStage}
                onChange={(e) => setSelectedMonthStage(e.target.value)}
              >
                <option value="">Tous les mois</option>
                <option value="01">Janvier</option>
                <option value="02">Février</option>
                <option value="03">Mars</option>
                <option value="04">Avril</option>
                <option value="05">Mai</option>
                <option value="06">Juin</option>
                <option value="07">Juillet</option>
                <option value="08">Août</option>
                <option value="09">Septembre</option>
                <option value="10">Octobre</option>
                <option value="11">Novembre</option>
                <option value="12">Décembre</option>
              </select>
            </div>
            <div className="filter-card">
              <select
                value={selectedYearStage}
                onChange={(e) => setSelectedYearStage(e.target.value)}
              >
                <option value="">Tous les Années</option>
                {Array.from({ length: 10 }, (_, i) => {
                  const currentYear = new Date().getFullYear();
                  return (
                    <option key={i} value={currentYear + i}>
                      {currentYear + i}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          {/* 📊 Affichage rapport suivi de stage */}
          <div className="finance-stats-container mt-0 p-4">
            <h5>Suivi de stage</h5>
            <div className="finance-rapport-card">
              <h5 className="fw-bold">Gestion</h5>
              <p>
                {
                  filteredStages.filter(
                    (stage) => stage.filiere === "Gestion"
                  ).length
                }
                /{calculateTotalStudentsForStage("Gestion")}
              </p>
            </div>
            <div className="finance-rapport-card">
              <h5 className="fw-bold"> Commerce</h5>
              <p>
                {
                  filteredStages.filter(
                    (stage) => stage.filiere === "Commerce"
                  ).length
                }
                /{calculateTotalStudentsForStage("Commerce")}
              </p>
            </div>
            <div className="finance-rapport-card">
              <h5 className="fw-bold">Tourisme</h5>
              <p>
                {
                  filteredStages.filter(
                    (stage) =>
                      stage.filiere === "Tourisme"
                  ).length
                }
                /
                {calculateTotalStudentsForStage(
                  "Tourisme"
                )}
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer></footer>
    </>
  );
}

export default RapportGenerale;
