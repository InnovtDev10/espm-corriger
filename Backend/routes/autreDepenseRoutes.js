// routes/autreDepenseRoutes.js
const express = require('express');
const router = express.Router();
const autreDepenseController = require('../controllers/autreDepenseController');


router.post('/add', autreDepenseController.create); // Route pour créer une nouvelle AutreDepense
router.get('/all', autreDepenseController.getAll); // Route pour récupérer toutes les AutreDepenses

module.exports = router;
