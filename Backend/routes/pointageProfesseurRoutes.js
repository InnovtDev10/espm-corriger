// routes/PointageEtudiantRoutes.js
const express = require('express');
const router = express.Router();
const PointageProfesseurController = require('../controllers/pointageProfesseurController');


router.post('/add', PointageProfesseurController.create); // Route pour ajouter un pointage
router.get('/all', PointageProfesseurController.getAll); // Route pour récupérer tous les pointages
router.get('/get/:matricule', PointageProfesseurController.getByMatricule); // Route pour récupérer tous les pointages

module.exports = router;
