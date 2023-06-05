const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
// const cryptodoc = require('./bcryptdoc');
const crypto = require('crypto');
const bcrypt = require('bcrypt');


// encryption method
async function hashPassword(plaintextPassword) {
    const hash = await bcrypt.hash(plaintextPassword, 10);
    // Store hash in the database
    return hash;
}

// compare password
async function comparePassword(plaintextPassword, hash) {
    const result = await bcrypt.compare(plaintextPassword, hash);
    return result;
}

passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
},
    async function (req, email, password, done) {
        try {

            let user = await User.findOne({ email: email })


            // the decipher function

            if (user) {
                let decryptedData = await comparePassword(password, user.password);

                if (decryptedData) {
                    return done(null, user);
                }
            }

            req.flash('error', "email or password not match!.")
            return done(null, false);
        } catch (err) {
            return done(err)
        }
    }
))

passport.serializeUser(function (user, done) {
    try {

        return done(null, user.id);
    } catch (err) {
        return done(err);
    }
})

passport.deserializeUser(async function (id, done) {
    try {
        let user = await User.findById(id)

        return done(null, user);
    } catch (err) {
        return done(err);
    }
})

passport.setAuthenticatedUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    return next();

}

passport.checkAuthenticatedUser = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    return res.redirect('/users/sign_in');
}

module.exports = passport;