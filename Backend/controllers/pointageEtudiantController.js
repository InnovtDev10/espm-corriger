// controllers/PointageEtudiantController.js
const { PointageEtudiant } = require('../models');

const PointageEtudiantController = {
  // Fonction pour ajouter un pointage étudiant
  create: async (req, res) => {
    try {
      const {
        matricule,
        nom,
        prenom,
        niveau,
        filiere,
        raison,
        dateDebut,
        dateFin,
        heureEntree,
        heureArrivee,
        motif,
        decision
      } = req.body;

      // Déterminer les champs à insérer en fonction de la raison
      let pointageData = {
        matricule,
        nom,
        prenom,
        niveau,
        filiere,
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

      // Si la raison est "Sanction", ajouter la décision
      if (raison === "Sanction") {
        pointageData.decision = decision; // On ajoute la décision dans l'objet pointageData
      }

      // Créer le pointage étudiant dans la base de données
      const newPointage = await PointageEtudiant.create(pointageData);

      return res.status(201).json({
        message: "Pointage ajouté avec succès!",
        pointage: newPointage
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du pointage:", error);
      return res.status(500).json({ error: "Une erreur est survenue lors de l'ajout du pointage" });
    }
  },

  // Fonction pour récupérer tous les pointages des étudiants
  getAll: async (req, res) => {
    try {
      const pointages = await PointageEtudiant.findAll();
      return res.status(200).json(pointages);
    } catch (error) {
      console.error("Erreur lors de la récupération des pointages:", error);
      return res.status(500).json({ error: "Une erreur est survenue lors de la récupération des pointages" });
    }
  },

  // Fonction pour récupérer tous les pointages d'un étudiant par matricule
getByMatricule: async (req, res) => {
  try {
    const { matricule } = req.params; 

    const pointages = await PointageEtudiant.findAll({ where: { matricule } });

    if (pointages.length === 0) {
      return res.status(404).json({ error: "Aucun pointage trouvé pour ce matricule" });
    }

    return res.status(200).json(pointages);
  } catch (error) {
    console.error("Erreur lors de la récupération des pointages:", error);
    return res.status(500).json({ error: "Une erreur est survenue lors de la récupération des pointages" });
  }
},

// Fonction pour récupérer les pointages filtrés par mois et année
getByMonth: async (req, res) => {
  try {
    const { mois, annee } = req.query;

    if (!mois || !annee) {
      return res.status(400).json({ error: "Le mois et l'année sont requis." });
    }

    // Construire la date de début et de fin du mois
    const startDate = new Date(`${annee}-${mois}-01`);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59);

    const pointages = await PointageEtudiant.findAll({
      where: {
        createdAt: {
          [require("sequelize").Op.between]: [startDate, endDate]
        }
      }
    });

    return res.status(200).json(pointages);
  } catch (error) {
    console.error("Erreur lors du filtrage par mois:", error);
    return res.status(500).json({ error: "Erreur lors du filtrage par mois." });
  }
}

};

module.exports = PointageEtudiantController;
