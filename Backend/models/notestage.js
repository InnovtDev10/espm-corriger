module.exports = (sequelize, DataTypes) => {
  const NoteStage = sequelize.define("NoteStage", {
    matricule: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prenom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    niveau: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filiere: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    etablissement: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    anneeUniv: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notes: {
      type: DataTypes.JSONB,  
      allowNull: false, 
    },
  });

  return NoteStage;
};
