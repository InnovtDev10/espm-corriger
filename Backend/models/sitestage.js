'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SiteStage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  
  SiteStage.init({
    nomEtablissement: DataTypes.STRING,
    natureStage: {        
      type: DataTypes.ARRAY(DataTypes.STRING),  
      allowNull: false,
    },
    serviceStage: {        
      type: DataTypes.ARRAY(DataTypes.STRING),  
      allowNull: false,
    },
  }, { 
    sequelize,
    modelName: 'SiteStage',
  });
  
  return SiteStage;
};
