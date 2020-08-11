const express = require("express");
const User = require("../database/models/User");
const router = express.Router();
const moment = require("moment");
const { authorizationMiddleware } = require("../middlewares/authMiddleware");
/* GET users listing. */
router.get("/", async function (req, res, next) {
  // my profile
  let loggedInUser = req.user.user_id;
  let userProfile = await User.findOne(
    { _id: loggedInUser },
    {
      email: 1,
      firstname: 1,
      lastname: 1,
      phonenumber: 1,
      department_id: 1,
      role_id: 1,
      dob: 1,
    }
  );

  res.json({
    ...userProfile._doc,
    dob: moment(userProfile._doc.dob).format("yyyy-MM-DD"),
  });
});

router.patch("/", async function (req, res, next) {
  // my profile
  let loggedInUser = req.user.user_id;

  if (req.body.department_id === "") req.body.department_id = null;
  const { email, firstname, lastname, dob, phonenumber } = req.body;
  console.log(req.body);
  let status = await User.updateOne(
    { _id: loggedInUser },
    {
      email,
      firstname,
      lastname,
      dob,
      phonenumber,
    }
  );
  res.json(status);
});

router.patch("/:id", async function (req, res, next) {
  let userId = req.params.id;
  console.log(req.body);
  const {
    email,
    firstname,
    lastname,
    dob,
    phonenumber,
    department_id,
    role_id,
  } = req.body;

  if (req.body.department_id === "") req.body.department_id = null;

  let status = await User.updateOne(
    { _id: userId },
    {
      email,
      firstname,
      lastname,
      dob,
      phonenumber,
      department_id,
      role_id,
    }
  );

  res.json(status);
});

router.get(
  "/:profile_id",
  authorizationMiddleware(["ADMIN", "MANAGER"]),
  async function (req, res, next) {
    let userProfile = await User.findOne({ _id: req.params.profile_id });

    res.json({
      ...userProfile._doc,
      password: null,
      dob: moment(userProfile._doc.dob).format("yyyy-MM-DD"),
    });
  }
);

module.exports = router;
