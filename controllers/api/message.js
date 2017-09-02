/* Dependencies */
const express = require('express');
let router = express.Router();

/* Helper dependencies */
const sha = require('../../helpers/sha.js');

/* Models */
let Message = require('../../models/message.js');

router.post('/get/all', (req, res) => {
  Message.find((err, messages) => {
    if(err){
      res.json({ success : false, err : err });
    } else {
      res.json({ success : true, response : { messages : messages }});
    }
  });
});

router.post('/get', (req, res) => {
  if(!req.body.id) return res.json({ success : false, err : 'Invalid parameter(s)' });

  Message.findById(req.body.id, (err, message) => {
    if(err){
      res.json({ success : false, err : err });
    } else if(message){
      res.json({ success : true, response : { message : message }});
    } else {
      res.json({ success : false, err : 'No such message' });
    }
  });
});

router.post('/get/last', (req, res) => {
  Message.find().limit(1).sort({ $natural : -1 }).exec((err, messages) => {
    if(err){
      res.json({ success : false, err : err });
    } else if(messages[0]){
      res.json({ success : true, response : { message : messages[0] }});
    } else {
      res.json({ success : false, err : 'No such message' });
    }
  });
});

router.post('/new', (req, res) => {
  if(!req.body.message) return res.json({ success : false, err : 'Invalid parameter(s)' });
  if(!req.body.secret) return res.json({ success : false, err : 'Invalid parameter(s)' });

  let secret_hash = global.config.secret_hash;

  if(sha(req.body.secret) != secret_hash) return res.json({ success : false, err : 'Incorrect secret' });

  let message = new Message(req.body.message);

  message.save((err, newMessage) => {
    if(err){
      res.json({ success : false, err : err });
    } else {
      res.json({ success : true, response : { message : newMessage }});
    }
  });
});

module.exports = router;
