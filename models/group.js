/* Dependencies */
const mongoose = require('mongoose');
let Schema = mongoose.Schema;

/* Schema */
let groupSchema = new Schema({
  institute : Number,
  group : String,
  secret : String,
  last_update : Number
});

module.exports = mongoose.model('Group', groupSchema);
