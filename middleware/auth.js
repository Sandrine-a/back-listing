const jwt = require("jsonwebtoken");

//Middleware d'authentification:
module.exports = (req, res, next) => {
  try {
    //On recupere le token dans le header (il est en indice 1 du split)
    const token = req.headers.authorization.split(" ")[1];
    //Fonction qui permet de verifier la validite du token
    const decodedToken = jwt.verify(token, process.env.USER_SECRET_TOKEN);
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
    // if (req.body.userId && req.body.userId !== userId) {
    //   throw new Error(" unauthorized User!");
    // } else {
    //   next();
    // }
  } catch (error) {
    res.status(401).json({ error: error });
  }
};
