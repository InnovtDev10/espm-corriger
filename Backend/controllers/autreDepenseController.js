// controllers/autreDepenseController.js
const { AutreDepense } = require('../models');

// Créer une nouvelle AutreDepense
exports.create = async (req, res) => {
  try {
    const { nom, description, montant, modePaiement } = req.body;
    const autreDepense = await AutreDepense.create({ nom, description, montant, modePaiement });
    return res.status(201).json(autreDepense);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la création de l\'autre dépense', error });
  }
};

// Récupérer toutes les AutreDepenses
exports.getAll = async (req, res) => {
  try {
    const autreDepenses = await AutreDepense.findAll();
    return res.status(200).json(autreDepenses);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la récupération des autres dépenses', error });
  }
};

