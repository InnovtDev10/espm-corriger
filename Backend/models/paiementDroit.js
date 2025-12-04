const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class PaiementDroit extends Model {}

  PaiementDroit.init(
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
      specialite: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      droit: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      montantPaye: { 
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      montantReste: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
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
      modelName: "PaiementDroit", 
      tableName: "PaiementDroits", 
      timestamps: true,
    }
  );

  return PaiementDroit;
};
