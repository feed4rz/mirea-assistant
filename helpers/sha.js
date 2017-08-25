const crypto = require('crypto');

function sha(string){
  return crypto.createHash('sha256').update(string).digest("hex");
}

module.exports = sha;
