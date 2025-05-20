const express = require("express");
const UserController = require("../../controllers/user.controller");
// const UserRoleController = require("../../controllers/user_role.controller");
const AuthMiddleware = require("../../middlewares/auth.middleware");
// const RBACMiddleware = require("../../middlewares/rbac.middleware");
// const RBACConstants = require("../../../share/constants/rbac.constants");
const router = express.Router();

router.use(AuthMiddleware.checkToken);

//* Users
router.get("/profile", UserController.getUser);
router.post("/update", UserController.updateUser);
router.post("/update-password", UserController.updatePassword);

//* User Roles
// router.get(
//   "/:userId/roles",

//   RBACMiddleware.checkPermission(RBACConstants.Role.Views),
//   UserRoleController.getUserRolesHandler
// );
// router.post(
//   "/:userId/roles/:roleId",
//   RBACMiddleware.checkPermission(RBACConstants.User.Assign),
//   UserRoleController.assignRoleToUserHandler
// );

// router.delete(
//   "/:userId/roles/:roleId",
//   RBACMiddleware.checkPermission(RBACConstants.User.Revoke),
//   UserRoleController.removeRoleFromUserHandler
// );

module.exports = router;
