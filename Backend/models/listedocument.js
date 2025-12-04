"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ListeDocument extends Model {
    static associate(models) {
      // Définir les associations ici si nécessaire
    }
  }

  ListeDocument.init(
    {
      documentName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      filePath: {
        type: DataTypes.STRING,
        allowNull: false, 
      },
    },
    {
      sequelize,
      modelName: "ListeDocument",
    }
  );

  return ListeDocument;
};
