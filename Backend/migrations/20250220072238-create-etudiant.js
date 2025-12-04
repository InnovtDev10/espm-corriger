'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Etudiants', {
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
      nationalite: {
        type: Sequelize.STRING
      },
      filiere: {
        type: Sequelize.STRING
      },
      niveau: {
        type: Sequelize.STRING
      },
      date_inscription: {
        type: Sequelize.DATE
      },
      statut: {
        type: Sequelize.STRING
      },
      nomPrenomPere: {
        type: Sequelize.STRING
      },
      telPere: {
        type: Sequelize.STRING
      },
      nomPrenomMere: {
        type: Sequelize.STRING
      },
      telMere: {
        type: Sequelize.STRING
      },
      numeroCIN: {
        type: Sequelize.STRING
      },
      dateDelivranceCIN: {
        type: Sequelize.DATE 
      },
      diplome_bacc: {
        type: Sequelize.BOOLEAN,
        defaultValue: false, 
      },
      certificat_residence: {
        type: Sequelize.BOOLEAN,
        defaultValue: false, 
      },
      reglement_interieur: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      acte_de_naissance: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      photocopie_cin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      photo_identite: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      acte_de_mariage: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      fiche_de_transfert: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      carton_chemise: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      enveloppe: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      gant: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      alcool: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      photo_profil: { 
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
    await queryInterface.dropTable('Etudiants');
  }
};