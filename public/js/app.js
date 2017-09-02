$(document).ready(function(){
  $('#services').dropdown();

  api.message_get_last((err, res) => {
    if(err){
      console.log(err);
    } else {
      displayMessage(res.message._id, res.message.color, res.message.header, res.message.content);
    }
  });
});

function about(){
  $('#about-modal').modal('show');
}

function dismissMessage(id){
  localStorage.setItem('message-'+id, true);

  $('#message').attr('style','display:none !important');
}

function displayMessage(id, color, header, content){
  if(localStorage.getItem('message-'+id)) return;

  $('#message').attr('class','ui message');

  $('#message').addClass(color);

  var model = '<i class="close icon" id="message-dismiss"></i>\
                <div class="header" id="message-header">\
                  ?\
                </div>';

  $('#message').html(model);

  $('#message-dismiss').attr('onclick','dismissMessage(\''+id+'\')');
  $('#message-header').html(header);
  $('#message').append(content);

  $('#message').show();
}
