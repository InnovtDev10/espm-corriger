const { SiteStage } = require("../models");

// Ajouter un site de stage
const addSiteStage = async (req, res) => {
  try {
    const { nomEtablissement, natureStage, serviceStage } = req.body;

    if (!nomEtablissement || !Array.isArray(natureStage) || natureStage.length === 0 || !Array.isArray(serviceStage) || serviceStage.length === 0) {
      return res.status(400).json({ message: "Données invalides" });
    }

    const newSiteStage = await SiteStage.create({ nomEtablissement, natureStage, serviceStage });
    return res.status(201).json(newSiteStage);
  } catch (error) {
    console.error("Erreur lors de l'ajout :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
}; 

// Récupérer tous les sites de stage
const getAllSiteStages = async (req, res) => {
  try {
    const sites = await SiteStage.findAll();
    return res.status(200).json(sites);
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = { addSiteStage, getAllSiteStages };
