'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SortieMateriels', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      designation: {
        type: Sequelize.STRING
      },
      natureSortie: {
        type: Sequelize.STRING
      },
      quantite: {
        type: Sequelize.INTEGER
      },
      prixUnitaire: {
        type: Sequelize.DECIMAL
      },
      nomPersonne: {
        type: Sequelize.STRING
      },
      prixTotal: {
        type: Sequelize.DECIMAL
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
    await queryInterface.dropTable('SortieMateriels');
  }
};