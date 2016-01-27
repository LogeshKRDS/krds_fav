var mongoose = require("mongoose");
var Schema      =   mongoose.Schema;
var contentSchema = new Schema({
  name: { type: String, required: true, unique: true },
  websites: Array
});
var Content = mongoose.model('Content', contentSchema);
module.exports = Content;
