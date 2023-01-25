/**
 * Model sequelize pour la persistance de donnes
 * Permet de creer me model Task utilise par sequelize pour generer la table et persister les donnees
 * @param {Sequilize} sequelize Instance de la DB
 * @param {DataTypes} datatypes Permet de specifier le type des attributs du model
 */
module.exports = (sequelize, datatypes) => {
  const Task = sequelize.define("Task", {
    //Attributs de la table "Task"
    title: {
      type: datatypes.STRING,
      allowNull: false,
      validate: {
        min: 1,
        max: 100,
      },
    },
    content: {
      type: datatypes.TEXT,
      validate: {
        max: 2000,
      },
    },
    day: {
      type: datatypes.DATE,
      allowNull: false,
      validate: {
        max: 70,
      },
    },
    time: {
      type: datatypes.TIME,
      validate: {
        max: 50,
      },
    },
    taskColor: {
      type: datatypes.STRING,
      validate: {
        max: 50,
      },
    },
  });

  return Task;
};
