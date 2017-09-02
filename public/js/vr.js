$(document).ready(function(){
  $('.progress').progress();

  $('#specialty_dropdown').dropdown();
});

var marks = $.extend(true, {}, classes);;

function save(){
  var specialty = $('#specialty_value').val();
  var profile = $('#profile_value').val();
  var term = $('#term').text();

  marks[specialty][profile][term][0] = Number($('#class-1-value').val() || "0");
  marks[specialty][profile][term][1] = Number($('#class-2-value').val() || "0");
  marks[specialty][profile][term][2] = Number($('#class-3-value').val() || "0");
  marks[specialty][profile][term][3] = Number($('#class-4-value').val() || "0");
  marks[specialty][profile][term][4] = Number($('#class-5-value').val() || "0");

  updateProgress();
}

function updateProgress(){
  var value = 0;
  for(var key in marks){
    for(var keey in marks[key]){
      for(var i = 1; i < 8; i++){
        for(var j = 0;j < marks[key][keey][i].length; j++){
          if(typeof marks[key][keey][i][j] != 'number') continue;

          switch (j) {
            case 0:
              value += (marks[key][keey][i][j] - 2) * 2;
              break;
            case 1:
              value += (marks[key][keey][i][j] - 2) * 2;
              break;
            case 2:
              value += marks[key][keey][i][j] - 2;
              break;
            case 3:
              value += marks[key][keey][i][j] - 2;
              break;
            case 4:
              value += (marks[key][keey][i][j] - 2) / 2;
              break;
          }
        }
      }
    }
  }

  $('.progress').progress({ value : value });
}

function openModal(term){
  var Term = classes[$('#specialty_value').val()][$('#profile_value').val()][term];
  var TermMarks = marks[$('#specialty_value').val()][$('#profile_value').val()][term];

  $('#term').text(term);

  $('#class-1').text(Term[0]);
  $('#class-2').text(Term[1]);
  $('#class-3').text(Term[2]);
  $('#class-4').text(Term[3]);
  $('#class-5').text(Term[4]);

  $('#class-1-dropdown').dropdown();
  $('#class-2-dropdown').dropdown();
  $('#class-3-dropdown').dropdown();
  $('#class-4-dropdown').dropdown();
  $('#class-5-dropdown').dropdown();

  for(var i = 0; i < TermMarks.length; i++){
    if(typeof TermMarks[i] != 'number'){
      $('#class-'+(i+1)+'-dropdown').dropdown('clear');
      continue;
    }

    $('#class-'+(i+1)+'-dropdown [data-value="'+TermMarks[i]+'"]').click();
  }

  $('#score').modal('show');
}

function selectSpecialty(name){
  var specialty = classes[name];
  var profiles = Object.keys(specialty);

  for(var i = 0; i < profiles.length; i++){
    var model = '<div class="item" data-value="'+profiles[i]+'" onclick="selectProfile(\''+profiles[i]+'\')">'+profiles[i]+'</div>';

    $('#profile_select').append(model);
  }

  $('#profile_dropdown').dropdown();
}

function selectProfile(name){
  $('#achievements').show();
}
