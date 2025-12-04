import React, { useState, useEffect } from "react";
import Navbar from "../Composants/Navbar";
import Sidebar from "../Composants/Sidebar";
import "../Styles/Finance.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Caisse() {
  const navigate = useNavigate();
  const handleVoirSortieClick = () => {
    navigate("/caissesortie");
  };

  // États des filtres
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [frais, setFrais] = useState([]);
  const [droits, setDroits] = useState([]);
  const [venteMateriel, setVenteMateriel] = useState([]);
  const [materiel, setMateriel] = useState([]);
  const [totalDroitEncaisse, setTotalDroitEncaisse] = useState(0);
  const [totalFraisEncaisse, setTotalFraisEncaisse] = useState(0);
  const [totalVenteEncaisse, setTotalVenteEncaisse] = useState(0);
  const [totalArgentSortant, setTotalArgentSortant] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/paiement/frais/all")
      .then((res) => setFrais(res.data));
    axios
      .get("http://localhost:5000/api/paiement/droit/all")
      .then((res) => setDroits(res.data));
    axios
      .get("http://localhost:5000/api/sortiemateriel/all")
      .then((res) => setVenteMateriel(res.data));
    axios
      .get("http://localhost:5000/api/materiel/all")
      .then((res) => setMateriel(res.data));
  }, []);

  useEffect(() => {
    const filterByDate = (data) => {
      return data.filter((item) => {
        const date = new Date(item.createdAt);
        return (
          (!selectedYear || date.getFullYear().toString() === selectedYear) &&
          (!selectedMonth ||
            (date.getMonth() + 1).toString().padStart(2, "0") ===
              selectedMonth) &&
          (!selectedDay || date.getDate().toString() === selectedDay)
        );
      });
    };

    const filteredFrais = filterByDate(frais);
    const filteredDroits = filterByDate(droits);
    const filteredVenteMateriel = filterByDate(venteMateriel);
    const filteredMateriel = filterByDate(materiel);

    // Calcul des entrées d'argent
    const totalDroitEncaisse = filteredDroits.reduce(
      (acc, d) => acc + parseFloat(d.montantPaye || 0),
      0
    );
    const totalFraisEncaisse = filteredFrais.reduce(
      (acc, f) => acc + parseFloat(f.montantPayer || 0),
      0
    );
    const totalVenteEncaisse = filteredVenteMateriel
      .filter((item) => item.natureSortie === "externe")
      .reduce((acc, item) => acc + parseFloat(item.prixTotal || 0), 0);

    // Calcul de l'argent sortant
    const totalArgentSortant = filteredMateriel.reduce(
      (acc, item) => acc + parseFloat(item.prixTotal || 0),
      0
    );

    setTotalDroitEncaisse(totalDroitEncaisse);
    setTotalFraisEncaisse(totalFraisEncaisse);
    setTotalVenteEncaisse(totalVenteEncaisse);
    setTotalArgentSortant(totalArgentSortant);
  }, [
    selectedMonth,
    selectedYear,
    selectedDay,
    droits,
    frais,
    venteMateriel,
    materiel,
  ]);

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
            <h4 className="fw-bold">Gestion de la Caisse</h4>
          </div>

          <div className="hr mt-2"></div>

          {/* Filtres */}
          <div className="filters-container mt-2">
            <div className="filter-card">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="">Tous les mois</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i} value={(i + 1).toString().padStart(2, "0")}>
                    {new Date(0, i).toLocaleString("fr", { month: "long" })}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-card">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <option value="">Toutes les années</option>
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
            <div className="filter-card">
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
              >
                <option value="">Tous les jours</option>
                {[...Array(31)].map((_, index) => (
                  <option key={index} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 📊 Statistiques Financières */}
          <div className="finance-stats-container mt-2">
            <div className="finance-stat-card">
              <h5 className="fw-bold">Argent Entrant</h5>
              <p>
                {totalDroitEncaisse + totalFraisEncaisse + totalVenteEncaisse}{" "}
                Ar
              </p>
            </div>
            <div className="finance-stat-card">
              <h5 className="fw-bold">Argent Sortant</h5>
              <p>{totalArgentSortant} Ar</p>
            </div>
          </div>

          {/* 📜 Entrées d'Argent */}
          <div className="finance-container mt-5">
            <div className="header-section">
              <h4 className="">Entrées d'Argent</h4>
              <button
                className="export-btn"
                title="Voir les dépenses"
                onClick={handleVoirSortieClick}
              >
                <i className="fas fa-file-export"></i> Voir les Sorties
              </button>
            </div>

            <div className="stats-container">
              <div className="stat-card">
                <h5
                  onClick={() => navigate("/classe")}
                  title="Voir les détails"
                >
                  Total Droit Encaissée
                </h5>
                <p>{totalDroitEncaisse} Ar</p>
              </div>
              <div className="stat-card">
                <h5 onClick={() => navigate("/frais")} title="Voir les détails">
                  Total Autres Frais Encaissée
                </h5>
                <p>{totalFraisEncaisse} Ar</p>
              </div>
              <div className="stat-card">
                <h5
                  onClick={() => navigate("/fourniture")}
                  title="Voir les détails"
                >
                  Total Somme Vente Encaissée
                </h5>
                <p>{totalVenteEncaisse} Ar</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Caisse;
