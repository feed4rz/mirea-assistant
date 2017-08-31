if(!process.argv[2]) throw 'Please, provide institute as an argument';
if(!process.argv[3]) throw 'Please, provide term as an argument';

/* Dependencies */
const XLSX = require('xlsx');
const fs = require('fs');
const random = require('./random.js');
const translit = require('./translit.js');

const workbook = XLSX.readFile('../data/schedule.xlsx');
let worksheet = workbook.Sheets['Лист1'];

function sheet2arr(sheet){
   let json = XLSX.utils.sheet_to_json(sheet, { header : 1 });
   let object = {};
   let counter = 0;

   for(let i = 0; i < json.length; i++){
     for(let j = 0; j < json[i].length; j++){
       if(!object[`FIELD${j}`]) object[`FIELD${j}`] = [];
       if(!json[i][j]) json[i][j] = '';
       object[`FIELD${j}`].push(json[i][j].replace(/\r\n/g,' '));
     }
   }

   return object;
};

const institute = Number(process.argv[2]);
const term = Number(process.argv[3]);
const columns = sheet2arr(worksheet);

fs.writeFileSync('../data/columns.json', JSON.stringify(columns, null, 2));

let schedules = [];

let classes = [];
let types = [];
let teachers = [];
let rooms = [];

let group = null;

for(let key in columns){
  let column = columns[key];

  if(column.indexOf('Предмет') > -1){
    group = column[column.indexOf('Предмет') - 1];

    for(let i = column.indexOf('Предмет') + 1; i < 73 + column.indexOf('Предмет'); i++){
      classes.push(column[i] || '');
    }
  }

  if(column.indexOf('Вид занятий') > -1){
    for(let i = column.indexOf('Вид занятий') + 1; i < 73 + column.indexOf('Вид занятий'); i++){
      types.push(column[i] || '');
    }
  }

  if(column.indexOf('ФИО преподавателя') > -1){
    for(let i = column.indexOf('ФИО преподавателя') + 1; i < 73 + column.indexOf('ФИО преподавателя'); i++){
      teachers.push(column[i] || '');
    }
  }

  if(column.indexOf('№  ауд.') > -1){
    for(let i = column.indexOf('№  ауд.') + 1; i < 73 + column.indexOf('№  ауд.'); i++){
      rooms.push(column[i] || '');
    }

    console.log(types);

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
  name = name.replace(/ /g,'');
  name = translit(name, 5).toLowerCase();

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

fs.writeFileSync('../data/schedule.json', JSON.stringify(schedules, null, 2));
