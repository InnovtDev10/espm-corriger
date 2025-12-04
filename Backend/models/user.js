module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    nom: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }, 
    role: {
      type: DataTypes.STRING,
      allowNull: false
    },
    statut: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Actif"  
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {});

  return User;
};
