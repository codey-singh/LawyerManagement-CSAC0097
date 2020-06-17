const mongoose = require("mongoose");

const rolePermissionSchema = new mongoose.Schema({
  permission: String,
  roleId: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  resourceId: { type: mongoose.Schema.Types.ObjectId, ref: "Resource" },
});

const RolePermission = mongoose.model("RolePermission", rolePermissionSchema);

module.exports = RolePermission;
