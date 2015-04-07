var AppsDownload = function(String_str, browserinfo) {
	this.locale = String_str.locale;
	this.browser = browserinfo;
    this.init();
    return true;
};

AppsDownload.prototype = {
    init: function() {
        this.bindControls();
    },
    bindControls: function() {
        $('#appsDownload').click(jQuery.proxy(this.AppsDownloadOpen, this));
    },
    resetPage: function() {
        $('#appsDownload').removeClass('selected');
        this.hideOverlay();
    },
    
    hideOverlay: function(event) {
        if (this.activeCover) {
            $(this.activeCover).remove();
            this.activeCover = null;
        }
        $('#overlay').hide();
    },
    
    AppsDownloadOpen: function() {
        $('#server_setting').html('');
        this.resetPage();
        $('#mediaManager').removeClass('selected');
        $('#serverSetting').removeClass('selected');
        $('#backupMedia').removeClass('selected');
        $('#appsDownload').addClass('selected');
		$('#userCenter').removeClass('selected');
        $('.contentContainer').hide();
        
        var downloadContainer = '';
        document.getElementById('folder_box').style.display = "";
        downloadContainer = $('<div></div>');
        $('#title_tab').html('');
        $('#title_tab').append('<tr><td class="heading">' + "%247".toLocaleString() + '</td><td></td></tr>');
		
        $('#folder_box').html('');
        $('#folder_box').append(downloadContainer);
        downloadContainer.append(downloadnote);
		var calssname = "";
		if (this.locale == "es" || this.locale == "fr")
			classname = "pdownload3";
		else
			classname = "pdownload2";
		
		var downloadbtnclass = "";
		if (this.browser.match("msie 8.0"))
			downloadbtnclass = "btndownload2";
		else
			downloadbtnclass = "btndownload";
        downloadContainer.append('<div class="download"><div class="downloadpicture_cloud" id="picturecontainer_cloud"></div><div class="downloaditems"><p class="pdownload1">' + "%259".toLocaleString() + '</p><p class=' + classname + '>' + "%260".toLocaleString() + '</p><img id="type_cloud" src="img/Cloud_2dimcode.png" style="display:block"><input id="btn_cloud" type="button" value="Android Phone" class=' + downloadbtnclass + ' onclick="openApplink(5)"/></div><div class="downloadpicture_player" id="picturecontainer_player"></div><div class="downloaditems"><p class="pdownload1">' + "%246".toLocaleString() + '</p><p class=' + classname + '>' + "%248".toLocaleString() + '</p><img id="phonetype" class="twodimcodeleft" src="img/Player-AndroidPhone.png"><img id="padtype" class="twodimcoderight" src="img/Player-AndroidPad.png"><input id="phonebtn" type="button" value="Android Phone" class=' + downloadbtnclass + ' style="float:left" onclick="openApplink(1)"/><input id="padbtn" type="button" value="Android Pad" class=' + downloadbtnclass + ' style="float:right" onclick="openApplink(2)"/></div></div>');
        document.getElementById('AndroidNote').style.background = 'url(img/tab_select.png)';
	}

}

function openApplink(linknum) {
    switch(linknum) {
        case 1:
            window.open('http://vidon.me/download/VidOn.me_Player.apk');
            break;
        case 2:
            window.open('http://vidon.me/download/VidOn.me_Player_HD.apk');
            break;
        case 3:
            window.open('https://itunes.apple.com/app/vidon.me/id679482348?mt=8');
            break;
        case 4:
            window.open('https://itunes.apple.com/app/vidon.me-player/id581454033?mt=8');
            break;
        case 5:
            window.open('http://www.vidon.me/download/tmp/VidOn_Cloud.apk');
            break;
        case 6:
            window.open('http://www.vidon.me/vidon_server.htm');
	}
}

function PlayerforAndroid() {
    document.getElementById('picturecontainer_player').style.background = 'url(img/Androidlogo.png)';
    document.getElementById('picturecontainer_cloud').style.background = 'url(img/Cloud_Android.png)';
    document.getElementById('iOSNote').style.background = 'url(img/tab_normal.png)';
    document.getElementById('AndroidNote').style.background = 'url(img/tab_select.png)';
    document.getElementById('type_cloud').style.display = "block";
    document.getElementById('type_cloud').src = 'img/Cloud_2dimcode.png';
	document.getElementById('phonetype').src = 'img/Player-AndroidPhone.png';
    document.getElementById('padtype').src = 'img/Player-AndroidPad.png';
    document.getElementById('btn_cloud').value = 'Android';
    document.getElementById('phonebtn').value = 'Android Phone';
    document.getElementById('padbtn').value = 'Android Pad';
    document.getElementById('phonebtn').onclick = function () { openApplink(1); };
    document.getElementById('padbtn').onclick = function () { openApplink(2); };
    document.getElementById('btn_cloud').onclick = function () { openApplink(5); };
}

function PlayerforiOS() {
    document.getElementById('picturecontainer_player').style.background = 'url(img/iOSlogo.png)';
    document.getElementById('picturecontainer_cloud').style.background = 'url(img/Cloud_iOS.png)';
    document.getElementById('AndroidNote').style.background = 'url(img/tab_normal.png)';
    document.getElementById('iOSNote').style.background = 'url(img/tab_select.png)';
    document.getElementById('type_cloud').style.display = "none";
    document.getElementById('phonetype').src = 'img/Player-iPhone.png';
    document.getElementById('padtype').src = 'img/Player-iPad.png';
    document.getElementById('btn_cloud').value = 'iOS';
    document.getElementById('phonebtn').value = 'iPhone';
    document.getElementById('padbtn').value = 'iPad';
    document.getElementById('phonebtn').onclick = function () { openApplink(3); };
    document.getElementById('padbtn').onclick = function () { openApplink(4); };
    document.getElementById('btn_cloud').onclick = function () { openApplink(6); };
}

//var downloadnote = '<table class="appsdownload"><tr><td><a id="AndroidNote" href="#" onclick="PlayerforAndroid()">Android</a></td><td><a id="iOSNote" href="#" onclick="PlayerforiOS()">iOS</a></td></tr></table>';
var downloadnote = '<table class="appsdownload"><tr><td><input id="AndroidNote" type="button" value="Android" onclick="PlayerforAndroid()" class="input"/></td><td><input id="iOSNote" type="button" value="iOS" onclick="PlayerforiOS()" class="input"/></td></tr></table>'