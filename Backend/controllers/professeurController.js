const { Professeur } = require('../models');
const upload = require('../middleware/upload');
const fs = require('fs');
const path = require('path');

// 📅 Fonction pour formater les dates en ISO
const formatDate = (date) => {
  return date ? new Date(date).toISOString().slice(0, 19).replace("T", " ") : null;
};
 
// ✅ Ajouter un professeur avec photo de profil
exports.createProfesseur = async (req, res) => {
  try {
    const {
      matricule, nom, prenom, date_naissance, lieu_naissance, sexe, email, telephone,
      adresse, departement, specialite, date_embauche, statut
    } = req.body;

    let photo_profil = null; 
    let cv = null;
    let lm = null;
    let diplome = null;

    // 🖼️ Vérifier si un fichier est fourni et l'ajouter
    if (req.file) {
      photo_profil = req.file.filename;
    }

    if (req.files) {
      if (req.files.cv) {
        cv = req.files.cv[0].filename; // Assure-toi que le champ de nom de fichier est correct
      }
      if (req.files.lm) {
        lm = req.files.lm[0].filename; // Assure-toi que le champ de nom de fichier est correct
      }
      if (req.files.diplome) {
        diplome = req.files.diplome[0].filename; // Assure-toi que le champ de nom de fichier est correct
      }
    }

    // 🔥 Création du professeur
    const newProfesseur = await Professeur.create({
      matricule,
      nom,
      prenom,
      date_naissance: formatDate(date_naissance),
      lieu_naissance,
      sexe,
      email,
      telephone,
      adresse,
      departement,
      specialite,
      date_embauche: formatDate(date_embauche),
      statut,  
      photo_profil,
      cv,
      lm,  
      diplome,  
    });

    console.log("✅ Professeur ajouté :", newProfesseur);
    return res.status(201).json({ message: 'Professeur ajouté avec succès', professeur: newProfesseur });

  } catch (error) {
    console.error("❌ Erreur ajout professeur :", error);
    return res.status(500).json({ message: 'Erreur lors de la création du professeur', error: error.message });
  }
};

// ✅ Modifier un professeur avec gestion de l'image
exports.updateProfesseur = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      matricule, nom, prenom, date_naissance, lieu_naissance, sexe, email, telephone,
      adresse, departement, specialite, date_embauche, statut
    } = req.body;

    // 🔎 Rechercher le professeur
    const professeur = await Professeur.findByPk(id);
    if (!professeur) {
      return res.status(404).json({ message: 'Professeur non trouvé' });
    }

    let newPhoto = professeur.photo_profil; // Garde l'ancienne photo si pas modifiée
    let newCv = professeur.cv; // Garde l'ancien CV si pas modifié
    let newLm = professeur.lm;
    let newDiplome = professeur.diplome;

    // 🖼️ Vérifier si une nouvelle photo est fournie
    if (req.file) {
      newPhoto = req.file.filename;

      // 🗑️ Supprimer l'ancienne photo si elle existe
      if (professeur.photo_profil) {
        const oldPhotoPath = path.join(__dirname, '../uploads', professeur.photo_profil);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
    }

    // 🔥 Vérifier si un nouveau CV est fourni
    if (req.files && req.files.cv) {
      newCv = req.files.cv[0].filename;

      // 🗑️ Supprimer l'ancien CV si nécessaire
      if (professeur.cv) {
        const oldCvPath = path.join(__dirname, '../uploads', professeur.cv);
        if (fs.existsSync(oldCvPath)) {
          fs.unlinkSync(oldCvPath);
        }
      }
    }

    // 🔥 Vérifier si une nouvelle lettre de motivation est fournie
    if (req.files && req.files.lm) {
      newLm = req.files.lm[0].filename;

      // 🗑️ Supprimer l'ancienne LM si nécessaire
      if (professeur.lm) {
        const oldLmPath = path.join(__dirname, '../uploads', professeur.lm);
        if (fs.existsSync(oldLmPath)) {
          fs.unlinkSync(oldLmPath);
        }
      }
    }

    // 🔥 Vérifier si une nouvelle diplome est fournie
    if (req.files && req.files.diplome) {
      newDiplome = req.files.diplome[0].filename;

      // 🗑️ Supprimer l'ancienne diplome si nécessaire
      if (professeur.diplome) {
        const oldLmPath = path.join(__dirname, '../uploads', professeur.diplome);
        if (fs.existsSync(oldLmPath)) {
          fs.unlinkSync(oldLmPath);
        }
      }
    }

    // 🔄 Mise à jour du professeur
    await professeur.update({
      matricule,
      nom,
      prenom,
      date_naissance: formatDate(date_naissance),
      lieu_naissance,
      sexe,
      email,
      telephone,
      adresse, 
      departement,
      specialite,
      date_embauche: formatDate(date_embauche),
      statut,
      photo_profil: newPhoto,
      cv: newCv,
      lm: newLm,
      diplome: newDiplome,
    });

    console.log("✅ Professeur mis à jour :", professeur);
    return res.status(200).json({ message: 'Professeur mis à jour avec succès', professeur });

  } catch (error) {
    console.error("❌ Erreur mise à jour professeur :", error);
    return res.status(500).json({ message: 'Erreur lors de la mise à jour du professeur', error: error.message });
  }
};

// ✅ Supprimer un professeur et sa photo
exports.deleteProfesseur = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔎 Chercher le professeur
    const professeur = await Professeur.findByPk(id);
    if (!professeur) {
      return res.status(404).json({ message: 'Professeur non trouvé' });
    }

    // 🗑️ Supprimer la photo de profil si elle existe
    if (professeur.photo_profil) {
      const photoPath = path.join(__dirname, '../uploads', professeur.photo_profil);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    // 🔥 Supprimer le professeur
    await professeur.destroy();

    console.log("✅ Professeur supprimé :", professeur);
    return res.status(200).json({ message: 'Professeur et sa photo supprimés avec succès' });

  } catch (error) {
    console.error("❌ Erreur suppression professeur :", error);
    return res.status(500).json({ message: 'Erreur lors de la suppression du professeur', error: error.message });
  }
};

// ✅ Récupérer tous les professeurs
exports.getAllProfesseurs = async (req, res) => {
  try {
    console.log('🔍 Recherche de tous les professeurs...');
    
    // Utiliser raw: true qui fonctionne dans le debug
    const professeurs = await Professeur.findAll({ raw: true });
    console.log('📊 Nombre trouvé:', professeurs.length);
    
    // Retourner directement le tableau
    return res.status(200).json(professeurs);
    
  } catch (error) {
    console.error("❌ Erreur récupération professeurs :", error);
    return res.status(500).json({ message: "Erreur lors de la récupération des professeurs", error: error.message });
  }
};

// ✅ Compter le nombre total de professeurs
exports.countProfesseurs = async (req, res) => {
  try {
    const count = await Professeur.count();
    return res.status(200).json({ totalProfesseurs: count });
  } catch (error) {
    console.error("❌ Erreur lors du comptage des professeurs :", error);
    return res.status(500).json({ message: "Erreur lors du comptage des professeurs", error: error.message });
  }
};

