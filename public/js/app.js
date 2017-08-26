Date.prototype.getWeek = function () {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
};

$(document).ready(() => {
  /*
  api.schedule_get({ term : 172, institute : 0, group : 'ikbo-02-17' }, (err, res) => {
    if(err){
      console.log(err);
    } else {
      $('#schedule').text('');

      let schedule = res.schedule;

      for(let i = 0; i < schedule.days.length; i++){
        renderDay(i, schedule.days[i]);
      }
    }
  });
  */
});

function getWeek(){
  let now = new Date();
  let september = new Date(now.getFullYear()+"-09-01");

  if(september.getWeek() % 2 == 0){
    if((now.getWeek() + 1) % 2 == 0){
      return 'even';
    } else {
      return 'odd';
    }
  } else {
    if(now.getWeek() % 2 == 0){
      return 'even';
    } else {
      return 'odd';
    }
  }
}

function renderDay(day, classes){
  let week = getWeek();

  let days = {
    0 : 'Понедельник',
    1 : 'Вторник',
    2 : 'Среда',
    3 : 'Четверг',
    4 : 'Пятница',
    5 : 'Суббота'
  };

  let time = {
    0 : '9:30 - 10:30',
    1 : '10:40 - 12:10',
    2 : '13:00 - 14:30',
    3 : '14:40 - 16:10',
    4 : '16:20 - 17:50',
    5 : '18:00 - 19:30'
  };

  let types = {
    0 : 'ЛК',
    1 : 'ПР',
    2 : 'ЛАБ',
    12 : 'ПР + ЛАБ',
    10 : 'ПР + ЛК',
    20 : 'ЛАБ + ЛК'
  };

  let classes_model = '';

  for(let i = 0; i < classes.length; i++){
    let name = classes[i][week].name ? classes[i][week].name : "-";
    let room = classes[i][week].room ? classes[i][week].room : "-";
    let teacher = classes[i][week].teacher ? classes[i][week].teacher : "-";
    let type = types[classes[i][week].type] ? types[classes[i][week].type] : "-";

    classes_model += '<tr>\
      <td>'+(i+1)+'</td>\
      <td>'+time[i]+'</td>\
      <td>'+name+'</td>\
      <td>'+room+'</td>\
      <td>'+type+'</td>\
      <td>'+teacher+'</td>\
    </tr>';
  }

  let model = '<div class="column">\
    <h3 class="header">'+days[day]+'</h3>\
    <table class="ui compact unstackable striped table">\
      <thead>\
        <tr>\
          <th>#</th>\
          <th><i class="wait icon"></i></th>\
          <th><i class="book icon"></i></th>\
          <th><i class="map icon"></i></th>\
          <th>Тип</th>\
          <th><i class="user icon"></i></th>\
        </tr>\
      </thead>\
      <tbody>\
        '+classes_model+'\
      </tbody>\
    </table>\
  </div>';

  $('#schedule').append(model);
}
