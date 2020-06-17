require("dotenv").config();
const mongoose = require("mongoose");

const User = require("./database/models/User");
const Department = require("./database/models/Department");
const Role = require("./database/models/Role");
const bcrypt = require("bcrypt");

const password = bcrypt.hashSync("admin", bcrypt.genSaltSync(10));

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", async function () {
  console.log("we're connected!");
  if (await Department.findOne()) {
    await Department.collection.drop();
  }

  await Department.collection.insertMany([
    { name: "Criminal law", desc: "Criminal Law Department" },
    { name: "Traffic Tickets", desc: "Traffic Tickets Department" },
    { name: "Technology", desc: "Technology Department" },
    { name: "Corporate Law", desc: "Corporate Law" },
    { name: "Immigration", desc: "Immigration Department" },
  ]);
  if (await Role.findOne()) await Role.collection.drop();

  await Role.collection.insertMany([
    { role: "ADMIN" },
    { role: "MANAGER" },
    { role: "GENERAL" },
  ]);

  const adminRoleId = await Role.find({ role: "ADMIN" });
  if (await User.findOne()) await User.collection.drop();
  await User.create({
    firstname: "Admin",
    lastname: "User",
    dob: new Date(1992, 04, 20),
    email: "admin@lmp.com",
    password: password,
    contact: "9898988989",
    address1: "line 1",
    address2: "line 2",
    role_id: adminRoleId._id,
  });

  db.close();
});
