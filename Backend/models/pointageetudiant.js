'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PointageEtudiant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PointageEtudiant.init({
    matricule: DataTypes.STRING,
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    niveau: DataTypes.STRING,
    filiere: DataTypes.STRING,
    raison: DataTypes.STRING, 
    dateDebut: DataTypes.DATE,
    dateFin: DataTypes.DATE,
    heureEntree: DataTypes.TIME,
    heureArrivee: DataTypes.TIME,
    motif: DataTypes.STRING,
    decision: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'PointageEtudiant',
  });
  return PointageEtudiant;
};