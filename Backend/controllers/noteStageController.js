const { NoteStage } = require('../models'); 

// Contrôleur pour créer une nouvelle note de stage
const createNoteStage = async (req, res) => {
  try {
    // Extraction des données du corps de la requête
    const { matricule, nom, prenom, niveau, filiere, etablissement, anneeUniv, notes } = req.body;

    // Création d'un nouvel enregistrement dans la base de données
    const newNoteStage = await NoteStage.create({
      matricule,
      nom,
      prenom,
      niveau,
      filiere, 
      etablissement,
      anneeUniv,
      notes,
    });

    // Réponse de succès
    return res.status(201).json({
      message: 'Note de stage ajoutée avec succès', 
      data: newNoteStage,
    });
  } catch (error) {
    // Gestion des erreurs
    console.error(error);
    return res.status(500).json({
      message: 'Erreur lors de l\'ajout de la note de stage',
      error: error.message,
    });
  }
};

const getAllNotesStage = async (req, res) => {
  try {
    const notes = await NoteStage.findAll();
    return res.status(200).json({
      message: 'Liste des notes de stage récupérée avec succès',
      data: notes,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erreur lors de la récupération des notes de stage",
      error: error.message,
    });
  }
};

// Contrôleur pour récupérer une note de stage par ID
const getNoteStageByMatricule = async (req, res) => {
  try {
    const { matricule } = req.params;
    const note = await NoteStage.findOne({ where: { matricule } });

    if (!note) {
      return res.status(404).json({
        message: 'Note de stage non trouvée',
      });
    }

    return res.status(200).json({
      message: 'Note de stage récupérée avec succès',
      data: note,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Erreur lors de la récupération de la note de stage",
      error: error.message,
    });
  }
};

module.exports = {
  createNoteStage,
  getAllNotesStage,
  getNoteStageByMatricule,
};

