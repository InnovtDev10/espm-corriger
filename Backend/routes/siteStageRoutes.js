const express = require("express");
const { addSiteStage, getAllSiteStages } = require("../controllers/siteStageController");
const router = express.Router();

router.post("/add", addSiteStage); // Route pour ajouter un site de stage
router.get("/all", getAllSiteStages); // Route pour récupérer tous les sites de stage

module.exports = router;
