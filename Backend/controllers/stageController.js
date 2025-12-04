const { Stage } = require("../models");

// Ajouter un stage
exports.addStage = async (req, res) => {
  try {
    const stage = await Stage.create(req.body);
    res.status(201).json({ message: "Stage ajouté avec succès", stage });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout du stage", error });
  }
};

// Obtenir tous les stages
exports.getAllStages = async (req, res) => {
  try {
    const stages = await Stage.findAll();
    res.status(200).json(stages);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des stages", error });
  }
};

// Modifier un stage
exports.updateStage = async (req, res) => { 
  const { id } = req.params;
  try {
    const stage = await Stage.findByPk(id);
    if (!stage) {
      return res.status(404).json({ message: "Stage non trouvé" });
    }
    await stage.update(req.body);
    res.status(200).json({ message: "Stage mis à jour avec succès", stage });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la modification du stage", error });
  }
};

// Supprimer un stage
exports.deleteStage = async (req, res) => {
  const { id } = req.params;
  try {
    const stage = await Stage.findByPk(id);
    if (!stage) {
      return res.status(404).json({ message: "Stage non trouvé" });
    }
    await stage.destroy();
    res.status(200).json({ message: "Stage supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression du stage", error });
  }
};
