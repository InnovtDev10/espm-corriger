'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AutreDepense extends Model {
    static associate(models) {
      // define association here
    }
  }
  AutreDepense.init({
    nom: DataTypes.STRING,
    description: DataTypes.STRING,
    montant: DataTypes.DECIMAL,
    modePaiement: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'AutreDepense',
  });
  return AutreDepense;
};