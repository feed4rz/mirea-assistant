/* Standalone app that uploads a json schedule */

/* Config */
if(!process.argv[2]) throw 'Please, provide secret as a parameter';

const secret = process.argv[2];
const host = 'localhost';

/* Dependencies */
const schedule = require('../data/schedule.json');
const request = require('request');

function scheduleRemove(callback){
  let json = {
    secret : secret
  };

  request({ method : 'POST', url : `http://${host}/api/schedule/remove/all`, json : json }, (e, r, b) => {
    if(e){
      callback(e, null);
    } else if(r.statusCode != 200){
      callback(r.statusCode, null);
    } else {
      let result = b;

      if(result.success){
        let response = result.response;

        callback(null, result.response);
      } else {
        callback(result.err, null);
      }
    }
  });
}

function scheduleNew(schedule, callback){
  let json = {
    secret : secret,
    schedule : schedule
  };

  request({ method : 'POST', url : `http://${host}/api/schedule/new`, json : json }, (e, r, b) => {
    if(e){
      callback(e, null);
    } else if(r.statusCode != 200){
      callback(r.statusCode, null);
    } else {
      let result = b;

      if(result.success){
        let response = result.response;

        callback(null, result.response);
      } else {
        callback(result.err, null);
      }
    }
  });
}

function groupRemove(callback){
  let json = {
    secret : secret
  };

  request({ method : 'POST', url : `http://${host}/api/group/remove/all`, json : json }, (e, r, b) => {
    if(e){
      callback(e, null);
    } else if(r.statusCode != 200){
      callback(r.statusCode, null);
    } else {
      let result = b;

      if(result.success){
        let response = result.response;

        callback(null, result.response);
      } else {
        callback(result.err, null);
      }
    }
  });
}

function groupNew(group, callback){
  let json = {
    secret : secret,
    group : group
  };

  request({ method : 'POST', url : `http://${host}/api/group/new`, json : json }, (e, r, b) => {
    if(e){
      callback(e, null);
    } else if(r.statusCode != 200){
      callback(r.statusCode, null);
    } else {
      let result = b;

      if(result.success){
        let response = result.response;

        callback(null, result.response);
      } else {
        callback(result.err, null);
      }
    }
  });
}

scheduleRemove((err, res) => {
  if(err){
    throw err;
  } else {
		console.log('Current schedule: clear');
		
    groupRemove((err, res) => {
      if(err){
        throw err;
      } else {
				console.log('Current group list: clear');
				
        for(let i = 0; i < schedule.length; i++){
          scheduleNew(schedule[i], (err, res) => {});

          let group = {
            institute : schedule[i].institute,
            group : schedule[i].group,
            secret : schedule[i].secret
          };

          groupNew(group, (err, res) => {});
        }
				
				console.log('Done');
      }
    });
  }
});