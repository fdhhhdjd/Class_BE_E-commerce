const express = require("express");
const AccountController = require("../../controllers/account.controller");
const RBACConstants = require("../../../share/constants/rbac.constants");
const RBACMiddleware = require("../../middlewares/rbac.middleware");
const AuthMiddleware = require("../../middlewares/auth.middleware");
const router = express.Router();

router.use(AuthMiddleware.checkToken);

router.get(
  "/",
  RBACMiddleware.checkPermission(RBACConstants.User.Views),
  AccountController.getAccounts
);
router.get(
  "/:id",
  RBACMiddleware.checkPermission(RBACConstants.User.View),
  AccountController.getAccount
);
router.post(
  "/",
  RBACMiddleware.checkPermission(RBACConstants.User.Create),
  AccountController.createAccount
);

router.patch(
  "/:id",
  RBACMiddleware.checkPermission(RBACConstants.User.Update),
  AccountController.updateAccount
);

router.delete(
  "/:id",
  RBACMiddleware.checkPermission(RBACConstants.User.Delete),
  AccountController.deleteAccount
);

module.exports = router;
