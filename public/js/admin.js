$(document).ready(function(){
  document.body.onfocus = function(){
		$('#xlsx_upload_btn').removeClass('loading');
	}
});

function upload_xlsx(){
  $('#xlsx_upload_btn').removeClass('loading');
  $('#xlsx_upload_btn').addClass('loading');

  $('#xlsx_upload').click();
}

function sheet2arr(sheet){
   var json = XLSX.utils.sheet_to_json(sheet, { header : 1 });
   console.log(json);
   var object = {};
   var counter = 0;

   for(var i = 0; i < json.length; i++){
     for(var j = 0; j < json[i].length; j++){
       if(!object[`FIELD${j}`]) object[`FIELD${j}`] = [];
       if(!json[i][j]) json[i][j] = '';
       object[`FIELD${j}`].push(json[i][j].replace(/\r\n/g,' '));
     }
   }

   return object;
}

function getTerm(){
  var date = new Date();
  return Number(date.getFullYear().toString().substr(-2) + "" + Math.ceil(date.getMonth() / 6).toString());
}

var schedules = [];

function handleXLSX(event){
	var input = event.target;

  var reader = new FileReader();

  reader.onload = function(){
    var data = new Uint8Array(reader.result);

    var workbook = XLSX.read(data, { type: 'array' });

    var worksheet = workbook.Sheets['Лист1'];

    var columns = sheet2arr(worksheet);

    console.log(columns);

    schedules = [];

    var term = Number($('#term').val() || getTerm());
    var institute = Number($('#institute').val() || 0);

    var classes = [];
    var types = [];
    var teachers = [];
    var rooms = [];

    var group = null;

    for(var key in columns){
      var column = columns[key];

      if(column.indexOf('Предмет') > -1){
        group = column[column.indexOf('Предмет') - 1];

        for(var i = column.indexOf('Предмет') + 1; i < 73 + column.indexOf('Предмет'); i++){
          classes.push(column[i] || '');
        }
      }

      if(column.indexOf('Вид занятий') > -1){
        for(var i = column.indexOf('Вид занятий') + 1; i < 73 + column.indexOf('Вид занятий'); i++){
          types.push(column[i] || '');
        }
      }

      if(column.indexOf('ФИО преподавателя') > -1){
        for(var i = column.indexOf('ФИО преподавателя') + 1; i < 73 + column.indexOf('ФИО преподавателя'); i++){
          teachers.push(column[i] || '');
        }
      }

      if(column.indexOf('№  ауд.') > -1){
        for(var i = column.indexOf('№  ауд.') + 1; i < 73 + column.indexOf('№  ауд.'); i++){
          rooms.push(column[i] || '');
        }

        console.log(types);

        var sorted_classes = [];

        for(var i = 0; i < classes.length; i++){
          if(i % 2 == 0){
            var current_class = {
              odd : { name : classes[i] || null, type : convertType(types[i]), teacher : teachers[i] || null, room : rooms[i] || null },
              even : { name : classes[i+1] || null, type : convertType(types[i+1]), teacher : teachers[i+1] || null, room : rooms[i+1] || null }
            };

            sorted_classes.push(current_class);
          }
        }

        var days = [];

        for(var i = 0; i < sorted_classes.length; i++){
          if(i % 6 == 0){
            var day = [
              sorted_classes[i],
              sorted_classes[i+1],
              sorted_classes[i+2],
              sorted_classes[i+3],
              sorted_classes[i+4],
              sorted_classes[i+5]
            ];

            days.push(day);
          }
        }

        var schedule = {
          term : term,
          institute : institute,
          group : convertGroupName(group),
          secret : Math.floor(Math.random()*10000000),
          days : days
        };

        schedules.push(schedule);

        classes = [];
        types = [];
        teachers = [];
        rooms = [];
      }
    }

    $('#schedule_preview').val(JSON.stringify(schedules, null, 2));
  }

  reader.readAsArrayBuffer(input.files[0]);
}

function convertGroupName(name){
  name = name.replace(/ /g,'');
  name = translit(name, 5).toLowerCase();

  return name;
}

function convertType(type){
  var result = "";

  type = type.replace(/ /g,'');

  if(type.indexOf('+') > -1){
    type = type.split('+');

    if(type[0] != 'лк') result = Number(convertType(type[0]) + "" + convertType(type[1]));
    if(type[0] == 'лк') result = Number(convertType(type[1]) + "" + convertType(type[0]));
  } else {
    var Types = {
      "" : null,
      "лк" : 0,
      "пр" : 1,
      "лаб" : 2
    };

    result = Types[type];
  }

  return result;
}

function upload(){
  $('#upload_btn').removeClass('loading');
  $('#upload_btn').addClass('loading');

  var term = Number($('#term').val() || getTerm());
  var institute = Number($('#institute').val() || 0);
  var secret = $('#secret').val();

  api.schedule_remove_all({
    term : term,
    institute : institute,
    secret : secret
  }, (err, res) => {
    if(err){
      console.log(err);

      $('#upload_btn').removeClass('loading');
    } else {
  		console.log('Current schedule: clear');

      api.group_remove_all({
        institute : institute,
        secret : secret
      }, (err, res) => {
        if(err){
          console.log(err);

          $('#upload_btn').removeClass('loading');
        } else {
  				console.log('Current group list: clear');

          for(var i = 0; i < schedules.length; i++){
            api.schedule_new({
              schedule : schedules[i],
              secret : secret
            }, (err, res) => {});

            var group = {
              institute : institute,
              group : schedules[i].group,
              secret : schedules[i].secret
            };

            api.group_new({
              group : group,
              secret : secret
            }, (err, res) => {
              if(err){
                console.log(err);
              }
            });
          }

  				console.log('Done');

          $('#upload_btn').removeClass('loading');
        }
      });
    }
  });
}
