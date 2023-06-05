const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user');
const crypto = require('crypto');
require('dotenv').config()

// passport FACEBOOK Strategy for authentication
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_client_ID,
    clientSecret: process.env.FACEBOOK_client_Secret,
    callbackURL: process.env.FACEBOOK_callback_URL,
    profileFields: ['id', 'displayName', 'photos', 'email'],
    enableProof: true
},
    async function (accessToken, refreshToken, profile, done) {
        try {

            let user = await User.findOne({ email: profile.emails[0].value })

            if (user) {
                done(null, user);
            } else {
                let newUser = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                })
                done(null, newUser)
            }

        } catch (err) {
            console.log("error in facebook strategy", err);
            return done(err);
        }
    }
));

