'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PaiementSalaire extends Model {
    static associate(models) {
      // define association here
    }
  }
  PaiementSalaire.init({
    matricule: DataTypes.STRING,
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    departement: DataTypes.STRING,
    mois: DataTypes.STRING,
    montant: DataTypes.FLOAT,
    modePaiement: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PaiementSalaire',
  });
  return PaiementSalaire;
};