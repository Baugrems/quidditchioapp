var express = require("express");
var router = express.Router(),
    mongoose                    = require("mongoose"),
    passport                    = require("passport"),
    LocalStrategy               = require("passport-local"),
    passportLocalMongoose       = require("passport-local-mongoose");
var User = require("../models/user");

router.get("/register", function(req, res){
   res.render("register"); 
});

router.post("/register", function(req, res){
   User.register(new User({username: req.body.username}), req.body.password, function(err, user){
      if(err){
          console.log(err);
          res.redirect('/register');
      } else {
          passport.authenticate("local")(req, res, function(){
                res.redirect("/");
          });
      }
   });
});

router.get("/login", function(req, res){
   res.render("login"); 
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
}),    function(req, res){
});

router.get("/logout", function(req, res){
   req.logout();
   res.redirect("/");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

module.exports = router;