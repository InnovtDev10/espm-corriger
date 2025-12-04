const express = require('express');
const router = express.Router();
const paiementController = require('../controllers/paiementDroitController');

router.post('/add', paiementController.addPaiement);
router.put('/update/:id', paiementController.updatePaiement);
router.get('/all', paiementController.getAllPaiements);
router.get('/get/:matricule', paiementController.getPaiementByMatricule);

module.exports = router;
