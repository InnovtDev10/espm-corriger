const express = require("express");
const router = express.Router();
const livretController = require("../controllers/livretController");


router.post("/add", livretController.addLivret); // Route pour ajouter un livret
router.get("/tous", livretController.getAllLivrets); // Route pour récupérer tous les livrets
router.get("/get/:id", livretController.getLivretById); // Route pour récupérer un livret par ID

module.exports = router;
