'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PointageProfesseur extends Model {
    static associate(models) {
      // define association here
    }
  }
  PointageProfesseur.init({
    matricule: DataTypes.STRING,
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    departement: DataTypes.STRING,
    raison: DataTypes.STRING,
    motif: DataTypes.STRING,
    dateDebut: DataTypes.DATE,
    dateFin: DataTypes.DATE,
    heureEntree: DataTypes.TIME,
    heureArrivee: DataTypes.TIME
  }, {
    sequelize,
    modelName: 'PointageProfesseur',
  });
  return PointageProfesseur;
};