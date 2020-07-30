const express = require("express");
const router = express.Router();
const Role = require("../database/models/Role");

/* GET home page. */
router.get("/", async function (req, res) {
  const roles = await Role.find({ role: { $nin: ["ADMIN"] } });
  res.json(roles);
});

module.exports = router;
