const express = require("express");
const { addMateriel, updateMateriel, getAllMateriels } = require("../controllers/materielController");

const router = express.Router();

router.post("/add", addMateriel); // Ajouter un matériel
router.put("/update/:id", updateMateriel); // Modifier un matériel
router.get("/all", getAllMateriels); // Obtenir tous les matériels

module.exports = router;
 