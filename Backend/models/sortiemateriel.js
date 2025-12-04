'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SortieMateriel extends Model {
    static associate(models) {
      // define association here
    }
  }
  SortieMateriel.init({
    designation: DataTypes.STRING,
    natureSortie: DataTypes.STRING,
    quantite: DataTypes.INTEGER,
    prixUnitaire: DataTypes.DECIMAL,
    nomPersonne: DataTypes.STRING,
    prixTotal: DataTypes.DECIMAL,
  }, {
    sequelize,
    modelName: 'SortieMateriel',
  });
  return SortieMateriel;
};