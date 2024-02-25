const router = require("express").Router();

const isAuthorised = require("../middleware/index.js");
const {
  signupController,
  signinController,
  deleteSessionController,
  dashboardController,
} = require("../controller/user.controller.js");
//signup
router.post("/signup", signupController);
//login
router.post("/signin", signinController);

router.get("/dashboard", isAuthorised, dashboardController);

router.delete("/:choice", isAuthorised, deleteSessionController);

module.exports = router;
