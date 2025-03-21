const RBACConstants = {
  Admin: {
    Access: "admin.access",
  },
  User: {
    View: "get_user",
    Views: "gets_user",
    Create: "create_user",
    Update: "update_user",
    Delete: "delete_user",
    Assign: "assign.user_roles",
    Revoke: "revoke.user_roles",
  },
  Role: {
    View: "get_role",
    Views: "gets_role",
    Create: "create_role",
    Update: "update_role",
    Delete: "delete_role",
    Assign: "assign.role_permissions",
    Revoke: "revoke.role_permissions",
  },
  Permission: {
    View: "get_permission",
    Views: "gets_permission",
    Create: "create_permission",
    Update: "update_permission",
    Delete: "delete_permission",
  },
};

module.exports = RBACConstants;
