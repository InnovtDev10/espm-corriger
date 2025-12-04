const { PaiementDroit, Etudiant } = require('../models');

// ✅ Ajouter un paiement
const addPaiement = async (req, res) => { 
    try {
        const { matricule, nom, prenom, niveau, specialite, droit, montantPaye, montantReste, anneeUniv, modePaiement } = req.body;

        // Vérification de l'existence de l'étudiant
        const etudiant = await Etudiant.findOne({ where: { matricule } });
        if (!etudiant) {
            return res.status(400).json({ message: "L'étudiant avec ce matricule n'existe pas." });
        }

        // Vérification des données obligatoires
        if (!matricule || !nom || !prenom || !niveau || !droit || !montantPaye || !anneeUniv || !modePaiement) {
            return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
        }

        // Création de l'enregistrement
        const paiement = await PaiementDroit.create({
            matricule,
            nom,    
            prenom,
            niveau,  
            specialite,
            droit,
            montantPaye,
            montantReste,
            anneeUniv,
            modePaiement
        });  

        res.status(201).json({ message: "Paiement ajouté avec succès", paiement });
    } catch (error) {
        console.error("Erreur lors de l'ajout du paiement:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// ✅ Modifier un paiement
const updatePaiement = async (req, res) => { 
    try {
        const { id } = req.params; 

        // Vérification si l'enregistrement du paiement existe              
        const paiement = await PaiementDroit.findByPk(id);
        if (!paiement) {
            return res.status(404).json({ message: "Paiement non trouvé" });
        }

        // Récupération des données envoyées depuis le frontend
        const { 
            matricule, 
            nom, 
            prenom, 
            niveau, 
            specialite, 
            droit, 
            montantPaye, 
            montantReste, 
            anneeUniv, 
            modePaiement 
        } = req.body; 

        // Mise à jour des données du paiement
        paiement.matricule = matricule || paiement.matricule;
        paiement.nom = nom || paiement.nom;
        paiement.prenom = prenom || paiement.prenom;
        paiement.niveau = niveau || paiement.niveau;
        paiement.specialite = specialite || paiement.specialite;
        paiement.droit = droit || paiement.droit;

        // Calcul du montant payé total
        const updatedMontantPaye = parseFloat(montantPaye) + parseFloat(montantReste);
        paiement.montantPaye = updatedMontantPaye;
        paiement.montantReste = 0; // Réinitialiser le montant restant à 0

        paiement.anneeUniv = anneeUniv || paiement.anneeUniv;
        paiement.modePaiement = modePaiement || paiement.modePaiement;

        // Sauvegarde des modifications
        await paiement.save();

        // Réponse de succès
        res.json({ message: "Paiement mis à jour avec succès", paiement });
    } catch (error) {
        console.error("Erreur lors de la mise à jour:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};


// ✅ Obtenir tous les paiements
const getAllPaiements = async (req, res) => {
    try {
        const paiements = await PaiementDroit.findAll();
        res.json(paiements);
    } catch (error) {
        console.error("Erreur lors de la récupération des paiements:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// ✅ Obtenir un paiement par matricule
const getPaiementByMatricule = async (req, res) => {
    try {
        const { matricule } = req.params;
        const paiement = await PaiementDroit.findOne({ where: { matricule } });

        if (!paiement) {
            return res.status(404).json({ message: "Aucun paiement trouvé pour ce matricule" });
        }

        res.json(paiement);
    } catch (error) {
        console.error("Erreur lors de la récupération du paiement:", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports = {
    addPaiement,
    updatePaiement,
    getAllPaiements,
    getPaiementByMatricule
};
