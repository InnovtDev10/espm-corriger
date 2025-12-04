'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;
    await queryInterface.createTable('Frais', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nom: {
        type: Sequelize.STRING
      },
      montant: { 
        type: Sequelize.DECIMAL
      },
      description: {
        type: Sequelize.STRING
      },
      niveau: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
      },
      specialite: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Frais');
  }
};
