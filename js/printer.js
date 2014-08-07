$(".printer-form").submit(function(e){
	e.preventDefault();
	content = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Document</title></head><body><div style="margin-bottom:30px;"></div>'
	content += $("#content").val();
	content += '</body></html>'
	$("#content").val(content);
	$(".printer-form").submit();
})


$(document).ready(function () {
	$('.new-to-do').on('click',function(){
		$('ul').append('<li><p contenteditable="true">Test</p></li>');
	});

	$('.add').on('click', function(){
		var form = $('.content').html();
		$('#content').val(form);
	});
});