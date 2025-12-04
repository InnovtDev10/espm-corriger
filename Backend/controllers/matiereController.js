const { Matiere } = require("../models");

// 📌 Ajouter une matière
exports.createMatiere = async (req, res) => { 
    const { filiere, matieres } = req.body;

  if (!filiere || !matieres) {
    return res.status(400).json({ message: "Les champs 'filiere' et 'matieres' sont requis" });
  }

  try {
    const newMatiere = await Matiere.create({ filiere, matieres });
    return res.status(201).json(newMatiere);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur lors de l'ajout de la matière" });
  }
};

// 📌 Récupérer toutes les matières
exports.getAllMatieres = async (req, res) => {
    try {
      const matieres = await Matiere.findAll();
      return res.status(200).json(matieres);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erreur lors de la récupération des matières" });
    }
};

// 📌 Modifier une matière
exports.updateMatiere = async (req, res) => {
    try {
        const { id } = req.params;
        const { code, nom } = req.body;

        const matiere = await Matiere.findByPk(id);
        if (!matiere) {
            return res.status(404).json({ message: "Matière non trouvée" });
        }

        matiere.code = code;
        matiere.nom = nom;
        await matiere.save();

        return res.status(200).json(matiere);
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la matière :", error);
        return res.status(500).json({ message: "Erreur serveur", error });
    }
};

// 📌 Supprimer une matière
exports.deleteMatiere = async (req, res) => {
    try {
        const { id } = req.params;

        const matiere = await Matiere.findByPk(id);
        if (!matiere) {
            return res.status(404).json({ message: "Matière non trouvée" });
        }

        await matiere.destroy();
        return res.status(200).json({ message: "Matière supprimée avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression de la matière :", error);
        return res.status(500).json({ message: "Erreur serveur", error });
    }
};
