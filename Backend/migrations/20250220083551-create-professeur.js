'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Professeurs', {
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
      date_naissance: {
        type: Sequelize.DATE
      },
      lieu_naissance: {
        type: Sequelize.STRING
      },
      sexe: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      telephone: {
        type: Sequelize.STRING
      },
      adresse: {
        type: Sequelize.TEXT
      },
      departement: {
        type: Sequelize.STRING
      },
      specialite: {
        type: Sequelize.STRING
      },
      date_embauche: {
        type: Sequelize.DATE
      },
      statut: {
        type: Sequelize.STRING
      }, 
      photo_profil: {
        type: Sequelize.STRING
      },
      cv: {  
        type: Sequelize.STRING
      },
      lm: {  
        type: Sequelize.STRING
      },
      diplome: {  
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
    await queryInterface.dropTable('Professeurs');
  }
};