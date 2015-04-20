$(function(){
	loadHtml() ;
	

	$(".dropdown").each(function(){  
        var $this = $(this);  
        var input_dropdown = $this.find(".input_dropdown"); 
		var jt = $this.find(".jt");  
        var ul = $this.find("ul"); 
		var li=$this.find("li"); 
        input_dropdown.click(function(){
			if(ul.css("display")=="none"){ 
				ul.slideDown("fast"); 
			}else{ 
				ul.slideUp("fast"); 
			} 
		})
		jt.click(function(){
			if(ul.css("display")=="none"){ 
				ul.slideDown("fast"); 
			}else{ 
				ul.slideUp("fast"); 
			} 
		})
		li.click(function(){
			var txt = $(this).text(); 
			if(input_dropdown.hasClass("input")){
				input_dropdown.val(txt); 
			}else{
				input_dropdown.find(".font").text(txt); 
			}
			ul.hide(); 
		})			                                
    });  
	
//评分
	var ratingNum=$(".rating .ratingnum").text();
	var ratingPercent=ratingNum/5*100;
	$(".rating .ratingvalue").css({'width':ratingPercent+'%'});

	$("#header .setting").click(function(){
				showdiv(".popsetup",1);			
	})
	
	//设置
	$("#setupmenu li").click(function(){
		$(this).addClass("selected").siblings().removeClass("selected");
		var index=$(this).index();
		$("#setupcontent .setupcon").eq(index).addClass("show").siblings().removeClass("show");		
	})
})

	function showdiv(elem,index) {
		if(index==1){
			$(elem).before("<div class='tckuanglayer'></div>");
			}
		if(index==2){
			$(elem).before("<div class='tckuanglayer2'></div>");
			}
		if(index==3){
			$(elem).before("<div class='tckuanglayer3'></div>");
			}
		$("body", "html").css({
			height: "100%",
			width: "100%"
		});
		$("html").css("overflow", "hidden");
		$("body").css("overflow", "hidden");
		if ($.browser.msie && ($.browser.version == "6.0") && !$.support.style) {
			$(elem).css("top", ($(window).height() - $(elem).height()) / 2 + $(window).scrollTop() + "px");
		} else {
			$(elem).css("top", ($(window).height() - $(elem).height()) / 2 + $(window).scrollTop() + "px");
		}
		$(elem).css("left", ($(window).width() - $(elem).width()) / 2 + "px");
		$(elem).fadeIn("slow");
		$(window).resize(function() {
			$(elem).css("top", ($(window).height() - $(elem).height()) / 2 + "px");
			$(elem).css("left", ($(window).width() - $(elem).width()) / 2 + "px");
		});
	}
	function loadHtml() {
		$.ajaxSetup({
			async: false //取消异步  
		});
		$(".addhtml").each(function(){
			var _this=$(this);
			var html=$(this).attr("url");
			$.get(html,
			function(data) {
				_this.append(data);
			});
		})
		$.ajaxSetup({
			async: true //取消异步  
		});
	}
	
	

	function close_box(elm,index) {
		if(index==1){
			$(".tckuanglayer").remove();
			}
		if(index==2){
			$(".tckuanglayer2").remove();
			}
		if(index==3){
			$(".tckuanglayer3").remove();
			}
		$(elm).fadeOut();
		$("html").css("overflow", "auto");
		$("body").css("overflow", "auto");
	}

//ÆÀ·Ö
var ratingNum=$(".rating .ratingnum").text();
var ratingPercent=ratingNum/5*100;
console.log(ratingNum);
$(".rating .ratingvalue").css({'width':ratingPercent+'%'});

