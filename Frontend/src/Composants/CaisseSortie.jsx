import React, { useState, useEffect } from "react";
import Navbar from "../Composants/Navbar";
import Sidebar from "../Composants/Sidebar";
import "../Styles/Finance.css";
import { useNavigate } from "react-router-dom"; // Utiliser une seule fois
import { FaPlusCircle } from "react-icons/fa"; // Pour l'icône du bouton
import Swal from "sweetalert2";

function CaisseSortie() {
  const [showModal, setShowModal] = useState(false);
  const [fraisAutres, setFraisAutres] = useState({
    nom: "",
    description: "",
    montant: "",
    modePaiement: "Cash",
  });

  const [moisFiltre, setMoisFiltre] = useState("");
  const [nomEtudiant, setNomEtudiant] = useState("");
  const [totalMontantPaye, setTotalMontantPaye] = useState(0);
  const [totalMontantReste, setTotalMontantReste] = useState(0);
  const [totalSalaires, setTotalSalaires] = useState(0);
  const [totalMateriel, setTotalMateriel] = useState(0);
  const [totalMontant, setTotalMontant] = useState(0);
  const [fournitures, setFournitures] = useState([]);
  const [filteredFournitures, setFilteredFournitures] = useState([]);
  const [frais, setFrais] = useState([]);
  const [droits, setDroits] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [filteredPaiements, setFilteredPaiements] = useState([]);
  const [autreDepenses, setAutreDepenses] = useState([]);
  const [filteredAutreDepenses, setFilteredAutreDepenses] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [historyMonth, setHistoryMonth] = useState("");
  const [historyYear, setHistoryYear] = useState("");
  const [historyDay, setHistoryDay] = useState("");

  const navigate = useNavigate(); // Initialisation de navigate

  // Manipulation des filtres
  const handleMonthChange = (event) => setSelectedMonth(event.target.value);
  const handleYearChange = (event) => setSelectedYear(event.target.value);
  const handleDayChange = (event) => setSelectedDay(event.target.value);
  const handleHistoryMonthChange = (event) =>
    setHistoryMonth(event.target.value);
  const handleHistoryYearChange = (event) => setHistoryYear(event.target.value);
  const handleHistoryDayChange = (event) => setHistoryDay(event.target.value);

  // Fonction pour filtrer les données par date
  const filterByDate = (data, year, month, day) => {
    return data.filter((item) => {
      const date = new Date(item.createdAt);
      return (
        (!year || date.getFullYear().toString() === year) &&
        (!month ||
          (date.getMonth() + 1).toString().padStart(2, "0") === month) &&
        (!day || date.getDate().toString() === day)
      );
    });
  };

  useEffect(() => {
    const totalMontantPayeDroit = droits.reduce(
      (acc, d) => acc + parseFloat(d.montantPaye || 0),
      0
    );
    const totalMontantResteDroit = droits.reduce(
      (acc, d) => acc + parseFloat(d.montantReste || 0),
      0
    );
    const totalMontantPayeFrais = frais.reduce(
      (acc, f) => acc + parseFloat(f.montantPayer || 0),
      0
    );
    const totalMontantResteFrais = frais.reduce(
      (acc, f) => acc + parseFloat(f.montantReste || 0),
      0
    );
    const totalMontantPaye = totalMontantPayeDroit + totalMontantPayeFrais;
    const totalMontantReste = totalMontantResteDroit + totalMontantResteFrais;

    setTotalMontantPaye(totalMontantPaye);
    setTotalMontantReste(totalMontantReste);
  }, [droits, frais]);

  // Appliquer les filtres aux données
  useEffect(() => {
    // Filtrer les paiements (salaires)
    const filtered = filterByDate(paiements);
    setFilteredPaiements(filtered);
    const totalSalairesCalculé = filtered.reduce(
      (acc, paiement) => acc + (parseFloat(paiement.montant) || 0),
      0
    );
    setTotalSalaires(totalSalairesCalculé);

    // Filtrer les fournitures (matériel)
    const filteredMateriel = filterByDate(fournitures);
    setFilteredFournitures(filteredMateriel);
    const totalMaterielCalculé = filteredMateriel.reduce(
      (acc, item) => acc + (parseFloat(item.prixTotal) || 0),
      0
    );
    setTotalMateriel(totalMaterielCalculé);

    // Filtrer les autres dépenses
    const filteredDepenses = filterByDate(autreDepenses);
    setFilteredAutreDepenses(filteredDepenses);
    const totalAutreDepenses = filteredDepenses.reduce(
      (acc, depense) => acc + parseFloat(depense.montant || 0),
      0
    );
    setTotalMontant(totalAutreDepenses);
  }, [
    selectedMonth,
    selectedYear,
    selectedDay,
    paiements,
    fournitures,
    autreDepenses,
  ]);

  // Nouveau useEffect pour filtrer le tableau d'historique
  useEffect(() => {
    const filteredHistory = filterByDate(
      autreDepenses,
      historyYear,
      historyMonth,
      historyDay
    );
    setFilteredAutreDepenses(filteredHistory);
  }, [historyMonth, historyYear, historyDay, autreDepenses]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFraisAutres((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/autre-depenses/add",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(fraisAutres),
        }
      );

      if (!response.ok) throw new Error("Erreur lors de l'ajout des frais");

      Swal.fire({
        icon: "success",
        title: "Succès",
        text: "Dépense enregistrée avec succès",
        timer: 2000,
        showConfirmButton: false,
      });

      toggleModal();
      window.location.reload();
    } catch (err) {
      console.error("Erreur:", err);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur est survenue lors de l'enregistrement",
      });
    }
  };

  const handleVoirSortieClick = () => {
    navigate("/financegenerale");
  };

  useEffect(() => {
    const fetchPaiements = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/paiement/salaire/all"
        );
        if (!response.ok)
          throw new Error("Erreur lors de la récupération des paiements");
        const data = await response.json();
        setPaiements(data);

        const totalSalairesCalculé = data.reduce(
          (acc, paiement) => acc + (parseFloat(paiement.montant) || 0),
          0
        );
        setTotalSalaires(totalSalairesCalculé);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchPaiements();
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/materiel/all")
      .then((response) => response.json())
      .then((data) => {
        const fetchedMateriel = Array.isArray(data) ? data : [];
        setFournitures(fetchedMateriel);
        setFilteredFournitures(fetchedMateriel);

        const totalMaterielCalculé = fetchedMateriel.reduce(
          (acc, item) => acc + (parseFloat(item.prixTotal) || 0),
          0
        );
        setTotalMateriel(totalMaterielCalculé);
      })
      .catch((error) => console.error("Erreur lors du fetch :", error));
  }, []);

  // Utilisation de useEffect pour récupérer les données à partir de l'API
  useEffect(() => {
    const fetchAutreDepenses = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/autre-depenses/all"
        );
        const data = await response.json();

        // Si des données sont récupérées, mettre à jour l'état
        setAutreDepenses(data);

        // Calculer le montant total
        const total = data.reduce(
          (acc, depense) => acc + parseFloat(depense.montant),
          0
        );
        setTotalMontant(total);
      } catch (error) {
        console.error("Erreur de récupération des données:", error);
      }
    };

    fetchAutreDepenses();
  }, []);

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
            <h4 className="fw-bold">Sorties d'Argent</h4>
            <button className="export-btn" onClick={() => navigate(-1)}>
              <i className="fas fa-file-export"></i> Retour
            </button>
          </div>

          <div className="hr mt-2"></div>
          <div className="filters-container mt-2">
            <div className="filter-card">
              <select
                id="month"
                value={selectedMonth}
                onChange={handleMonthChange}
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
                id="year"
                value={selectedYear}
                onChange={handleYearChange}
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

            <div className="filter-card">
              <select id="day" value={selectedDay} onChange={handleDayChange}>
                <option value="">Jours</option>
                {[...Array(31)].map((_, index) => (
                  <option key={index} value={index + 1}>
                    {index + 1}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="finance-stats-container mt-4">
            <div
              className="finance-stat-card"
              title="Salaire des professeurs et des autres personnelles"
            >
              <h5 onClick={() => navigate("/paie")} title="Voir les détails">
                Salaires des personnels
              </h5>
              <p>{totalSalaires.toLocaleString()} Ar</p>
            </div>
            <div
              className="finance-stat-card"
              title="Coût total des achats de fourniture et Matériaux"
            >
              <h5
                onClick={() => navigate("/fourniture")}
                title="Voir les détails"
              >
                Achat matériel{" "}
              </h5>
              <p>{totalMateriel.toLocaleString()} Ar</p>
            </div>

            <div
              className="finance-stat-card-autre"
              title="Autres dépenses non mentionnées"
            >
              <div className="finance-stat-header">
                <h5>Autres</h5>
                <FaPlusCircle
                  className="plus-icon"
                  onClick={toggleModal}
                  title="Ajouter un dépense non mentionnées"
                />
              </div>
              <p>{totalMontant} Ar</p>
            </div>

            <div
              className="finance-stat-card"
              title="Montant total des dépenses cumulés"
            >
              <h5>Total des Dépenses</h5>
              <p>{totalSalaires + totalMateriel + totalMontant} Ar</p>
            </div>
          </div>

          <div className="autredepenses mt-5">
            <h5 className=" mt-4">Historique des autres dépenses</h5>
            <div className="filters-container mt-2">
              <div className="filter-card">
                <select
                  id="month"
                  value={historyMonth}
                  onChange={handleHistoryMonthChange}
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
                  id="year"
                  value={historyYear}
                  onChange={handleHistoryYearChange}
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

              <div className="filter-card">
                <select
                  id="day"
                  value={historyDay}
                  onChange={handleHistoryDayChange}
                >
                  <option value="">Jours</option>
                  {[...Array(31)].map((_, index) => (
                    <option key={index} value={index + 1}>
                      {index + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <table className="table2 mt-4">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Description</th>
                  <th>Montant</th>
                  <th>Mode Paiement</th>
                  <th>Date du paiement</th>
                </tr>
              </thead>
              <tbody>
                {filteredAutreDepenses.map((depense, index) => (
                  <tr key={index}>
                    <td>{depense.nom}</td>
                    <td>{depense.description}</td>
                    <td>{depense.montant.toLocaleString()} Ar</td>
                    <td>{depense.modePaiement}</td>
                    <td>{formatDate(depense.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {showModal && (
        <div className="modal-frais-overlay">
          <div className="modal-frais-content">
            <button className="btn-fermer-modal" onClick={toggleModal}>
              ×
            </button>
            <h2>Paiement Autres Dépenses</h2>
            <label>Titre</label>
            <input
              type="text"
              name="nom"
              value={fraisAutres.nom}
              onChange={handleChange}
              placeholder="Titre du dépense"
            />
            <label>Description :</label>
            <input
              type="text"
              name="description"
              value={fraisAutres.description}
              onChange={handleChange}
              placeholder="Déscription"
            />
            <label>Montant :</label>
            <input
              type="number"
              name="montant"
              value={fraisAutres.montant}
              onChange={handleChange}
              placeholder="Montant en Ar"
            />
            <label>Mode de paiement :</label>
            <select
              name="modePaiement"
              value={fraisAutres.modePaiement}
              onChange={handleChange}
            >
              <option value="Cash">Cash</option>
              <option value="Virement">Virement</option>
              <option value="Mobile Money">Mobile Money</option>
            </select>
            <div className="modal-frais-buttons">
              <button className="btn-valider" onClick={handleSubmit}>
                Valider
              </button>
              <button className="btn-annuler" onClick={toggleModal}>
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CaisseSortie;
