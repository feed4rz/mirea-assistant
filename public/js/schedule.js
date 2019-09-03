Date.prototype.getWeek = function () {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
};

var institutes = {};
var institute = null;
var group = null;
var week = 'odd';

$(document).ready(function(){
  loading(true);

  api.group_get_all(function(err, res){
    if(err){
      console.log(err);
    } else {
      for(var i = 0; i < res.groups.length; i++){
        if(!institutes[res.groups[i].institute]) institutes[res.groups[i].institute] = [];

        institutes[res.groups[i].institute].push(res.groups[i].group);
      }

      for(var key in institutes){
        institutes[key].sort(function(a, b){
          if(a < b) return -1;
          if(a > b) return 1;
          return 0;
        });
      }

      $('#institute_value').html('');

      for(var key in institutes){
        var model = '<div class="item" data-value="'+key+'" onclick="selectInstitute('+key+')">'+api.institute_get_type(key)+'</div>';

        $('#institute_value').append(model);
      }

      $('#institute_dropdown').dropdown('restore defaults');

      $('#institute_dropdown').dropdown();

      enable('institute', false);

      loadSelected();
    }

    loading(false);
  });
});

function selectInstitute(inst){
  var groups = institutes[inst];

  institute = inst;

  $('#schedule').text('');

  $('#group_value').html('');

  for(var i = 0; i < groups.length; i++){
    var model = '<div class="item" data-value="'+groups[i]+'" onclick="selectGroup(\''+groups[i]+'\')">'+convertGroupName(groups[i])+'</div>';

    $('#group_value').append(model);
  }

  $('#group_dropdown').dropdown('restore defaults');

  $('#group_dropdown').dropdown();

  enable('group', false);
}

function selectGroup(grp){
  group = grp;

  saveSelected();

  $('#week_dropdown').dropdown('restore defaults');

  $('#week_dropdown').dropdown();

  $('[data-value="'+getWeek()+'"]').click();

  enable('week', false);
}

function selectWeek(type){
  week = type;

  api.schedule_get({ institute : institute, group : group }, function(err, res){
    if(err){
      console.log(err);
    } else {
      $('#schedule').text('');

      var schedule = res.schedule;

      for(var i = 0; i < schedule.days.length; i++){
        renderDay(i, schedule.days[i]);
      }

      highlightCurrentDay();
      highlightCurrentClass();
    }
  });
}

function saveSelected(){
  localStorage.setItem('institute', institute);
  localStorage.setItem('group', group);
}

function loadSelected(){
  if(!localStorage.getItem("group")) return;

  $('[onclick="selectInstitute('+localStorage.getItem("institute")+')"]').click();

  $('[onclick="selectGroup(\''+localStorage.getItem("group")+'\')"]').click();
}

function convertGroupName(name){
  name = translit(name, -5).toUpperCase();

  return name;
}

function loading(load){
  $('#form').removeClass('loading');

  if(load){
    $('#form').addClass('loading');
  }
}

function enable(field, e){
  $('#'+field).removeClass('disabled');

  if(e){
    $('#'+field).addClass('disabled');
  }
}

var mod = function (num, mod) {
  var remain = num % mod;
  return Math.floor(remain >= 0 ? remain : remain + mod);
};

function highlightCurrentDay(){
  var date = new Date();
  var day = mod(date.getDay() - 1, 7);

  $('#table-'+day).addClass('teal');
}

function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    // Return array of year and week number
    return [d.getUTCFullYear(), weekNo];
}

function getWeek(){
  var now = new Date();
  var september = new Date(now.getFullYear()+"-09-01");

  if(getWeekNumber(september)[1] % 2 == 0){
    if((getWeekNumber(now)[1] + 1) % 2 == 0){
      return 'even';
    } else {
      return 'odd';
    }
  } else {
    if(getWeekNumber(now)[1] % 2 == 0){
      return 'even';
    } else {
      return 'odd';
    }
  }
}

function highlightCurrentClass(){
  var date = new Date();
  var day = mod(date.getDay() - 1, 7);

  var time = (Math.floor(Date.now()/1000) + 60*60*3) % 86400;

  if(32400 < time && time < 37800){
    $('#table-'+day+'-0').addClass('active');

    console.log(day, 0);
  }

  if(38400 < time && time < 43800){
    $('#table-'+day+'-1').addClass('active');

    console.log(day, 1);
  }

  if(46800 < time && time < 52200){
    $('#table-'+day+'-2').addClass('active');

    console.log(day, 2);
  }

  if(52800 < time && time < 58200){
    $('#table-'+day+'-3').addClass('active');

    console.log(day, 3);
  }

  if(58800 < time && time < 64200){
    $('#table-'+day+'-4').addClass('active');

    console.log(day, 4);
  }

  if(64800 < time && time < 70200){
    $('#table-'+day+'-5').addClass('active');

    console.log(day, 5);
  }
}

function renderDay(day, classes){
  var days = {
    0 : 'Понедельник',
    1 : 'Вторник',
    2 : 'Среда',
    3 : 'Четверг',
    4 : 'Пятница',
    5 : 'Суббота'
  };

  var time = {
    0 : '9:00 - 10:30',
    1 : '10:40 - 12:10',
    2 : '13:10 - 14:40',
    3 : '14:50 - 16:20',
    4 : '16:30 - 18:00',
    5 : '18:10 - 19:40'
  };

  var types = {
    0 : 'ЛК',
    1 : 'ПР',
    2 : 'ЛАБ',
    12 : 'ПР + ЛАБ',
    10 : 'ПР + ЛК',
    20 : 'ЛАБ + ЛК'
  };

  var classes_model = '';

  for(var i = 0; i < classes.length; i++){
    var name = classes[i][week].name ? classes[i][week].name : "-";
    var room = classes[i][week].room ? classes[i][week].room : "-";
    var teacher = classes[i][week].teacher ? classes[i][week].teacher : "-";
    var type = types[classes[i][week].type] ? ", " + types[classes[i][week].type] : "";

    classes_model += '<tr id="table-'+day+'-'+i+'">\
      <td>'+(i+1)+'</td>\
      <td>'+time[i]+'</td>\
      <td>'+name+type+'</td>\
      <td>'+room+'</td>\
      <td class="mobile-hidden-critical">'+teacher+'</td>\
    </tr>';
  }

  var model = '<div class="column">\
    <h3 class="header">'+days[day]+'</h3>\
    <table class="ui compact unstackable striped table" id="table-'+day+'">\
      <thead>\
        <tr>\
          <th>#</th>\
          <th><i class="wait icon"></i></th>\
          <th><i class="book icon"></i></th>\
          <th><i class="map icon"></i></th>\
          <th class="mobile-hidden-critical"><i class="user icon"></i></th>\
        </tr>\
      </thead>\
      <tbody>\
        '+classes_model+'\
      </tbody>\
    </table>\
  </div>';

  $('#schedule').append(model);
}
