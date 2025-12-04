'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Matiere extends Model {
    static associate(models) {
      // define association here
    }
  }
  Matiere.init({
    filiere: DataTypes.STRING,
    matieres: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Matiere',
  });
  return Matiere;
};