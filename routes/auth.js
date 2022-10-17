const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')
const homecontroller = require('../controllers/home')
const rController = require('../controllers/rController')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

router.get('/', homecontroller.getIndex)
router.get('/about', homecontroller.getAbout)
router.get('/dashboard', ensureAuth, rController.getdashboard)
router.get('/login', ensureGuest, authController.getLogin)
router.post('/login', ensureGuest, authController.postLogin)
router.get('/logout', authController.logout)
router.get('/signup', ensureGuest, authController.getSignup)
router.post('/signup', ensureGuest, authController.postSignup)

module.exports = router