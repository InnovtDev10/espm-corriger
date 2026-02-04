const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { 
  createEtudiant, 
  updateEtudiant, 
  deleteEtudiant, 
  getAllEtudiants, 
  countEtudiants, 
  debugEtudiants,
  updateEtudiantByMatricule 
} = require('../controllers/etudiantController');

// Routes avec gestion d'erreur pour multipart
router.post('/add', (req, res, next) => {
  upload.single('photo')(req, res, (err) => {
    if (err) {
      console.error('Erreur upload:', err);
      return res.status(400).json({ message: 'Erreur lors de l\'upload', error: err.message });
    }
    next();
  });
}, createEtudiant);

router.put('/update/:id', (req, res, next) => {
  upload.single('photo')(req, res, (err) => {
    if (err) {
      console.error('Erreur upload:', err);
      return res.status(400).json({ message: 'Erreur lors de l\'upload', error: err.message });
    }
    next();
  });
}, updateEtudiant);

// Correction: utiliser 'photo' au lieu de 'photo_profil' pour la cohérence
router.put('/update/by/:matricule', (req, res, next) => {
  upload.single('photo')(req, res, (err) => {
    if (err) {
      console.error('Erreur upload:', err);
      return res.status(400).json({ message: 'Erreur lors de l\'upload', error: err.message });
    }
    next();
  });
}, updateEtudiantByMatricule);

router.delete('/delete/:id', deleteEtudiant);
router.get('/tous', getAllEtudiants);
router.get('/count', countEtudiants);
router.get('/debug', debugEtudiants);

module.exports = router;