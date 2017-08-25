const Random = require('random-js');

let random = new Random(Random.engines.mt19937().autoSeed());

module.exports = random;
