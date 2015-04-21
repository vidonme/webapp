$(function(){
	loadHtml() ;
	loadProperties();
	translateHtml();

	//var settings = new SettingService();
	
	$(".dropdown").each(function(){  
        var $this = $(this);  
        var input_dropdown = $this.find(".input_dropdown"); 
		var jt = $this.find(".jt");  
        var ul = $this.find("ul"); 
		var li=$this.find("li"); 
        input_dropdown.click(function(){
			if($this.hasClass("disable")){
				ul.hide();
				
				}
			else{
				if(ul.css("display")=="none"){ 
				ul.slideDown("fast"); 
				}else{ 
				ul.slideUp("fast"); 
				} 
			}
			
		})
		jt.click(function(){
			if($this.hasClass("disable")){
				ul.hide();
				}
			else{
				if(ul.css("display")=="none"){ 
				ul.slideDown("fast"); 
				}else{ 
				ul.slideUp("fast"); 
				} 
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
	//自动升级
	$("#autostart .checkbox").click(function(){
	
		$(".autoupgrade").toggleClass("disable");
		$(".autoupgrade .dropdown").toggleClass("disable");
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

	function translateHtml() {
		$("[trans_value]").each(function(){
			var _this=$(this);
			var originStr=$(this).attr("trans_value");
			originStr = $.i18n.prop( originStr );
			_this.html( originStr );
		})

		$("[trans_title]").each(function(){
			var _this=$(this);
			var originStr=$(this).attr("trans_title");
			originStr = $.i18n.prop( originStr );
			_this.attr( "title", originStr );
		})
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

function loadProperties(){
			jQuery.i18n.properties({//¼ÓÔØ×Êä¯ÀÀÆ÷ÓïÑÔ¶ÔÓ¦µÄ×ÊÔ´ÎÄ¼þ
					name:'strings', //×ÊÔ´ÎÄ¼þÃû³Æ
					path:'i18n/', //×ÊÔ´ÎÄ¼þÂ·¾¶
					mode:'map', //ÓÃMapµÄ·½Ê½Ê¹ÓÃ×ÊÔ´ÎÄ¼þÖÐµÄÖµ
					callback: function() {//¼ÓÔØ³É¹¦ºóÉèÖÃÏÔÊ¾ÄÚÈÝ
						//ÓÃ»§Ãû
						$('#label_username').html($.i18n.prop('string_movie'));
					    //ÃÜÂë
						$('#label_password').html($.i18n.prop('string_teleplay'));
					    //µÇÂ¼
						$('#button_login').val($.i18n.prop('string_home_video'));
					}
			});
}

String.prototype.format=function()  
{  
  if(arguments.length==0) return this;  
  for(var s=this, i=0; i<arguments.length; i++)  
    s=s.replace(new RegExp("\\{"+i+"\\}","g"), arguments[i]);  
  return s;  
};
//ÆÀ·Ö
var ratingNum=$(".rating .ratingnum").text();
var ratingPercent=ratingNum/5*100;
console.log(ratingNum);
$(".rating .ratingvalue").css({'width':ratingPercent+'%'});

