const { PaiementSalaire } = require("../models");

// Ajouter un paiement de salaire
const addPaiement = async (req, res) => {
  try {
    const { matricule, nom, prenom, departement, mois, montant, modePaiement } = req.body;

    if (!nom || !prenom || !departement || !mois || !montant || !modePaiement) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    const paiement = await PaiementSalaire.create({
      matricule,
      nom,
      prenom,
      departement,
      mois,
      montant,
      modePaiement,
    });

    return res.status(201).json({ message: "Paiement enregistré avec succès", paiement });
  } catch (error) {
    console.error("Erreur lors de l'ajout du paiement :", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// Récupérer tous les paiements de salaire
const getAllPaiements = async (req, res) => {
  try {
    const paiements = await PaiementSalaire.findAll();
    return res.status(200).json(paiements);
  } catch (error) {
    console.error("Erreur lors de la récupération des paiements :", error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

module.exports = {
  addPaiement,
  getAllPaiements,
};
