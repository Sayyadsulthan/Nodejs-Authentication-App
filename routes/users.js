const express = require('express');

const router = express.Router();

const userController = require('../controller/userController');
const passport = require('passport');


router.post('/create', userController.create);
router.get('/sign_in', userController.sign_in);
router.get('/sign_up', userController.sign_up);

// local Authentication
router.post('/createSession', passport.authenticate(
    'local',
    {failureRedirect: '/users/sign_in'}),
     userController.createSession);

    //  google Authentication 
router.get('/auth/google', passport.authenticate(
    'google', 
    {scope: ['profile','email']})
    );

    //  google Authentication callback 
router.get('/auth/google/callback', passport.authenticate(
    'google',
    {failureRedirect:'/users/sign_in'}
), userController.createSession);

    // facebook Authentication
router.get('/auth/facebook', passport.authenticate(
    'facebook',
    {scope: 'email'}
));
    // facebook Authentication callback
router.get('/auth/facebook/callback', passport.authenticate(
    'facebook',
    {failureRedirect: '/users/sign_in'}
), userController.createSession);


router.get('/destroy',passport.checkAuthenticatedUser, userController.destroySession);


    
// router.get('/forgot_password', userController.forgot_password);
router.post('/reset_password/:id',passport.checkAuthenticatedUser, userController.reset_password);
router.get('/verify_otp',passport.checkAuthenticatedUser, userController.verify_otp);
router.post('/verifyOTP',passport.checkAuthenticatedUser, userController.verifyOTP);
router.get('/set_Password',passport.checkAuthenticatedUser, userController.set_Password);

router.post('/set_password', userController.set_password);



module.exports = router;