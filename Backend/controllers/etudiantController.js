const { Etudiant } = require('../models');
const path = require('path');
const fs = require('fs');

// Ajouter un étudiant
exports.createEtudiant = async (req, res) => {
  try {
    const { matricule, nom, prenom, date_naissance, lieu_naissance, sexe, email, telephone, adresse, nationalite, filiere, niveau, date_inscription, statut, nomPrenomPere, telPere, nomPrenomMere, telMere, numeroCIN, dateDelivranceCIN, diplome_bacc, certificat_residence, acte_de_naissance, photocopie_cin, photo_identite, acte_de_mariage, fiche_de_transfert, carton_chemise, enveloppe, gant, alcool } = req.body;
    
    let photo = null;

    // Vérifier si un fichier est fourni et l'ajouter  
    if (req.file) {
      photo = req.file.filename;    
    }  

    // Créer un nouvel étudiant
    const newEtudiant = await Etudiant.create({
      matricule,
      nom,
      prenom,
      date_naissance,
      lieu_naissance,
      sexe,
      email,
      telephone,
      adresse,
      nationalite,
      filiere,
      niveau,
      date_inscription,
      statut,
      photo,
      nomPrenomPere,
      telPere,
      nomPrenomMere,
      telMere,
      numeroCIN,
      dateDelivranceCIN,
      diplome_bacc: diplome_bacc === 'true' || diplome_bacc === true, 
      certificat_residence: certificat_residence === 'true' || certificat_residence === true,
      acte_de_naissance: acte_de_naissance === 'true' || acte_de_naissance === true,
      photocopie_cin: photocopie_cin === 'true' || photocopie_cin === true,
      photo_identite: photo_identite === 'true' || photo_identite === true,
      acte_de_mariage: acte_de_mariage === 'true' || acte_de_mariage === true,
      fiche_de_transfert: fiche_de_transfert === 'true' || fiche_de_transfert === true,
      carton_chemise: carton_chemise === 'true' || carton_chemise === true,
      enveloppe: enveloppe === 'true' || enveloppe === true,
      gant: gant === 'true' || gant === true,
      alcool: alcool === 'true' || alcool === true
    });

    return res.status(201).json({ message: 'Étudiant ajouté avec succès', etudiant: newEtudiant });
  } catch (error) {
    console.error('Erreur createEtudiant:', error);
    return res.status(500).json({ message: 'Erreur lors de la création de l\'étudiant', error: error.message });
  }
};

// Modifier un étudiant by id
exports.updateEtudiant = async (req, res) => {
    try {
      const { id } = req.params;
      const { matricule, nom, prenom, date_naissance, lieu_naissance, sexe, email, telephone, adresse, nationalite, filiere, niveau, date_inscription, statut, nomPrenomPere, telPere, nomPrenomMere, telMere, numeroCIN, dateDelivranceCIN, diplome_bacc, certificat_residence, acte_de_naissance, photocopie_cin, photo_identite, acte_de_mariage, fiche_de_transfert, carton_chemise, enveloppe, gant, alcool } = req.body;
      
      // Chercher l'étudiant par son ID
      const etudiant = await Etudiant.findByPk(id);  
  
      if (!etudiant) {
        return res.status(404).json({ message: 'Étudiant non trouvé' });
      }
  
      // Préparer les données de mise à jour
      const updateData = {
        matricule,
        nom,
        prenom,
        date_naissance,
        lieu_naissance,
        sexe,
        email,
        telephone,
        adresse,
        nationalite,
        filiere,
        niveau,
        date_inscription,
        statut,
        nomPrenomPere,
        telPere, 
        nomPrenomMere,
        telMere,
        numeroCIN,
        dateDelivranceCIN,
        diplome_bacc: diplome_bacc === 'true' || diplome_bacc === true, 
        certificat_residence: certificat_residence === 'true' || certificat_residence === true,
        acte_de_naissance: acte_de_naissance === 'true' || acte_de_naissance === true,
        photocopie_cin: photocopie_cin === 'true' || photocopie_cin === true,
        photo_identite: photo_identite === 'true' || photo_identite === true,
        acte_de_mariage: acte_de_mariage === 'true' || acte_de_mariage === true,
        fiche_de_transfert: fiche_de_transfert === 'true' || fiche_de_transfert === true,
        carton_chemise: carton_chemise === 'true' || carton_chemise === true,
        enveloppe: enveloppe === 'true' || enveloppe === true,
        gant: gant === 'true' || gant === true,
        alcool: alcool === 'true' || alcool === true
      };

      // Vérifier si un nouveau fichier est fourni
      if (req.file) {
        // Supprimer l'ancienne photo si elle existe
        if (etudiant.photo) {
          const oldPhotoPath = path.join(__dirname, '../uploads', etudiant.photo);
          fs.unlink(oldPhotoPath, (err) => {
            if (err) console.error('Erreur suppression ancienne photo:', err);
          });
        }
        updateData.photo = req.file.filename;
      }
  
      // Mettre à jour les informations de l'étudiant
      await etudiant.update(updateData);
  
      return res.status(200).json({ message: 'Étudiant mis à jour avec succès', etudiant });
    } catch (error) {
      console.error('Erreur updateEtudiant:', error);
      return res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'étudiant', error: error.message });
    }
};

// Supprimer un étudiant et sa photo de profil
exports.deleteEtudiant = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Chercher l'étudiant par son ID
      const etudiant = await Etudiant.findByPk(id);
  
      if (!etudiant) {
        return res.status(404).json({ message: 'Étudiant non trouvé' });
      }
  
      // Supprimer la photo de profil si elle existe
      if (etudiant.photo) {
        const photoPath = path.join(__dirname, '../uploads', etudiant.photo);
  
        // Vérifier si le fichier existe et le supprimer
        fs.unlink(photoPath, (err) => {
          if (err) {
            console.error('Erreur lors de la suppression de la photo de profil', err);
          }
        });
      }
  
      // Supprimer l'étudiant de la base de données
      await etudiant.destroy();
  
      return res.status(200).json({ message: 'Étudiant et sa photo de profil supprimés avec succès' });
    } catch (error) {
      console.error('Erreur deleteEtudiant:', error);
      return res.status(500).json({ message: 'Erreur lors de la suppression de l\'étudiant', error: error.message });
    }
};

// Récupérer tous les étudiants
exports.getAllEtudiants = async (req, res) => {
  try {
    console.log('🔍 Recherche de tous les étudiants...');
    
    // Utiliser raw: true comme pour les professeurs
    const etudiants = await Etudiant.findAll({ raw: true });
    console.log('📊 Nombre trouvé:', etudiants.length);
    
    return res.status(200).json(etudiants);
  } catch (error) {
    console.error('Erreur getAllEtudiants:', error);
    return res.status(500).json({ message: "Erreur lors de la récupération des étudiants", error: error.message });
  }
};

exports.countEtudiants = async (req, res) => {
  try {
    const countInfirmier = await Etudiant.count({ where: { filiere: "Infirmier généraliste" } });
    const countSageFemme = await Etudiant.count({ where: { filiere: "Sage-femme" } });
    const countBioTechnicien = await Etudiant.count({ where: { filiere: "Bio Technicien d'analyses Médicales" } });

    return res.status(200).json({
      totalInfirmiers: countInfirmier,
      totalSageFemmes: countSageFemme,
      totalBioTechniciens: countBioTechnicien
    });
  } catch (error) {
    console.error('Erreur countEtudiants:', error);
    return res.status(500).json({ message: "Erreur lors du comptage des étudiants", error: error.message });
  }
};

// Modifier un étudiant en utilisant le matricule
exports.updateEtudiantByMatricule = async (req, res) => {
  try {
      const { matricule } = req.query;

      // Chercher l'étudiant par son matricule
      const etudiant = await Etudiant.findOne({ where: { matricule } });

      if (!etudiant) {
          return res.status(404).json({ message: "Étudiant non trouvé" });
      }

      // Préparer les données de mise à jour
      const updateData = { ...req.body };

      // Gestion de la photo si un fichier est fourni
      if (req.file) {
        // Supprimer l'ancienne photo si elle existe
        if (etudiant.photo) {
          const oldPhotoPath = path.join(__dirname, '../uploads', etudiant.photo);
          fs.unlink(oldPhotoPath, (err) => {
            if (err) console.error('Erreur suppression ancienne photo:', err);
          });
        }
        updateData.photo = req.file.filename;
      }

      // Conversion des valeurs booléennes si nécessaire
      const booleanFields = ['diplome_bacc', 'certificat_residence', 'acte_de_naissance', 'photocopie_cin', 'photo_identite', 'acte_de_mariage', 'fiche_de_transfert', 'carton_chemise', 'enveloppe', 'gant', 'alcool'];
      
      booleanFields.forEach(field => {
        if (updateData[field] !== undefined) {
          updateData[field] = updateData[field] === 'true' || updateData[field] === true;
        }
      });

      // Mettre à jour uniquement les champs envoyés
      await etudiant.update(updateData);

      return res.status(200).json({ message: "Étudiant mis à jour avec succès", etudiant });
  } catch (error) {
      console.error('Erreur updateEtudiantByMatricule:', error);
      return res.status(500).json({ message: "Erreur lors de la mise à jour de l'étudiant", error: error.message });
  }
};