'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Materiel extends Model {
    static associate(models) {
      // define association here
    }
  }
  Materiel.init({ 
    designation: DataTypes.STRING,
    quantite: DataTypes.INTEGER,
    quantiteReste: DataTypes.INTEGER,
    prixUnitaire: DataTypes.FLOAT,
    prixTotal: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Materiel',
  });
  return Materiel;
};