const RBACConstants = {
  User: {
    View: "user.view",
    Create: "user.create",
    Update: "user.update",
    Delete: "user.delete",
    UserRoleAssign: "user.role.assign",
    UserRoleDelete: "user.role.delete",
  },
  Role: {
    View: "role.view",
    Create: "role.create",
    Update: "role.update",
    Delete: "role.delete",
    RoleAssign: "role.assign",
    RoleDelete: "role.delete",
  },
  Permission: {
    View: "permission.view",
    Create: "permission.create",
    Update: "permission.update",
    Delete: "permission.delete",
  },

  Admin: {
    Access: "admin.access",
  },
};

module.exports = RBACConstants;
