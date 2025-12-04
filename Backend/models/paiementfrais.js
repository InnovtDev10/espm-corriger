'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PaiementFrais extends Model {
    static associate(models) {
      
    }
  }

  PaiementFrais.init(
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
      nomFrais: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      montant: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      montantPayer: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      montantReste: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      modePaiement: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      anneeUniv: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'PaiementFrais',
      timestamps: true, 
    }
  );

  return PaiementFrais;
};
