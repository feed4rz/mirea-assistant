var offset = 0;
var limit = 10;

$(document).ready(function(){
  loading(true);

  api.chat_get_all({ offset : offset, limit : limit }, function(err, res){
    if(err){
      console.log(err);
    } else {
      if(res.chats.length < limit){
        $('#load_more').hide();
      }

      for(var i = 0; i < res.chats; i++){
        renderChat(res.chats[i]);
      }

      $(window).scroll(function(){
        if($(window).scrollTop() == $(document).height() - $(window).height()){
          loadMore();
        }
      });
    }

    loading(false);
  });
});

function loading(load){
  $('#load_more').removeClass('loading');

  if(load){
    $('#load_more').addClass('loading');
  }
}

function loadMore(){
  loading(true);

  offset += limit;

  api.chat_get_all({ offset : offset, limit : limit }, function(err, res){
    if(err){
      console.log(err);
    } else {
      if(res.chats.length < limit){
        $('#load_more').hide();
      }

      for(var i = 0; i < res.chats; i++){
        renderChat(res.chats[i]);
      }
    }

    loading(false);
  });
}

function renderChat(chat){
  var model = '<div class="ui card">\
    <div class="image">\
      <img class="ui image" src="'+chat.img+'">\
    </div>\
    <div class="content">\
      <div class="header">'+chat.name+'</div>\
      <div class="meta">\
        <i class="user icon"></i>\
        '+chat.users+' Участника\
      </div>\
    </div>\
    <div class="ui bottom attached teal button" onclick="join('+chat.chat+')">\
      <i class="send icon"></i>\
      Подключиться\
    </div>\
  </div>';

  $('#chats').append(model);
}
