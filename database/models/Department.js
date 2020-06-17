const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: String,
  desc: String,
});

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
