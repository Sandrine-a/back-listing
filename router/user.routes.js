const express = require("express");
const router = require("express").Router();

const user_ctrl = require("../controllers/user.controller");
const auth = require("../middleware/auth");

// Enregistement des endpoints et redirection des requetes vers les methodes du controller

router.post("/signup", user_ctrl.create_user); // Pour SIGNUP
router.post("/token", user_ctrl.get_user_token); // Pour AVOIR LE TOKEN
router.get("/me", auth, user_ctrl.get_one_user); // Pour GET USER
router.post("/forgot_password", user_ctrl.send_forgot_email); // Pour le forgotPass

router.put("/reset_password/", user_ctrl.reset_password); //Reset password
router.put("/:id", auth, user_ctrl.update_user); //Update username et/Ou mdp

router.delete("/:id", auth, user_ctrl.delete_user); // POUR DELETE

router.get("/", auth, user_ctrl.get_users); // Pour GET All USER



// router.put("/reset_password/", user_ctrl.reset_password);

// router.post("/reset_password/", user_ctrl.reset_password);

// router.get("/reset_password/:id/:token", user_ctrl.reset_password)

// router.post(`/reset_password/reset_password/:id/:token`, user_ctrl.reset_password);


module.exports = router;
