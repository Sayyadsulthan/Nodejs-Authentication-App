const flash = require('connect-flash');

// to pass the flash messages in locals for ejs 
module.exports.setFlash= function ( req, res, next){
    res.locals.flash ={
        "success": req.flash('success'),
        "error": req.flash('error'),
        "warning": req.flash('warning')
    }

    next();
 }