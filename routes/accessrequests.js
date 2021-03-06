const express = require("express");
const router = express.Router();
const AccessRequest = require("../database/models/AccessRequest");
const { authorizationMiddleware } = require("../middlewares/authMiddleware");

const User = require("../database/models/User");
const Role = require("../database/models/Role");

/* GET home page. */
router.get("/", authorizationMiddleware(["ADMIN"]), async function (
  req,
  res,
) {
  const { page, per_page } = req.query;

  const requestCount = await AccessRequest.countDocuments({});

  const accessRequests = await AccessRequest.find({})
    .limit(+per_page)
    .skip((+page - 1) * +per_page)
    .populate("user")
    .exec();

  res.json({ requests: accessRequests, count: +requestCount, page: +page });
});

router.get(
  "/my",
  authorizationMiddleware(["ADMIN", "MANAGER", "GENERAL"]),
  async function (req, res) {
    const accessRequest = await AccessRequest.findOne({
      user: req.user.user_id,
    }).populate("user");
    res.json(accessRequest);
  }
);

router.patch("/:req_id", authorizationMiddleware(["ADMIN"]), async function (
  req,
  res,
) {
  const req_id = req.params.req_id;
  const status = req.body.status;
  const accessRequests = await AccessRequest.update(
    { _id: req_id },
    {
      status,
    }
  );
  // Todo : Update access rights after approval
  console.log(accessRequests);
  res.json(accessRequests);
});

router.patch("/", authorizationMiddleware(["ADMIN"]), async function (
  req,
  res,
) {
  const status = req.body.status;
  const _ids = req.body.selectedRows.map((row) => row._id);
  const userIds = req.body.selectedRows.map((row) => row.user);
  const accessRequests = await AccessRequest.updateMany(
    { _id: { $in: _ids } },
    {
      status,
    }
  );
  if (status === "APPROVED") {
    const managerRole = await Role.findOne({ role: "MANAGER" });
    await User.updateMany(
      { _id: { $in: userIds } },
      { role_id: managerRole._id }
    );
  }
  res.json(accessRequests);
});

router.post("/", authorizationMiddleware(["GENERAL"]), async function (
  req,
  res,
) {
  const userId = req.user.user_id;
  const accessRequests = await AccessRequest.create({
    status: "ACTIVE",
    requestedAt: new Date(),
    user: userId,
  });
  res.json(accessRequests);
});

module.exports = router;
