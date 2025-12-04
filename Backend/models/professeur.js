module.exports = (sequelize, DataTypes) => {
  const Professeur = sequelize.define("Professeur", {
    matricule: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prenom: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    date_naissance: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    lieu_naissance: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sexe: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    telephone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    adresse: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    departement: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    specialite: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date_embauche: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    statut: {
      type: DataTypes.STRING,
      defaultValue: "Actif",
    },
    photo_profil: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cv: { 
      type: DataTypes.STRING,
      allowNull: false,
    },
    lm: {  
      type: DataTypes.STRING,
      allowNull: false,
    },
    diplome: {  
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Professeur;
};
