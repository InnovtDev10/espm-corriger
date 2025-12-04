const express = require('express');
const router = express.Router();
const paiementEcolageController = require('../controllers/paiementEcolageController');


router.post('/add', paiementEcolageController.createPaiementEcolage);// Route pour créer un paiement
router.put('/update/:id', paiementEcolageController.updatePaiement);// Route pour mettre à jour un paiement
router.get('/all', paiementEcolageController.getAllPaiementsEcolage);
router.get('/get/:matricule', paiementEcolageController.getPaiementByMatricule);
router.get('/filtered', paiementEcolageController.getFilteredPaiementsEcolage);

module.exports = router;
 