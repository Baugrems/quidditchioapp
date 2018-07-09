var express = require("express");
var app = express();
var bodyParser = require('body-parser');
var result;
var mongoose = require("mongoose");
var passport                    = require("passport"),
    LocalStrategy               = require("passport-local"),
    passportLocalMongoose       = require("passport-local-mongoose");
var User = require("./models/user.js");
var Roster = require("./models/roster.js");
var Broom = require("./models/broom.js");
var Log = require("./models/log.js");
var Game = require("./models/game.js");
var indexRoutes          = require("./routes/index");

mongoose.connect("mongodb://localhost/quidditch");

app.use(express.static(__dirname + '/public'));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(require("express-session")({
    secret: "Chewbacca is the best dog in the entire world!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

app.use(indexRoutes);




// ===================== ROUTES ========================== 

app.get("/", isLoggedIn, function(req,res){
    Broom.find({}, function(err, allBrooms){
        if(err){
            console.log("Error on Broom.find");
        } else {
    res.render("home", {brooms: allBrooms});
        }
    });
});

app.post('/addplayer', isLoggedIn, function (req, res) {
  if (!req.body) return res.sendStatus(400);
  var timeStampVar = Math.floor(Date.now() / 1000);
  
  var player = {id: timeStampVar,
  name: req.body.charName,
  house: req.body.house,
  position: req.body.position,
  stamina: req.body.stamina,
  agility: req.body.agility,
  strength: req.body.strength,
  control: req.body.control,
  arcane: req.body.arcane,
  accuracy: req.body.accuracy,
  broom: req.body.broom};
  
  Roster.create(player, function(err, player){
     if(err){
         console.log(err);
     } else {
         console.log("Added Player", player);
     }
    });

    result = timeStamp() + " " + req.user.username + " created new player: " + req.body.charName;
    var log = {result: result};
    Log.create(log, function(err, log){
        if(err){
            console.log(err);
        } else {
            console.log("Added log", log);
        }
    });
    res.redirect("/roster");
});

app.get("/log", isLoggedIn, function(req, res){
    Log.find({}, function(err, results){
        if(err){
            console.log(err);
        } else {
               res.render("logs", {results: results}); 
        }
    });
});

app.get("/game", function(req, res){
    Roster.find({}, function(err, roster){
        if(err){
            console.log(err);
        } else {
            res.render("game", {roster: roster});      
        }
    });
});

app.post("/game", function(req, res){
    Game.create(req.body.game, function(err, newGame){
       if(err){
           console.log(err);
       } else {
           res.redirect("/game/" + newGame._id);
       }
    });
});

app.get("/game/:play", function(req, res){
    Game.findById(req.params.play, function(err, game){
       if(err){
           console.log(err);
       } else {
           Roster.find({}, function(err, roster){
               if(err){
                   console.log(err);
               } else {
                    res.render("play", {game: game, roster: roster}); 
               }
           });
       }
    });
});

app.post("/game/:play", function(req, res){
    Game.findByIdAndUpdate(req.params.play, req.body.game, function(err, updateGame){
        if(err){
            console.log(err);
        } else {
            res.redirect("/game/" + req.params.play + "/go");
        }
    });
});

app.get("/game/:play/go", function(req, res){
    Game.findById(req.params.play, function(err, game){
       if(err){
           console.log(err);
       } else {
           Roster.find({}, function(err, roster){
               if(err){
                   console.log(err);
               } else {
                    res.render("go", {game: game, roster: roster});  
               }
           });
       }
    });
});

app.get("/roster", function(req, res){
        Roster.find({}, function(err, roster){
        if(err){
            console.log(err);
        } else {
            res.render("roster", {roster: roster}); 
        }
    });
});


app.get("/roster/:player", function(req,res){
        Broom.find({}, function(err, brooms){
        if(err){
            console.log(err);
        } else {
    var currentID = req.params.player;
    Roster.find({}, function(err, roster) {
        if(err){
            console.log(err);
        } else {
            res.render("player", {currentPlayer: req.params.player, roster: roster, brooms: brooms});   
        }
    });
        }
    });
});

app.get("/roster/:player/edit", isLoggedIn, function(req, res){
        Broom.find({}, function(err, brooms){
        if(err){
            console.log(err);
        } else {
        Roster.find({}, function(err, roster) {
        if(err){
            console.log(err);
        } else {
            res.render("edit", {currentPlayer: req.params.player, roster: roster, brooms: brooms});   
        }
    });
        }
    });
});

app.post('/editPlayer', isLoggedIn, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    var timeStampVar = Math.floor(Date.now() / 1000);
    Roster.remove({name: req.body.charName}, function(err){
      if(err){
          console.log(err);
      }
    });
    var player = {
    id: timeStampVar,
    name: req.body.charName,
    house: req.body.house,
    position: req.body.position,
    stamina: req.body.stamina,
    agility: req.body.agility,
    strength: req.body.strength,
    control: req.body.control,
    arcane: req.body.arcane,
    accuracy: req.body.accuracy,
    broom: req.body.broom};
    
    Roster.create(player, function(err, player){
     if(err){
         console.log(err);
     } else {
         console.log("Added Player", player);
     }
    });
    var stamp = timeStamp();
    result = timeStamp() + " " + req.user.username + " edited player: " + req.body.charName;
    var log = {result: result};
    console.log(log);
    Log.create(log, function(err, log){
        if(err){
            console.log(err);
        } else {
            console.log("Added log", log);
        }
    });
    res.redirect("/roster");
});

app.post('/deleteplayer/:player', isLoggedIn, function(req, res){
    Roster.find({id: req.params.player}, function(err, roster){
       if(err){
           console.log(err);
       } else {
            result = timeStamp() + " " + req.user.username + " deleted a player.";
            var log = {result: result};
            console.log(log);
            Log.create(log, function(err, log){
                if(err){
                    console.log(err);
                } else {
                  Roster.remove({id: req.params.player}, function(err){
                    if(err){
                        console.log(err);
                    }
            });
                    console.log("Added log", log);
                }
         });
       }
    });
    res.redirect("/roster");
});


app.get("/brooms", function(req, res){
    Broom.find({}, function(err, brooms){
        if(err){
            console.log(err);
        } else {
    res.render("brooms", {brooms: brooms});
        }
    });
});

app.get("/brooms/new", isLoggedIn, function(req, res){
   res.render("newbroom"); 
});

app.get("/brooms/:broom", function(req, res){
    var currentBroom = parseInt(req.params.broom);
    Broom.find({}, function(err, brooms){
        if(err){
            console.log(err);
        } else {
    res.render("editbroom", {brooms: brooms, currentBroom: currentBroom});
        }
    });
});


app.post("/brooms", isLoggedIn, function(req, res){
    var timeStampVar = Math.floor(Date.now() / 1000);
    var broom = {
    id: timeStampVar,
    name: req.body.broomName,
    stamina: req.body.stamina,
    agility: req.body.agility,
    strength: req.body.strength,
    control: req.body.control,
    arcane: req.body.arcane,
    accuracy: req.body.accuracy,
    prereq: req.body.prereq};
  
    Broom.create(broom, function(err, broom){
     if(err){
         console.log(err);
     } else {
         console.log("Added Broom", broom);
     }
    });
    result = timeStamp() + " " + req.user.username + " added a broom: " + req.body.name;
    var log = {result: result};
    Log.create(log, function(err, log){
        if(err){
            console.log(err);
        } else {
            console.log("Added log", log);
        }
    });
    Broom.find({}, function(err, brooms){
        if(err){
            console.log(err);
        } else {
    res.redirect("/brooms");
        }
    });
});

app.post('/editbroom', isLoggedIn, function (req, res) {
  var timeStampVar = Math.floor(Date.now() / 1000);
  Broom.remove({name: req.body.broomName}, function(err){
      if(err){
          console.log(err);
      }
  });
  var broom = {
    id: timeStampVar,
    name: req.body.broomName,
    stamina: req.body.stamina,
    agility: req.body.agility,
    strength: req.body.strength,
    control: req.body.control,
    arcane: req.body.arcane,
    accuracy: req.body.accuracy,
    prereq: req.body.prereq};
  
    Broom.create(broom, function(err, broom){
    if(err){
     console.log(err);
    } else {
    }
    });
    result = timeStamp() + " " + req.user.username + " edited broom: " + req.body.name;
    var log = {result: result};
    console.log(log);
    Log.create(log, function(err, log){
        if(err){
            console.log(err);
        } else {
            console.log("Added log", log);
        }
    });
    res.redirect("/brooms");
});

app.get("*", function(req, res){
    Broom.find({}, function(err, allBrooms){
        if(err){
            console.log("Error on Broom.find");
        } else {
    res.render("home", {brooms: allBrooms});
        }
    });
});

// =============================== LISTEN ==============

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
});

// =============================== OTHER FUNCTIONS ===========

function timeStamp() {
// Create a date object with the current time
  let now = new Date();

// Create an array with the current month, day and time
  let date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ].map(d=>d.toString().length === 1 ? "0"+d : d);

// Create an array with the current hour, minute and second
  let time = [ now.getHours(), now.getMinutes(), now.getSeconds() ].map(d=>d.toString().length === 1 ? "0"+d : d);


// Return the formatted string
  return time.join(":") + " " + date.join(".");
}

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};