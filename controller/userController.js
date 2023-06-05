const User = require('../models/user');
const OTPMailer = require('../mailers/OTP_mailer');
// const bcryptdoc = require('../config/bcryptdoc');
const bcrypt = require('bcrypt');

// used to hash the password / encrypt
async function hashPassword(plaintextPassword) {
    const hash = await bcrypt.hash(plaintextPassword, 10);
    // Store hash in the database
    return hash;
}

// generate randome otp
function generateOTP() {
    let pass = '';
    for (i = 0; i < 6; i++) {
        pass += Math.floor(Math.random() * 10);
    }

    return pass;
}

module.exports.sign_in = function (req, res) {
    return res.render('sign_in');
}

module.exports.sign_up = function (req, res) {
    return res.render('sign_up');
}

// to create user in db
module.exports.create = async function (req, res) {

    try {
        let user = await User.findOne({ email: req.body.email })

        if (!user) {

        //    calling hashpassword method to encrypt password
           let encryptedData= await hashPassword(req.body.password);

            await User.create({
                name: req.body.name,
                email: req.body.email,
                password: encryptedData
            })

            req.flash('success', "sign in to continue..");
            console.log("user created...");
            return res.redirect('/users/sign_in');
        }

        req.flash('warning', "User already Exist!..")
        console.log("user already exist..")
        return res.redirect('/users/sign_in');

    } catch (err) {
        req.flash('error', "Internal Server Error..")
        console.log("error in creating user:", err);
        return res.redirect('/users/sign_up');
    }
}

module.exports.login = function (req, res) {
    return res.redirect('/');
}

module.exports.createSession = function (req, res) {
    req.flash('success', "You have Logged in..")
    console.log('user login successfull..')
    return res.redirect('/');
}

module.exports.destroySession = function (req, res) {
    req.logout(function (err) {
        if (err) { console.log("err in logout: ", err); return }
        req.flash('success', "You are logged out...")
        return res.redirect('/users/sign_in');
    })
}

// FOR RESET PASSWORD

module.exports.forgot_password = function (req, res) {

    return res.render('forgot_password');
}

// to store the otp which sent to mail & check / compare with user otp
let otp;

module.exports.reset_password = async function (req, res) {

    try {

        let user = await User.findById(req.params.id);

        if (user) {
            // sending otp to email
            otp = generateOTP();

            OTPMailer.newOTP(user, otp);
            console.log("otp sent To User ", user.email)
            req.flash('success', 'Check your Email to see OTP..')
            return res.redirect('/users/verify_otp');
        }

        console.log("Email not match in db..");
        return res.redirect("back");
    } catch (err) {
        req.flash('error', "Internal Server Error..")
        console.log("error ", err);
        return res.redirect("back");
    }
}

module.exports.verify_otp = function (req, res) {
    return res.render('verify_otp');
}

module.exports.set_Password = function (req, res) {
    return res.render('set_Password');
}


module.exports.verifyOTP = async function (req, res) {

    try {
        

        if (otp == req.body.otp) {
            console.log("otp matches..")
            let user = await User.findOne({ email: req.body.verifyUserEmail });

            return res.render('set_Password', {
                verifyUser: user
            })
        }
        req.flash('error', "Please Enter a OTP Sent to Email..")
        console.log("otp not match..");
        return res.redirect("back");

    } catch (err) {
        req.flash('error', "Internal Server Error..")
        console.log("error ", err);
        return res.redirect("back");
    }
}

// Reset password To user
module.exports.set_password = async function (req, res) {

        try {
            let user = await User.findOne({ email: req.body.verifyUserEmail })
            if (req.body.newpassword == req.body.confirm_password) {

                // encrypt password using bcrypt
                let encryptedData = await hashPassword(req.body.newpassword);

                user.password = encryptedData;
                user.save()
                console.log("password is updated..")
                return res.redirect('/')
            } else {
                console.log("password not match..")
                return res.redirect('/');
            }
        } catch (err) {
            req.flash('error', "Internal Server Error..")
            console.log("error ", err);
            return res.redirect("back");
        }
    
}