var g_languageType = null;

$(function() {
	loadHtml();
	loadProperties("en");
	translateHtml();
	getServerLanguage();
	var settings = new SettingService();
	//var settings = new SettingService();

	$(".dropdown").each(function() {
		var $this = $(this);
		var input_dropdown = $this.find(".input_dropdown");
		var jt = $this.find(".jt");
		var ul = $this.find("ul");
		var li = $this.find("li");
		input_dropdown.click(function() {
			if ($this.hasClass("disable")) {
				ul.hide();

			} else {
				if (ul.css("display") == "none") {
					ul.slideDown("fast");
				} else {
					ul.slideUp("fast");
				}
			}

		})
		jt.click(function() {
			if ($this.hasClass("disable")) {
				ul.hide();
			} else {
				if (ul.css("display") == "none") {
					ul.slideDown("fast");
				} else {
					ul.slideUp("fast");
				}
			}
		})
		li.click(function() {
			var txt = $(this).text();
			var cusvalue = $(this).attr("cus_value");
			if (input_dropdown.hasClass("input")) {
				input_dropdown.val(txt);
				input_dropdown.attr("cus_value", cusvalue);
			} else {
				input_dropdown.find(".font").text(txt);
				input_dropdown.attr("cus_value", cusvalue);
			}
			ul.hide();
		})
		$this.hover(function() {
				ul.fadeOut(10).hide();
			},
			function() {
				ul.fadeOut(10).hide();
			});
	});


	//评分
	var ratingNum = $(".rating .ratingnum").text();
	var ratingPercent = ratingNum / 5 * 100;
	$(".rating .ratingvalue").css({
		'width': ratingPercent + '%'
	});

	$("#header .setting").click(function() {
		showdiv(".popsetup", 1);
	})

	//设置
	$("#setupmenu li").click(function() {
			$(this).addClass("selected").siblings().removeClass("selected");
			var index = $(this).index();
			$("#setupcontent .setupcon").eq(index).addClass("show").siblings().removeClass("show");
			showSettingPage(index);
		})
		//自动升级
	$("#autoUpdate .checkbox").click(function() {

			$(".autoupgrade").toggleClass("disable");
			$(".autoupgrade .dropdown").toggleClass("disable");
		})
		//按钮有灰色变亮
	$("#selectedMedia a").click(function() {
		$("#setUp3btn").removeClass("btn-disable").addClass("btn-blue");
	})
	$("#btnAddLibPathOK").click(function() {
		$("#btnWzdOK").removeClass("btn-disable").addClass("btn-blue");
	})

})

function showdiv(elem, index) {
	if (index == 1) {
		$(elem).before("<div class='tckuanglayer'></div>");
	}
	if (index == 2) {
		$(elem).before("<div class='tckuanglayer2'></div>");
	}
	if (index == 3) {
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
	$(".addhtml").each(function() {
		var _this = $(this);
		var html = $(this).attr("url");
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
	$("[trans_value]").each(function() {
		var _this = $(this);
		var originStr = $(this).attr("trans_value");
		originStr = $.i18n.prop(originStr);
		_this.html(originStr);
	})

	$("[trans_in_value]").each(function() {
		var _this = $(this);
		var originStr = $(this).attr("trans_in_value");
		originStr = $.i18n.prop(originStr);
		_this.attr("value", originStr);
	})

	$("[trans_title]").each(function() {
		var _this = $(this);
		var originStr = $(this).attr("trans_title");
		originStr = $.i18n.prop(originStr);
		_this.attr("title", originStr);
	})
}



function close_box(elm, index) {
	if (index == 1) {
		$(".tckuanglayer").remove();
	}
	if (index == 2) {
		$(".tckuanglayer2").remove();
	}
	if (index == 3) {
		$(".tckuanglayer3").remove();
	}
	$(elm).fadeOut();
	$("html").css("overflow", "auto");
	$("body").css("overflow", "auto");
}

function loadProperties(languageType) {
	jQuery.i18n.properties({ //¼ÓÔØ×Êä¯ÀÀÆ÷ÓïÑÔ¶ÔÓ¦µÄ×ÊÔ´ÎÄ¼þ
		name: 'strings', //×ÊÔ´ÎÄ¼þÃû³Æ
		path: 'i18n/', //×ÊÔ´ÎÄ¼þÂ·¾¶
		mode: 'map', //ÓÃMapµÄ·½Ê½Ê¹ÓÃ×ÊÔ´ÎÄ¼þÖÐµÄÖµ
		language: languageType,
		callback: function() { //¼ÓÔØ³É¹¦ºóÉèÖÃÏÔÊ¾ÄÚÈÝ
		}
	});
}

function getServerLanguage() {
	vidonme.rpc.request({
		'context': this,
		'method': 'VidOnMe.GetSystemSetting',
		'params': {
			"key": "language.default"
		},
		'success': function(data) {
			var locale = "en";
			if (data && data.result) {

				if (data.result.val == "Chinese (Simple)") {
					locale = "zh-cn";
				} else if (data.result.val == "Chinese (Traditional)") {
					locale = "zh-tw";
				} else if (data.result.val == "German") {
					locale = "de";
				} else if (data.result.val == "French") {
					locale = "fr";
				} else if (data.result.val == "Japanese") {
					locale = "ja";
				} else if (data.result.val == "Portuguese (Brazil)") {
					locale = "pt";
				} else if (data.result.val == "Spanish" || data.result.val == "Spanish (Mexico)") {
					locale = "es";
				} else if (data.result.val == "Korean") {
					locale = "ko";
				} else if (data.result.val == "Swedish") {
					locale = "se";
				} else if (data.result.val == "English" || data.result.val == "") {
					locale = "en";
				}

				g_languageType = locale;
				loadProperties(locale);
				translateHtml();
			}
		}
	});
}

String.prototype.format = function() {
	if (arguments.length == 0) return this;
	for (var s = this, i = 0; i < arguments.length; i++)
		s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
	return s;
};
//ÆÀ·Ö
var ratingNum = $(".rating .ratingnum").text();
var ratingPercent = ratingNum / 5 * 100;
console.log(ratingNum);
$(".rating .ratingvalue").css({
	'width': ratingPercent + '%'
});