const express = require('express');
const router = express.Router();
const ecolageController = require('../controllers/ecolageController');


router.post('/add', ecolageController.addEcolage); // Ajouter un ecolage
router.put('/update/:id', ecolageController.updateEcolage); // Modifier un ecolage par matricule
router.delete('/delete/:id', ecolageController.deleteEcolage); // Supprimer un ecolage par matricule
router.get('/get', ecolageController.getAllEcolages); // Récupérer un ecolage 

module.exports = router;
