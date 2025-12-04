'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('paiementEcolages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      matricule: {
        type: Sequelize.STRING
      },
      nom: {
        type: Sequelize.STRING
      },
      prenom: {
        type: Sequelize.STRING
      },
      niveau: {
        type: Sequelize.STRING
      },
      filiere: {
        type: Sequelize.STRING
      },
      montantParMois: {
        type: Sequelize.DECIMAL
      },
      moisEffectuer: {
        type: Sequelize.JSON 
      },
      moisRestant: {
        type: Sequelize.JSON 
      },
      anneeUniv: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('paiementEcolages');
  }
};
