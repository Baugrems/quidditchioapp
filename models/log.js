var mongoose = require("mongoose");
var passportLocalMongoose       = require("passport-local-mongoose");

var logSchema = new mongoose.Schema({
   result: {},
});

module.exports = mongoose.model("Log", logSchema);