$(document).on('DOMContentLoaded', function() {
  $('<button>').text('Slide Toggle').addClass('slide_down').appendTo(($('#personal_message').parent()));

  $('.slide_down').on('click', function() {
    $('#personal_message').slideToggle('slow');
  });
});