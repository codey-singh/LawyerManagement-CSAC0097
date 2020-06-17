require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const profileRouter = require("./routes/profile");
const authRouter = require("./routes/auth");
const { authenticateMiddleware } = require("./middlewares/authMiddleware");
const app = express();

// Database connection logic starts
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("we're connected!");
});
// Database connection logic ends

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/api/v1/users", authenticateMiddleware, usersRouter);
app.use("/api/v1/profile", authenticateMiddleware, profileRouter);
app.use("/api/v1/auth", authRouter);

module.exports = app;
