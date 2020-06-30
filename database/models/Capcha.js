const mongoose = require("mongoose");

const captchaSchema = new mongoose.Schema({
  text: String,
});

const Captcha = mongoose.model("Captcha", captchaSchema);

module.exports = Captcha;
