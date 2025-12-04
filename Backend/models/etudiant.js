module.exports = (sequelize, DataTypes) => {
  const Etudiant = sequelize.define("Etudiant", {
    matricule: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    nom: {
      type: DataTypes.STRING,
      allowNull: false
    },
    prenom: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    date_naissance: {
      type: DataTypes.DATE,
      allowNull: false
    },
    lieu_naissance: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sexe: {
      type: DataTypes.ENUM("Homme", "Femme"),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    telephone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    adresse: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    nationalite: {
      type: DataTypes.STRING,
      allowNull: false
    },
    filiere: {
      type: DataTypes.STRING,
      allowNull: false
    },
    niveau: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date_inscription: {
      type: DataTypes.DATE, 
      allowNull: false
    },
    statut: {
      type: DataTypes.ENUM("Actif", "Suspendu", "Diplômé"),
      defaultValue: "Actif"
    },
    photo_profil: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nomPrenomPere: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    telPere: {  
      type: DataTypes.STRING,
      allowNull: false
    },
    nomPrenomMere: {
      type: DataTypes.STRING,
      allowNull: false
    },
    telMere: {  
      type: DataTypes.STRING,
      allowNull: false
    },
    numeroCIN: {  
      type: DataTypes.STRING,
      allowNull: false
    },
    dateDelivranceCIN: {  
      type: DataTypes.DATE,
      allowNull: false
    },
    diplome_bacc: {
      type: DataTypes.BOOLEAN,
      defaultValue: false  
    },
    certificat_residence: {
      type: DataTypes.BOOLEAN,
      defaultValue: false 
    },
    reglement_interieur: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      acte_de_naissance: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      photocopie_cin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      photo_identite: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      acte_de_mariage: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      fiche_de_transfert: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      carton_chemise: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      enveloppe: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      gant: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      alcool: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
  });

  return Etudiant;
};
