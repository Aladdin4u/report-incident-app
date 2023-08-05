const express = require("express");
const upload = require("../middleware/multer");
const reports = require("../controllers/reports");
const { ensureAuth } = require("../middleware/auth");
const router = express.Router();

router.get("/", reports.reportIndex);
router.post("/", ensureAuth, upload.single("file"), reports.reportCreatePost);
router.get("/create", ensureAuth, reports.reportCreateGet);
router.get("/:id", ensureAuth, reports.reportDetails);
router.get("/edit/:id", ensureAuth, reports.reportEdit);
router.put(
  "/edit/:id",
  ensureAuth,
  upload.single("file"),
  reports.reportUpdateEdit
);
router.delete("/:id", ensureAuth, reports.reportDelete);

module.exports = router;
