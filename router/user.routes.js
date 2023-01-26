const express = require('express');
const router = express.Router();

const user_ctrl = require("../controllers/user.controller");
const auth = require("../middleware/auth");

// Enregistement des endpoints et redirection des requetes vers les methodes du controller

router.post("/signup", user_ctrl.create_user); // Pour SIGNUP
router.post("/token", user_ctrl.get_user_token); // Pour AVOIR LE TOKEN
router.get("/me", auth, user_ctrl.get_one_user); // Pour GET USER
router.delete("/:id", auth, user_ctrl.delete_user); // POUR DELETE
router.put("/:id", auth ,user_ctrl.update_user); //// Voir changement mdp

module.exports = router;
