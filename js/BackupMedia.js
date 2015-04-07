var BackupMedia = function() {
    this.init();
    return true;
};

var deviceuuids = new Array();
var gstart = 0, gend = 10, gtotal = 0, items_per_page = 10;

BackupMedia.prototype = {
    init: function() {
        this.bindControls();
    },
    bindControls: function() {
        $('#backupMedia').click(jQuery.proxy(this.BackupMediaOpen, this));
    },
    resetPage: function() {
        $('#backupMedia').removeClass('selected');
        this.hideOverlay();
    },
    
    hideOverlay: function(event) {
        if (this.activeCover) {
            $(this.activeCover).remove();
            this.activeCover = null;
        }
        $('#overlay').hide();
    },
    
    BackupMediaOpen: function() {
        $('#server_setting').html('');
        this.resetPage();
        $('#mediaManager').removeClass('selected');
        $('#serverSetting').removeClass('selected');
        $('#appsDownload').removeClass('selected');
		$('#backupMedia').addClass('selected');
		$('#userCenter').removeClass('selected');
        $('.contentContainer').hide();
		
        var backupPicContainer = $('<div id="backupPic"></div>');
		$('#title_tab').html('');
        $('#title_tab').append('<tr><td class="heading">' + "%252".toLocaleString() + '</td><td><input class="refresh" align="center" type="image" src="img/refresh.png", onclick="UpdatePhotoLibraryV2()"></td></tr>')
        $('#folder_box').html('');
        $('#folder_box').append(backupPicContainer);

        backupPicContainer.append('<table align="center" id="tabHeader" style="table-layout:fixed; word-break:break-all"></table>');
        backupPicContainer.append('<table align="center" id="tabPic" style="table-layout:fixed; word-break:break-all"></table>');
        backupPicContainer.append('<p class="backuppadding" style="margin: 20px"></p>');
        backupPicContainer.append('<table align="center" id="tabIdx" style="table-layout:fixed; word-break:break-all"></table>');
		
        getDeviceUUID();
		setTimeout(getBackupDetails, 500);
	}

}

function getDeviceUUID() {
    deviceuuids.length = 0;
    var s = vidonme.rpc.request({
        'context': this,
        'method': 'PictureLibrary.GetPictureBackupDevicesV2',
        'params': {},
        'success': function(data) {
            var index = 0;
            $.each($(data.result.results), jQuery.proxy(function(i, item) {
                if (item.deviceuuid != "others") {
                    deviceuuids[index] = item.deviceuuid;
                    index++;
                }
            }, this));
	    }
    });	
}

function getBackupDetails() {
    if (deviceuuids.length == 0) {
        $('#tabHeader').html('');
        $('#tabPic').html('');
        $('#backuppadding').html('');
        $('#tabIdx').html('');

        $('#backupPic').append('<table align="center"><tr><td><a href="http://www.vidon.me/vidon_server.htm"><img src="img/vidon_cloud.png" align="middle" style="cursor:pointer"></a></td></tr></table><div><table align="center" class="backuptext"><tr><td>VidOn Cloud</td></tr><tr><td>' + "%257".toLocaleString() + '</td></tr><tr><td>' + "%258".toLocaleString() + '</td></tr></table></div>');
       
        return;
    }

    vidonme.rpc.request({
        'context': this,
        'method': 'PictureLibrary.GetBackupDetailsV2',
        'params': {
            'limits': {
                'start': gstart,
                'end': gend
            },
            'deviceUUID': deviceuuids
		},
        'success': function(data) {
            var devicename = new Array();
            var backuppath = new Array();
            var uploadtime = new Array();
            var backuptotal = new Array();
            $.each($(data.result.limits), jQuery.proxy(function(i, item) {
                    gstart = item.start;
                    gend   = item.end;
                    gtotal = item.total;
            }, this));
			
            $.each($(data.result.backupdetails), jQuery.proxy(function(i, item) {
                    devicename[i] = item.devicename;
                    backuppath[i] = item.path;
                    uploadtime[i] = item.uploadtime;
                    backuptotal[i] = item.total;

            }, this));
			
			if (gtotal > 0) {
                $('#tabHeader').append('<tr class="backupheader"><td class="backupheader tddevicename">' + "%253".toLocaleString() + '</td><td class="backupheader tdbackuppath">' + "%254".toLocaleString() + '</td><td class="backupheader tduploadtime">' +  "%255".toLocaleString() + '</td><td class="backupheader tdbackupnum">' + "%256".toLocaleString() + '</td></tr>');
			
                for (var i = 0; i < gend - gstart; ++i) {
                    $('#tabPic').append('<tr class="backupmedia"><td class="backupmedia tddevicename">' + devicename[i] + '</td><td class="backupmedia tdbackuppath">' + backuppath[i] + '</td><td class="backupmedia tduploadtime">' + uploadtime[i] + '</td><td class="backupmedia tdbackupnum">' + backuptotal[i] + '</td></tr>')
                }
			
                var pages = Math.ceil(gtotal / items_per_page);
                for (var i = 0; i < pages; ++i) {
				    var index = i + 1;
                    var start = i * 10;
                    var end = i * 10 + 10;
                    $('#tabIdx').append('<input class="backupbutton" onClick="getBackupPage(' + start + ',' + end + ')" type="button" value="' + index + '" />');
                }
            } else {
                $('#tabHeader').html('');
                $('#tabPic').html('');
                $('#backuppadding').html('');
                $('#tabIdx').html('');
				
                var url = '';
                if (glocale == "zh-cn") {
                    url = "http://cn.vidon.me/vidon_cloud.htm";
                } else {
                    url = "http://www.vidon.me/vidon_cloud.htm";
                }

                $('#backupPic').append('<table align="center"><tr><td><a href=' + url + '><img src="img/vidon_cloud.png" align="middle" style="cursor:pointer"></a></td></tr></table><div><table align="center" class="backuptext"><tr><td>Vidon Cloud</td></tr><tr><td>' + "%257".toLocaleString() + '</td></tr><tr><td>' + "%258".toLocaleString() + '</td></tr></table></div>');
            }
        }
    });
}

function getBackupPage(start, end) {
    gstart = start;
    gend   = end;
	
    $('#tabHeader').html('');
    $('#tabPic').html('');
    $('#backuppadding').html('');
    $('#tabIdx').html('');
	
    getBackupDetails();
}

function UpdatePhotoLibraryV2() {
    var s = vidonme.rpc.request({
        'context': this,
        'method': 'PictureLibrary.UpdatePhotoLibraryV2',
        'params': {},
        'success': function(data) {
            alert("Refresh OK");

            gstart = 0;
            gend   = 10;
            $('#tabHeader').html('');
            $('#tabPic').html('');
            $('#backuppadding').html('');
            $('#tabIdx').html('');
            $('#backupPic').html('');
			
            $('#backupPic').append('<table align="center" id="tabHeader" style="table-layout:fixed; word-break:break-all"></table>');
            $('#backupPic').append('<table align="center" id="tabPic" style="table-layout:fixed; word-break:break-all"></table>');
            $('#backupPic').append('<p class="backuppadding" style="margin: 20px"></p>');
            $('#backupPic').append('<table align="center" id="tabIdx" style="table-layout:fixed; word-break:break-all"></table>');
	
            getDeviceUUID();
            setTimeout(getBackupDetails, 500);
	    }
    });	
}
