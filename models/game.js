var mongoose = require("mongoose");
var passportLocalMongoose       = require("passport-local-mongoose");

var gameSchema = new mongoose.Schema({
    team1: String,
    team2: String,
    team1Keeper: {},
    team2Keeper: {},
    team1Chaser1: {},
    team2Chaser1: {},
    team1Chaser2: {},
    team2Chaser2: {},
    team1Chaser3: {},
    team2Chaser3: {},
    team1Beater1: {},
    team2Beater1: {},
    team1Beater2: {},
    team2Beater2: {},
    team1Seeker: {},
    team2Seeker: {},
});


module.exports = mongoose.model("Game", gameSchema);