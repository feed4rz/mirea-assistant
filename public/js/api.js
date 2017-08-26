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
    0 : 'Институт информационных технологий'
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

API.prototype.schedule_get = function(params, callback){
  if(!params) return callback('Invalid parameter1', null);
  if(!params.institute && params.institute != 0) return callback('Invalid parameter2', null);
  if(!params.term) return callback('Invalid parameter3', null);
  if(!params.group) return callback('Invalid parameter4', null);

  this.api_call('/api/schedule/get', params, function(err, res){
    if(err){
      callback(err, null);
    } else {
      callback(null, res);
    }
  });
}
