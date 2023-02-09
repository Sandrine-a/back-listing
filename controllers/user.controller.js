const { User, Task } = require("../models/index");
//Import de bcrypt pour hash des mpd
const bcrypt = require("bcrypt");
//Importer jsonwebtoken pour générer des tokens d'authentification
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
/**
 * Permet la creation d'un nouvel iser en DB, si success retourne l'objet persiste
 * @param {Req} req la requete provenant du client
 * @param {Res} res la reponse envoye en clien: userId et email
 */
exports.create_user = (req, res) => {
  //Validation de la requete
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  if (!email || !username || !password)
    return res.status(400).json({ message: "Data missing" });

  //La validation par unique fait qu'il ne peut y avoir 2 adresses identiques en bdd

  //Hash du mdp pour l'enregistrer en bdd
  bcrypt
    .hash(password, 10)
    .then((hash) => {
      // Creer user a enregistrer
      const user = {
        email: email,
        username: username,
        password: hash,
        isAdmin: false,
      };
      User.create(user)
        .then((user) =>
          res.status(201).json({ userId: user.id, email: user.email })
        )
        .catch((error) =>
          res.status(400).json({ message: `Error create in DB  ${error}` })
        );
    })
    .catch((error) =>
      res.status(500).json({ message: `Error with DB  ${error}` })
    );
};

/**
 * Permet de trouver un user
 * @param {Req} req la requete provenant du client
 * @param {Res} res la reponse sous forme userId, username, email
 */
exports.get_one_user = (req, res) => {
  //Recuperation du id du user dans parametre url
  const id = req.auth.userId;

  console.log(id);
  //Recherche du user avec id du token
  User.findOne({ where: { id: req.auth.userId } })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Bad credentials !" });
      } else {
        res.status(200).json({
          userId: user.id,
          username: user.username,
          email: user.email,
        });
      }
    })
    .catch((error) =>
      res.status(500).json({ message: "Internal error", error })
    );
};

/**
 * Permet de d'avoir un token
 * @param {Req} req la requete provenant du client
 * @param {Res} res la reponse forme body: userId et token
 */
exports.get_user_token = (req, res) => {
  //Recuperation du id du user dans parametre url
  const email = req.body.email;
  const password = req.body.password;

  // Valider la requete
  if (!email || !password)
    return res.status(400).json({ message: "Data missing!" });

  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Bad credentials !" });
      } else {
        console.log("user ==", user);
        bcrypt
          .compare(password, user.password)
          .then((valid) => {
            if (!valid) {
              return res.status(401).json({ error: "Bad credentials !" });
            } else {
              res.status(200).json({
                userId: user.id,
                token: jwt.sign(
                  { userId: user.id, isAdmin: user.isAdmin },
                  process.env.USER_SECRET_TOKEN
                ),
              });
            }
          })
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) =>
      res.status(500).json({ message: "Internal error", error })
    );
};

/**
 * Permet la MAJ d'un user en DB
 * @param {Req} req la requete provenant du client
 * @param {Res} res la reponse a construire et a envoyer au client
 */
exports.update_user = (req, res) => {
  const id = Number(req.params.id);

  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;

  // Valider la requete
  if (!id)
    return res.status(400).json({ message: "Invalid, email, username or id" });

  if (id != req.auth.userId) {
    res.status(401).json({ message: "Unauthorized!" });
  } else {
    if (password) {
      bcrypt.hash(password, 10).then((hash) => {
        const user = {
          email: email,
          username: username,
          password: hash,
        };
        // Update the password in the database
        User.update(user, { where: { id } })
          .then((number) => {
            if (number == 1) {
              res.json({ message: "Update successed !" });
            } else {
              res.json({ message: `User with ID ${id} not found!` });
            }
          })
          .catch((error) =>
            res.status(500).json({
              message: `Error updating password for user with ID ${id}`,
              error,
            })
          );
      });
    } else {
      console.log("no pass");
      const user = {
        email: email,
        username: username,
      };
      // Update only user email and/or username
      User.update(user, { where: { id } })
        .then((number) => {
          if (number == 1) {
            res.json({ message: "Update successed !" });
          } else {
            res.json({ message: `User with ID ${id} not found!` });
          }
        })
        .catch((error) =>
          res.status(500).json({
            message: `Error updating password for user with ID ${id}`,
            error,
          })
        );
    }
  }
};

/**
 * Permet la suppression d'un user en DB
 * @param {Req} req la requete provenant du client
 * @param {Res} res la reponse a construire et a envoyer au clien
 */
exports.delete_user = (req, res) => {
  const id = Number(req.params.id); //Recuperation du id du parametre url

  console.log("auth admin ==", req.auth.isAdmin);
  console.log("id params", id);
  console.log("req.auth.userId ==", req.auth.userId);

  if (!id) {
    return res.status(400).json({ message: "Invalid user" });
  }

  // Valider si le user dans l'authentification est = au user concerné
  if (!req.auth.isAdmin && id != req.auth.userId) {
    res.status(401).json({ message: "Unauthorized!" });
  } else {
    User.destroy({ where: { id } })
      .then((number) => {
        if (number == 1) {
          res.json({ message: "User is deleted !" });
        } else {
          res.json({ message: `User id = ${id} not found !` });
        }
      })
      .catch((error) =>
        res.status(500).json({ message: `Failed to delete = ${id}`, error })
      );
  }
};

////////////////////////////////////////// -- ////////////////////////////////////////////////////////////
/**
 * Permet la modification du password
 * @param {Req} req la requete provenant du client
 * @param {Res} res la reponse a construire et a envoyer au client
 */
exports.update_user_password = (req, res) => {
  const id = Number(req.params.id);
  const newPassword = req.body.password;

  // Validate the request
  if (!id || !newPassword) {
    return res
      .status(400)
      .json({ message: "Invalid request, missing user ID or new password" });
  }

  // Check if the user is authorized to update this account
  if (id != req.auth.userId) {
    res.status(401).json({ message: "Unauthorized!" });
  } else {
    // Hash the new password
    bcrypt.hash(newPassword, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({
          message: `Error hashing password for user with ID ${id}`,
          error: err,
        });
      }

      // Update the password in the database
      User.update({ password: hash }, { where: { id } })
        .then((number) => {
          if (number == 1) {
            res.json({ message: "Password updated successfully!" });
          } else {
            res.json({ message: `User with ID ${id} not found!` });
          }
        })
        .catch((error) =>
          res.status(500).json({
            message: `Error updating password for user with ID ${id}`,
            error,
          })
        );
    });
  }
};

/**
 * Permet de trouver un user
 * @param {Req} req la requete provenant du client
 * @param {Res} res la reponse sous forme userId, username, email
 */
exports.get_users = (req, res) => {
  //Recuperation du id du user dans parametre url
  //Recherche du user avec id du token

  User.findAll({})
    .then((data) => {
      console.log(data.length);
      res.json({ data });
    })
    .catch((error) =>
      res.status(500).json({ message: "Internal ERROR !", error })
    );
};

/**
 * Permet l'envoi du mail du mdp oublié
 * @param {Req} req la requete provenant du client
 * @param {Res} res la reponse envoye au client
 */
exports.send_forgot_email = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("Email === ", email);
    //Recherche du user avec email
    User.findOne({ where: { email: email } })
      .then(async (userExist) => {
        if (!userExist) {
          return res.status(401).json({ error: "User unknown !" });
        } else {
          const secret = process.env.USER_SECRET_TOKEN + userExist.password;
          const token = jwt.sign(
            { userId: userExist.id, isAdmin: userExist.isAdmin },
            secret,
            { expiresIn: "7min" }
          );

          // const link = `http://localhost:3000/api/v1/users/reset_password/${userExist.id}/${token}`;
          // const link = `exp://127.0.0.1:19000/api/v1/users/reset_password/?id=${userExist.id}&token=${token}`;

          const link = `listingapp://api/v1/users/reset_password/?id=${userExist.id}&token=${token}`

          await sendEmail(email, link);
          res.send("mail envoyé sur sandrine");
        }
      })
      .catch((error) =>
        res.status(500).json({ message: "Internal error", error })
      );
  } catch (error) {}
};

/**
 * Permet l'envoi du mail du mdp oublié
 * @param {Req} req la requete provenant du client
 * @param {Res} res la reponse envoye au client
 */
exports.reset_password = (req, res) => {
  console.log("REESETTTTTT");
  // const { id, token } = req.query;
  const id = req.query.id;
  const token = req.query.token;

  const newPassword = req.body.password;

  console.log("req.query du reset_password ==", id);

  //On vérifie si les data sont bonnes
  // Recherche du user avec email

  User.findOne({ where: { id: id } })
    .then((userExist) => {
      if (!userExist) {
        return res.status(401).json({ error: "User unknown !" });
      } else {
        try {
          const secret = process.env.USER_SECRET_TOKEN + userExist.password;

          const verify = jwt.verify(token, secret);

          console.log(verify);
          // Hash the new password
          bcrypt.hash(newPassword, 10, (err, hash) => {
            if (err) {
              return res.status(500).json({
                message: `Error hashing password for user with ID ${id}`,
                error: err,
              });
            }

            // Update the password in the database
            User.update({ password: hash }, { where: { id } })
              .then((number) => {
                if (number == 1) {
                  res.json({ message: "Password updated successfully!" });
                } else {
                  res.json({ message: `User with ID ${id} not found!` });
                }
              })
              .catch((error) =>
                res.status(500).json({
                  message: `Error updating password for user with ID ${id}`,
                  error,
                })
              );
          });

          // sendEmail("sandrine_a971@yahoo.fr");
        } catch (error) {
          return res.status(401).json({ error: "Bad credentials !" });
        }
      }
    })
    .catch((error) =>
      res.status(500).json({ message: "Internal error", error })
    );
};
