import React, { useState, useEffect } from "react";
import Navbar from "../Composants/Navbar";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Composants/Sidebar";
import "../Styles/EcolagePayment.css";
import axios from "axios";
import Swal from "sweetalert2";
import { GiReceiveMoney } from "react-icons/gi";
import jsPDF from "jspdf";
import Logo from "../assets/SARY.jpeg";
import "jspdf-autotable";

function EcolagePayment() {
  const [matricule, setMatricule] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [niveau, setNiveau] = useState("");
  const [filiere, setFiliere] = useState("");
  const [montant, setMontant] = useState("");
  const [anneeUniv, setAnneeUniv] = useState("");
  const [students, setStudents] = useState([]);
  const [ecolages, setEcolages] = useState([]);
  const [paiements, setPaiements] = useState([]);
  const [moisSelectionne, setMoisSelectionne] = useState("");
  const [paiementId, setPaiementId] = useState(null);
  const navigate = useNavigate();
  const [searchMatricule, setSearchMatricule] = useState(""); // Champ de recherche
  const [filteredStudents, setFilteredStudents] = useState([]);
  const getMonthIndex = (mois) => mois.indexOf(moisSelectionne);

  // Liste des étudiants filtrés

  const mois = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const [searchNom, setSearchNom] = useState("");

  const [filterNiveau, setFilterNiveau] = useState("");
  const [filterSpecialite, setFilterSpecialite] = useState("");
  const [filterAnnee, setFilterAnnee] = useState("");

  const [filteredPaiements, setFilteredPaiements] = useState(paiements);
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Vérifie si le clic est en dehors du champ ou des suggestions
      if (
        !event.target.closest(".suggestion-container") &&
        !event.target.closest(".search-input")
      ) {
        setFilteredStudents([]); // Ferme les suggestions
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let result = paiements;

    if (searchNom) {
      result = result.filter((p) =>
        p.nom.toLowerCase().includes(searchNom.toLowerCase())
      );
    }

    if (searchMatricule) {
      result = result.filter((p) =>
        p.matricule.toLowerCase().includes(searchMatricule.toLowerCase())
      );
    }

    if (filterNiveau) {
      result = result.filter((p) => p.niveau === filterNiveau);
    }

    if (filterSpecialite) {
      result = result.filter((p) => p.filiere === filterSpecialite);
    }

    if (filterAnnee) {
      result = result.filter((p) => p.anneeUniv === filterAnnee);
    }

    setFilteredPaiements(result);
  }, [
    searchNom,
    searchMatricule,
    filterNiveau,
    filterSpecialite,
    filterAnnee,
    paiements,
  ]);

  const handleMoisChange = (e) => {
    const moisChoisi = e.target.value;
    console.log("Mois sélectionné :", moisChoisi);

    if (paiementId) {
      const paiement = paiements.find((p) => p.id === paiementId);
      console.log("Paiement trouvé :", paiement);

      if (paiement) {
        const moisEffectuer = paiement.moisEffectuer || [];
        console.log("Mois déjà payés :", moisEffectuer);

        if (moisEffectuer.length > 0) {
          const dernierMoisPayé = moisEffectuer[moisEffectuer.length - 1];
          const indexDernierMois = mois.indexOf(dernierMoisPayé);
          const indexMoisChoisi = mois.indexOf(moisChoisi);

          console.log("Dernier mois payé :", dernierMoisPayé);
          console.log("Index dernier mois :", indexDernierMois);
          console.log("Index mois choisi :", indexMoisChoisi);

          // Vérification du mois sélectionné
          if (indexMoisChoisi !== indexDernierMois + 1) {
            Swal.fire({
              icon: "warning",
              title: "Sélection invalide",
              text: `Vous devez payer le mois suivant : ${
                mois[indexDernierMois + 1]
              }.`,
            });
            return;
          }
        }
      }
    }

    setMoisSelectionne(moisChoisi);
  };

  useEffect(() => {
    if (searchMatricule.trim() === "") {
      setFilteredStudents([]); // Si le champ est vide, pas de suggestions
    } else {
      const filtered = students.filter((student) =>
        student.matricule.toLowerCase().includes(searchMatricule.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchMatricule, students]);

  useEffect(() => {
    if (matricule) {
      const paiement = paiements.find((p) => p.matricule === matricule);
      if (paiement) {
        setPaiementId(paiement.id); // Stocke l'ID du paiement
      } else {
        setPaiementId(null);
      }
    }
  }, [matricule, paiements]);

  // Fetch liste etudiants
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/etudiant/tous"
        );
        setStudents(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des étudiants :", error);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchPaiements = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/paiement/ecolage/all"
        );
        setPaiements(response.data.data);
        console.log("Donnée de paiement ecolage:", response.data.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des paiements :", error);
      }
    };

    fetchPaiements();
  }, []);

  const isMatriculePaiementExist = paiements.some(
    (paiement) => paiement.matricule === matricule
  );

  // Fetch liste des droits d'inscription
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/ecolage/get")
      .then((response) => {
        setEcolages(response.data);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des écolages:", error);
      });
  }, []);

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
            setMontant(droitData.ecolage);
          } else {
            setMontant("");
          }
        } else {
          console.log(
            "Les données des écolages ne sont pas encore disponibles."
          );
        }
      }
    }
  }, [matricule, students, ecolages]);

  // Function to handle payment submission
  const handlePaiementSubmit = async () => {
    if (!montant || !matricule || !nom || !prenom || !moisSelectionne) {
      Swal.fire({
        icon: "warning",
        title: "Champs incomplets",
        text: "Veuillez remplir tous les champs nécessaires avant de soumettre le paiement.",
      });
      return;
    }

    const paiementData = {
      matricule,
      nom,
      prenom,
      niveau,
      filiere: filiere,
      montantParMois: montant,
      moisEffectuer: [moisSelectionne],
      moisRestant: mois.filter((moisItem) => moisItem !== moisSelectionne),
      anneeUniv: anneeUniv.trim(),
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/paiement/ecolage/add",
        paiementData
      );
      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Paiement réussi",
          text: "Le paiement a été effectué avec succès !",
        }).then(() => {
          generateReceipt(paiementData);
          window.location.reload();
          // Reload the page after the payment is successful
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur s'est produite lors du paiement. Veuillez réessayer.",
      });
      console.error("Erreur lors du paiement:", error);
    }
  };

  //Fonction pour faire update
  const handleUpdate = async () => {
    if (!paiementId) {
      Swal.fire({
        icon: "warning",
        title: "Erreur",
        text: "Aucun paiement trouvé pour ce matricule.",
      });
      return;
    }

    const paiement = paiements.find((p) => p.id === paiementId);

    if (!paiement) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Paiement introuvable.",
      });
      return;
    }

    // ✅ Éviter les doublons dans `moisEffectuer`
    const moisEffectuerMisAJour = Array.from(
      new Set([...paiement.moisEffectuer, moisSelectionne])
    );

    // ✅ Vérifier avant de supprimer de `moisRestant`
    const moisRestantMisAJour = paiement.moisRestant.includes(moisSelectionne)
      ? paiement.moisRestant.filter((m) => m !== moisSelectionne)
      : paiement.moisRestant;

    const updateData = {
      matricule,
      nom,
      prenom,
      niveau,
      filiere,
      montantParMois: montant,
      moisEffectuer: moisEffectuerMisAJour,
      moisRestant: moisRestantMisAJour,
      anneeUniv,
    };

    console.log("Mois envoyé au backend :", moisSelectionne);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/paiement/ecolage/update/${paiementId}`,
        updateData
      );
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Paiement réussi",
          text: "Le paiement a été effectué avec succès !",
        }).then(() => {
          // Générer le PDF après validation
          generateReceipt2(updateData);
          setTimeout(() => {
            window.location.reload();
          }, 500);
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: "Une erreur s'est produite lors de la mise à jour du paiement.",
      });
      console.error("Erreur lors de la mise à jour du paiement:", error);
    }
  };

  useEffect(() => {}, [moisSelectionne]);
  const handleMoisClick = (moisItem) => {
    // Vérifier si le mois est déjà payé
    const paiement = paiements.find((p) => p.matricule === matricule);
    if (paiement && paiement.moisEffectuer.includes(moisItem)) {
      return; // Ne rien faire si le mois est déjà payé
    }

    setMoisSelectionne(moisItem); // Sélectionner le mois automatiquement
  };
  const generateAcademicYears = (startYear = 2020) => {
    const currentYear = new Date().getFullYear();
    let years = [];
    for (let year = startYear; year <= currentYear + 5; year++) {
      years.push(`${year}-${year + 1}`);
    }
    return years.reverse(); // Trier pour afficher la plus récente en premier
  };
  const generateReceipt = (paiementData) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 230], // Hauteur augmentée pour un meilleur espacement
    });

    // Génération du numéro de facture
    const invoiceNumber = `EC0 ${Math.floor(Math.random() * 10000) + 1}`;

    // Ajout du logo (Hauteur augmentée)
    doc.addImage(Logo, "PNG", 20, 10, 40, 30); // Largeur 40mm, Hauteur 30mm (augmentation de l'espacement)

    // Titre du reçu
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor("#000000");
    doc.text("REÇU DE PAIEMENT D'ÉCOLAGE", 40, 50, { align: "center" }); // Augmenter l'espacement vertical

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
    doc.text(`Matricule: ${paiementData.matricule}`, 10, 80);
    doc.text(
      `Nom & Prénom: ${paiementData.nom} ${paiementData.prenom}`,
      10,
      86
    );
    doc.text(`Niveau: ${paiementData.niveau}`, 10, 92);
    doc.text(`Parcours: ${paiementData.filiere}`, 10, 98);
    doc.text(`Année Académique: ${paiementData.anneeUniv}`, 10, 104);
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

    posY += rowHeight;

    // Contenu du tableau avec bordures X et Y
    const dernierMoisPaiement =
      paiementData.moisEffectuer && paiementData.moisEffectuer.length
        ? paiementData.moisEffectuer[paiementData.moisEffectuer.length - 1]
        : null;

    const tableData = [
      ["Écolage/Mois", `${paiementData.montantParMois || "N/A"} Ar`, ""],
      ["Mois", `${dernierMoisPaiement || "Non spécifié"}`, ""],
      ["Montant payé", `${paiementData.montantParMois || "N/A"} Ar`, ""],
    ];

    console.log(tableData); // Vérifier les données utilisées

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

    // Placer le slogan en bas (footer)
    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#16A085"); // Couleur vert pour le slogan ou le message complémentaire
    const footerMessage = "E.S.P.M";
    const footerMessageWidth = doc.getTextWidth(footerMessage); // Calcul de la largeur du texte du footer
    const footerMessageX = (80 - footerMessageWidth) / 2; // Calcul du X pour centrer
    doc.text(footerMessage, footerMessageX, 225); // Footer centré

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
  const generateReceipt2 = (updateData) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [80, 230], // Hauteur augmentée pour un meilleur espacement
    });

    // Génération du numéro de facture
    const invoiceNumber = `E00 ${Math.floor(Math.random() * 10000) + 1}`;

    // Ajout du logo
    doc.addImage(Logo, "PNG", 20, 10, 40, 30); // Largeur 40mm, Hauteur 30mm

    // Titre du reçu
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor("#000000");
    doc.text("REÇU DE PAIEMENT D'ÉCOLAGE", 40, 50, { align: "center" });

    // Formater la date
    const formattedDate = new Date().toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
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
    doc.text(`Matricule: ${updateData.matricule || "N/A"}`, 10, 80);
    doc.text(
      `Nom & Prénom: ${updateData.nom || ""} ${updateData.prenom || ""}`,
      10,
      86
    );
    doc.text(`Niveau: ${updateData.niveau || "N/A"}`, 10, 92);
    doc.text(`Parcours: ${updateData.filiere || "N/A"}`, 10, 98);
    doc.text(`Année Académique: ${updateData.anneeUniv || "N/A"}`, 10, 104);
    doc.line(5, 108, 75, 108); // Séparation horizontale

    // Détails du paiement
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Détails du Paiement", 10, 114);

    // Tableau des paiements
    const colX = [10, 35, 60]; // Position des colonnes
    const rowHeight = 6;
    let posY = 120;

    // En-tête du tableau
    doc.setFillColor(230, 230, 230); // Fond gris clair
    doc.rect(5, posY - 4, 70, rowHeight, "F"); // Fond gris
    doc.rect(5, posY - 4, 70, rowHeight); // Bordure
    doc.text("Description", colX[0], posY);
    doc.text("Montant", colX[1], posY);

    posY += rowHeight;

    // Contenu du tableau
    const dernierMoisUpdate =
      updateData.moisEffectuer && updateData.moisEffectuer.length
        ? updateData.moisEffectuer[updateData.moisEffectuer.length - 1]
        : null;

    const tableData = [
      ["Écolage/Mois", `${updateData.montantParMois || "N/A"} Ar`, ""],
      ["Mois", `${dernierMoisUpdate || "Non spécifié"}`, ""],
      ["Montant payé", `${updateData.montantParMois || "N/A"} Ar`, ""],
    ];

    doc.setFont("helvetica", "normal");
    tableData.forEach((row) => {
      doc.rect(5, posY - 4, 70, rowHeight); // Bordure
      doc.text(row[0], colX[0], posY);
      doc.text(row[1], colX[1], posY);
      doc.text(row[2], colX[2], posY);
      posY += rowHeight;
    });

    // Ajouter le message de remerciement
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#2C3E50");
    const thanksMessage = "Merci de votre paiement !";
    const thanksMessageX = (80 - doc.getTextWidth(thanksMessage)) / 2;
    doc.text(thanksMessage, thanksMessageX, posY + 20);

    // Ligne de séparation
    doc.setDrawColor(44, 62, 80);
    doc.line(5, posY + 25, 75, posY + 25);

    // Footer
    doc.setFontSize(6);
    doc.setFont("helvetica", "bold");
    doc.setTextColor("#16A085");
    const footerMessage = "E.S.P.M";
    const footerMessageX = (80 - doc.getTextWidth(footerMessage)) / 2;
    doc.text(footerMessage, footerMessageX, 225);

    // Convertir en blob et imprimer
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

  return (
    <>
      <header className="pt-3">
        <Navbar />
      </header>
      <main className="center p-3">
        <aside className="p-3">
          <Sidebar />
        </aside>
        <section className="contenu2 mt-4 p-4">
          <div className="header-section mt-0">
            <h4 className="fw-bold mt-0">Paiement des Écolages</h4>
            <button className="payment-btn" onClick={() => navigate("/classe")}>
              <GiReceiveMoney size={24} /> Paiement Droit
            </button>
          </div>

          <div className="hr mt-2"></div>

          {/* Conteneur principal avec le formulaire à gauche et la carte à droite */}
          <div className="paiement-container d-flex mt-0">
            {/* Formulaire de paiement */}
            <div className="paiement-form w-50 me-4">
              <h5> Effectuer un Paiement</h5>
              <div className="d-flex align-items-center">
                {/* Matricule avec auto-complétion */}
                <div className="position-relative w-50 me-2">
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Matricule..."
                    value={searchMatricule}
                    onChange={(e) => setSearchMatricule(e.target.value)}
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
                            setSearchMatricule(student.matricule);
                            setNom(student.nom);
                            setPrenom(student.prenom);
                            setFilteredStudents([]); // Masquer la liste après sélection
                          }}
                        >
                          {student.matricule} - {student.nom} {student.prenom}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Champ du nom (lecture seule) */}
                <input
                  type="text"
                  className="form-control w-50 mb-3"
                  placeholder="Nom"
                  value={nom}
                />
              </div>

              <div className="d-flex justify-content-between gap-3 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Prénom"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  readOnly
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Niveau"
                  value={niveau}
                  onChange={(e) => setNiveau(e.target.value)}
                  readOnly
                />
              </div>
              <div className="d-flex justify-content-between gap-3 mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Parcours"
                  value={filiere}
                  onChange={(e) => setFiliere(e.target.value)}
                  readOnly
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ecolage /mois"
                  value={montant ? `${montant} Ar` : ""}
                  onChange={(e) => setMontant(e.target.value)}
                  readOnly
                />
              </div>
              <div className="d-flex justify-content-between gap-3 mb-3">
                <select
                  id="mois"
                  value={moisSelectionne}
                  onChange={handleMoisChange}
                  className="form-control"
                >
                  <option value="">Sélectionner un mois</option>
                  {mois.map((moisItem) => (
                    <option key={moisItem} value={moisItem}>
                      {moisItem}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Année Académique"
                  value={anneeUniv}
                  onChange={(e) => setAnneeUniv(e.target.value)}
                />
              </div>
              <button
                className="btn btn-success"
                onClick={handlePaiementSubmit}
                style={{
                  display: isMatriculePaiementExist ? "none" : "inline-block",
                }}
              >
                Premier Paiement
              </button>

              {/* Ce bouton est hidden si matricule est absente et visible si matricule presente */}
              <button
                className="btn btn-success"
                onClick={handleUpdate}
                style={{
                  display: !isMatriculePaiementExist ? "none" : "inline-block",
                }}
              >
                Valider Paiement
              </button>
            </div>

            {/* Carte Écolage */}
            <div className="carte-ecolage-container">
              <h5>Carte d'Écolage</h5>

              {/* Informations de l'étudiant */}
              <div className="etudiant-info">
                <span>
                  <strong>Matricule:</strong> {matricule || " "}
                </span>

                <div className="etudiant-details">
                  <span>
                    <strong>Nom:</strong> {nom || " "}
                  </span>
                  <span>
                    <strong>Niveau:</strong> {niveau || " "}
                  </span>
                  <span>
                    <strong>Spécialité:</strong> {filiere || ""}
                  </span>
                </div>
              </div>

              {/* Mois de paiement */}
              <div className="mois-grid">
                {mois.map((moisItem, index) => {
                  let classe = "mois non-paye"; // Par défaut, non payé
                  let estCliqueable = true;

                  if (paiements.length > 0) {
                    const paiement = paiements.find(
                      (p) => p.matricule === matricule
                    );

                    if (paiement) {
                      if (paiement.moisEffectuer.includes(moisItem)) {
                        classe = "mois paye"; // Bleu pour les mois payés
                        estCliqueable = false; // Désactiver le clic sur les mois payés
                      } else if (paiement.moisRestant.includes(moisItem)) {
                        classe = "mois restant"; // Vert pour les mois restants
                      }
                    }
                  }

                  return (
                    <div
                      key={index}
                      className={classe}
                      onClick={() => estCliqueable && handleMoisClick(moisItem)}
                      style={{
                        cursor: estCliqueable ? "pointer" : "not-allowed",
                        opacity: estCliqueable ? 1 : 0.6,
                      }}
                    >
                      {moisItem}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Historique des paiements */}
          <div className="paiement-historique mt-1">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5>Historique des Paiements</h5>
              <button
                className="payment-btn2 mb-2"
                onClick={() => navigate("/ecolagehistorique")}
              >
                <GiReceiveMoney size={24} /> Voir les historiques
              </button>
            </div>

            <div className="filters d-flex gap-3 mb-3">
              <input
                type="text"
                placeholder="Rechercher par nom..."
                className="form-control"
                value={searchNom}
                onChange={(e) => setSearchNom(e.target.value)}
              />
              <input
                type="text"
                placeholder="Rechercher par Matricule..."
                className="form-control"
                value={searchMatricule}
                onChange={(e) => setSearchMatricule(e.target.value)}
              />
              <select
                className="form-control"
                value={filterNiveau}
                onChange={(e) => setFilterNiveau(e.target.value)}
              >
                <option value="">Filtrer par niveau</option>
                <option value="L1">L1</option>
                <option value="L2">L2</option>
                <option value="L3">L3</option>
                <option value="M1">M1</option>
                <option value="M2">M2</option>
              </select>
              <select
                className="form-control"
                value={filterSpecialite}
                onChange={(e) => setFilterSpecialite(e.target.value)}
              >
                <option value="">Parcours</option>
                <option>Technicien de laboratoire</option>
                <option>Sciences infirmières</option>
                <option>Maieutique</option>
              </select>
              <input
                list="annees-universitaires"
                className="form-control"
                value={filterAnnee}
                onChange={(e) => setFilterAnnee(e.target.value)}
                placeholder="Année universitaire"
              />
            </div>

            <div className="table-responsive">
              <table className="noteo-table">
                <thead>
                  <tr>
                    <th>Matricule</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Niveau</th>
                    <th>Parcours</th>
                    <th>Montant /mois</th>
                    <th>Mois effectués</th>
                    <th>Mois restants</th>
                    <th>Année Scolaire</th>
                    <th>Date dernier paiement</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPaiements.length > 0 ? (
                    filteredPaiements.map((paiement, index) => {
                      const paiementDate = new Date(paiement.updatedAt);
                      const now = new Date();

                      const monthNames = [
                        "janvier",
                        "février",
                        "mars",
                        "avril",
                        "mai",
                        "juin",
                        "juillet",
                        "août",
                        "septembre",
                        "octobre",
                        "novembre",
                        "décembre",
                      ];

                      const currentMonthIndex = now.getMonth(); // 0-11
                      const currentMonthName = monthNames[currentMonthIndex];

                      const moisEffectuer =
                        paiement.moisEffectuer?.map((m) => m.toLowerCase()) ||
                        [];

                      // Trouver le mois le plus récent payé
                      const moisEffectuerIndex = moisEffectuer
                        .map((m) => monthNames.indexOf(m)) // convertit en index numérique
                        .filter((index) => index !== -1);

                      const dernierMoisPayéIndex = Math.max(
                        ...moisEffectuerIndex,
                        -1
                      ); // -1 si aucun

                      const cinquiemeJour = new Date(
                        now.getFullYear(),
                        now.getMonth(),
                        5
                      );

                      const isAfter5th = now >= cinquiemeJour;
                      const isMonthPaid =
                        moisEffectuer.includes(currentMonthName);
                      const isMoisEnRetard =
                        dernierMoisPayéIndex < currentMonthIndex;

                      const shouldBlink =
                        isAfter5th && (!isMonthPaid || isMoisEnRetard);

                      return (
                        <tr
                          key={index}
                          className={shouldBlink ? "clignote" : ""}
                        >
                          <td>{paiement.matricule}</td>
                          <td>{paiement.nom}</td>
                          <td>{paiement.prenom}</td>
                          <td>{paiement.niveau}</td>
                          <td>{paiement.filiere}</td>
                          <td>{paiement.montantParMois} Ar</td>
                          <td>
                            {paiement.moisEffectuer?.join(", ") || "Aucun"}
                          </td>
                          <td>{paiement.moisRestant?.join(", ") || "Aucun"}</td>
                          <td>{paiement.anneeUniv}</td>
                          <td>{paiementDate.toLocaleDateString()}</td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center">
                        Aucun paiement trouvé
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
}

export default EcolagePayment;
