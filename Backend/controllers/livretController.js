const { Livret } = require("../models");

// Ajouter un livret
const addLivret = async (req, res) => {
  try {
    const { matricule, nom, prenom, niveau, filiere, typeDocument, description, dateReception,anneeUniv } = req.body;

    if (!matricule || !nom || !prenom || !niveau || !filiere || !typeDocument || !dateReception || !anneeUniv ) {
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
    }

    const livret = await Livret.create({
      matricule,
      nom,
      prenom,
      niveau,
      filiere,
      typeDocument,
      description,
      dateReception,
      anneeUniv,
    });

    res.status(201).json({ message: "Livret ajouté avec succès", livret });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'ajout du livret" });
  }
};

// Récupérer tous les livrets
const getAllLivrets = async (req, res) => {
  try {
    const livrets = await Livret.findAll();
    res.status(200).json(livrets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des livrets" });
  }
};

// Récupérer un livret par ID
const getLivretById = async (req, res) => {
  try {
    const { id } = req.params;
    const livret = await Livret.findByPk(id);

    if (!livret) {
      return res.status(404).json({ message: "Livret non trouvé" });
    }

    res.status(200).json(livret);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération du livret" });
  }
};

module.exports = {
  addLivret,
  getAllLivrets,
  getLivretById,
};
