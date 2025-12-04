'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Stages', {
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
      etablissementAcceuil: {
        type: Sequelize.STRING,
        allowNull: false 
      },
      departement: {
        type: Sequelize.STRING,
        allowNull: false 
      },
      service: {
        type: Sequelize.STRING,
        allowNull: false 
      },
      anneeUniv: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dateDebut: {
        type: Sequelize.DATE,
        allowNull: false
      },
      dateFin: {
        type: Sequelize.DATE,
        allowNull: false
      },
      observation: {
        type: Sequelize.TEXT,
        allowNull: true  
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
    await queryInterface.dropTable('Stages');
  }
};
