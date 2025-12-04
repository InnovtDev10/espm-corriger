const { Ecolage } = require("../models");

// Ajouter un nouvel écolage
const addEcolage = async (req, res) => {
  try {
    const { niveau, specialite, droit, ecolage, anneeUniv } = req.body;
    const newEcolage = await Ecolage.create({ niveau, specialite, droit, ecolage, anneeUniv });
    return res.status(201).json(newEcolage);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Récupérer tous les écolages
const getAllEcolages = async (req, res) => {
  try {
    const ecolages = await Ecolage.findAll();
    return res.status(200).json(ecolages);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Récupérer un écolage par ID
const getEcolageById = async (req, res) => {
  try {
    const { id } = req.params;
    const ecolage = await Ecolage.findByPk(id);
    if (!ecolage) {
      return res.status(404).json({ message: "Écolage non trouvé" });
    }
    return res.status(200).json(ecolage);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Modifier un écolage
const updateEcolage = async (req, res) => {
  try {
    const { id } = req.params;
    const { niveau, specialite, droit, ecolage, anneeUniv } = req.body;
    const ecolageToUpdate = await Ecolage.findByPk(id);

    if (!ecolageToUpdate) {
      return res.status(404).json({ message: "Écolage non trouvé" });
    }

    await ecolageToUpdate.update({ niveau, specialite, droit, ecolage, anneeUniv });
    return res.status(200).json(ecolageToUpdate);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Supprimer un écolage
const deleteEcolage = async (req, res) => {
  try {
    const { id } = req.params;
    const ecolageToDelete = await Ecolage.findByPk(id);

    if (!ecolageToDelete) {
      return res.status(404).json({ message: "Écolage non trouvé" });
    }

    await ecolageToDelete.destroy();
    return res.status(200).json({ message: "Écolage supprimé avec succès" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { addEcolage, getAllEcolages, getEcolageById, updateEcolage, deleteEcolage };
