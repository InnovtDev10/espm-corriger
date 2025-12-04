// controllers/immobilisationController.js

const { Immobilisation } = require('../models'); // Import du modèle

// Créer une nouvelle immobilisation
exports.create = async (req, res) => {
  try {
    const { titre, description, montant } = req.body;
    const immobilisation = await Immobilisation.create({
      titre,
      description,
      montant
    });
    res.status(201).json(immobilisation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création de l'immobilisation" });
  }
};

// Récupérer toutes les immobilisations
exports.getAll = async (req, res) => {
  try {
    const immobilisations = await Immobilisation.findAll();
    res.status(200).json(immobilisations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des immobilisations" });
  }
};

// Récupérer une immobilisation par son ID
exports.getById = async (req, res) => {
  try {
    const immobilisation = await Immobilisation.findByPk(req.params.id);
    if (immobilisation) {
      res.status(200).json(immobilisation);
    } else {
      res.status(404).json({ message: "Immobilisation non trouvée" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération de l'immobilisation" });
  }
};

// Mettre à jour une immobilisation
exports.update = async (req, res) => {
  try {
    const immobilisation = await Immobilisation.findByPk(req.params.id);
    if (immobilisation) {
      const { titre, description, montant } = req.body;
      immobilisation.titre = titre;
      immobilisation.description = description;
      immobilisation.montant = montant;
      await immobilisation.save();
      res.status(200).json(immobilisation);
    } else {
      res.status(404).json({ message: "Immobilisation non trouvée" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'immobilisation" });
  }
};

// Supprimer une immobilisation
exports.delete = async (req, res) => {
  try {
    const immobilisation = await Immobilisation.findByPk(req.params.id);
    if (immobilisation) {
      await immobilisation.destroy();
      res.status(200).json({ message: "Immobilisation supprimée avec succès" });
    } else {
      res.status(404).json({ message: "Immobilisation non trouvée" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la suppression de l'immobilisation" });
  }
};
