const User= require('../models/user');

module.exports.index =async function(req, res){
    if(req.isAuthenticated()){
        let user =await User.findById(req.user.id);
        return res.render('home');
    }
}