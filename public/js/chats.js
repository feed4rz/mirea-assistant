var offset = 0;
var limit = 10;
var no_chats = false;

$(document).ready(function(){
  loading(true);

  api.chat_get_all({ offset : offset, limit : limit }, function(err, res){
    if(err){
      console.log(err);
    } else {
      if(res.chats.length < limit){
        $('#load_more').hide();
        no_chats = true;
      }

      for(var i = 0; i < res.chats.length; i++){
        renderChat(res.chats[i]);
      }

      if(!no_chats){
        $(window).scroll(function(){
          if(no_chats) return;
          if($(window).scrollTop() == $(document).height() - $(window).height()){
            loadMore();
          }
        });
      }
    }

    loading(false);
  });

  searchLoading(true);

  api.chat_get_all({ offset : 0, limit : -1 }, function(err, res){
    if(err){
      console.log(err);
    } else {
      var search_content = [];

      for(var i = 0; i < res.chats.length; i++){
        search_content.push({
          id : res.chats[i].chat,
          title : res.chats[i].name,
          image : res.chats[i].img
        });
      }

      $('#search').search({
        source : search_content,
        searchFields   : [
          'title'
        ],
        searchFullText: false,
        onSelect : function(result, response){
          join(result.id, result.title);
        }
      });
    }

    searchLoading(false);
  });
});

function loading(load){
  $('#load_more').removeClass('loading');

  if(load){
    $('#load_more').addClass('loading');
  }
}

function searchLoading(load){
  $('#search').removeClass('loading');

  if(load){
    $('#search').addClass('loading');
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

function loadingAdd(load){
  $('[onclick="add()"]').removeClass('loading');

  if(load){
    $('[onclick="add()"]').addClass('loading');
  }
}

function add(){
  loadingAdd(true);

  var vk = $('#vk').val();
  var regex = /^(?:https?:\/\/)?(?:www\.)?vk\.com\/(.*)\/?$/;

  if(!vk.match(regex)){
    $('#vk-input').removeClass('error');
    $('#vk-input').addClass('error');
    return;
  }

  if(vk.indexOf('&') > -1 || vk.indexOf('?') > -1 || vk.indexOf('=') > -1){
    $('#vk-input').removeClass('error');
    $('#vk-input').addClass('error');
    return;
  }

  api.chat_formaturl({ url : vk }, function(err, res){
    if(err){
      console.log(err);
    } else {
      console.log(res.vkid);

      var vkid = res.vkid;

      api.chat_friendship({ user : vkid }, function(err, res){
        if(err){
          console.log(err);
        } else {
          if(res.status == 3){
            $('#join-3').show('slow');

            loadingAdd(false);
          } else {
            api.chat_add({ user : vkid }, function(err, res){
              if(err){
                console.log(err);
              } else {
                $('#join-2').show('slow');
                $('#join-3').show('slow');
              }

              loadingAdd(false);
            });
          }

          var id = Number($('#join-connect').attr('data-id'));

          $('#join-connect').attr('href','javascript:connect('+id+', '+vkid+')');
        }
      });
    }

    loadingAdd(false);
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
    <div class="ui bottom attached teal button" onclick="join('+chat.chat+', \''+chat.name+'\')">\
      <i class="send icon"></i>\
      Подключиться\
    </div>\
  </div>';

  $('#chats').append(model);
}

function loadingConnect(load){
  $('#join-connect').removeClass('loading');

  if(load){
    $('#join-connect').addClass('loading');
  }
}

function connect(id, user){
  loadingConnect(true);

  console.log({ user : user, chat : id });

  api.chat_join({ user : user, chat : id }, function(err, res){
    if(err){
      console.log(err);
    } else {
      $('#join-4').show('slow');
    }

    loadingConnect(false);
  });
}

function join(id, title){
  $('#join-title').text(title);

  $('#join-connect').attr('data-id', id);

  $('#join-1').show('slow');
  $('#join-2').hide();
  $('#join-3').hide();
  $('#join-4').hide();

  $('#join').modal('show');
}

function saveUrl(){
  localStorage.setItem('vkurl',$('#vk').val());
}

function getUrl(){
  if(!localStorage.getItem('vkurl')) return;

  $('#vk').val(localStorage.getItem('vkurl'));
}
