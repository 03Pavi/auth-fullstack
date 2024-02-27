const router = require("express").Router();
const multer = require("multer");

const isAuthorised = require("../middleware/index.js");
const {
  signupController,
  signinController,
  deleteSessionController,
  dashboardController,
  imageUploadController,
} = require("../controller/user.controller.js");
//signup
router.post("/signup", signupController);
//login
router.post("/signin", signinController);

router.get("/dashboard", isAuthorised, dashboardController);

router.delete("/:choice", isAuthorised, deleteSessionController);

//multer implementation
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/uploads");
  }, //cb is callback
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// single
// const uploadImg = multer({
//   storage: storage,
// }).single("image");

//multiple
const uploadImg = multer({
  storage: storage,
}).array("image", 12);

router.post("/uploads", uploadImg, imageUploadController);

module.exports = router;
