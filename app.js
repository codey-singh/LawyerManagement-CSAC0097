require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const profileRouter = require("./routes/profile");
const departmentRouter = require("./routes/departments");
const rolesRouter = require("./routes/roles");
const accessRequestsRouter = require("./routes/accessrequests");
const authRouter = require("./routes/auth");
const captchaRouter = require("./routes/captcha");
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

// basic middleware configuration.
app.use(cors({ origin: "*" }));
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// routes without any authentication
app.use("/", indexRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/captcha", captchaRouter);

// routes with authentication
app.use("/api/v1/users", authenticateMiddleware, usersRouter);
app.use("/api/v1/profile", authenticateMiddleware, profileRouter);
app.use("/api/v1/departments", authenticateMiddleware, departmentRouter);
app.use("/api/v1/roles", authenticateMiddleware, rolesRouter);
app.use("/api/v1/accessrequests", authenticateMiddleware, accessRequestsRouter);

module.exports = app;
