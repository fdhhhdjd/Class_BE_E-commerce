const express = require("express");
const UserController = require("../../controllers/user.controller");
const UserRoleController = require("../../controllers/user_role.controller");
const AuthMiddleware = require("../../middlewares/auth.middleware");
const router = express.Router();

router.use(AuthMiddleware.checkToken);

// User
router.get("/profile", UserController.getUser);
router.post("/update", UserController.updateUser);

// User Role
router.post(
  "/:userId/roles/:roleId",
  UserRoleController.assignRoleToUserHandler
);

router.get("/:userId/roles", UserRoleController.getUserRolesHandler);

router.delete(
  "/:userId/roles/:roleId",
  UserRoleController.removeRoleFromUserHandler
);

module.exports = router;
