const { ListeDocument } = require("../models");
const path = require("path");

// Ajouter un document
const addDocument = async (req, res) => {
  try {
    const { documentName, description } = req.body;

    // Vérifier si un fichier a bien été uploadé
    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier sélectionné." });
    }

    const filePath = req.file.path; // Chemin du fichier enregistré

    // Créer le document en base de données
    const newDocument = await ListeDocument.create({
      documentName,
      description,
      filePath,
    });

    return res.status(201).json(newDocument);
  } catch (error) {
    console.error("Erreur lors de l'ajout du document :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// Récupérer tous les documents
const getAllDocuments = async (req, res) => {
  try {
    const documents = await ListeDocument.findAll();
    return res.status(200).json(documents);
  } catch (error) {
    console.error("Erreur lors de la récupération des documents :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
};

// Télécharger un fichier
const downloadDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await ListeDocument.findByPk(id);

    if (!document) {
      return res.status(404).json({ message: "Document non trouvé." });
    }

    return res.download(path.resolve(document.filePath));
  } catch (error) {
    console.error("Erreur lors du téléchargement du document :", error);
    return res.status(500).json({ message: "Erreur serveur." });
  }
}; 

module.exports = { addDocument, getAllDocuments, downloadDocument };
