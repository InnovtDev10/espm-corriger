import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Styles/Note.css";
import Swal from "sweetalert2";
import axios from "axios";
import jsPDF from "jspdf";
import Logo from "../assets/SARY.jpeg";

function FournitureTable() {
  const [fournitures, setFournitures] = useState([]);
  const [filteredFournitures, setFilteredFournitures] = useState([]);
  const [selectedFourniture, setSelectedFourniture] = useState(null);
  const [natureSortie, setNatureSortie] = useState("interne");
  const [quantite, setQuantite] = useState("");
  const [prixUnitaire, setPrixUnitaire] = useState("");
  const [nomPersonne, setNomPersonne] = useState("");
  const [prixTotal, setPrixTotal] = useState("");
  const [designation, setDesignation] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // Ajout d'une nouvelle variable d'état pour gérer le clignotement
  const [blinkingRows, setBlinkingRows] = useState([]);
  const url = import.meta.env.VITE_API_URL;
  
  useEffect(() => {
    const interval = setInterval(() => {
      setBlinkingRows((prev) => {
        const lowStockItems = filteredFournitures
          .filter((f) => f.quantiteReste <= 5)
          .map((f) => f.id);

        return prev.length === 0 ? lowStockItems : [];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [filteredFournitures]);

  useEffect(() => {
    fetch(`${url}/api/materiel/all`, {
      cache: 'no-store'
    })
      .then((response) => response.json())
      .then((data) => {
        const fetchedFournitures = Array.isArray(data) ? data : [];
        setFournitures(fetchedFournitures);
        setFilteredFournitures(fetchedFournitures);

        // Ajouter une logique pour détecter les fournitures avec quantité inférieure à 5
        const lowStockItems = fetchedFournitures.filter(
          (f) => f.quantiteReste < 5
        );
        setBlinkingRows(lowStockItems.map((f) => f.id)); // Gérer le clignotement sur les éléments avec stock faible
      })
      .catch((error) => console.error("Erreur lors du fetch :", error));
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = fournitures.filter((fourniture) =>
      ["designation", "quantite", "quantiteReste", "prixUnitaire"].some((key) =>
        String(fourniture[key]).toLowerCase().includes(value)
      )
    );
    setFilteredFournitures(filtered);
  };

  const handleOpenModal = (fourniture) => {
    if (fourniture.quantiteReste <= 5) {
      Swal.fire({
        icon: "warning",
        title: "Stock faible",
        text: "Impossible de faire une sortie. Le stock restant est critique (≤ 5).",
      });
      return;
    }

    setSelectedFourniture(fourniture);
    setNatureSortie("interne");
    setQuantite("");
    setPrixUnitaire(fourniture.prixUnitaire || "");
    setNomPersonne("");
    setPrixTotal("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFourniture(null);
  };

  const handleQuantiteChange = (e) => {
    let newQuantite = parseInt(e.target.value, 10) || 0;
    if (selectedFourniture && newQuantite > selectedFourniture.quantiteReste) {
      newQuantite = selectedFourniture.quantiteReste;
    }
    setQuantite(newQuantite);
    updatePrixTotal(newQuantite, prixUnitaire, natureSortie);
  };

  const handlePrixUnitaireChange = (e) => {
    const newPrixUnitaire = parseFloat(e.target.value) || 0;
    setPrixUnitaire(newPrixUnitaire);
    updatePrixTotal(quantite, newPrixUnitaire, natureSortie);
  };

  const updatePrixTotal = (quantite, prixUnitaire, natureSortie) => {
    setPrixTotal(natureSortie === "externe" ? quantite * prixUnitaire : "");
  };

  const handleSubmitSortie = async () => {
    try {
      const response = await axios.post(
        `${url}/api/sortiemateriel/add`,
        {
          designation: selectedFourniture.designation,
          natureSortie,
          quantite,
          prixUnitaire,
          nomPersonne,
          materielId: selectedFourniture.id,
        }
      );

      Swal.fire({
        title: "Succès",
        text: response.data.message,
        icon: "success",
      });

      // Générer le PDF seulement si la nature de sortie est "externe"
      if (natureSortie === "externe") {
        generateFournitureReceipt({
          designation: selectedFourniture.designation,
          natureSortie,
          quantite,
          prixUnitaire,
          prixTotal,
          nomPersonne,
        });
      }

      handleCloseModal();
      window.location.reload(); // Recharger la page
    } catch (error) {
      console.error("Erreur lors de l'envoi des données :", error);
      Swal.fire({
        title: "Erreur",
        text: "Une erreur est survenue. Veuillez réessayer.",
        icon: "error",
      });
    }
  };
  const generateFournitureReceipt = (sortieData) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 230], // Augmenté pour un meilleur espacement
    });

    // Génération du numéro de facture
    const lastInvoiceNumber = Math.floor(Math.random() * 10000) + 1; // Numéro aléatoire entre 1 et 10000
    const invoiceNumber = `A00 ${lastInvoiceNumber}`;

    // Ajout du logo (Ajusté comme dans l'exemple de reçu)
    doc.addImage(Logo, "PNG", 20, 10, 40, 30); // Largeur 40mm, Hauteur 30mm

    // Titre de la facture
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor("#000000");
    doc.text("REÇU D'ACHAT DE FOURNITURE", 40, 50, { align: "center" });

    // Informations de la facture
    doc.setFontSize(9);
    const formattedDate = new Date().toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    doc.text(`Facture: ${invoiceNumber}`, 40, 58, { align: "center" });
    doc.text(`Date: ${formattedDate}`, 40, 64, { align: "center" });

    doc.line(5, 68, 75, 68); // Séparation horizontale

    // Informations de la sortie
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Informations de Sortie", 10, 74);
    doc.setFont("helvetica", "normal");
    doc.text(`Désignation: ${sortieData.designation}`, 10, 80);
    doc.text(`Nom: ${sortieData.nomPersonne}`, 10, 86);
    doc.text(`Quantité sortie: ${sortieData.quantite}`, 10, 92);
    doc.text(`Prix unitaire: ${sortieData.prixUnitaire} Ar`, 10, 98);
    doc.line(5, 102, 75, 102); // Séparation horizontale

    // Détails de la sortie dans un tableau
    const colX = [10, 40, 60]; // Position des colonnes
    const rowHeight = 6;
    let posY = 108;

    // En-tête du tableau
    doc.setFont("helvetica", "bold");
    doc.text("Description", colX[0], posY);
    doc.text("Montant", colX[1], posY);
    doc.text("Nature", colX[2], posY);
    posY += rowHeight;

    // Contenu du tableau
    const tableData = [
      [
        "Désignation",
        `${sortieData.designation}`,
        `${sortieData.natureSortie}`,
      ],
      ["Quantité sortie", `${sortieData.quantite}`, ""],
      ["Prix unitaire", `${sortieData.prixUnitaire} Ar`, ""],
      ["Prix total", `${sortieData.prixTotal} Ar`, ""],
    ];

    doc.setFont("helvetica", "normal");
    tableData.forEach((row) => {
      doc.text(row[0], colX[0], posY);
      doc.text(row[1], colX[1], posY);
      doc.text(row[2], colX[2], posY);
      posY += rowHeight; // Avance à la ligne suivante
    });

    // Message de remerciement
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#2C3E50");
    const thanksMessage = "Merci pour votre achat !";
    const thanksMessageWidth = doc.getTextWidth(thanksMessage);
    const thanksMessageX = (80 - thanksMessageWidth) / 2;
    doc.text(thanksMessage, thanksMessageX, posY + 10);

    // Ajouter une ligne de séparation
    doc.setDrawColor(44, 62, 80);
    doc.line(5, posY + 15, 75, posY + 15);

    // Footer removed per request

    // Convertir en blob et imprimer avec window.print
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const printWindow = window.open(pdfUrl);

    if (printWindow) {
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setBlinkingRows((prev) => {
        const lowStockItems = filteredFournitures
          .filter((f) => f.quantiteReste < 5)
          .map((f) => f.id);

        return prev.length === 0 ? lowStockItems : [];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [filteredFournitures]);

  return (
    <div className="container mt-4">
      <h5 className="fw-bold">Liste des Fournitures et matériaux </h5>
      {/* Champ de recherche */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher par désignation, quantité, prix..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <div className="table3-responsive">
        <table className="table table-bordered">
          <thead className="note-table">
            <tr>
              <th>Désignation</th>
              <th>Quantité Initiale</th>
              <th>Quantité Restante</th>
              <th>Prix Unitaire</th>
              <th>Prix Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredFournitures.length > 0 ? (
              filteredFournitures.map((fourniture, index) => (
                <tr
                  key={fourniture.id || index}
                  className={
                    blinkingRows.includes(fourniture.id) ? "blinking-row" : ""
                  }
                >
                  <td>{fourniture.designation}</td>
                  <td>{fourniture.quantite}</td>
                  <td>{fourniture.quantiteReste}</td>
                  <td>{fourniture.prixUnitaire} Ar</td>
                  <td>{fourniture.prixTotal} Ar</td>
                  <td className="text-center">
                    <FontAwesomeIcon
                      icon={faSignOutAlt}
                      className={`icon-action ${
                        fourniture.quantiteReste <= 5
                          ? "text-secondary disabled-icon"
                          : "text-success"
                      }`}
                      title={
                        fourniture.quantiteReste <= 5
                          ? "Stock insuffisant"
                          : "Sortir la fourniture"
                      }
                      onClick={() => {
                        if (fourniture.quantiteReste > 5) {
                          handleOpenModal(fourniture);
                        }
                      }}
                      style={{
                        cursor:
                          fourniture.quantiteReste <= 5
                            ? "not-allowed"
                            : "pointer",
                      }}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  Aucune fourniture trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedFourniture && (
        <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
          <Modal.Header closeButton>
            <Modal.Title>Sortie de fourniture</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ maxHeight: "80vh", overflowY: "auto" }}>
            <p>
              <strong>Désignation :</strong> {selectedFourniture.designation}
            </p>

            <label className="form-label">Nature de sortie :</label>
            <select
              className="form-select"
              value={natureSortie}
              onChange={(e) => {
                setNatureSortie(e.target.value);
                updatePrixTotal(quantite, prixUnitaire, e.target.value);
              }}
            >
              <option value="interne">Interne</option>
              <option value="externe">Externe</option>
            </select>

            <label className="form-label mt-2">Quantité :</label>
            <input
              type="number"
              className="form-control"
              min="1"
              max={selectedFourniture.quantiteReste}
              value={quantite}
              onChange={handleQuantiteChange}
            />

            <label className="form-label mt-2">
              Nom complet de la personne :
            </label>
            <input
              type="text"
              className="form-control"
              value={nomPersonne}
              onChange={(e) => setNomPersonne(e.target.value)}
            />

            {natureSortie === "externe" && (
              <>
                <label className="form-label mt-2">Prix unitaire :</label>
                <input
                  type="number"
                  className="form-control"
                  min="0"
                  step="0.01"
                  value={prixUnitaire}
                  onChange={handlePrixUnitaireChange}
                />

                <label className="form-label mt-2">Prix total :</label>
                <input
                  type="text"
                  className="form-control"
                  value={prixTotal}
                  disabled
                />
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="success" onClick={handleSubmitSortie}>
              Confirmer
            </Button>
            <Button variant="danger" onClick={handleCloseModal}>
              Annuler
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default FournitureTable;
