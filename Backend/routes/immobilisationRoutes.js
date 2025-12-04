const express = require('express');
const immobilisationController = require('../controllers/immobilisationController');
const router = express.Router();


router.post('/add', immobilisationController.create); // Route pour créer une immobilisation
router.get('/tous', immobilisationController.getAll); // Route pour obtenir toutes les immobilisations
router.get('/get/:id', immobilisationController.getById); // Route pour obtenir une immobilisation par son ID
router.put('/update/:id', immobilisationController.update); // Route pour mettre à jour une immobilisation
router.delete('/delete/:id', immobilisationController.delete); // Route pour supprimer une immobilisation

module.exports = router;
