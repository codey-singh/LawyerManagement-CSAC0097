const mongoose = require("mongoose");

const accessRequestSchema = new mongoose.Schema({
  status: String,
  requestedAt: Date,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const AccessRequest = mongoose.model("AccessRequest", accessRequestSchema);

module.exports = AccessRequest;
