var mongoose = require("mongoose");
var passportLocalMongoose       = require("passport-local-mongoose");

var broomSchema = new mongoose.Schema({
   id: Number(), 
   name: String,
   stamina: Number,
   agility: Number,
   strength: Number,
   control: Number,
   arcane: Number,
   accuracy: Number,
   prereq: Number
});

module.exports = mongoose.model("Broom", broomSchema);