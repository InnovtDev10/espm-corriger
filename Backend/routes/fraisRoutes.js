const express = require('express');
const router = express.Router();
const fraisController = require('../controllers/fraisController');


router.post('/add', fraisController.addFrais);// Ajouter un frais
router.put('/update/:id', fraisController.updateFrais); // Modifier un frais
router.delete('/delete/:id', fraisController.deleteFrais); // Supprimer un frais
router.get('/tous', fraisController.getAllFrais);// Récupérer tous les frais

module.exports = router;
 