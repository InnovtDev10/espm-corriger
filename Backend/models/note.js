'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Note extends Model {
    static associate(models) {
      // define association here
    }
  }
  Note.init({
    matricule: DataTypes.STRING,
    nom: DataTypes.STRING,
    prenom: DataTypes.STRING,
    niveau: DataTypes.STRING,
    filiere: DataTypes.STRING,
    notes: {
      type: DataTypes.JSONB,  
      allowNull: false, 
    },   
    anneeUniv: DataTypes.STRING
  }, { 
    sequelize,
    modelName: 'Note',
  });
  return Note;
};