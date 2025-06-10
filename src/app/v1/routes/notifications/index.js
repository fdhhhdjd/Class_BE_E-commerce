const express = require("express");
const NotificationController = require("../../controllers/notification.controller");
const router = express.Router();

router.post("/", NotificationController.sendUserAllDevices);
router.post("/device", NotificationController.sendUserDevice);

module.exports = router;
