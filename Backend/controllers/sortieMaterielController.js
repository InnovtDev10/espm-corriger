const { SortieMateriel, Materiel } = require("../models");

// Ajouter une sortie de matériel
exports.addSortieMateriel = async (req, res) => {
  try {
    const { designation, natureSortie, quantite, prixUnitaire, nomPersonne, materielId } = req.body;

    // Vérifier si le matériel existe
    const materiel = await Materiel.findByPk(materielId);
    if (!materiel) {
      return res.status(404).json({ message: "Matériel non trouvé" });
    }

    // Vérifier si la quantité demandée est disponible
    if (materiel.quantiteReste < quantite) {
      return res.status(400).json({ message: "Quantité insuffisante" });
    }

    // Calculer le prix total
    const prixTotal = quantite * prixUnitaire;

    // Enregistrer la sortie du matériel
    const sortie = await SortieMateriel.create({
      designation,
      natureSortie,
      quantite,
      prixUnitaire,
      nomPersonne,
      prixTotal, 
    });

    // Mettre à jour la quantité restante du matériel
    await materiel.update({
      quantiteReste: materiel.quantiteReste - quantite,
    });

    res.status(201).json({ message: "Sortie de matériel ajoutée avec succès", sortie });
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// Récupérer toutes les sorties de matériel
exports.getAllSortiesMateriel = async (req, res) => {
  try { 
    const sorties = await SortieMateriel.findAll();

    res.status(200).json(sorties);
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

