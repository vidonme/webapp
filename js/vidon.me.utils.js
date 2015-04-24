function showdiv() {
	$(".vidoncover").show();
	$(".loadimg").show();
	$(".vidoncover").css('height', $(document).height());
	$("body", "html").css({
		height: "100%",
		width: "100%"
	});
	//$("html").css("overflow", "hidden");
	//$("body").css("overflow", "hidden");
	if ($.browser.msie && ($.browser.version == "6.0") && !$.support.style) {
		$(".loadimg").css("top", ($(window).height() - $(".loadimg").height()) / 2 + $(window).scrollTop() + "px");
	} else {
		$(".loadimg").css("top", ($(window).height() - $(".loadimg").height()) / 2 + $(window).scrollTop() + "px");
	}
	$(".loadimg").css("left", ($(window).width() - $(".loadimg").width()) / 2 + "px");
	$(".loadimg").fadeIn("slow");

	$(window).resize(function() {
		$(".loadimg").css("top", ($(window).height() - $(".loadimg").height()) / 2 + "px");
		$(".loadimg").css("left", ($(window).width() - $(".loadimg").width()) / 2 + "px");
	});
}

function hidediv() {
	$(".vidoncover").hide();
	$(".loadimg").hide();
}