const express = require('express');
const router = express.Router();
const professeurController = require('../controllers/professeurController');
const upload = require('../middleware/upload');


router.post('/add', 
  upload.fields([
    { name: 'photo_profil', maxCount: 1 }, // Photo de profil
    { name: 'cv', maxCount: 1 },           // CV
    { name: 'lm', maxCount: 1 },           // Lettre de Motivation
    { name: 'diplome', maxCount: 1 }           // Lettre de Motivation
  ]), 
  professeurController.createProfesseur
); // Route pour ajouter un professeur  
router.put('/update/:id', 
  upload.fields([
    { name: 'photo_profil', maxCount: 1 }, // Photo de profil
    { name: 'cv', maxCount: 1 },           // CV
    { name: 'lm', maxCount: 1 },            // Lettre de Motivation
    { name: 'diplome', maxCount: 1 }            // Diplome
  ]), 
  professeurController.updateProfesseur
); // pour mettre à jour un professeur
router.delete('/delete/:id', professeurController.deleteProfesseur); // pour supprimer un professeur
router.get("/tous", professeurController.getAllProfesseurs); // pour recuperer tous les professeurs
router.get("/count", professeurController.countProfesseurs); // pour recuperer tous les professeurs

module.exports = router;
 