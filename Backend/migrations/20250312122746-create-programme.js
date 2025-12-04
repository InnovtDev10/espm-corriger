'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Programmes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      filiere: {
        type: Sequelize.STRING
      },
      niveau: {
        type: Sequelize.STRING
      },
      semestre: {
        type: Sequelize.STRING
      },
      uniteEnseignement: {
        type: Sequelize.STRING
      },
      matiere: {
        type: Sequelize.STRING
      },
      professeur: {
        type: Sequelize.STRING
      },
      anneeAcademique: {
        type: Sequelize.STRING
      },
      volumeHoraireTotal: {
        type: Sequelize.INTEGER
      },
      volumeHoraireEffectuer: {
        type: Sequelize.INTEGER
      },
      credit: {  
        type: Sequelize.INTEGER 
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
    await queryInterface.dropTable('Programmes');
  }
};