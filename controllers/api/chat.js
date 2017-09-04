const config = require('../../bot_config.json');

/* Dependencies */
const VK = require('vk-io');
const express = require('express');
let router = express.Router();

/* VK config */
const vk = new VK({
  app : config.app,
  login : config.login,
  pass : config.password
});

/* VK auth */
vk.auth.standalone().run().then((token) => {
    console.log('User token:', token);

    vk.setToken(token);
}).catch((error) => {
    console.error(error);
});

/* Models */
let Chat = require('../../models/chat.js');

router.post('/get/all', (req, res) => {
  if(!req.body.offset && req.body.offset != 0) return res.json({ success : false, err : 'Invalid parameter(s)' });
  if(!req.body.limit && req.body.limit != 0) return res.json({ success : false, err : 'Invalid parameter(s)' });

  if(req.body.limit == -1){
    Chat.find().skip(req.body.offset).exec((err, chats) => {
      if(err){
        res.json({ success : false, err : err });
      } else {
        res.json({ success : true, response : { chats : chats }});
      }
    });
  } else {
    Chat.find().skip(req.body.offset).limit(req.body.limit).exec((err, chats) => {
      if(err){
        res.json({ success : false, err : err });
      } else {
        res.json({ success : true, response : { chats : chats }});
      }
    });
  }
});

router.post('/add', (req, res) => {
  if(!req.body.user) return res.json({ success : false, err : 'Invalid parameter(s)' });

  vk.api.friends.add({
    user_id : req.body.user
  }).then((result) => {
    res.json({ success : true, response : { status : result } });
  }).catch((error) => {
    res.json({ success : false, err : error.error_msg });
  });
});

router.post('/friendship', (req, res) => {
  if(!req.body.user) return res.json({ success : false, err : 'Invalid parameter(s)' });

  vk.api.friends.areFriends({
    user_ids : [req.body.user]
  }).then((result) => {
    res.json({ success : true, response : { friendship : result[0].friend_status } });
  }).catch((error) => {
    res.json({ success : false, err : error.error_msg });
  });
});

router.post('/join', (req, res) => {
  if(!req.body.user) return res.json({ success : false, err : 'Invalid parameter(s)' });
  if(!req.body.chat) return res.json({ success : false, err : 'Invalid parameter(s)' });

  vk.api.messages.addChatUser({
    chat_id : req.body.chat,
    user_id : req.body.user
  }).then((result) => {
    res.json({ success : true });
  }).catch((error) => {
    res.json({ success : false, err : error.error_msg });
  });
});

router.post('/new', (req, res) => {
  if(!req.body.chat) return res.json({ success : false, err : 'Invalid parameter(s)' });
  if(!req.body.secret) return res.json({ success : false, err : 'Invalid parameter(s)' });

  let secret_hash = global.config.secret_hash;

  if(sha(req.body.secret) != secret_hash) return res.json({ success : false, err : 'Incorrect secret' });

  let chat = new Chat(req.body.chat);

  chat.save((err, newChat) => {
    if(err){
      res.json({ success : false, err : err });
    } else {
      res.json({ success : true, response : { chat : newChat }});
    }
  });
});


module.exports = router;
