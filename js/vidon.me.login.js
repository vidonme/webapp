$(function() {
	$("#selectNationality").click(function(){
		$(this).toggleClass("selected");
	})
	
	$("#header .login").click(function(){
				showdiv(".poplogin",1);
				
	})
	
	$(".checkbox").click(function(){
		$(this).toggleClass("selected");
	})
	
	$("#loginbtn").click(function () {
		$("#loginerr").text("");
		var cn = $("#selectNationality").hasClass("selected");
		var username = $("#user").val();
		var userpass = $.md5($("#password").val());
		var userpass2=$("#password").val();
		
		if(username=="" && userpass2==""){
			$("#loginerr").text($.i18n.prop('index_175'));
			}
		else if(username!=""&& userpass2==""){
			$("#loginerr").text($.i18n.prop('index_174'));
			}
		else if(username==""&& userpass!=""){
			$("#loginerr").text($.i18n.prop('index_173'));
			}
		else{
		showdiv('.loading', 3);
		vidonme.rpc.request({
			'context': this,
			'method': 'VidOnMe.LoginAuth',
			'params': {
				"username": username,
				"password": userpass,
				"country":  cn == true ? "cn" : "oversea"
			},
			
			'success': function(data) {
			close_box(".loading", 3);
				
				if (data.result.ret) {
					//$("#login_title").text($.i18n.prop('index_50'));
					$("#login").hide();
					$("#login_ok").show();
				}
				else{
					$("#loginerr").text($.i18n.prop('index_176'));
					}
			}
		});
		}
		
		
	})
	$("#logoutbtn").click(function(){
		LogoutAuthUser();
		})
})

function CheckAuthUserInfo() {
	vidonme.rpc.request({
		'context': this,
		'method': 'VidOnMe.GetAuthUserInfo',
		'params': {
		},
		'success': function(data) {
			showdiv(".poplogin",1);
			
			if (data && data.result.ret) {
				//$("#login_title").text("User Information");
				$("#login").hide();
				$("#login_ok").show();
				
				$("#accout_img").attr("src", data.result.avatar);
				$("#email").text(data.result.email);
	
				if (data.result.subscribed) {
					$("#expiration").html = data.result.expiredate;
					$("#accout").html(data.result.username + '<div class="btn-small btn-blue">Subscribed</div>');	
				} else {
					$("#accout").text(data.result.username);
				}
			} else {
				//$("#login_title").text($.i18n.prop('index_50'));
				$("#login").show();
				$("#login_ok").hide();
			}
		}
	});
}

function LogoutAuthUser() {
	vidonme.rpc.request({
        'context': this,
        'method': 'VidOnMe.LogoutAuth',
        'params': {
		},
		'success': function(data) {
			if (data && data.result.ret) {
				$("#login_ok").hide();
				//$("#login_title").text("User Login");
				$("#login").show();
			}
		}
	});
}