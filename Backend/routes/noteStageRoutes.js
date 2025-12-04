const express = require('express');
const router = express.Router();
const { createNoteStage, getAllNotesStage, getNoteStageByMatricule } = require('../controllers/noteStageController');

// Route pour créer une nouvelle note de stage
router.post('/add', createNoteStage);
router.get('/all', getAllNotesStage);
router.get('/get/:matricule', getNoteStageByMatricule);

module.exports = router;
