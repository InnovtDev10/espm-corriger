'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class paiementEcolage extends Model {
    static associate(models) {
      // define association here
    }
  }
  paiementEcolage.init({
    matricule: DataTypes.STRING,
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    niveau: DataTypes.STRING,
    filiere: DataTypes.STRING,
    montantParMois: DataTypes.DECIMAL, 
    moisEffectuer: DataTypes.JSON, 
    moisRestant: DataTypes.JSON,   
    anneeUniv: DataTypes.STRING, 
  }, {
    sequelize,
    modelName: 'paiementEcolage',
  });
  return paiementEcolage;     
};                             
