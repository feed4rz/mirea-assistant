/* Dependencies */
const mongoose = require('mongoose');
let Schema = mongoose.Schema;

/* Schema */
let scheduleSchema = new Schema({
  term : Number,
  institute : Number,
  group : String,
  days : Array,
  secret : String,
  last_update : Number
});

/* Days model */
/*
  Array
*/

/* Classes model */
/*
  odd : Object,
  even : Object
*/

/* Odd and even class model */
/*
  name : String,
  type : Number,
  teacher : String,
  room : String
*/

module.exports = mongoose.model('Schedule', scheduleSchema);
