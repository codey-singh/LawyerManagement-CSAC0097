const express = require("express");
const { authorizationMiddleware } = require("../middlewares/authMiddleware");
const User = require("../database/models/User");
const router = express.Router();

/* GET users listing. */
router.get("/", async function (req, res, next) {
  // my profile
  let loggedInUser = req.user.user_id;
  let userProfile = await User.findOne({ _id: loggedInUser });

  res.json({ ...userProfile._doc, password: null });
});

router.get("/:profile_id", async function (req, res, next) {
  // my profile
  let userProfile = await User.findOne({ _id: req.params.profile_id });

  res.json({ ...userProfile._doc, password: null });
});

module.exports = router;
