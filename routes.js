const router = require("express").Router();

router.use("/tasks", require("./router/task.routes"));
router.use("/users", require("./router/user.routes"));

module.exports = router;