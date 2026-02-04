import React, { useState, useEffect } from "react";
import "../Styles/ClasseTable.css";
import Swal from "sweetalert2";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";
import { GiReceiveMoney } from "react-icons/gi";
import { FaMoneyBillTrendUp } from "react-icons/fa6";
import jsPDF from "jspdf";
import Logo from "../assets/SARY.jpeg";
import "jspdf-autotable";
function ClasseTable() {
  const [searchResteAPayer, setSearchResteAPayer] = useState("");

  const [searchNom, setSearchNom] = useState("");
  const [searchPrenom, setSearchPrenom] = useState("");
  const [searchNiveau, setSearchNiveau] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [niveau, setNiveau] = useState("");
  const [matricule, setMatricule] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [droit, setDroit] = useState("");
  const [montantPaye, setMontantPaye] = useState("");
  const [montantReste, setMontantReste] = useState("");
  const [anneeUniv, setAnneeUniv] = useState("");
  const [filiere, setFiliere] = useState("");
  const [modePaiement, setModePaiement] = useState("");
  const [editPaymentId, setEditPaymentId] = useState(null);
  const [students, setStudents] = useState([]);
  const [ecolages, setEcolages] = useState([]);
  const [payments, setPayments] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const url = import.meta.env.VITE_API_URL;

  // Fetch la liste des paiements
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(
          `${url}/api/paiement/droit/all`,
          {
            headers: {
              'Cache-Control': 'no-cache'
            }
          }
        );
        setPayments(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des paiements:", error);
      }
    };

    fetchPayments();
  }, []);

  // Fetch liste etudiants
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `${url}/api/etudiant/tous`,
          {
            headers: {
              'Cache-Control': 'no-cache'
            }
          }
        );
        setStudents(response.data); // Met à jour l'état `students` avec les étudiants
      } catch (error) {
        console.error("Erreur lors de la récupération des étudiants :", error);
      }
    };

    fetchStudents();
  }, []);

  // Fetch liste des droits d'inscription
  useEffect(() => {
    axios
      .get(`${url}/api/ecolage/get`)
      .then((response) => {
        setEcolages(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des écolages:", error);
      });
  }, []);

  // Update student info when a matricule is selected
  useEffect(() => {
    if (matricule) {
      const student = students.find(
        (student) => student.matricule === matricule
      );
      if (student) {
        setNom(student.nom);
        setPrenom(student.prenom);
        setNiveau(student.niveau);
        setFiliere(student.filiere);

        // Vérifier si les ecolages sont bien chargés avant de faire la recherche
        if (ecolages && ecolages.length > 0) {
          const droitData = ecolages.find(
            (ecolage) =>
              ecolage.niveau.trim().toLowerCase() ===
                student.niveau.trim().toLowerCase() &&
              ecolage.specialite.trim().toLowerCase() ===
                student.filiere.trim().toLowerCase()
          );

          if (droitData) {
            setDroit(droitData.droit);
          } else {
            setDroit("");
          }
        } else {
          console.log(
            "Les données des écolages ne sont pas encore disponibles."
          );
        }
      }
    }
  }, [matricule, students, ecolages]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const montantPayeFloat = parseFloat(montantPaye);
    const droitFloat = parseFloat(droit.replace(" Ar", ""));

    const paymentData = {
      matricule,
      nom,
      prenom,
      niveau,
      specialite: filiere,
      droit: droitFloat,
      montantPaye: montantPayeFloat,
      montantReste: droitFloat - montantPayeFloat,
      anneeUniv,
      modePaiement,
    };

    try {
      const response = await fetch(
        `${url}/api/paiement/droit/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          title: "Succès!",
          text: data.message,
          icon: "success",
          confirmButtonText: "OK",
        });

        // Générer le reçu PDF
        generateReceipt(paymentData);

        setShowModal(false);
        // Recharger les paiements après la confirmation
        fetchPayments(); // Appel de la fonction pour re-fetcher les paiements
      } else {
        Swal.fire({
          title: "Erreur!",
          text: data.message || "Erreur lors de l'ajout du paiement.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi de la requête:", error);
      Swal.fire({
        title: "Erreur!",
        text: "Erreur de connexion avec le serveur.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleEditPayment = async (payment) => {
    // Initialiser les valeurs du paiement pour l'édition
    setEditPaymentId(payment.id);
    setMatricule(payment.matricule);
    setNom(payment.nom);
    setPrenom(payment.prenom);
    setNiveau(payment.niveau);
    setFiliere(payment.specialite);
    setDroit(payment.droit);
    setMontantPaye(payment.montantPaye);
    setMontantReste(payment.montantReste);
    setAnneeUniv(payment.anneeUniv);
    setModePaiement(payment.modePaiement);

    // Ouvrir le modal pour l'édition
    setShowModalEdit(true);
  };

  const handleUpdatePayment = async (e) => {
    e.preventDefault();

    // Convertir les montants en nombres
    const montantPayeFloat = parseFloat(montantPaye);
    const montantResteFloat = parseFloat(montantReste);

    // Mettre à jour montantPaye en ajoutant montantReste
    const updatedMontantPaye = montantPayeFloat + montantResteFloat;

    // Réinitialiser montantReste à 0
    const updatedMontantReste = 0;

    const paymentData = {
      matricule,
      nom,
      prenom,
      niveau,
      specialite: filiere,
      droit: parseFloat(droit),
      montantPaye: updatedMontantPaye,
      montantReste: updatedMontantReste,
      anneeUniv,
      modePaiement,
    };

    console.log("Id:", editPaymentId);
    try {
      const response = await axios.put(
        `${url}/api/paiement/droit/update/${editPaymentId}`,
        paymentData
      );

      const data = response.data;

      if (response.status === 200) {
        Swal.fire({
          title: "Succès!",
          text: data.message,
          icon: "success",
          confirmButtonText: "OK",
        });

        // Générer le reçu PDF
        generateReceipt(paymentData);

        setShowModalEdit(false); // Fermer le modal d'édition
        // Recharger les paiements après la confirmation
        fetchPayments(); // Appel de la fonction pour re-fetcher les paiements
      } else {
        Swal.fire({
          title: "Erreur!",
          text: data.message || "Erreur lors de la mise à jour du paiement.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du paiement:", error);
      Swal.fire({
        title: "Erreur!",
        text: "Erreur de connexion avec le serveur.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };
  const fetchPayments = async () => {
    try {
      const response = await axios.get(
        `${url}/api/paiement/droit/all`,
        {
          headers: {
            'Cache-Control': 'no-cache'
          }
        }
      );
      setPayments(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des paiements:", error);
    }
  };
  const generateReceipt = (paymentData) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 230], // Hauteur augmentée pour un meilleur espacement
    });

    // Génération du numéro de facture
    const invoiceNumber = `D00 ${Math.floor(Math.random() * 10000) + 1}`;

    // Ajout du logo (Hauteur augmentée)
    doc.addImage(Logo, "PNG", 20, 10, 40, 30); // Largeur 40mm, Hauteur 30mm (augmentation de l'espacement)

    // Titre du reçu
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor("#000000");
    doc.text("REÇU DE PAIEMENT", 40, 50, { align: "center" }); // Augmenter l'espacement vertical

    // Infos du reçu
    doc.setFontSize(9);
    doc.setTextColor("#000000");

    // Formater la date en "Mardi 20 Mars 2025"
    const formattedDate = new Date().toLocaleDateString("fr-FR", {
      weekday: "long", // Jour de la semaine (Mardi)
      day: "numeric", // Jour (20)
      month: "long", // Mois (Mars)
      year: "numeric", // Année (2025)
    });

    // Centrer la date et le numéro de facture
    doc.text(`Facture: ${invoiceNumber}`, 40, 58, { align: "center" });
    doc.text(`Date: ${formattedDate}`, 40, 64, { align: "center" });

    doc.line(5, 68, 75, 68); // Séparation horizontale

    // Informations de l'étudiant
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Informations Étudiant", 10, 74);
    doc.setFont("helvetica", "normal");
    doc.text(`Matricule: ${paymentData.matricule}`, 10, 80);
    doc.text(`Nom & Prenom: ${paymentData.nom} ${paymentData.prenom}`, 10, 86);
    doc.text(`Niveau: ${paymentData.niveau}`, 10, 92);
    doc.text(`Spécialité: ${paymentData.specialite}`, 10, 98);
    doc.text(`Année Académique: ${paymentData.anneeUniv}`, 10, 104);
    doc.line(5, 108, 75, 108); // Séparation horizontale

    // Détails du paiement
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Détails du Paiement", 10, 114);

    // Tableau des paiements avec bordures X et Y
    const colX = [10, 35, 60]; // Position des colonnes
    const rowHeight = 6;
    let posY = 120;

    // En-tête du tableau avec bordures et fond gris
    doc.setFillColor(230, 230, 230); // Fond gris clair
    doc.rect(5, posY - 4, 70, rowHeight, "F"); // Fond gris
    doc.rect(5, posY - 4, 70, rowHeight); // Bordure du haut
    doc.text("Description", colX[0], posY);
    doc.text("Montant", colX[1], posY);
    doc.text("Paiement", colX[2], posY);
    posY += rowHeight;

    // Contenu du tableau avec bordures X et Y
    const tableData = [
      [
        "Droit d'inscription",
        `${paymentData.droit} Ar`,
        `${paymentData.modePaiement}`,
      ],
      ["Montant payé", `${paymentData.montantPaye} Ar`, ""],
    ];

    // Calcul du reste à payer
    const restantAPayer = paymentData.droit - paymentData.montantPaye;
    tableData.push(["Reste à payer", `${restantAPayer} Ar`, ""]);

    doc.setFont("helvetica", "normal");
    tableData.forEach((row) => {
      doc.rect(5, posY - 4, 70, rowHeight); // Bordure pour chaque ligne
      doc.text(row[0], colX[0], posY);
      doc.text(row[1], colX[1], posY);
      doc.text(row[2], colX[2], posY);
      posY += rowHeight;
    });

    // Ajouter le message de remerciement
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#2C3E50"); // Couleur du texte en noir foncé
    const thanksMessage = "Merci de votre paiement !";
    const thanksMessageWidth = doc.getTextWidth(thanksMessage); // Calcul de la largeur du texte
    const thanksMessageX = (80 - thanksMessageWidth) / 2; // Calcul du X pour centrer
    doc.text(thanksMessage, thanksMessageX, posY + 20);

    // Ajout d'une ligne de séparation pour structurer l'élément
    doc.setDrawColor(44, 62, 80); // Couleur gris foncé
    doc.line(5, posY + 25, 75, posY + 25); // Ligne de séparation sous le message

    // Footer removed per request

    // Convertir en blob et imprimer avec window.print
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const printWindow = window.open(pdfUrl);

    if (printWindow) {
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print(); // Utilisation de window.print pour l'impression
      };
    }
  };

  return (
    <div className="note-table-container">
      <h5 className="fw-bold">Historique des paiements des droits</h5>
      <div className="note-filters-container">
        <div className="note-filters">
          <input
            type="text"
            placeholder="Recherche par nom"
            className="form-control"
            value={searchNom}
            onChange={(e) => setSearchNom(e.target.value)}
          />
          <input
            type="text"
            placeholder="Recherche par prénom"
            className="form-control"
            value={searchPrenom}
            onChange={(e) => setSearchPrenom(e.target.value)}
          />
          <select
            className="form-control"
            value={searchNiveau}
            onChange={(e) => setSearchNiveau(e.target.value)}
          >
            <option value="">Tous les niveaux</option>
            <option value="L1">L1</option>
            <option value="L2">L2</option>
            <option value="L3">L3</option>
            <option value="M1">M1</option>
            <option value="M2">M2</option>
          </select>
          <select
            className="form-control"
            value={searchResteAPayer}
            onChange={(e) => setSearchResteAPayer(e.target.value)}
          >
            <option value="">Tous les paiements</option>
            <option value="reste">Avec reste à payer</option>
            <option value="paye">Payé en totalité</option>
          </select>
        </div>

        <Button
          className="payment-btn"
          variant="success"
          onClick={() => setShowModal(true)}
        >
          <GiReceiveMoney size={24} /> Paiement Droit
        </Button>
      </div>

      <div className="table-responsive">
        <table className="noteo-table">
          <thead>
            <tr>
              <th>Numéro de Facture</th>{" "}
              {/* Nouvelle colonne pour le numéro de facture */}
              <th>Matricule</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Niveau</th>
              <th>Spécialité</th>
              <th>Droit d'inscription</th>
              <th>Déja payer</th>
              <th>Reste à payer</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {payments
              .filter((payment) => {
                return (
                  payment.nom.toLowerCase().includes(searchNom.toLowerCase()) &&
                  payment.prenom
                    .toLowerCase()
                    .includes(searchPrenom.toLowerCase()) &&
                  (searchNiveau ? payment.niveau === searchNiveau : true) &&
                  (searchResteAPayer
                    ? (searchResteAPayer === "reste" &&
                        payment.montantReste > 0) ||
                      (searchResteAPayer === "paye" &&
                        payment.montantReste === 0)
                    : true)
                );
              })
              .map((payment, index) => {
                // Génération du numéro de facture pour chaque paiement
                const invoiceNumber = `D00 ${
                  Math.floor(Math.random() * 10000) + 1
                }`;
                return (
                  <tr key={index}>
                    <td>{invoiceNumber}</td>{" "}
                    {/* Affichage du numéro de facture */}
                    <td>{payment.matricule}</td>
                    <td>{payment.nom}</td>
                    <td>{payment.prenom}</td>
                    <td>{payment.niveau}</td>
                    <td>{payment.specialite}</td>
                    <td>{payment.droit} Ar</td>
                    <td>{payment.montantPaye} Ar</td>
                    <td>{payment.montantReste} Ar</td>
                    <td>
                      {payment.montantReste > 0 && (
                        <Button
                          variant="warning"
                          onClick={() => handleEditPayment(payment)}
                        >
                          <FaMoneyBillTrendUp style={{ marginRight: "5px" }} />{" "}
                          Completer
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Paiement Droit d'Inscription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              {/* Colonne 1 */}
              <div className="col-md-6">
                <div className="mb-3">
                  <div className="position-relative w-100">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Rechercher un matricule..."
                      value={matricule}
                      onChange={(e) => {
                        setMatricule(e.target.value);
                        setFilteredStudents(
                          students.filter((student) =>
                            student.matricule
                              .toLowerCase()
                              .includes(e.target.value.toLowerCase())
                          )
                        );
                      }}
                      onFocus={() => setFilteredStudents(students)}
                    />
                    {filteredStudents.length > 0 && (
                      <ul
                        className="list-group position-absolute w-100"
                        style={{
                          zIndex: 1000,
                          maxHeight: "150px",
                          overflowY: "auto",
                        }}
                      >
                        {filteredStudents.slice(0, 5).map((student) => (
                          <li
                            key={student.matricule}
                            className="list-group-item list-group-item-action"
                            onClick={() => {
                              setMatricule(student.matricule);
                              setFilteredStudents([]);
                            }}
                          >
                            {student.matricule}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Prénom"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Niveau"
                    value={niveau}
                    onChange={(e) => setNiveau(e.target.value)}
                  />
                </div>
              </div>

              {/* Colonne 2 */}
              <div className="col-md-6">
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Parcours"
                    value={filiere}
                    onChange={(e) => setFiliere(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Droit d'inscription"
                    value={droit ? `${droit} Ar` : ""}
                    onChange={(e) => setDroit(e.target.value)}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Montant payé"
                    value={montantPaye}
                    onChange={(e) => setMontantPaye(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Année Universitaire"
                    value={anneeUniv}
                    onChange={(e) => setAnneeUniv(e.target.value)}
                  />
                </div>
                <label>Mode de paiement :</label>
                <select
                  className="form-control mb-3"
                  value={modePaiement}
                  onChange={(e) => setModePaiement(e.target.value)}
                >
                  <option value="">Sélectionner un mode de paiement</option>
                  <option value="Virement">Virement</option>
                  <option value="Chèque">Chèque</option>
                  <option value="Espèces">Espèces</option>
                </select>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </Button>
          <Button variant="success" onClick={handlePaymentSubmit}>
            Valider paiement
          </Button>
        </Modal.Footer>
      </Modal>

      {/*Modal pour completer paiement*/}
      <Modal
        show={showModalEdit}
        onHide={() => setShowModalEdit(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Completer Droit d'Inscription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              {/* Colonne 1 */}
              <div className="col-md-6">
                <div className="mb-3">
                  <div className="position-relative w-100">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Matricule"
                      value={matricule}
                      onChange={(e) => {
                        setMatricule(e.target.value);
                      }}
                      readOnly
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Prénom"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Niveau"
                    value={niveau}
                    onChange={(e) => setNiveau(e.target.value)}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Montant payé"
                    value={montantReste ? `${montantReste} Ar` : ""}
                    onChange={(e) => setMontantPaye(e.target.value)}
                    readOnly
                  />
                </div>
              </div>

              {/* Colonne 2 */}
              <div className="col-md-6">
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Parcours"
                    value={filiere}
                    onChange={(e) => setFiliere(e.target.value)}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Droit d'inscription"
                    value={droit ? `${droit} Ar` : ""}
                    onChange={(e) => setDroit(e.target.value)}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Montant payé"
                    value={montantPaye ? `${montantPaye} Ar` : ""}
                    onChange={(e) => setMontantPaye(e.target.value)}
                    readOnly
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Année Universitaire"
                    value={anneeUniv}
                    onChange={(e) => setAnneeUniv(e.target.value)}
                    readOnly
                  />
                </div>
                <label>Mode de paiement :</label>
                <select
                  className="form-control mb-3"
                  value={modePaiement}
                  onChange={(e) => setModePaiement(e.target.value)}
                >
                  <option value="">Sélectionner un mode de paiement</option>
                  <option value="Virement">Virement</option>
                  <option value="Chèque">Chèque</option>
                  <option value="Espèces">Espèces</option>
                </select>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </Button>
          <Button variant="success" onClick={handleUpdatePayment}>
            Confirmer paiement
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ClasseTable;
