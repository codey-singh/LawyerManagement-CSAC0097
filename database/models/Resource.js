const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  resourceName: String,
  resourceUri: String,
});

const Resource = mongoose.model("Resource", resourceSchema);

module.exports = Resource;
