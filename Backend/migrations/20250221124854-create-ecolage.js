'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Ecolages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      niveau: { 
        type: Sequelize.STRING,
        allowNull: false
      },
      specialite: { 
        type: Sequelize.STRING,
        allowNull: false
      },
      droit: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      ecolage: {
        type: Sequelize.DECIMAL(10, 2),
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
    await queryInterface.dropTable('Ecolages');
  }
};
