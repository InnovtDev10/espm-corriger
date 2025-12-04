const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Clé secrète pour JWT (à placer dans les variables d'environnement en production)
const SECRET_KEY = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";  

// Fonction pour créer un utilisateur (inscription)
exports.signup = async (req, res) => {
    try {
        const { nom, email, password, role } = req.body;
        let photo = null;
        // Vérifier si un fichier est fourni et l'ajouter  
        if (req.file) { 
           photo = req.file.filename;   
        }  

        // Vérifier si l'utilisateur existe déjà 
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: "L'utilisateur existe déjà !" });
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Création de l'utilisateur
        const user = await User.create({
            nom, 
            email,
            password: hashedPassword,
            role,
            statut: "Actif",
            photo
        });

        res.status(201).json({ message: "Utilisateur créé avec succès", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
 
// Fonction pour se connecter (authentification)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifier si l'utilisateur existe
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Vérifier le mot de passe
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }

        // Générer le token JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        // Répondre avec le token et les données de l'utilisateur
        res.status(200).json({
            message: "Connexion réussie",
            token,
            user: {
                id: user.id,
                nom: user.nom,
                email: user.email,
                role: user.role,
                statut: user.statut,
                photo: user.photo, 
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll(); 
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs" });
    }
};


// Modifier un utilisateur
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, email, role, statut } = req.body;

        // Trouver l'utilisateur
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Mettre à jour l'utilisateur
        user.nom = nom || user.nom;
        user.email = email || user.email;
        user.role = role || user.role;
        user.statut = statut || user.statut;

        await user.save();

        res.status(200).json({ message: "Utilisateur mis à jour", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Supprimer un utilisateur
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Trouver l'utilisateur
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Supprimer l'utilisateur
        await user.destroy();

        res.status(200).json({ message: "Utilisateur supprimé avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};