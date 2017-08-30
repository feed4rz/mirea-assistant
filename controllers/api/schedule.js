/* Dependencies */
const express = require('express')
let router = express.Router();

/* Helper dependencies */
const sha = require('../../helpers/sha.js');

/* Models */
let Schedule = require('../../models/schedule.js');

router.post('/get/all', (req, res) => {
  Schedule.find((err, schedules) => {
    if(err){
      res.json({ success : false, err : err });
    } else {
      res.json({ success : true, response : { schedules : schedules }});
    }
  });
});

router.post('/get', (req, res) => {
  if(!req.body.term) return res.json({ success : false, err : 'Invalid parameter(s)' });
  if(!req.body.group) return res.json({ success : false, err : 'Invalid parameter(s)' });

  let query = {
    term : req.body.term,
    institute : req.body.institute,
    group : req.body.group
  };

  Schedule.findOne(query, (err, schedule) => {
    if(err){
      res.json({ success : false, err : err });
    } else if(schedule){
      res.json({ success : true, response : { schedule : schedule }});
    } else {
      res.json({ success : false, err : 'No such schedule' });
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

  Schedule.findOneAndUpdate(query, req.body.update, { new : true }, (err, schedule) => {
    if(err){
      res.json({ success : false, err : err });
    } else if(schedule){
      res.json({ success : true, response : { schedule : schedule }});
    } else {
      res.json({ success : false, err : 'No such schedule' });
    }
  });
});

router.post('/new', (req, res) => {
  if(!req.body.schedule) return res.json({ success : false, err : 'Invalid parameter(s)' });
  if(!req.body.secret) return res.json({ success : false, err : 'Invalid parameter(s)' });

  let secret_hash = global.config.secret_hash;

  if(sha(req.body.secret) != secret_hash) return res.json({ success : false, err : 'Incorrect secret' });

  req.body.schedule.last_update = Math.floor(Date.now()/1000);
  req.body.schedule.secret = sha(req.body.schedule.secret);

  let schedule = new Schedule(req.body.schedule);

  schedule.save((err, newSchedule) => {
    if(err){
      res.json({ success : false, err : err });
    } else {
      res.json({ success : true, response : { schedule : newSchedule }});
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

  Schedule.findOneAndRemove(query, (err, schedule) => {
    if(err){
      res.json({ success : false, err : err });
    } else if(schedule){
      res.json({ success : true, response : { schedule : schedule } });
    } else {
      res.json({ success : false, err : 'No such schedule' });
    }
  });
});

router.post('/remove/all', (req, res) => {
  if(!req.body.secret) return res.json({ success : false, err : 'Invalid parameter(s)' });

  let secret_hash = global.config.secret_hash;

  if(sha(req.body.secret) != secret_hash) return res.json({ success : false, err : 'Incorrect secret' });
	
	let query = {};
	if((req.body.institute || req.body.institute == 0) && req.body.term) query = {
		institute : req.body.institute,
		term : req.body.term
	};

  Schedule.remove(query, (err) => {
    if(err){
      res.json({ success : false, err : err });
    } else {
      res.json({ success : true, response : { message : 'All schedules were removed' } });
    }
  });
});

module.exports = router;
