const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  dob: Date,
  email: { type: String, unique: true },
  password: String,
  contact: String,
  address1: String,
  address2: String,
  phonenumber: String,
  role_id: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  department_id: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
