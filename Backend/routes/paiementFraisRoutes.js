const express = require('express');
const router = express.Router();
const paiementFraisController = require('../controllers/paiementFraisController');

// Routes pour les paiements des frais
router.post('/add', paiementFraisController.addPaiementFrais); // Ajouter un paiement
router.put('/update/:id', paiementFraisController.updatePaiementFrais); // Modifier un paiement
router.get('/all', paiementFraisController.getAllPaiementsFrais); // Obtenir tous les paiements
router.get('/:matricule', paiementFraisController.getPaiementFraisByMatricule); // Obtenir un paiement par matricule

module.exports = router;
