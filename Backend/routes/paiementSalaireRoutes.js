const express = require("express");
const router = express.Router();
const { addPaiement, getAllPaiements } = require("../controllers/paiementSalaireController");


router.post("/add", addPaiement); // Route pour ajouter un paiement
router.get("/all", getAllPaiements); // Route pour récupérer tous les paiements

module.exports = router;
