/* Dependencies */
const express = require('express')
let router = express.Router();

/* Enabling other controllers */
router.use('/schedule', require('./schedule.js'));
router.use('/group', require('./group.js'));
router.use('/message', require('./message.js'));

const start = Math.floor(Date.now()/1000);

router.post('/', (req, res) => {
  res.json({ success : true, response : { version : global.config.version, up_since : start } });
})

module.exports = router;
