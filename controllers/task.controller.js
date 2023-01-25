const { Task, User } = require("../models/index");;

/**
 * Permet la creation d'un nouvel employe en DB, si success retourne l'objet persiste
 * @param {Req} req la requete provenant du client
 * @param {Res} res la reponse a envoyer au client : id
 */
exports.create_task = (req, res) => {
  //Validation de la requete
  const title = req.body.title;
  const content = req.body.content;
  const day = req.body.day;
  const time = req.body.time ? req.body.time : null;
  const taskColor = req.body.taskColor;

  if (!title || !day)
    return res.status(400).json({ message: "title or day missing" });

  //Recherche de la task avec son id
  User.findOne({
    where: { id: req.auth.userId },
  })
    .then((user) => {
      console.log("userID =", user.id, user.email);
      const task = {
        title,
        content,
        day,
        time,
        taskColor,
        user_id: user.id,
      };
      Task.create(task)
        .then((data) => res.status(201).json({id: data.id}))
        .catch((error) =>
          res.status(400).json({ message: `Error create in DB  ${error}` })
        );
    })
    .catch((error) => res.status(400).json({ message: `Error ${error}` }));
};
/**
 * Permet la mdoficaition d'une task en DB, si success retourne l'objet persiste
 * @param {Req} req la requete provenant du client
 * @param {Res} res la reponse a construire et a envoyer au client
 */
exports.update_task = (req, res) => {
  //Recuperation du id de la task dans parametre url
  const id = Number(req.params.id);
  // Valider la requete
  if (!req.body.title || !req.body.day || !id)
    return res.status(400).json({ message: "Bad request" });

  //Recherche de la task avec son id
  Task.findOne({
    where: { id: id },
  })
    .then((task) => {
      //On verifie que le user dans le token est bien celui qui correspon a l'user_id
      if (task.user_id != req.auth.userId) {
        res.status(401).json({ message: "Unauthorized!" });
      } else {
        Task.update(req.body, { where: { id } })
          .then((number) => {
            console.log("ID ==,", id);
            if (number == 1) {
              res.json({ message: "Update success" });
            } else {
              console.log(number);
              res.json({ message: `Failed to find id = ${id} introuvable` });
            }
          })
          .catch((error) =>
            res
              .status(401)
              .json({ message: `Failed to find id = ${id} ${error}` })
          );
      }
    })
    .catch((error) => res.status(400).json({ message: `Error ${error}` }));
};

/**
 * Permet la suppression d'un employe en DB
 * @param {Req} req la requete provenant du client
 * @param {Res} res la reponse a construire et a envoyer au clien
 */
exports.delete_task = (req, res) => {
  //Recuperation de l'id de la task depuis les parametres url
  const id = Number(req.params.id);
  if (!id) {
    return res.status(400).json({ message: "Invalid id" });
  }

  //Recherche de la task avec son id
  Task.findOne({
    where: { id: id },
  })
    .then((task) => {
      //On verifie que le user dans le token est bien celui qui correspon a l'user_id
      if (task.user_id != req.auth.userId) {
        res.status(401).json({ message: "Unauthorized!" });
      } else {
        Task.destroy({ where: { id } })
          .then((number) => {
            if (number == 1) {
              console.log(number);
              res.json({ message: "Task deleted !" });
            } else {
              console.log(number);
              res.json({ message: `Failed to find id = ${id} introuvable` });
            }
          })
          .catch((error) =>
            res
              .status(401)
              .json({ message: `Failed to find id = ${id} ${error}` })
          );
      }
    })
    .catch((error) => res.status(400).json({ error }));
};

/**
 * Recupere la liste des tasks en DB et la retourne au client
 * @param {Req} req la requete provenant du client
 * @param {Res} res la reponse a construire et a envoyer au client
 */
exports.get_tasks = (req, res) => {
  //Recherche de la task avec son id
  User.findOne({
    where: { id: req.auth.userId },
  })
    .then((user) => {
      Task.findAll({
        where: { user_id: req.auth.userId },
        //Facultatif si je veux retrouver les details de la liaison
        // include: [
        //   {
        //     model: User,
        //     as: "user",
        //     attributes: { exclude: ["password"] },
        //   },
        // ],
      })
        .then((data) => res.json({ data }))
        .catch((error) => res.status(401).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));

  // Task.findAll({})
  //   .then((data) => res.json({ data }))
  //   .catch((error) =>
  //     res.status(500).json({ message: "Internal ERROR !", error })
  //   );
};


////////////////////////////////////////// -- ////////////////////////////////////////////////////////////
/**
 * Permet de trouver une task
 * @param {Req} req la requete provenant du client
 * @param {Res} res la reponse a construire et a envoyer au clien
 */
exports.get_one_task = (req, res) => {
  //Recuperation du id de la task dans parametre url
  const id = Number(req.params.id);

  // Valider la requete
  if (!id) return res.status(400).json({ message: "Id invalid" });

  Task.findOne({ where: { id: id } })
    .then((data) => res.json({ data }))
    .catch((error) => res.status(500).json({ message: "Internal", error }));
};
