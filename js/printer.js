$(".printer-form").submit(function(e){
	e.preventDefault();
	content = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Document</title></head><body>'
	content += $("#content").val();
	content += '</body></html>'
	$("#content").val(content);
	$(".printer-form").submit();
})