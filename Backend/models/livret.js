"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Livret extends Model {
    static associate(models) {
      // Ajouter les associations ici si nécessaire
    }
  }

  Livret.init(
    {
      matricule: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      prenom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      niveau: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      filiere: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      typeDocument: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      dateReception: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      anneeUniv: {
        type: DataTypes.STRING,
        allowNull: false 
      }, 
    },
    {
      sequelize,
      modelName: "Livret",
    }
  );

  return Livret;
};
