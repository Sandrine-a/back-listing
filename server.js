const express = require("express");
require("dotenv").config();

const app = express();
const logger = require("morgan"); // Import de morgan pour ajouter logs serveur
const cors = require("cors"); // Import du cors config

const db = require("./models/index");

const users_router = require("./router/user.routes");
const tasks_router = require("./router/task.routes");

// - MIDDLEWARE

// Configuration logs
app.use(logger("dev"));
// Configuration du CORS
app.use(cors());
// Configuration du parsin de la requete en json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// * ETAPE 2 - Etablissement de la connexion a la DB
db.sequelize
  .sync() //Synchronise tous les models automatiquement
  .then(() => console.log("Connected with database ok. Sync done!"))
  .catch((error) =>
    console.log("ERROR - Cannot connect with Database ", error)
  );

// - ROUTER

// Enregistrement des routes de l'API
// app.use("/api/v1", require("./routes"));
app.use("/api/v1/users", users_router);
app.use("/api/v1/tasks", tasks_router);

// - PORT
const PORT = process.env.PORT || 3000;

console.log(process.env);

// - SERVER
app.listen(PORT, () =>
  console.log(`Serveur en execution sur le port ${process.env.PORT}`)
);
