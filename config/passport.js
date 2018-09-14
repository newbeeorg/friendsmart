const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const cons = require('../config/constants.js');

module.exports = function(passport){

  passport.serializeUser(function(user,done){
    done(null,user.id);
  });

  passport.deserializeUser(function(id,done){
    User.findById(id,function(err,user){
      done(err,user);
    });
  });

  passport.use('local-signup',new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },function(req,email,password,done){
    process.nextTick(function(){
      User.findOne({'local.email' : email},function(err,user){
        if(err){
          return done(err);
        }else if(user){
          return done(null,false,req.flash('message',cons.accountExist));
        }else{
          var newUser = new User();
          newUser.local.email = email;
          newUser.local.password = newUser.generateHash(password);
          newUser.save(function(err){
            if(err){
              return done(err);
            }else{
              return done(null,newUser);
            }
          });
        }
      });
    });
  }));

  passport.use('local-login',new LocalStrategy({
    usernameField:'email',
    passwordField:'password'
  },function(username,password,done){
    User.findOne({username:username},function(err,user){
      if(err){
        return done(err);
      }else if(!user){
        return done(null,false,{message:cons.userNotFound});
      }else if(!user.validPassword(password)){
        return done(null,false,{message:cons.passwordNotMatch});
      }else{
        return done(null,user);
      }
    });
  }));
}
