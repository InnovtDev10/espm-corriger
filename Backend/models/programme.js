'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Programme extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Programme.init({
    filiere: DataTypes.STRING,
    niveau: DataTypes.STRING,
    semestre: DataTypes.STRING,
    uniteEnseignement: DataTypes.STRING,
    matiere: DataTypes.STRING,
    professeur: DataTypes.STRING,
    anneeAcademique: DataTypes.STRING,
    volumeHoraireTotal: DataTypes.INTEGER,
    volumeHoraireEffectuer: DataTypes.INTEGER,
    credit: DataTypes.INTEGER 
  }, {
    sequelize,
    modelName: 'Programme',
  });
  return Programme;
};