const express = require('express');
const upload = require("../middleware/multer");
const rController = require('../controllers/rController')
const { ensureAuth } = require('../middleware/auth')
const router = express.Router();

router.get('/', rController.report_index)
router.post('/', ensureAuth, upload.single("file"), rController.report_create_post)
router.get('/create', ensureAuth, rController.report_create_get)
router.get('/:id', ensureAuth, rController.report_details)
router.get('/edit/:id', ensureAuth, rController.report_edit)
router.put('/edit/:id', ensureAuth, upload.single("file"), rController.report_up_edit)
router.delete('/:id', ensureAuth, rController.report_delete)

module.exports = router;