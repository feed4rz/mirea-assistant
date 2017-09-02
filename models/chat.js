/* Dependencies */
const mongoose = require('mongoose');
let Schema = mongoose.Schema;

/* Schema */
let chatSchema = new Schema({
  chat : Number,
  name : String,
  img : String
});

module.exports = mongoose.model('Chat', chatSchema);
