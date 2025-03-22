const express = require("express");
const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/users", require("./users"));
router.use("/media", require("./media"));

router.use("/roles", require("./roles"));
router.use("/permissions", require("./permissions"));
router.use("/accounts", require("./account"));

module.exports = router;
