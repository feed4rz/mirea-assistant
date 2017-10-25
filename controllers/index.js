/* Dependencies */
const express = require('express');
let router = express.Router();

/* Enabling other controllers */
router.use('/api', require('./api/index.js'));

router.get('/', (req, res) => {
  res.render('index');
});

router.get('/chats', (req, res) => {
  res.render('chats');
});

router.get('/labaccess', (req, res) => {
  res.render('vr_lab_calculator');
});

router.get('/voice', (req, res) => {
  res.render('voice');
});

router.get('/admin', (req, res) => {
  res.render('admin');
});

module.exports = router;
