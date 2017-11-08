var questions = ['I get angry easily','I am filled with doubts about things',
'I feel others emotions','I respect authority','I carry out my plans','I make friends easily',
'I am quick to understand things','I enjoy the beauty of nature','I believe in evolution','I use facebook every day'];


$(document).ready(function(){

  for(var i=0; i < questions.length; i++){
    $('form > button:last').before(
      $('<div>')
      .addClass('row')
      .append(
        $('<div>')
        .addClass('form-group animated wow delay-0'+(i+1)+'s slideInUp fadeInUp col-lg-3')
        .append(
          $('<label>')
          .attr('for','question'+(i+1))
          .text('Question '+(i+1)),('<br/>'),
          $('<p>').html(questions[i]),
          $('<select>')
          .addClass('form-control')
          .attr('id','question'+(i+1)+'')
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
    for(var i=0; i < data.length; i++){
      $('<figure>')
      .addClass('col-lg-3 img margin animated delay-0'+(i+2)+'s fadeInUp photo')
      .append(
        $('<img>')
        .addClass('img img-thumbnail')
        .attr('src', data[i].photo)
        .attr('alt', data[i].name),
        $('<figcaption>')
        .addClass('text-center img-thumbnail')
        .html('<b>'+data[i].name+'</b>')
      ).appendTo('#friendsCards')
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

    var answers = [];
    $('select option:selected').each(function(i){
      if($(this).val() == 0){
        $('#question'+(i+1)+'')
        .animateCss('shake')
        .css('border-color', 'red');
        $(window).scrollTop('#question'+(i+1)+'');
      }
      else {
        $('#question'+(i+1)+'').css('border-color', 'green');
        answers.push(parseInt($('#question'+(i+1)+'').val().trim()));
        if(answers.length == 10){
          var friend = {
            name: friendName,
            photo: friendPhoto,
            scoresAnswer: answers
          };
          $.post("/api/friends", friend,
          function(data) {
            if(data[data.length -1].name === friendName){
              $('.modal-title').html('<b>'+data[0].name+'</b>').addClass('text-center')
              $('.modal-body').html(
                $('<img>')
                .attr('src', data[0].photo)
                .addClass('img img-thumbnail'),
                $('<figcaption>')
                .addClass('text-center img-thumbnail')
                .html('<b>'+data[0].name+'</b>')
              )
            }

            // Clear the form when submitting
            $("#name").val("");
            $("#photolink").val("");
            $('select option:selected').each(function(i){
              $('#question'+(i+1)+'')
              .prop('selectedIndex',0)
              .css('border-color', '#d1d1d1');
              $('#photolink').css('border-color', '#d1d1d1');
              $('#name').css('border-color', '#d1d1d1');

            });

          });
        }
      }
    });
  });
});
