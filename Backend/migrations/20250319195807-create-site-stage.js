'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const { DataTypes } = Sequelize;
    await queryInterface.createTable('SiteStages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      }, 
      nomEtablissement: {
        type: Sequelize.STRING
      },
      natureStage: { 
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
      },
      serviceStage: { 
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
    await queryInterface.dropTable('SiteStages');
  }
};