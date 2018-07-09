var mongoose = require("mongoose");
var passportLocalMongoose       = require("passport-local-mongoose");

var rosterSchema = new mongoose.Schema({
   id: Number,
   name: String,
   house: String,
   position: String,
   stamina: Number,
   agility: Number,
   strength: Number,
   control: Number,
   arcane: Number,
   accuracy: Number,
   broom: String
});

module.exports = mongoose.model("Roster", rosterSchema);