const express = require("express");
const MediaController = require("../../controllers/media.controller");
const upload = require("../../../share/utils/multer.util");

const router = express.Router();

router.get("/get", MediaController.getMedia);

router.post(
  "/upload/single",
  upload.single("file"),
  MediaController.uploadSingle
);
router.post(
  "/upload/multiple",
  upload.array("files"),
  MediaController.uploadMultiple
);
router.get("/delete/single", MediaController.deleteSingle);
router.post("/delete/multiple", MediaController.deleteMultiple);

module.exports = router;
