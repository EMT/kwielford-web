var face = [];

$('.save-face').on('click', function(e) {
    e.preventDefault;
    $('.row').each(function() {
      var checkboxes = $(this).children();
      var faceRow = '';
      
      $(checkboxes).each(function() {
             if($(this).prop('checked')) {
                 faceRow += '1';
              } else {
                 faceRow += '0';
              }
       });
      face.push(faceRow);
     });
  console.log(face);
  face = [];
  
  $('span').fadeIn(500);
  setTimeout( function() {
      $('span').fadeOut(500);
  }, 1500)
  
});


// Draggable selection - Need to clean this up - SPAGGETI CODE.

var mousedown = false;

$('input[type="checkbox"]').click(function(e) {
        e.preventDefault();
        return false;
});


$('face-grid').on('mousedown', function(e){
  e.preventDefault;
});

$('input[type="checkbox"]').on('mousedown', function(){
  mousedown = true;
    if($(this).prop('checked')) {
         $(this).prop('checked', false);
    } else {
         $(this).prop('checked', true);
    }
});

$('.face-grid').on('mouseup', function(e){
  e.preventDefault;
  mousedown = false;
});

$('input[type="checkbox"]').on('mouseenter', function(){
  if ( mousedown == true) {
    if($(this).prop('checked')) {
         $(this).prop('checked', false);
    } else {
         $(this).prop('checked', true);
    }
  }
});
