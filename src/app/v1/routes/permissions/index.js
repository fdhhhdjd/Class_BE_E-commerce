const express = require("express");
const PermissionController = require("../../controllers/permission.controller");
const router = express.Router();

router.get("/", PermissionController.getPermissionsHandler);
router.get("/:permissionId", PermissionController.getPermissionHandler);
router.post("/", PermissionController.createPermissionHandler);
router.patch("/", PermissionController.updatePermissionHandler);
router.delete("/", PermissionController.deletePermissionHandler);

module.exports = router;
