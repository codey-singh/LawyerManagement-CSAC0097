const express = require("express");
const router = express.Router();
const svgCaptcha = require("svg-captcha");

const Captcha = require("../database/models/Capcha");

router.get("/", async (req, res, next) => {
  const captcha = svgCaptcha.create();
  // pass the capcha.text t some table with a ref key.
  const nCaptcha = await Captcha.create({ text: captcha.text });

  res.json({
    captchaRef: nCaptcha._id,
    captcha: captcha.data,
  });
});

module.exports = router;
