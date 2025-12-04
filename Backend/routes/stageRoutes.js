const express = require("express");
const router = express.Router();
const upload = require('../middleware/upload');
const stageController = require("../controllers/stageController");

router.post("/add", stageController.addStage);         // Ajouter un stage
router.get("/all", stageController.getAllStages);     // Obtenir tous les stages
router.put("/update/:id", stageController.updateStage);   // Modifier un stage
router.delete("/delete/:id", stageController.deleteStage); // Supprimer un stage

module.exports = router;
 