const express = require("express");
const { authorizationMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

module.exports = router;
