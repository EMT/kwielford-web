$(".interface-wrapper h2").click(function(){
    $(".interface-wrapper h2").removeClass("selected");
        $.get( "http://10.0.1.52/?mood=" + $(this).data("mood"), function( data ) {
    });
  $(this).addClass("selected");
})