const express = require('express');

const router = express.Router();

const homeController = require('../controller/index');
const passport = require('passport');

// if user authenticated then home page will render
router.get('/', passport.checkAuthenticatedUser, homeController.index);

// uses middle ware for routes 
router.use('/users', require('./users'));

module.exports = router;