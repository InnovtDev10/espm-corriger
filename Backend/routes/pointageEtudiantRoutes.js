// routes/PointageEtudiantRoutes.js
const express = require('express');
const router = express.Router();
const PointageEtudiantController = require('../controllers/pointageEtudiantController');


router.post('/add', PointageEtudiantController.create); // Route pour ajouter un pointage
router.get('/all', PointageEtudiantController.getAll); // Route pour récupérer tous les 
router.get('/get/:matricule', PointageEtudiantController.getByMatricule); // Route pour récupérer tous les
router.get('/mois', PointageEtudiantController.getByMonth); 

module.exports = router; 
