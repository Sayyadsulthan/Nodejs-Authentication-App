const express = require('express');

const router = express.Router();

const homeController = require('../controller/index');
const passport = require('passport');

router.get('/', passport.checkAuthenticatedUser, homeController.index);

router.use('/users', require('./users'));

module.exports = router;