const { Programme } = require("../models");

exports.ajouterProgramme = async (req, res) => {
  try {
    const programme = await Programme.create(req.body);
    return res.status(201).json(programme);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Récupérer tous les programmes
exports.getProgrammes = async (req, res) => {
    try {
      const programmes = await Programme.findAll();
      return res.status(200).json(programmes);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };

  // Mettre à jour volumeHoraireEffectuer
exports.updateVolumeHoraire = async (req, res) => {
  try {
    const { id } = req.params;
    const { volumeHoraireEffectuer } = req.body;

    // Récupérer le programme existant
    const programme = await Programme.findByPk(id);
    if (!programme) {
      return res.status(404).json({ error: "Programme non trouvé" });
    }

    // Calculer le nouveau volume horaire
    const nouveauVolume = programme.volumeHoraireEffectuer + parseInt(volumeHoraireEffectuer, 10);

    // Vérifier que le nouveau volume ne dépasse pas le volume total
    if (nouveauVolume > programme.volumeHoraireTotal) {
      return res.status(400).json({ error: "Le volume horaire effectué dépasse le volume total autorisé." });
    }

    // Mettre à jour le volume horaire effectué
    programme.volumeHoraireEffectuer = nouveauVolume;
    await programme.save();

    return res.status(200).json(programme);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};