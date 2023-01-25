const router = require("express").Router();
const auth = require('../middleware/auth');
const task_ctrl = require("../controllers/task.controller");

// Enregistement des endpoints et redirection des requetes vers les methodes du controller
router.get("/", auth,task_ctrl.get_tasks);
router.post("/", auth,task_ctrl.create_task);
router.get("/:id", auth, task_ctrl.get_one_task);
router.put("/:id", auth, task_ctrl.update_task);
router.delete("/:id", auth, task_ctrl.delete_task);

module.exports = router;
