const { Materiel } = require("../models");

// Ajouter un matériel
const addMateriel = async (req, res) => {
  try {
    const { designation, quantite, quantiteReste, prixUnitaire, prixTotal } = req.body;

    const newMateriel = await Materiel.create({
      designation,
      quantite,
      quantiteReste,
      prixUnitaire,
      prixTotal,
    });

    res.status(201).json(newMateriel);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout du matériel", error });
  }
};

// Modifier un matériel
const updateMateriel = async (req, res) => {
  try {
    const { id } = req.params;
    const { designation, quantite, quantiteReste, prixUnitaire } = req.body;

    const materiel = await Materiel.findByPk(id);
    if (!materiel) {
      return res.status(404).json({ message: "Matériel non trouvé" });
    }

    materiel.designation = designation || materiel.designation;
    materiel.quantite = quantite || materiel.quantite;
    materiel.quantiteReste = quantiteReste || materiel.quantiteReste;
    materiel.prixUnitaire = prixUnitaire || materiel.prixUnitaire;
    materiel.prixTotal = materiel.quantite * materiel.prixUnitaire;

    await materiel.save();

    res.status(200).json(materiel);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du matériel", error });
  }
};

// Récupérer tous les matériels
const getAllMateriels = async (req, res) => {
  try {
    const materiels = await Materiel.findAll();
    res.status(200).json(materiels);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des matériels", error });
  }
};

module.exports = { addMateriel, updateMateriel, getAllMateriels };
