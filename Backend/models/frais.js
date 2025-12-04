'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Frais extends Model {
    static associate(models) {
      // Définir ici les associations si nécessaire
    }
  }

  Frais.init({
    nom: {
      type: DataTypes.STRING,
      allowNull: false
    },
    montant: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING, 
      allowNull: true
    },
    niveau: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false
    }, 
    specialite: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Frais',
  });

  return Frais;
};
