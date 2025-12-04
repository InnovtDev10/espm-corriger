const { Frais } = require('../models');

// Ajouter un frais
exports.addFrais = async (req, res) => {
  try {
    const { nom, montant, description, niveau, specialite } = req.body;

    // Assurez-vous que niveau et specialite sont des tableaux
    if (!Array.isArray(niveau) || !Array.isArray(specialite)) {
      return res.status(400).json({ message: "Niveau et spécialité doivent être des tableaux" });
    }

    const newFrais = await Frais.create({ nom, montant, description, niveau, specialite });

    return res.status(201).json({ message: "Frais ajouté avec succès", frais: newFrais });
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de l'ajout du frais", error });
  }
};

// Récupérer tous les frais 
exports.getAllFrais = async (req, res) => {
  try {
    const frais = await Frais.findAll();
    return res.status(200).json(frais);
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de la récupération des frais", error });
  }
};

// Récupérer un frais par son ID
exports.getFraisById = async (req, res) => {
  try {
    const frais = await Frais.findByPk(req.params.id);
    if (!frais) {
      return res.status(404).json({ message: "Frais non trouvé" });
    }
    return res.status(200).json(frais);
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de la récupération du frais", error });
  }
};

// Modifier un frais
exports.updateFrais = async (req, res) => {
  try {
    const { nom, montant, description, niveau, specialite } = req.body;

    // Vérifier que niveau et specialite sont des tableaux
    if (!Array.isArray(niveau) || !Array.isArray(specialite)) {
      return res.status(400).json({ message: "Niveau et spécialité doivent être des tableaux" });
    }

    const frais = await Frais.findByPk(req.params.id);     
    if (!frais) {
      return res.status(404).json({ message: "Frais non trouvé" });
    }

    await frais.update({ nom, montant, description, niveau, specialite });

    return res.status(200).json({ message: "Frais mis à jour avec succès", frais });
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de la mise à jour du frais", error });
  }
};

// Supprimer un frais
exports.deleteFrais = async (req, res) => {
  try {
    const frais = await Frais.findByPk(req.params.id);
    if (!frais) {
      return res.status(404).json({ message: "Frais non trouvé" });
    }

    await frais.destroy();

    return res.status(200).json({ message: "Frais supprimé avec succès" });
  } catch (error) {
    return res.status(500).json({ message: "Erreur lors de la suppression du frais", error });
  }
};
