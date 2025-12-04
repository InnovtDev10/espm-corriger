'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PaiementFrais', { 
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      matricule: {
        type: Sequelize.STRING, 
        allowNull: false
      },
      nom: {
        type: Sequelize.STRING,
        allowNull: false
      },
      prenom: {
        type: Sequelize.STRING,
        allowNull: false
      },
      niveau: {
        type: Sequelize.STRING,
        allowNull: false
      },
      filiere: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nomFrais: {
        type: Sequelize.STRING,
        allowNull: false
      },
      montant: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false
      },
      montantPayer: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false
      },
      montantReste: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false
      }, 
      modePaiement: {
        type: Sequelize.STRING,
        allowNull: false
      },     
      anneeUniv: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: { 
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PaiementFrais'); 
  }
};
