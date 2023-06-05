const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const { realpath } = require('fs');
require('dotenv').config();


let transporter = nodemailer.createTransport({
    service:'gmail',
    host:'smtp.gmail.com',
    port: 587,
    secure: false,
    auth:{
        user:process.env.NODE_MAILER_AUTH_USER,
        pass:process.env.NODE_MAILER_AUTH_PASS
    }
})

let renderTemplate = (data, relativePath)=>{
    let mainHTML;
    ejs.renderFile(
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function(err, temlate){
            if(err){
                console.log("err in rendering template: ", err);
                return
            }

            mainHTML = temlate;
        }
    )
    return mainHTML;

}   

module.exports={
    transporter: transporter,
    renderTemplate: renderTemplate
}