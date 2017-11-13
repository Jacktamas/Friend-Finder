var questions = ['I get angry easily','I am filled with doubts about things',
'I feel others emotions','I respect authority','I carry out my plans','I make friends easily',
'I am quick to understand things','I enjoy the beauty of nature','I believe in evolution','I use facebook every day'];


$(document).ready(function(){
  for(var index=0; index < questions.length; index++){
    $('form > button:last').before(
      $('<div>')
      .addClass('row')
      .append(
        $('<div>')
        .addClass('form-group animated wow delay-0'+(index+1)+'s slideInUp fadeInUp col-lg-3')
        .append(
          $('<label>')
          .attr('for','question'+(index+1))
          .text('Question '+(index+1)),('<span style="color: red;"> *</span><br/>'),
          $('<p>').html(questions[index]),
          $('<select>')
          .addClass('form-control')
          .attr('id','question'+(index+1)+'')
          .append(
            $('<option value="0">Choose....</option>'),
            $('<option value="1">').text('1 [Strongley Disagree]'),
            $('<option value="2">').text('2'),
            $('<option value="3">').text('3'),
            $('<option value="4">').text('4'),
            $('<option value="5">').text('5 [Strongley Agree]')
          )
        )
      )
    )
  }

  $.ajax({
    url:'/api/friends',
    method: 'GET'
  }).done(function(data){
    var images = 0;
    setInterval(function(){
      if(images < data.length){
        var imgUrl =  data[images].photo;
        $('#logo').empty();
        $('#logo').append(
          $('<img>')
          .addClass('fadeIn animated animation-duration-1s img img-thumbnail img-size')
          .attr('src', imgUrl)
        )
        images ++;
      }
      else {
        images =0;
      }
    },2000);

    for(var i=0; i < data.length; i++){
      $('<figure>')
      .addClass('col-lg-2 img margin animated delay-0'+(i+2)+'s fadeInUp photo')
      .append(
        $('<img>')
        .addClass('img img-thumbnail')
        .attr('src', data[i].photo)
        .attr('alt', data[i].name.toUpperCase()),
        $('<figcaption>')
        .addClass('text-center img-thumbnail')
        .html('<b>'+data[i].name.toUpperCase()+'</b>')
      ).appendTo('#friendsCards').addClass('margin-top')
    }

  });

  $.fn.extend({
    animateCss: function (animationName) {
      var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
      this.addClass('animated ' + animationName).one(animationEnd, function() {
        $(this).removeClass('animated ' + animationName);
      });
      return this;
    }
  });
});


$("button.submit").on("click", function(event) {
  event.preventDefault();
  if($('#name').val() == ''){
    $('#name')
    .animateCss('shake')
    .css('border-color', 'red');
    $(window).scrollTop('#name');
  }
  else {
    (!$('#name').val() == '')
    $('#name').css('border-color', 'green');
    var friendName = $('#name').val().trim();
  }

  if($('#photolink').val() == ''){
    $('#photolink')
    .animateCss('shake')
    .css('border-color', 'red');
    $(window).scrollTop('#photolink');
  }
  else {
    (!$('#photolink').val() == '')
    $('#photolink').css('border-color', 'green');
    var friendPhoto = $('#photolink').val().trim();
  }
  var friend = {
    "name": friendName,
    "photo": friendPhoto,
    "scores": []
  };

  $('select option:selected').each(function(j){
    if($(this).val() == 0){
      $('#question'+(j+1)+'')
      .animateCss('shake')
      .css('border-color', 'red');
      $(window).scrollTop('#question'+(j+1)+'');
    }
    else {
      $('#question'+(j+1)+'').css('border-color', 'green');
      friend.scores.push(parseInt($('#question'+(j+1)+'').val().trim()));
    };

  });
  // Clear the form when submitting
  $("#name").val("");
  $("#photolink").val("");
  $('select option:selected').each(function(num){
    $('#question'+(num+1)+'')
    .prop('selectedIndex',0)
    .css('border-color', '#d1d1d1');
    $('#photolink').css('border-color', '#d1d1d1');
    $('#name').css('border-color', '#d1d1d1');
  });

  if(friend.scores.length == 10){
    $.post('/api/friends', friend, function(data) {
      if(data === false){
        $('.modal-title').html('<span style="color: red;">ERROR!</span>').addClass('text-center')
        $('.modal-body').html(
          $('<h1>')
          .addClass('text-center')
          .text('Sorry! You\'re already exist! in our database!')
        )
        $('#myModal').modal('show');
      }
      else {
        $('.modal-title').text(data.name).addClass('text-center')
        $('.modal-body').html(
          $('<img>')
          .attr('src', data.photo)
          .addClass('img img-thumbnail')
        )
        $('#myModal').modal('show');
      }
    });
  }
});
