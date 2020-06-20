const express = require("express");
const router = express.Router();
const Role = require("../database/models/Role");

/* GET home page. */
router.get("/", async function (req, res, next) {
  const roles = await Role.find({});
  console.log(roles);
  res.json(roles);
});

module.exports = router;
