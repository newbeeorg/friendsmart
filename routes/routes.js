const cons = require('../config/constants.js');

module.exports = function(app,passport){
  app.get('/',isLoggedIn,function(req,res){
    res.writeHead(200,{'Content-Type':'text/plain'});
    res.end();
  });

  // app.get('/login',function(req,res){
  //   console.log(__dirname);
  //   res.sendFile(__dirname + "/../public/html/login.html");
  // });

  app.post('/login',function(req,res,next){
    passport.authenticate('local-login',function(err,user,info){
      if(err){
        res.status(500);
      }else{
        var msg = info.message;
        if(msg == cons.userNotFound){
          res.status(404);
        }else if(msg == cons.passwordNotMatch){
          res.status(401);
        }else if(msg == cons.missingCredential){
          res.status(400);
        }else{
          res.redirect('/');
        }
        res.end();
      }
    })(req,res,next);
  });

  app.post('/signup',function(req,res,next){
    passport.authenticate('local-signup',function(err,user,info){
      if(err){

      }else{
        var msg = info.message;
        res.end();
      }
    })(req,res,next);
  });

  // app.get('/login',function(req,res){
  //   passport.authenticate('local-login',function(err,user,info){
  //     if(err){
  //       return next(err);
  //     }else if(!user){
  //       return res.redirect('/login');
  //     }else if(user){
  //       return res.redirect('/');
  //     }
  //   })(req,res,next);
  // });

  app.post('/login',passport.authenticate('local',function(req,res){

  }));
}

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }else{
    res.redirect('/login');
  }
}
