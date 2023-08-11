const express = require("express");
const upload = require("../middleware/multer");
const reports = require("../controllers/reports");
const { ensureAuth } = require("../middleware/auth");
const router = express.Router();

router.get("/", reports.getAllReport);
router.post("/", ensureAuth, upload.single("file"), reports.create);
router.get("/create", ensureAuth, reports.getCreate);
router.get("/:id", ensureAuth, reports.getReportDetails);
router.get("/edit/:id", ensureAuth, reports.edit);
router.put(
  "/edit/:id",
  ensureAuth,
  upload.single("file"),
  reports.update
);
router.delete("/:id", ensureAuth, reports.delete);

module.exports = router;
