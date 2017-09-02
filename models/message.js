/* Dependencies */
const mongoose = require('mongoose');
let Schema = mongoose.Schema;

/* Schema */
let messageSchema = new Schema({
  color : { default : '', type : String },
  header : { default : '', type : String },
  content : String
});

module.exports = mongoose.model('Message', messageSchema);
