const express = require("express");
const bcrypt = require("bcrypt");
const { authorizationMiddleware } = require("../middlewares/authMiddleware");
const User = require("../database/models/User");
const Role = require("../database/models/Role");
const router = express.Router();

/* GET users listing. */
router.get("/", authorizationMiddleware(["ADMIN", "MANAGER"]), async function (
  req,
  res,
  next
) {
  const { page, per_page, department } = req.query;

  const roles = await Role.find({ role: { $in: ["ADMIN", "MANAGER"] } });
  const adminRole = roles.find((r) => r.role === "ADMIN");
  const managerRole = roles.find((r) => r.role === "MANAGER");
  let query = { role_id: { $nin: [adminRole._id] } };

  if (req.user.role === "MANAGER")
    query = { role_id: { $nin: [adminRole._id] } };

  if (department) {
    query = { ...query, department_id: department };
  }
  const userCount = await User.countDocuments(query);

  const users = await User.find(query, { password: 0, __v: 0 })
    .skip((+page - 1) * +per_page)
    .limit(+per_page)
    .populate("role_id")
    .populate("department_id")
    .exec();
  res.json({ users, count: userCount, page: page });
});

// PATCH: Route /users/change-password

router.patch("/change-password", async (req, res, next) => {
  const loggedInUser = req.user.user_id;
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(loggedInUser);
  console.log(currentPassword, user.password);
  bcrypt.compare(currentPassword, user.password, async (err, same) => {
    if (err || !same)
      res.json({ error: "Wrong current password. Please check again." });
    else {
      const password = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));
      const result = await User.updateOne(
        { _id: loggedInUser },
        {
          password,
        }
      );
      res.json(result);
    }
  });
});

router.get(
  "/:id",
  authorizationMiddleware(["ADMIN", "MANAGER"]),
  async function (req, res, next) {
    const roles = await Role.find({ role: { $in: ["ADMIN", "MANAGER"] } });
    const adminRole = roles.find((r) => r.role === "ADMIN");
    let query = { _id: req.params.id, role_id: { $nin: [adminRole._id] } };
    const user = await User.findOne(query, { password: 0, __v: 0 })
      .populate("role_id")
      .populate("department_id");

    res.json(user);
  }
);

router.post("/", authorizationMiddleware(["ADMIN"]), async (req, res, next) => {
  const password = bcrypt.hashSync(req.body.email, bcrypt.genSaltSync(10));
  const user = await User.create({ ...req.body, password });
  res.json(user);
});

router.delete(
  "/",
  authorizationMiddleware(["ADMIN"]),
  async (req, res, next) => {
    let _ids = req.query._ids.split(",");
    const result = await User.deleteMany({ _id: { $in: _ids } });
    res.json(result);
  }
);

module.exports = router;
