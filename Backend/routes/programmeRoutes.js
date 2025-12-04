const express = require("express");
const { ajouterProgramme, getProgrammes, updateVolumeHoraire } = require("../controllers/programmeController");
const router = express.Router();

router.post("/add", ajouterProgramme);
router.get("/all", getProgrammes);
router.put("/update/:id", updateVolumeHoraire);

module.exports = router;
