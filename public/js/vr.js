$(document).ready(function(){
  $('.progress').progress();

  $('#specialty_dropdown').dropdown();
});

function openModal(term){
  var Term = classes[$('#specialty_value').val()][$('#profile_value').val()][term];

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
