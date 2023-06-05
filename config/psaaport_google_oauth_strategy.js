const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
require('dotenv').config();


// passport GOOGLE Strategy for authentication
passport.use(new googleStrategy({
    clientID:process.env.GOOGLE_client_ID,
    clientSecret:process.env.GOOGLE_client_Secret,
    callbackURL:process.env.GOOGLE_callback_URL
},
 async function(accessToken, refreshToken, profile, done){
    try{
        let user = await User.findOne({email: profile.emails[0].value});

        if(user){
            done(null, user)
        }else{
           let newuser = await  User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            })

            return done(null, newuser);
        }

    }catch(err){
        return console.log("error in google strategy...", err);
    }
 }
))
