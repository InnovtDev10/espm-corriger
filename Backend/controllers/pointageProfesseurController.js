const { PointageProfesseur } = require('../models');

const PointageProfesseurController = {
  // Fonction pour ajouter un pointage professeur
  create: async (req, res) => {
    try {
      const {
        matricule,
        nom,
        prenom,
        departement,
        raison,
        motif,
        dateDebut,
        dateFin,
        heureEntree,
        heureArrivee
      } = req.body;

      // Déterminer les champs à insérer en fonction de la raison
      let pointageData = {
        matricule,
        nom,
        prenom,
        departement,
        raison,
        motif
      };

      // Si la raison est "Absence", ajouter les dates de début et de fin
      if (raison === "Absence") {
        pointageData.dateDebut = dateDebut;
        pointageData.dateFin = dateFin;
      }

      // Si la raison est "Retard", ajouter les heures d'entrée et d'arrivée
      if (raison === "Retard") {
        pointageData.heureEntree = heureEntree;
        pointageData.heureArrivee = heureArrivee;
      }

      // Créer le pointage professeur dans la base de données
      const newPointage = await PointageProfesseur.create(pointageData);

      return res.status(201).json({
        message: "Pointage ajouté avec succès!",
        pointage: newPointage
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du pointage:", error);
      return res.status(500).json({ error: "Une erreur est survenue lors de l'ajout du pointage" });
    }
  },

  // Fonction pour récupérer tous les pointages des professeurs
  getAll: async (req, res) => {
    try {
      const pointages = await PointageProfesseur.findAll();
      return res.status(200).json(pointages);
    } catch (error) {
      console.error("Erreur lors de la récupération des pointages:", error);
      return res.status(500).json({ error: "Une erreur est survenue lors de la récupération des pointages" });
    }
  },

  // Fonction pour récupérer un pointage professeur par matricule
getByMatricule: async (req, res) => {
  try {
    const { matricule } = req.params; 
    const pointages = await PointageProfesseur.findAll({ where: { matricule } });

    if (pointages.length === 0) {
      return res.status(404).json({ error: "Aucun pointage trouvé pour ce matricule" });
    }

    return res.status(200).json(pointages);
  } catch (error) {
    console.error("Erreur lors de la récupération du pointage:", error);
    return res.status(500).json({ error: "Une erreur est survenue lors de la récupération du pointage" });
  }
}

};

module.exports = PointageProfesseurController;
