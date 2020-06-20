const express = require("express");
const router = express.Router();
const Department = require("../database/models/Department");

/* GET home page. */
router.get("/", async function (req, res, next) {
  const departments = await Department.find({});
  console.log(departments);
  res.json(departments);
});

module.exports = router;
