/**
 * FIchier qui permet de configurer l'acces a la BD et d'enregistrer les differents models via les routes
 */
const dbConfig = require("../config/db.config"); // Import des config d'acces a la BDD
const { Sequelize, DataTypes } = require("sequelize");

/**
 * Creation de l'instance Sequelize via les infos venant du fichier de dbconfig
 */
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.DIALECT,
  port: dbConfig.PORT,
});

const db = {
  sequelize,
  DataTypes,
  User: require("./user.model")(sequelize, DataTypes), // Utilisation du model User pour la synchronisation
  Task: require("./task.model")(sequelize, DataTypes), // Utilisation du model task pour la synchronisation
};

// Ajout de la relation 1 user has many tasks - 1 TO MANY RELATION
db.User.hasMany(db.Task, {
  foreignKey: "user_id",
  as: "task",
  onDelete: "cascade",
  
});
db.Task.belongsTo(db.User, {
  foreignKey: "user_id",
  as: "user",
});

module.exports = db;
