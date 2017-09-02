/* Dependencies */
const express = require('express');
let router = express.Router();

/* Helper dependencies */
const sha = require('../../helpers/sha.js');

/* Models */
let Group = require('../../models/group.js');

router.post('/get/all', (req, res) => {
  Group.find((err, groups) => {
    if(err){
      res.json({ success : false, err : err });
    } else {
      res.json({ success : true, response : { groups : groups }});
    }
  });
});

router.post('/get', (req, res) => {
  if(!req.body.group) return res.json({ success : false, err : 'Invalid parameter(s)' });

  let query = {
    group : req.body.group
  };

  Group.findOne(query, (err, group) => {
    if(err){
      res.json({ success : false, err : err });
    } else if(group){
      res.json({ success : true, response : { group : group }});
    } else {
      res.json({ success : false, err : 'No such group' });
    }
  });
});

router.post('/update', (req, res) => {
  if(!req.body.id) return res.json({ success : false, err : 'Invalid parameter(s)' });
  if(!req.body.secret) return res.json({ success : false, err : 'Invalid parameter(s)' });
  if(!req.body.update) return res.json({ success : false, err : 'Invalid parameter(s)' });

  let query = {
    _id : req.body.id,
    secret : sha(req.body.secret)
  };

  req.body.update.last_update = Math.floor(Date.now()/1000);

  Group.findOneAndUpdate(query, req.body.update, { new : true }, (err, group) => {
    if(err){
      res.json({ success : false, err : err });
    } else if(schedule){
      res.json({ success : true, response : { group : group }});
    } else {
      res.json({ success : false, err : 'No such group' });
    }
  });
});

router.post('/new', (req, res) => {
  if(!req.body.group) return res.json({ success : false, err : 'Invalid parameter(s)' });
  if(!req.body.secret) return res.json({ success : false, err : 'Invalid parameter(s)' });

  let secret_hash = global.config.secret_hash;

  if(sha(req.body.secret) != secret_hash) return res.json({ success : false, err : 'Incorrect secret' });

  req.body.group.last_update = Math.floor(Date.now()/1000);
  req.body.group.secret = sha(req.body.group.secret);

  let group = new Group(req.body.group);

  group.save((err, newGroup) => {
    if(err){
      res.json({ success : false, err : err });
    } else {
      res.json({ success : true, response : { group : newGroup }});
    }
  });
});

router.post('/remove', (req, res) => {
  if(!req.body.id) return res.json({ success : false, err : 'Invalid parameter(s)' });
  if(!req.body.secret) return res.json({ success : false, err : 'Invalid parameter(s)' });

  let query = {
    _id : req.body.id,
    secret : sha(req.body.secret)
  };

  Group.findOneAndRemove(query, (err, group) => {
    if(err){
      res.json({ success : false, err : err });
    } else if(schedule){
      res.json({ success : true, response : { group : group } });
    } else {
      res.json({ success : false, err : 'No such group' });
    }
  });
});

router.post('/remove/all', (req, res) => {
  if(!req.body.secret) return res.json({ success : false, err : 'Invalid parameter(s)' });

  let secret_hash = global.config.secret_hash;

  if(sha(req.body.secret) != secret_hash) return res.json({ success : false, err : 'Incorrect secret' });

	let query = {};
	if(req.body.institute || req.body.institute == 0) query = {
		institute : req.body.institute,
		term : req.body.term
	};

  Group.remove(query, (err) => {
    if(err){
      res.json({ success : false, err : err });
    } else {
      res.json({ success : true, response : { message : 'All groups were removed' } });
    }
  });
});

module.exports = router;
