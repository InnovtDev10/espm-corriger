'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Stage extends Model {
    static associate(models) {
      // define association here si nécessaire
    }
  }

  Stage.init({
    matricule: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false
    },
    prenom: {
      type: DataTypes.STRING,
      allowNull: false
    },
    niveau: {
      type: DataTypes.STRING,
      allowNull: false
    },
    filiere: {
      type: DataTypes.STRING,
      allowNull: false
    },
    etablissementAcceuil: {
      type: DataTypes.STRING,
      allowNull: false
    },
    departement: {
      type: DataTypes.STRING,
      allowNull: false
    },
    service: {
      type: DataTypes.STRING,
      allowNull: false
    },
    anneeUniv: {
      type: DataTypes.STRING,
      allowNull: false 
    }, 
    dateDebut: {
      type: DataTypes.DATE,
      allowNull: false
    },  
    dateFin: {
      type: DataTypes.DATE,
      allowNull: false
    },
    observation: {
      type: DataTypes.TEXT,
      allowNull: true  
    }                      
  }, {
    sequelize,
    modelName: 'Stage',
  });

  return Stage;
};
