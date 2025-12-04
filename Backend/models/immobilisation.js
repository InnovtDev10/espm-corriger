'use strict';
const { 
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Immobilisation extends Model {
    static associate(models) {
      // define association here
    }
  }
  Immobilisation.init({
    titre: DataTypes.STRING,
    description: DataTypes.TEXT,
    montant: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Immobilisation',
  });
  return Immobilisation;
};