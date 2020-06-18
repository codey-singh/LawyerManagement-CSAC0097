const express = require("express");
const router = express.Router();
const secret = process.env.AUTH_SECRET_KEY || "secretKey";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../database/models/User");
const Role = require("../database/models/Role");
const mongoose = require("mongoose");

let accessTokens = [];

router.post("/login", async function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) res.sendStatus(403);
  else {
    let user = await User.findOne({ email: username }).populate("role_id");
    console.log(user);
    if (user) {
      bcrypt.compare(password, user.password, async (err, same) => {
        if (err || !same)
          res.status(401).send("Username or password are incorrect");
        else {
          const accessToken = generateAccessToken({
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            role: user.role_id.role,
            user_id: user._id,
          });
          res.json({
            accessToken,
            name: user.firstname + " " + user.lastname,
            role: user.role_id.role,
            email: user.email,
            user_id: user._id,
          });
        }
      });
    } else {
      res.setStatus(403).send();
    }
  }
});

router.delete("/logout", function (req, res, next) {
  res.json({ msg: "app works" });
});

router.post("/register", async function (req, res, next) {
  const password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  let generalRole = await Role.findOne({ role: "GENERAL" });
  let user = await User.create({
    ...req.body,
    password,
    role_id: generalRole._id,
  });
  res.json({ ...user, password: null });
});

function generateAccessToken(user) {
  return jwt.sign(user, secret, { expiresIn: "1 d" });
}

module.exports = router;
