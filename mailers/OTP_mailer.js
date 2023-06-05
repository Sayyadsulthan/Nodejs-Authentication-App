const nodeMailer = require('../config/nodemailer');
require('dotenv').config();

exports.newOTP= function(user, otp){
    let htmlString = nodeMailer.renderTemplate({verifyUser:user, otp:otp}, '/otp/newOTP.ejs')
    
    nodeMailer.transporter.sendMail({
        from:process.env.NODE_MAILER_AUTH_USER,
        to:user.email,
        subject:'One Time Password for Authentication',
        html: htmlString
    },
    function(err, info){
        if(err){console.log("err in sending mail...", err); return};

        console.log('message sent To..', info);
        return;
    })
}