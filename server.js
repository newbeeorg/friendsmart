const express = require('express');
const app = express();

const path = require("path");
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');

const configDB = require('./config/database.js');

mongoose.connect(configDB.jbossdb); //connect to our database

app.use(cookieParser());
app.use(bodyParser());

app.use(session({ secret:'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/',express.static(path.join(__dirname,'public')));

app.get('/login',function(req,res){res.sendFile(__dirname+"/public/html/login.html");});
app.get('/signup',function(req,res){res.sendFile(__dirname+"/public/html/signup.html");});

//Configuring passport here
require('./config/passport')(passport);

//Configuring routes here
require('./routes/routes')(app,passport);

const server = app.listen(8081,function(){
   var host = server.address().address;
   var port = server.address().port;
   console.log("app listening at http://%s:%s",host,port);
});
