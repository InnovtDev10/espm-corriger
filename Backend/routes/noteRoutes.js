const express = require("express");
const router = express.Router();
const noteController = require("../controllers/noteController"); 

// Routes pour gérer les notes
router.post("/add", noteController.createNote); // Ajouter une note
router.put("/update/:id", noteController.updateNote); // Modifier une note
router.delete("/delete/:id", noteController.deleteNote); // Supprimer une note
router.get("/all", noteController.getAllNotes); // Get all note
router.get("/get/:matricule", noteController.getNotesByMatricule); // Récupérer les notes d'un étudiant

module.exports = router;
