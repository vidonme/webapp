var UserCenter = function() {
    this.init();
    return true;
};

UserCenter.prototype = {
    init: function() {
        this.bindControls();
    },
    bindControls: function() {
        $('#userCenter').click(jQuery.proxy(this.UserCenterOpen, this));
    },
    resetPage: function() {
        $('#userCenter').removeClass('selected');
        this.hideOverlay();
    },
    
    hideOverlay: function(event) {
        if (this.activeCover) {
            $(this.activeCover).remove();
            this.activeCover = null;
        }
        $('#overlay').hide();
    },
    
    UserCenterOpen: function() {
        $('#server_setting').html('');
        this.resetPage();
        $('#mediaManager').removeClass('selected');
        $('#serverSetting').removeClass('selected');
        $('#backupMedia').removeClass('selected');
        $('#appsDownload').removeClass('selected');
		$('#userCenter').addClass('selected');
        $('.contentContainer').hide();
		
        document.getElementById('folder_box').style.display = "";
        $('#title_tab').html('');
        $('#title_tab').append('<tr><td class="heading">' + "%279".toLocaleString() + '</td><td></td></tr>');
		
		doMainPage();
	}
}

function doMainPage() {
	var userCenter = $('<div class="usrctr" id="usrctr"></div>');
	$('#folder_box').html('');
	$('#folder_box').append(userCenter);

	vidonme.rpc.request({
        'context': this,
        'method': 'VidOnMe.GetAuthUserInfo',
        'params': {
		},
		'success': function(data) {
			if (data && data.result.ret) {
				userCenter.append('<div class="accinfo"><img class="accimg" id="accimg"><table class="btntab"><tr><td><input class="btn" type="button" value=\'' + "%103".toLocaleString() + '\' onclick="doLogout()"></td><td><input class="btn" type="button" value=\'' + "%104".toLocaleString() + '\' style="left:5px;" onclick="doLogout()"></td></tr></table></div><div class="accmain"><p class="head">' + "%283".toLocaleString() + '</p><table class="infotab"><tr><td class="itemlabel">' + "%280".toLocaleString() + '</td><td id="account"></td><td class="itemsubscription">' + "%284".toLocaleString() + '</td></tr><tr><td class="itemlabel">' + "%281".toLocaleString() + '</td><td id="email"></td></tr><tr id="expiration" style="display:none;"><td class="itemlabel">' + "%282".toLocaleString() +  '</td><td id="expiredate" class="iteminfo"></td></tr></table></div>');				
				doChangeData(data);
			} else {
				userCenter.append('<p class="welcome">' + "%285".toLocaleString() + '</p><table class="account"><tr><td class="tablabel">' + "%270".toLocaleString() + '</td><td><input class="tabinput" type="text" id="account_name"></td></tr><tr><td class="tablabel">' + "%271".toLocaleString() + '</td><td><input class="tabinput" type="password" id="account_pass"></td><td class="account forgetpass" onclick=window.open("http://www.vidonme.cn/uc/account/resetpw")>' + "%288".toLocaleString() + '</td></tr><tr><td><input class="btn" type="button" value=\'' + "%287".toLocaleString() + '\' onclick=window.open("http://www.vidonme.cn/uc/account/register") style="left:0px;"></a></td><td><input class="btn" type="button" value=\'' + "%286".toLocaleString() + '\' style="left:310px;" onclick="doLogin()"></td></tr></table>');
				$('#account_name').focus();	
			}
		}
	});
}

function doLogin() {
	var user_name = document.getElementById("account_name").value;
	var user_pass = document.getElementById("account_pass").value;
	
	if (user_name == '' || user_pass == '') {
		alert("%275".toLocaleString());	
	} else {
		var user = document.getElementById("account_name").value;
		var pass = $.md5(document.getElementById("account_pass").value);
		
		doAuthenticate(user, pass);
	}
}

function doAuthenticate(user, pass) {
	showdiv();
    vidonme.rpc.request({
        'context': this,
        'method': 'VidOnMe.LoginAuth',
        'params': {
            "username": user,
            "password": pass,
			"country":  "oversea"
        },
        'success': function(data) {
			hidediv();
			if (data && data.result.ret) {
				$('#usrctr').html('');
				var user_info = document.getElementById("usrctr");
				user_info.innerHTML = '<div class="accinfo"><img class="accimg" id="accimg"><table class="btntab"><tr><td><input class="btn" type="button" value=\'' + "%103".toLocaleString() + '\' onclick="doLogout()"></td><td><input class="btn" type="button" value=\'' + "%104".toLocaleString() + '\' style="left:5px;" onclick="doLogout()"></td></tr></table></div><div class="accmain"><p class="head">' + "%283".toLocaleString() + '</p><table class="infotab"><tr><td class="itemlabel">' + "%280".toLocaleString() + '</td><td id="account"></td><td class="itemsubscription">' + "%284".toLocaleString() + '</td></tr><tr><td class="itemlabel">' + "%281".toLocaleString() + '</td><td id="email"></td></tr><tr id="expiration" style="display:none;"><td class="itemlabel">' + "%282".toLocaleString() +  '</td><td id="expiredate" class="iteminfo"></td></tr></table></div>';
				doChangeData(data);
			}
        }
    });
}

function doChangeData(data) {
	$('#account').html(data.result.username);
	$('#email').html(data.result.email);
	
	if (data.result.avatar == '') {
		$('#accimg').attr("src", "img/acc_default_img.png");
		$('#user_img').attr("src", "img/acc_default_img_small.png");
	} else {
		$('#accimg').attr("src", data.result.avatar);
		$('#user_img').attr("src", data.result.avatar);
	}
	
	if (data.result.subscribed) {
		$('#expiredate').ihtml = data.result.expiredate;
	}
}

function doLogout() {
	vidonme.rpc.request({
        'context': this,
        'method': 'VidOnMe.LogoutAuth',
        'params': {
		},
		'success': function(data) {
			if (data && data.result.ret) {
				$('#user_img').attr("src", "img/user_head_normal.png");
				doMainPage();
			}
		}
	});
}
