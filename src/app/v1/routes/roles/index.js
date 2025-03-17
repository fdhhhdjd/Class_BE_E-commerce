const express = require("express");
const RoleController = require("../../controllers/role.controller");
const router = express.Router();

router.get("/", RoleController.getRolesHandler);
router.get("/:roleId", RoleController.getRoleHandler);
router.post("/", RoleController.createRoleHandler);
router.patch("/", RoleController.updateRoleHandler);
router.delete("/", RoleController.deleteRoleHandler);

module.exports = router;
