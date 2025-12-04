const express = require("express");
const router = express.Router();
const matiereController = require("../controllers/matiereController");

// Routes pour gérer les matières
router.post("/add", matiereController.createMatiere);
router.get("/tous", matiereController.getAllMatieres);
router.put("/update/:id", matiereController.updateMatiere);
router.delete("/delete/:id", matiereController.deleteMatiere);

module.exports = router;
   