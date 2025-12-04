import React, { useState, useEffect } from "react";
import Navbar from "../Composants/Navbar";
import Sidebar from "../Composants/Sidebar";
import "../Styles/Finance.css";
import "chart.js/auto";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FaPlusCircle } from "react-icons/fa";
import { Modal, Button, Form } from "react-bootstrap";
import LineChartFinance from "../Composants/LineChartFinance";
import DonutChartFinance from "../Composants/DonutChartFinance";

function Charts() {
  const [totalMontantPaye, setTotalMontantPaye] = useState(0);
  const [totalMontantReste, setTotalMontantReste] = useState(0);
  const [totalMontantPayeDroit, setTotalMontantPayeDroit] = useState(0);
  const [totalMontantPayeFrais, setTotalMontantPayeFrais] = useState(0);
  const [totalMontantResteDroit, setTotalMontantResteDroit] = useState(0);
  const [totalMontantResteFrais, setTotalMontantResteFrais] = useState(0);
  const [totalVenteExterne, setTotalVenteExterne] = useState(0);
  const [totalEcolage, setTotalEcolage] = useState(0);
  const [frais, setFrais] = useState([]);
  const [droits, setDroits] = useState([]);
  const [venteMateriel, setVenteMateriel] = useState([]);
  const [ecolage, setEcolage] = useState([]);
  const [totalSalaires, setTotalSalaires] = useState(0);
  const [totalMateriel, setTotalMateriel] = useState(0);
  const [totalMontant, setTotalMontant] = useState(0);
  const [fournitures, setFournitures] = useState([]);
  const [filteredFournitures, setFilteredFournitures] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [autreDepenses, setAutreDepenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [montant, setMontant] = useState("");
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [historique, setHistorique] = useState([]);
  const [totalMontantImmo, setTotalMontantImmo] = useState(0);

  // Manipulation des filtres
  const handleMonthChange = (event) => setSelectedMonth(event.target.value);
  const handleYearChange = (event) => setSelectedYear(event.target.value);
  const handleDayChange = (event) => setSelectedDay(event.target.value);

  // Ouvrir le modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Fermer le modal
  const closeModal = () => {
    setIsModalOpen(false);
    setTitre("");
    setDescription("");
    setMontant("");
  };

  // Ouvrir/fermer le modal d'historique
  const openHistoryModal = () => setIsHistoryModalOpen(true);
  const closeHistoryModal = () => setIsHistoryModalOpen(false);

  useEffect(() => {
    // Fonction pour récupérer les données de l'API
    const fetchHistorique = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/immobilisation/tous"
        );
        setHistorique(response.data);

        // Calculer le montant total
        const total = response.data.reduce(
          (acc, depense) => acc + parseFloat(depense.montant),
          0
        );
        setTotalMontantImmo(total);
      } catch (error) {
        console.error("Erreur lors de la récupération de l'historique:", error);
      }
    };

    fetchHistorique();
  }, []);

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Créer un objet avec les données du formulaire
    const immobilisationData = {
      titre,
      description,
      montant,
    };

    try {
      // Effectuer la requête POST vers l'API
      const response = await axios.post(
        "http://localhost:5000/api/immobilisation/add",
        immobilisationData
      );

      // Alerte de succès si l'immobilisation est ajoutée avec succès
      Swal.fire({
        icon: "success",
        title: "Immobilisation ajoutée avec succès!",
        text: "Les informations de l'immobilisation ont été enregistrées.",
        confirmButtonText: "OK",
      });
      window.location.reload();

      // Fermer le modal après l'ajout
      closeModal();
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'immobilisation:", error);

      // Alerte d'erreur si l'ajout échoue
      Swal.fire({
        icon: "error",
        title: "Erreur lors de l'ajout",
        text: "Une erreur s'est produite lors de l'ajout de l'immobilisation. Veuillez réessayer.",
        confirmButtonText: "OK",
      });
    }
  };

  useEffect(() => {
    axios.get("http://localhost:5000/api/paiement/ecolage/all").then((res) => {
      setEcolage(res.data.data);
    });
  }, []);

  // Fetch la liste des paiements
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
  }, []);

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
      } catch (error) {
        console.error("Erreur de récupération des données:", error);
      }
    };

    fetchAutreDepenses();
  }, []);

  // Nouveau useEffect pour appliquer les filtres et calculer les totaux
  useEffect(() => {
    // Fonction pour filtrer les données par date
    const filterByDate = (data) => {
      return data.filter((item) => {
        const date = new Date(item.createdAt || item.date);
        return (
          (!selectedYear || date.getFullYear().toString() === selectedYear) &&
          (!selectedMonth ||
            (date.getMonth() + 1).toString().padStart(2, "0") ===
              selectedMonth) &&
          (!selectedDay || date.getDate().toString() === selectedDay)
        );
      });
    };

    // Appliquer les filtres à toutes les données
    const filteredDroits = filterByDate(droits);
    const filteredFrais = filterByDate(frais);
    const filteredVenteMateriel = filterByDate(venteMateriel);
    const filteredEcolage = filterByDate(ecolage);
    const filteredPaiements = filterByDate(paiements);
    const filteredFournitures = filterByDate(fournitures);
    const filteredAutreDepenses = filterByDate(autreDepenses);
    const filteredHistorique = filterByDate(historique);

    // Calcul des totaux pour les droits et frais
    const totalMontantPayeDroit = filteredDroits.reduce(
      (acc, d) => acc + parseFloat(d.montantPaye || 0),
      0
    );
    const totalMontantResteDroit = filteredDroits.reduce(
      (acc, d) => acc + parseFloat(d.montantReste || 0),
      0
    );
    const totalMontantPayeFrais = filteredFrais.reduce(
      (acc, f) => acc + parseFloat(f.montantPayer || 0),
      0
    );
    const totalMontantResteFrais = filteredFrais.reduce(
      (acc, f) => acc + parseFloat(f.montantReste || 0),
      0
    );
    const totalMontantPaye = totalMontantPayeDroit + totalMontantPayeFrais;
    const totalMontantReste = totalMontantResteDroit + totalMontantResteFrais;

    // Calcul du total des ventes externes
    const totalVenteExterne = filteredVenteMateriel
      .filter((item) => item.natureSortie === "externe")
      .reduce((acc, item) => acc + parseFloat(item.prixTotal || 0), 0);

    // Calcul du total des écolages
    const totalEcolage = filteredEcolage.reduce((acc, etudiant) => {
      const montantParMois = parseFloat(etudiant.montantParMois || 0);
      const moisEffectuerCount = etudiant.moisEffectuer
        ? etudiant.moisEffectuer.length
        : 0;
      return acc + montantParMois * moisEffectuerCount;
    }, 0);

    // Calcul des dépenses
    const totalSalaires = filteredPaiements.reduce(
      (acc, paiement) => acc + (parseFloat(paiement.montant) || 0),
      0
    );
    const totalMateriel = filteredFournitures.reduce(
      (acc, item) => acc + (parseFloat(item.prixTotal) || 0),
      0
    );
    const totalMontant = filteredAutreDepenses.reduce(
      (acc, depense) => acc + parseFloat(depense.montant || 0),
      0
    );
    const totalMontantImmo = filteredHistorique.reduce(
      (acc, depense) => acc + parseFloat(depense.montant || 0),
      0
    );

    // Mise à jour des états
    setTotalMontantPaye(totalMontantPaye);
    setTotalMontantReste(totalMontantReste);
    setTotalMontantPayeDroit(totalMontantPayeDroit);
    setTotalMontantPayeFrais(totalMontantPayeFrais);
    setTotalMontantResteDroit(totalMontantResteDroit);
    setTotalMontantResteFrais(totalMontantResteFrais);
    setTotalVenteExterne(totalVenteExterne);
    setTotalEcolage(totalEcolage);
    setTotalSalaires(totalSalaires);
    setTotalMateriel(totalMateriel);
    setTotalMontant(totalMontant);
    setTotalMontantImmo(totalMontantImmo);
  }, [
    selectedMonth,
    selectedYear,
    selectedDay,
    droits,
    frais,
    venteMateriel,
    ecolage,
    paiements,
    fournitures,
    autreDepenses,
    historique,
  ]);

  const filteredHistorique = historique.filter((item) => {
    const matchTitle = item.titre
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const itemDate = new Date(item.date);
    const itemYear = itemDate.getFullYear();
    const itemMonth = itemDate.getMonth() + 1;

    const matchDate = selectedDate ? item.date === selectedDate : true;
    const matchMonth = selectedMonth
      ? itemMonth === parseInt(selectedMonth)
      : true;
    const matchYear = selectedYear ? itemYear === parseInt(selectedYear) : true;

    return matchTitle && matchDate && matchMonth && matchYear;
  });

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

  const navigate = useNavigate();

  const handleVoirSortieClick = () => {
    navigate("/sortie");
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
            <h4 className="fw-bold">Tableau de bord Financier</h4>
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

          {/* 📊 Statistiques Financières */}
          <div className="finance-stats-container mt-2">
            <div
              className="finance-stat-card"
              title="Total des revenus générés avant toute déduction"
            >
              <h5 className="fw-bold">Solde en Caisse</h5>
              <p>
                {totalMontantPayeDroit +
                  totalMontantPayeFrais +
                  totalEcolage +
                  totalVenteExterne}{" "}
                Ar
              </p>
            </div>
            <div
              className="finance-stat-card"
              title="Somme de toutes les charges ou dépenses"
            >
              <h5 onClick={() => navigate("/sortie")} className="fw-bold">
                {" "}
                Dépense Totale
              </h5>
              <p>{totalSalaires + totalMateriel + totalMontant} Ar</p>
            </div>
            <div
              className="finance-stat-card"
              title="Recette brute moins les charges ou dépenses"
            >
              <h5 className="fw-bold">Bénéfice brute</h5>
              <p>
                {totalMontantPayeDroit +
                  totalMontantPayeFrais +
                  totalEcolage +
                  totalVenteExterne -
                  (totalSalaires + totalMateriel + totalMontant)}{" "}
                Ar
              </p>
            </div>
            <div className="finance-stat-card" title="Immobilisation">
              <div className="finance-stat-header d-flex justify-content-between align-items-center">
                <h5
                  className="fw-bold"
                  style={{ cursor: "pointer" }}
                  onClick={openHistoryModal}
                  title="Voir l'historique des immobilisations"
                >
                  Immobilisation
                </h5>
                <p>{totalMontantImmo} Ar</p>
                <FaPlusCircle
                  className="plus-icon"
                  style={{
                    cursor: "pointer",
                    fontSize: "24px",
                    color: "#007bff",
                  }}
                  onClick={openModal}
                  title="Ajouter Immobilisation"
                />
              </div>

              {/* Modal pour ajouter une immobilisation */}
              <Modal show={isModalOpen} onHide={closeModal} centered>
                <Modal.Header closeButton>
                  <Modal.Title>Ajouter Immobilisation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="titre">
                      <Form.Label>Titre</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Entrez le titre"
                        value={titre}
                        onChange={(e) => setTitre(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="description" className="mt-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Entrez la description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </Form.Group>
                    <Form.Group controlId="montant" className="mt-3">
                      <Form.Label>Montant(Ar)</Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Entrez le montant"
                        value={montant}
                        onChange={(e) => setMontant(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={closeModal}>
                    Annuler
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Ajouter
                  </Button>
                </Modal.Footer>
              </Modal>

              {/* Modal pour l'historique des immobilisations */}
              <Modal
                show={isHistoryModalOpen}
                onHide={closeHistoryModal}
                centered
                size="lg"
              >
                <Modal.Header closeButton>
                  <Modal.Title>Historique des Immobilisations</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {/* Filtres */}
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    <Form.Control
                      type="text"
                      placeholder="Rechercher par titre..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ maxWidth: "250px" }}
                    />
                    <Form.Control
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      style={{ maxWidth: "200px" }}
                    />
                    <Form.Select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      style={{ maxWidth: "150px" }}
                    >
                      <option value="">Mois</option>
                      <option value="1">Janvier</option>
                      <option value="2">Février</option>
                      <option value="3">Mars</option>
                      <option value="4">Avril</option>
                      <option value="5">Mai</option>
                      <option value="6">Juin</option>
                      <option value="7">Juillet</option>
                      <option value="8">Août</option>
                      <option value="9">Septembre</option>
                      <option value="10">Octobre</option>
                      <option value="11">Novembre</option>
                      <option value="12">Décembre</option>
                    </Form.Select>
                    <Form.Control
                      type="number"
                      placeholder="Année"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      style={{ maxWidth: "120px" }}
                    />
                  </div>

                  {/* Tableau avec défilement */}
                  <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Titre</th>
                          <th>Montant</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredHistorique.map((item) => (
                          <tr key={item.id}>
                            <td>{item.titre}</td>
                            <td>{item.montant} Ar</td>
                            <td>{formatDate(item.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={closeHistoryModal}>
                    Fermer
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>

          {/* 📜 Entrées d'Argent */}
          <div className="finance-container mt-5">
            <div className="charts-row">
              <div className="linechart-container">
                <LineChartFinance selectedYear={selectedYear} />
              </div>
              <div className="donutchart-container">
                <DonutChartFinance selectedYear={selectedYear} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer></footer>
    </>
  );
}

export default Charts;
