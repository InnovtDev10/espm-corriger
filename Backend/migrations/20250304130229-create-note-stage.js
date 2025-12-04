'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('NoteStages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      matricule: { 
        type: Sequelize.STRING,
        allowNull: false,
      },
      nom: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      prenom: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      niveau: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      filiere: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      etablissement: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      anneeUniv: {
        type: Sequelize.STRING,
        allowNull: false, 
      },
      notes: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('NoteStages');
  },
};
