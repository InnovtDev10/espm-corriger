'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Ecolage extends Model {
    static associate(models) {
      
    }
  }

  Ecolage.init({
    niveau: {
      type: DataTypes.STRING,
      allowNull: false
    },
    specialite: {
      type: DataTypes.STRING,
      allowNull: false
    },
    droit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    ecolage: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    anneeUniv: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Ecolage',
  });

  return Ecolage;
};
