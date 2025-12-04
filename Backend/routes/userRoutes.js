const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const userController = require('../controllers/userController');

router.post('/signup', upload.single('photo'), userController.signup); //pour créer un compte
router.post('/login', userController.login); //pour se connecterx
router.get('/', userController.getAllUsers);
router.put('/:id', userController.updateUser); // Modifier un utilisateur
router.delete('/:id', userController.deleteUser); // Supprimer un utilisateur

module.exports = router;
 