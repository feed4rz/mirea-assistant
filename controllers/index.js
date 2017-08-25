/* Dependencies */
const express = require('express')
let router = express.Router();

/* Enabling other controllers */
router.use('/api', require('./api/index.js'));

router.get('/', (req, res) => {
  res.render('index');
})

module.exports = router;
