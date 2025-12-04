const { Note } = require("../models"); 

// 📌 Ajouter une note
exports.createNote = async (req, res) => {
    try {
        const { matricule, nom, prenom, niveau, filiere, notes, anneeUniv } = req.body;

        // Vérifier que tous les champs obligatoires sont fournis
        if (!matricule || !nom || !prenom || !niveau || !filiere || !notes || !anneeUniv) {
            return res.status(400).json({ message: "Tous les champs sont obligatoires" });
        }

        // Vérifier que `notes` est bien un objet JSON
        if (typeof notes !== 'object' || Array.isArray(notes)) {
            return res.status(400).json({ message: "Le format des notes est invalide, un objet JSON est requis" });
        }

        // Création de la note
        const newNote = await Note.create({ matricule, nom, prenom, niveau, filiere, notes, anneeUniv });
        return res.status(201).json(newNote);
    } catch (error) {
        console.error("Erreur lors de l'ajout de la note:", error);
        return res.status(500).json({ message: "Erreur serveur", error });
    }
};
                   
     
// 📌 Modifier une note par ID
exports.updateNote = async (req, res) => {
    try {
        const { id } = req.params; 
        const { matricule, nom, prenom, niveau, filiere, notes, anneeUniv } = req.body;

        // Vérifier que la note existe
        const noteToUpdate = await Note.findByPk(id);
        if (!noteToUpdate) {
            return res.status(404).json({ message: "Note non trouvée" });
        }

        // Vérifier que tous les champs obligatoires sont fournis
        if (!matricule || !nom || !prenom || !niveau || !filiere || !notes || !anneeUniv) {
            return res.status(400).json({ message: "Tous les champs sont obligatoires" });
        }

        // Vérifier que `notes` est bien un objet JSON
        if (typeof notes !== 'object' || Array.isArray(notes)) {
            return res.status(400).json({ message: "Le format des notes est invalide, un objet JSON est requis" });
        }

        // Mise à jour des champs
        noteToUpdate.matricule = matricule;
        noteToUpdate.nom = nom;
        noteToUpdate.prenom = prenom;
        noteToUpdate.niveau = niveau;
        noteToUpdate.filiere = filiere;
        noteToUpdate.notes = notes;
        noteToUpdate.anneeUniv = anneeUniv;
   
        // Sauvegarder les modifications 
        await noteToUpdate.save();

        return res.status(200).json(noteToUpdate);
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la note:", error);
        return res.status(500).json({ message: "Erreur serveur", error });
    }
};


// 📌 Supprimer une note par ID
exports.deleteNote = async (req, res) => {
    try {
        const { id } = req.params;

        const noteToDelete = await Note.findByPk(id);
        if (!noteToDelete) {
            return res.status(404).json({ message: "Note non trouvée" });
        }

        await noteToDelete.destroy();
        return res.status(200).json({ message: "Note supprimée avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression de la note:", error);
        return res.status(500).json({ message: "Erreur serveur", error });
    }
};

// 📌 Récupérer toutes les notes d'un étudiant par matricule
exports.getNotesByMatricule = async (req, res) => {
    try {
        const { matricule } = req.params;

        const notes = await Note.findAll({ where: { matricule } });
        if (notes.length === 0) {
            return res.status(404).json({ message: "Aucune note trouvée pour cet étudiant" });
        }

        return res.status(200).json(notes);
    } catch (error) {
        console.error("Erreur lors de la récupération des notes:", error);
        return res.status(500).json({ message: "Erreur serveur", error });
    }
};

// 📌 Récupérer toutes les notes
exports.getAllNotes = async (req, res) => {
    try {
        const notes = await Note.findAll();
        return res.status(200).json(notes);
    } catch (error) {
        console.error("Erreur lors de la récupération des notes:", error);
        return res.status(500).json({ message: "Erreur serveur", error });
    }
};
