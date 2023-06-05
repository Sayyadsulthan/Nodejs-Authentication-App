const express = require('express');
 require('dotenv').config()
 require('crypto');
require('bcrypt');
const port =process.env.PORT || 8000;
const app = express();
const ejs = require('ejs');
const ejsLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

// passport is used for authentication 
const passport = require('passport');
const passportLocals = require('./config/passport_local_strategy');
const passportGoogle = require('./config/psaaport_google_oauth_strategy');
const  passportFacebook = require('./config/passport_facebook_oauth_strategy');
const session = require('express-session');
const mongoStore = require('connect-mongo');
const flash = require('connect-flash');
const customMflash = require('./config/customeMiddleware');

app.use(express.urlencoded({extended:true}));

// setting up static files
app.use(express.static('./assets'));
app.use('uploads', express.static(__dirname + '/uploads'));

// using ejs layouts for setup views
app.use(ejsLayouts);

app.set('views', './views');
app.set('view engine', 'ejs');

app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// session creation for authentication
app.use(session({
    name: "authentication",
    secret: 'nodejs',
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: (1000 * 60 * 100)
    },
    store: mongoStore.create({
        mongoUrl: process.env.DB_URI,
        autoRemove: 'disabled'
    })
}))

// passport initialization for use of middlewares
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMflash.setFlash)


app.use('/', require('./routes'));

app.listen(port, function(err){
    if(err){
        console.log("err in listening to port: ", port);
        return;
    }

    console.log("app server is running on port :",port);
})