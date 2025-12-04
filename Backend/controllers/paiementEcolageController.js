const { paiementEcolage, Etudiant } = require('../models');
const { Op } = require("sequelize");

// Fonction pour générer la liste des mois restants
const generateMoisRestants = (moisEffectuer) => {
    const moisTous = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    return moisTous.filter(mois => !moisEffectuer.includes(mois));
  };
  
  // Créer un nouveau paiement
  exports.createPaiementEcolage = async (req, res) => {
    const paiementData = req.body;

    try {
      // Extraction des données du corps de la requête
      const {
        matricule,
        nom,
        prenom,
        niveau,
        filiere,
        montantParMois,
        moisEffectuer,
        anneeUniv
      } = req.body;
  
      // Vérification de la présence des champs requis
      if (!matricule || !nom || !prenom || !niveau || !filiere || !montantParMois || !anneeUniv) {
        return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
      }
  
      // Vérification de l'existence de l'étudiant
      const etudiant = await Etudiant.findOne({ where: { matricule } });
      if (!etudiant) {
        return res.status(400).json({ message: "L'étudiant avec ce matricule n'existe pas." });
      }
  
      // Vérifier si `moisEffectuer` est bien un tableau JSON valide
      let moisEffectuerJSON = Array.isArray(moisEffectuer) ? moisEffectuer : [];
  
      // Génération des mois restants
      const moisRestantJSON = generateMoisRestants(moisEffectuerJSON);
  
      // Création du paiement
      const paiement = await paiementEcolage.create({
        matricule,
        nom,
        prenom,
        niveau,
        filiere,
        montantParMois,
        moisEffectuer: moisEffectuerJSON,
        moisRestant: moisRestantJSON,
        anneeUniv
      });
  
      return res.status(201).json({
        message: "Paiement créé avec succès",
        data: paiement
      });
  
    } catch (error) {
      console.error("Erreur lors de la création du paiement:", error);
      return res.status(500).json({
        message: "Erreur serveur",
        error: error.message
      });
    }
  };
  

// Mettre à jour un paiement en ajoutant un mois payé
exports.updatePaiement = async (req, res) => {
  const { id } = req.params;
  const { moisEffectuer, moisRestant, ...otherFields } = req.body;

  try {
    const paiement = await paiementEcolage.findByPk(id);
    if (!paiement) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }

    // Vérification si moisEffectuer est un tableau valide
    const moisEffectuerJSON = Array.isArray(moisEffectuer) ? moisEffectuer : [moisEffectuer];

    // ✅ Éviter les doublons
    const updatedMoisEffectuer = Array.from(new Set([...paiement.moisEffectuer, ...moisEffectuerJSON]));

    // ✅ Mise à jour correcte des mois restants
    const updatedMoisRestant = paiement.moisRestant.filter(m => !moisEffectuerJSON.includes(m));

    // Mise à jour des autres informations
    await paiement.update({
      ...otherFields,
      moisEffectuer: updatedMoisEffectuer,
      moisRestant: updatedMoisRestant
    });

    return res.status(200).json({
      message: 'Paiement mis à jour avec succès',
      data: paiement
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du paiement:', error);
    return res.status(500).json({
      message: 'Erreur serveur',
      error: error.message
    });
  }
};

// Obtenir tous les paiements
exports.getAllPaiementsEcolage = async (req, res) => {
    try {
      const paiements = await paiementEcolage.findAll();
      return res.status(200).json({
        message: "Liste de tous les paiements récupérée avec succès",
        data: paiements
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des paiements:", error);
      return res.status(500).json({
        message: "Erreur serveur",
        error: error.message
      });
    }
  };
  
  // Obtenir un paiement par matricule
  exports.getPaiementByMatricule = async (req, res) => {
    const { matricule } = req.params;
    
    try {
      const paiements = await paiementEcolage.findAll({ where: { matricule } });
      
      if (paiements.length === 0) {
        return res.status(404).json({ message: "Aucun paiement trouvé pour ce matricule" });
      }
  
      return res.status(200).json({
        message: "Paiements récupérés avec succès",
        data: paiements
      });
    } catch (error) {
      console.error("Erreur lors de la récupération du paiement:", error);
      return res.status(500).json({
        message: "Erreur serveur",
        error: error.message
      });
    }
  };
  

 // Obtenir les paiements filtrés par mois, année, et jour
exports.getFilteredPaiementsEcolage = async (req, res) => {
  const { mois, annee, jour } = req.query; // Récupération des filtres depuis la requête

  try {
    // Préparer les conditions de filtrage
    let whereConditions = {};

    if (mois) {
      whereConditions.moisEffectuer = {
        [Op.contains]: [mois], // Filtre sur le mois spécifié
      };
    }
    if (annee) {
      whereConditions.anneeUniv = annee; // Filtre sur l'année universitaire
    }
    if (jour) {
      // Si on filtre aussi par jour, ajouter une condition pour le jour (optionnel selon les données)
      whereConditions.jour = jour; // Assurez-vous que 'jour' est un champ valide dans votre modèle
    }

    // Recherche des paiements selon les conditions définies
    const paiements = await paiementEcolage.findAll({
      where: whereConditions
    });

    // Si aucun paiement trouvé
    if (paiements.length === 0) {
      return res.status(404).json({ message: "Aucun paiement trouvé pour ces filtres" });
    }

    // Retourner les paiements filtrés
    return res.status(200).json({
      message: "Paiements récupérés avec succès",
      data: paiements
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des paiements:", error);
    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message
    });
  }
};
   

  
