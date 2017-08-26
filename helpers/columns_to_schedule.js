/* Standalone app that converts columns from CSV to proper schedule model. */

/* Config */
const term = 172;
const institute = 3;

/* Dependencies */
/*
  Use http://www.convertcsv.com/csv-to-json.htm to
  convert csv into json column array
*/
const columns = require('../data/schedule_columns_raw.json');
const fs = require('fs');
const random = require('./random.js');

let schedules = [];

let classes = [];
let types = [];
let teachers = [];
let rooms = [];

let group = null;

for(let key in columns){
  let column = columns[key];

  if(column.indexOf('Предмет') > -1){
    group = column[2];

    for(let i = 4; i < 76; i++){
      classes.push(column[i]);
    }
  }

  if(column.indexOf('Вид занятий') > -1){
    for(let i = 4; i < 76; i++){
      types.push(column[i]);
    }
  }

  if(column.indexOf('ФИО преподавателя') > -1){
    for(let i = 4; i < 76; i++){
      teachers.push(column[i]);
    }
  }

  if(column.indexOf('№  ауд.') > -1){
    for(let i = 4; i < 76; i++){
      rooms.push(column[i]);
    }

    let sorted_classes = [];

    for(let i = 0; i < classes.length; i++){
      if(i % 2 == 0){
        let current_class = {
          odd : { name : classes[i] || null, type : convertType(types[i]), teacher : teachers[i] || null, room : rooms[i] || null },
          even : { name : classes[i+1] || null, type : convertType(types[i+1]), teacher : teachers[i+1] || null, room : rooms[i+1] || null }
        };

        sorted_classes.push(current_class);
      }
    }

    let days = [];

    for(let i = 0; i < sorted_classes.length; i++){
      if(i % 6 == 0){
        let day = [
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

    let schedule = {
      term : term,
      institute : institute,
      group : convertGroupName(group),
      secret : random.string(8),
      days : days
    };

    schedules.push(schedule);

    classes = [];
    types = [];
    teachers = [];
    rooms = [];

    //group = null;
  }
}

function convertGroupName(name){
  console.log(name);

  name = name.replace(/ /g,'');
  name = name.replace(/И/g,'i');
  name = name.replace(/К/g,'k');
  name = name.replace(/Б/g,'b');
  name = name.replace(/О/g,'o');
  name = name.replace(/А/g,'a');
  name = name.replace(/В/g,'v');
  name = name.replace(/Н/g,'n');
  name = name.replace(/Т/g,'t');
  name = name.replace(/Ш/g,'sh');
  name = name.replace(/Х/g,'h');
  name = name.replace(/Л/g,'l');
  name = name.replace(/С/g,'s');
  name = name.replace(/Э/g,'e');
  name = name.replace(/У/g,'u');
  name = name.replace(/Д/g,'d');
  name = name.replace(/М/g,'m');
  name = name.replace(/Р/g,'r');
  name = name.replace(/Г/g,'g');
  name = name.replace(/П/g,'p');

  return name;
}

function convertType(type){
  let result = "";

  type = type.replace(/ /g,'');

  if(type.indexOf('+') > -1){
    type = type.split('+');

    if(type[0] != 'лк') result = Number(convertType(type[0]) + "" + convertType(type[1]));
    if(type[0] == 'лк') result = Number(convertType(type[1]) + "" + convertType(type[0]));
  } else {
    let Types = {
      "" : null,
      "лк" : 0,
      "пр" : 1,
      "лаб" : 2
    };

    result = Types[type];
  }

  return result;
}

fs.writeFileSync(`../data/schedule.json`, JSON.stringify(schedules, null, 2));
