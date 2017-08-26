class API {
  constructor(){
  }

  api_call(url, data, callback) {
    $.ajax({
      url: url,
      data: JSON.stringify(data),
      cache: false,
      contentType: 'application/json',
      type: 'POST',
      success: (data) => {
        console.log(data);

        if(data.success || data.success == "true"){
          callback(null, data.response);
        } else {
          callback(data.err, null);
        }
      }
    });
  }

  institute_get_type(type){
    let types = {
      0 : 'Институт информационных технологий'
    };

    return types[type];
  }

  group_get_all(callback){
    this.api_call('/api/group/get/all', {}, (err, res) => {
      if(err){
        callback(err, null);
      } else {
        callback(null, res);
      }
    });
  }

  schedule_get(params, callback){
    if(!params) return callback('Invalid parameter1', null);
    if(!params.institute && params.institute != 0) return callback('Invalid parameter2', null);
    if(!params.term) return callback('Invalid parameter3', null);
    if(!params.group) return callback('Invalid parameter4', null);

    this.api_call('/api/schedule/get', params, (err, res) => {
      if(err){
        callback(err, null);
      } else {
        callback(null, res);
      }
    });
  }
}
