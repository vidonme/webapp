function ShowMgrBtn() {
	var checked = document.getElementById("mgrbtnswitch").checked;
	var btn = document.getElementById("mgrbtn");
	if (checked) {
		btn.disabled = false;
		btn.style.color = "white";
		btn.style.cursor = "pointer";
	} else {
		btn.disabled = true;
		btn.style.color = "grey";
		btn.style.cursor = "";
	}
}

function ShowMgrPage() {
	vidonme.rpc.request({
		'context': this,
		'method': 'VidOnMe.SetSystemSetting',
		'params': {
			'key': "promotion.display",
			'val': "false"
		},
		'success': function(data) {
			if (data && data.result.ret == true) {
				document.getElementById("mgrbtn").style.background = "url(promotion/showpage_btn_hover.png)";
				setTimeout(function() {
					var location = window.location.href;
					if (location.substr(location.length - 2) == "/#") {
						location = location.substr(0, location.length - 2);
					}
					
					window.location.replace(location);
					clearInterval(intervalId);
				}, 500);
			}
		}
	});
}

function mousehover(id) {
	var element = document.getElementById(id);
	if (id == "Android_player") {
		element.src = "promotion/android_btn_hover.png";
	} else if (id == "Android_cloud") {
		element.src = "promotion/android_btn_hover.png";
	} else if (id == "iOS_player") {
		element.src = "promotion/ios_btn_hover.png";
	} else if (id == "iOS_cloud") {
		element.src = "promotion/ios_btn_hover.png";
	} else if (id == "mgrbtn") {
		if (!element.disabled) {
			element.style.background = "url(promotion/showpage_btn_hover.png)";
		}
	} else {
		;
	}
}

function mouseout(id) {
	var element = document.getElementById(id);
	if (id == "Android_player") {
		element.src = "promotion/android_btn_normal.png";
	} else if (id == "Android_cloud") {
		element.src = "promotion/android_btn_normal.png";
	} else if (id == "iOS_player") {
		element.src = "promotion/ios_btn_normal.png";
	} else if (id == "iOS_cloud") {
		element.src = "promotion/ios_btn_normal.png";
	} else if (id == "mgrbtn") {
		element.style.background = "url(promotion/showpage_btn_normal.png)";
	} else {
		;
	}
}

function openlink(type) {
	if (type == "Android_player") {
		window.open("https://play.google.com/store/apps/details?id=vidon.me.phone&hl=en");
	} else if (type == "Android_cloud") {
		window.open("https://play.google.com/store/apps/details?id=vidon.me.vms&hl=en");
	} else if (type == "iOS_player") {
		window.open("https://itunes.apple.com/us/app/vidon-player/id679482348?mt=8");
	} else if (type == "iOS_cloud") {
		alert("%266".toLocaleString());		
	} else {
		;	
	}
}

function updatetext() {
	$('#promotiontext').html('');
	$('#promotionhdtext').html('');
	$('#promotionhdlink').html('');
	$('#promotionnote').html('');
	$('#mgrbtn').attr("value", '');

	$('#promotiontext').html("%261".toLocaleString());
	$('#promotionhdtext').html("%262".toLocaleString());
	$('#promotionhdlink').html("%263".toLocaleString());
	$('#promotionnote').html("%264".toLocaleString());
	$('#mgrbtn').attr("value", "%265".toLocaleString());
}

function postfinish() {
	vidonme.rpc.request({
		'context': this,
		'method': 'VidOnMe.GetSystemSetting',
		'params': {
			'key': "promotion.display"
		},
		'success': function(data) {
			if (data && data.result.ret == true) {
				if (data.result.val == "false") {
					$("#mgrbtnswitch").attr("checked", true);
					ShowMgrBtn();
				}
			}
		}
	});

	intervalId = setInterval("updatetext()", 50);
}

var intervalId;