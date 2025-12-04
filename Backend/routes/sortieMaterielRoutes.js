const express = require("express");
const router = express.Router();
const sortieMaterielController = require("../controllers/sortieMaterielController");

router.post("/add", sortieMaterielController.addSortieMateriel);
router.get("/all", sortieMaterielController.getAllSortiesMateriel);

module.exports = router;
