const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { addDocument, getAllDocuments, downloadDocument } = require("../controllers/listeDocumentController");


router.post("/add", upload.single("file"), addDocument);// Route pour ajouter un document
router.get("/all", getAllDocuments); // Route pour récupérer tous les documents
router.get("/download/:id", downloadDocument);// Route pour télécharger un fichier spécifique

module.exports = router;
 