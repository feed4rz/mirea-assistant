var API = function(){

};

API.prototype.api_call = function(url, data, callback) {
  $.ajax({
    url: url,
    data: JSON.stringify(data),
    cache: false,
    contentType: 'application/json',
    type: 'POST',
    success: function(data){
      console.log(data);

      if(data.success || data.success == "true"){
        callback(null, data.response);
      } else {
        callback(data.err, null);
      }
    }
  });
}

API.prototype.institute_get_type = function(type){
  var types = {
    0 : 'Институт информационных технологий',
    1 : 'Физико-технологический институт',
    2 : 'Институт инновационных технологий и государственного управления',
    3 : 'Институт кибернетики',
    4 : 'Институт комплексной безопасности и специального приборостроения',
    5 : 'Институт радиотехнических и телекоммуникационных систем',
    6 : 'Институт тонких химических технологий',
    7 : 'Институт управления и стратегического развития организаций'
  };

  return types[type];
}

API.prototype.group_get_all = function(callback){
  this.api_call('/api/group/get/all', {}, function(err, res){
    if(err){
      callback(err, null);
    } else {
      callback(null, res);
    }
  });
}

API.prototype.group_remove_all = function(params, callback){
  if(!params) return callback('Invalid parameter', null);
  if(!params.institute && params.institute != 0) return callback('Invalid parameter', null);
  if(!params.secret) return callback('Invalid parameter', null);

  this.api_call('/api/group/remove/all', params, function(err, res){
    if(err){
      callback(err, null);
    } else {
      callback(null, res);
    }
  });
}

API.prototype.group_new = function(params, callback){
  if(!params) return callback('Invalid parameter', null);
  if(!params.group) return callback('Invalid parameter', null);
  if(!params.secret) return callback('Invalid parameter', null);

  this.api_call('/api/group/new', params, function(err, res){
    if(err){
      callback(err, null);
    } else {
      callback(null, res);
    }
  });
}

API.prototype.schedule_get = function(params, callback){
  if(!params) return callback('Invalid parameter', null);
  if(!params.institute && params.institute != 0) return callback('Invalid parameter', null);
  if(!params.term) return callback('Invalid parameter', null);
  if(!params.group) return callback('Invalid parameter', null);

  this.api_call('/api/schedule/get', params, function(err, res){
    if(err){
      callback(err, null);
    } else {
      callback(null, res);
    }
  });
}

API.prototype.schedule_remove_all = function(params, callback){
  if(!params) return callback('Invalid parameter', null);
  if(!params.institute && params.institute != 0) return callback('Invalid parameter', null);
  if(!params.term) return callback('Invalid parameter', null);
  if(!params.secret) return callback('Invalid parameter', null);

  this.api_call('/api/schedule/remove/all', params, function(err, res){
    if(err){
      callback(err, null);
    } else {
      callback(null, res);
    }
  });
}

API.prototype.schedule_new = function(params, callback){
  if(!params) return callback('Invalid parameter', null);
  if(!params.schedule) return callback('Invalid parameter', null);
  if(!params.secret) return callback('Invalid parameter', null);

  this.api_call('/api/schedule/new', params, function(err, res){
    if(err){
      callback(err, null);
    } else {
      callback(null, res);
    }
  });
}

API.prototype.message_get_last = function(callback){
  this.api_call('/api/message/get/last', {}, function(err, res){
    if(err){
      callback(err, null);
    } else {
      callback(null, res);
    }
  });
}

API.prototype.chat_formaturl = function(params, callback){
  if(!params) return callback('Invalid parameter', null);
  if(!params.url) return callback('Invalid parameter', null);

  this.api_call('/api/chat/formaturl', params, function(err, res){
    if(err){
      callback(err, null);
    } else {
      callback(null, res);
    }
  });
}

API.prototype.chat_get_all = function(params, callback){
  if(!params) return callback('Invalid parameter', null);
  if(!params.offset && params.offset != 0) return callback('Invalid parameter', null);
  if(!params.limit && params.limit != 0) return callback('Invalid parameter', null);

  this.api_call('/api/chat/get/all', params, function(err, res){
    if(err){
      callback(err, null);
    } else {
      callback(null, res);
    }
  });
}

API.prototype.chat_friendship = function(params, callback){
  if(!params) return callback('Invalid parameter', null);
  if(!params.user) return callback('Invalid parameter', null);

  this.api_call('/api/chat/friendship', params, function(err, res){
    if(err){
      callback(err, null);
    } else {
      callback(null, res);
    }
  });
}

API.prototype.chat_add = function(params, callback){
  if(!params) return callback('Invalid parameter', null);
  if(!params.user) return callback('Invalid parameter', null);

  this.api_call('/api/chat/add', params, function(err, res){
    if(err){
      callback(err, null);
    } else {
      callback(null, res);
    }
  });
}

API.prototype.chat_join = function(params, callback){
  if(!params) return callback('Invalid parameter', null);
  if(!params.user) return callback('Invalid parameter', null);
  if(!params.chat) return callback('Invalid parameter', null);

  this.api_call('/api/chat/join', params, function(err, res){
    if(err){
      callback(err, null);
    } else {
      callback(null, res);
    }
  });
}
