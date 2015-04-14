function isurl(path)
{
    return path.indexOf("://") > 0;
}

function removeslashAtEnd(path) {
    var protocol = "";
    var index = path.indexOf("://");

    if (index > 0) {
        protocol = path.substr(0, index + 3);
        path = path.substr(protocol.length, path.length - protocol.length);
    }

    if (path[path.length - 1] == '/' || path[path.length - 1] == '\\') {
        path = path.substr(0, path.length - 1);
    }

    if (index > 0) {
        path = protocol + path;
    }

    return path;
}

function getParentPath(path) {
    if (path == "") {
        return path;
    }
    var protocol = "";
    var index = path.indexOf("://");

    if (index > 0) {
        protocol = path.substr(0, index + 3);
        path = path.substr(protocol.length, path.length - protocol.length);
    }

    var path_without_slash_atend = removeslashAtEnd(path);

    var has_slash = path_without_slash_atend.lastIndexOf("/");

    var parent = "";
    if (has_slash > 0) {
        parent = protocol + path_without_slash_atend.substr(0, has_slash);
    } else {
        if (index > 0 && path_without_slash_atend != "") {
            parent = protocol; // e.g, smb:// or nfs://
        }
    }

    return parent;
}

var MediaLibrary = function() {
    this.init();
    gbrowser = getBrowserInfo();
    return true;
};

MediaLibrary.prototype = {
    init: function() {
        this.bindControls();
        MediaLibrary.prototype.mediaManagerOpen();
    },
    bindControls: function() {
        $('#mediaManager').click(jQuery.proxy(this.mediaManagerOpen, this));
        $(window).resize(jQuery.proxy(this.MediaManagerResize, this));
    },
    resetPage: function() {
        $('#mediaManager').removeClass('selected');
        this.hideOverlay();
    },
    replaceAll: function(haystack, needle, thread) {
        return (haystack || '').split(needle || '').join(thread || '');
    },
    
    getThumbnailPath: function(thumbnail) {
        return thumbnail ? ('/image/' + encodeURI(thumbnail)) : vidonme.core.DEFAULT_ALBUM_COVER;
    },
    
    hideOverlay: function(event) {
        if (this.activeCover) {
            $(this.activeCover).remove();
            this.activeCover = null;
        }
        $('#overlay').hide();
    },
    
    updateScrollEffects: function(event) {
        if (event.data.activeLibrary && $(event.data.activeLibrary).scrollTop() > 0) {
            $('#topScrollFade').fadeIn();
        } else {
            $('#topScrollFade').fadeOut();
        }
    },
    startSlideshow: function(event) {
        vidonme.rpc.request({
            'method': 'Player.Open',
            'params': {
                'item': {
                    'recursive': 'true',
                    'random': 'true',
                    'path': this.replaceAll(event.data.directory.file, "\\", "\\\\")
                }
            },
            'success': function() {
            }
        });
    },

    //显示电影、图片、TVShow
    generateThumb: function(type, thumbnail, title, artist) {
        //thumbnail=thumbnail.replace("\","");
        //Thumbnail=thumbnail.replace(/\\/g,'\\\\');
        var floatableAlbum = $('<div></div>');
        var path = this.getThumbnailPath(thumbnail);
        title = title || '';
        
        artist = artist || '';
        if (title.length > 18 && !(title.length <= 21)) {
            title = title.substring(0, 18) + '...';
        }
        if (artist.length > 20 && !(artist.length <= 22)) {
            artist = artist.substring(0, 20) + '...';
        }
        var className = '';
        var code = '';
        var imgPath = '';
        switch (type) {
            case 'album':
                className = 'floatableAlbum';
                code = '<p class="album" title="' + title + '">' + title + '</p><p class="artist" title="' + artist + '">' + artist + '</p>';
                break;
            case 'video':
                className = 'floatableAlbum';
                imgPath = "img/folder_video_icon.png"
                code = '<p class="album" title="' + title + '">' + title + '</p>';
                break;
            case 'movie':
                className = 'floatableAlbum';
                imgPath = "img/folder_movie_icon.png"
                code = '<p class="album" title="' + title + '">' + title + '</p>';
                break;
            case 'tvshow':
                className = 'floatableAlbum';
                imgPath = "img/folder_tvshow_icon.png"
                break;
            case 'tvshowseason':
                className = 'floatableTVShowCoverSeason';
                break;
            case 'photo':
                className = 'floatableAlbum';
                imgPath = "img/folder_photo_icon.png"
                code = '<p class="album" title="' + title + '">' + title + '</p>';
                break;
            case 'directory':
                className = 'floatableAlbum';
                code = '<p class="album" title="' + title + '">' + title + '</p>';
                break;
            case 'auto':
                className = 'floatableAlbum';
                imgPath = "img/folder_auto_icon.png"
                code = '<p class="album" title="' + title + '">' + title + '</p>';
                break;
        }

        var mouse = '<img class="img" src=' + imgPath + ' /><p class="Album_name">' + title + '</p><ul class="Album_menu clearfix"><li><a href="#" onClick="btn_refresh(\'' + escape(thumbnail) + '\')">' + "%105".toLocaleString() + '</a></li> <li><a href="#" onClick=btn_add(\'' + escape(title) + '\',\'' + type + '\',\'' + escape(thumbnail) + '\',' + true + ',\'' + "" + '\')>' + "%106".toLocaleString() + '</a></li><li><a href="#" onClick="btn_delete(\'' + escape(title) + '\',\'' + type + '\',\'' + false + '\',\'' + escape(thumbnail) + '\')">' + "%107".toLocaleString() + '</a></li></ul></a></li></ul>';

        return floatableAlbum.addClass(className).html(mouse).hover(function() {
            $(this).addClass("hover");
            $(this).children(".Album_menu").show();
        }, function() {
            $(this).removeClass("hover");
            $(this).children(".Album_menu").hide();
        });
    },
    MediaLibrarytitleSet: function() {
        $('#title_tab').html('');
        $('#title_tab').append('<tr><td class="heading">' + "%101".toLocaleString() + '</td><td></td></tr>');
    },
    MediaLibraryMaintitleSet: function() {
        var str = "%101".toLocaleString();
        var len = str.length;
        if (len > 30)
        {
            document.getElementById('mediaManager').style.lineHeight = "35px";
        }
        $('#mediaManager').html(str);
    },
    ServerSettingMaintitleSet: function() {
        var str = "%102".toLocaleString();
        var len = str.length;
        if (len > 30)
        {
            document.getElementById('serverSetting').style.lineHeight = "35px";
		}
        $('#serverSetting').html("%102".toLocaleString());
    },
    AppsDownloadMaintitleSet: function() {
        var str = "%247".toLocaleString();
        var len = str.length;
        if (len > 30)
        {
            document.getElementById('appsDownload').style.lineHeight = "35px";
		}
        $('#appsDownload').html("%247".toLocaleString());
    },
    BackupMediaMaintitleSet: function() {
        var str = "%252".toLocaleString();
        var len = str.length;
        if (len > 30)
        {
            document.getElementById('backupMedia').style.lineHeight = "35px";
        }
        $('#backupMedia').html(str);
    },
    UserCenterImageSet: function() {
		vidonme.rpc.request({
			'context': this,
			'method': 'VidOnMe.GetAuthUserInfo',
			'params': {
			},
			'success': function(data) {
				if (data && data.result.ret) {
					var imageHTML = '<img id="user_img" src="' + data.result.avatar + '">';
					$('#userCenter').html(imageHTML);
				} else {
					$('#userCenter').html('<img id="user_img" src="img/user_head_normal.png">');
				}
			}
		});
    },
	MediaLibraryAddtagSet: function() {
        $('#addtag').html("%132".toLocaleString());
    },
    mediaManagerOpen: function() {
        $('#server_setting').html('');
        this.resetPage();
        $('#serverSetting').removeClass('selected');
        $('#appsDownload').removeClass('selected');
        $('#backupMedia').removeClass('selected');
        $('#mediaManager').addClass('selected');
		$('#userCenter').removeClass('selected');
        $('.contentContainer').hide();
        var libraryContainer = '';
        var video_data = '';
        setTimeout(this.MediaLibrarytitleSet, 100);
        setTimeout(this.MediaLibraryMaintitleSet, 100);
        setTimeout(this.ServerSettingMaintitleSet, 100);
        setTimeout(this.AppsDownloadMaintitleSet, 100);
        setTimeout(this.BackupMediaMaintitleSet, 100);
		setTimeout(this.UserCenterImageSet, 100);
        document.getElementById('folder_box').style.display = "";
        vidonme.rpc.request({
            'context': this,
            'method': 'VidOnMe.GetShares',
            'params': [],
            'success': function(videoData) {
                video_data = videoData;
                vidonme.rpc.request({
                    'context': this,
                    'method': 'VidOnMe.GetShares',
                    'params': [],
                    'success': function(pic_data) {
                        //设置标题
                       
                        $('#mediaManager').html("%101".toLocaleString());
                        $('#serverSetting').html("%102".toLocaleString());

                        //$('#folder_box').append('<li><a href="#" class="folder_hover"><img src="img/folder_img_icon.png" /><p align="center">Picture 1</p>');
                        libraryContainer = $('<div></div>');
                        $('#folder_box').html('');
                        $('#folder_box').append(libraryContainer);
                        if (pic_data && pic_data.result && pic_data.result.shares) {
                            $.each($(pic_data.result.shares), jQuery.proxy(function(i, item) {
                                var floatableMovieCover = this.generateThumb(item.type, item.path, item.name);
                                //floatableMovieCover.bind('click', { movie: item }, jQuery.proxy(this.displayMovieDetails, this));
                                libraryContainer.append(floatableMovieCover);
                            }, 
                            this));
                        } else {
                            libraryContainer.html('');
                        }
                        
                        libraryContainer.append('<div class="floatableAlbum"> <a href="#" onClick=btn_add("","","",false,"")><img class="img" src="img/add_btn.png" /><p  class="Album_name" id="addtag">' + "%132".toLocaleString() + '</p></a></div>');
                    
                    }
                
                });
            }
        });

        setTimeout(this.MediaLibraryAddtagSet, 100);
    },
	MediaManagerResize: function () {
		$(".ui-dialog").css("top", ($(window).height() - $(".ui-dialog").height()) / 2 + "px");
		$(".ui-dialog").css("left", ($(window).width() - $(".ui-dialog").width()) / 2 + "px");
	}
}

function btn_delete(title, type, isOpen, path) {
    var truthBeTold = window.confirm("%108".toLocaleString());
    path = unescape(path);
    if (truthBeTold) {
        if (isOpen) {
            $("#dialog-form").dialog("close");
        }
        vidonme.rpc.request({
            'context': this,
            'method': 'VidOnMe.DeleteShare',
            'params': {
                "type": type,
                "name": title,
                "path": path
            },
            'success': function(data) {
                MediaLibrary.prototype.mediaManagerOpen();
            }
        });
    }
}

function btn_refresh(thumbnail) {
    thumbnail = unescape(thumbnail);
    vidonme.rpc.request({
        'context': this,
        'method': 'VidOnMe.StartScan',
        'params': {
            "directory": thumbnail,
            "scanAll": true
        },
        'success': function(data) {
            alert("%109".toLocaleString());
        }
    });

}

function btn_save(shareType, sharePath, edit, origpath) {
    dialogClose();
    var dialogTitle = '';
	
    gsharePath = sharePath;
    switch (shareType) {
        case 'movie':
            dialogTitle = "%161".toLocaleString();
        break;
        case 'tvshow':
            dialogTitle = "%162".toLocaleString();
        break;
        case 'video':
            dialogTitle = "%230".toLocaleString();
        break;
        case 'photo':
            dialogTitle = "%164".toLocaleString();
        break;
        default:
            dialogTitle = "%229".toLocaleString();
    }
	
    var add = $("#dialog-form");
    add.html('');
    add.dialog({
        //	autoOpen: true,
        title: dialogTitle,
        height: 440,
        width: 690,
        //draggable: false,
        resizable: false,
        position: 'center',
        modal: true
    });

    sharePath = unescape(sharePath);
    sharePath = removeslashAtEnd(sharePath);

    if (sharePath == "")
    {
        alert("Path empty!");
        dialogClose();
        return false;
    }

    var paths = '';
    if (sharePath.match("/")) {
        paths = sharePath.split("/");
    } else {
        paths = sharePath.split("\\");
    }

    var name = '';

    if (paths.length == 0) {
        name = "/";
    } else {
        name = handleUrl(sharePath, false, true);
        paths = name.split("/");
        name = paths[paths.length - 1].toString();
    }
			
    var img_src = '';
    if (shareType == "video") {
        img_src = "img/video_01.png";
    } else if (shareType == "movie") {
        img_src = "img/movie_01.png";
    } else if (shareType == "tvshow") {
        img_src = "img/tvshow_01.png";
    } else if (shareType == "photo") {
        img_src = "img/photo_01.png";
    } else {
        img_src = "img/auto_01.png";
    }
	
    add.append('<div class="save"></div>');
	
    $(".save").append('<img style="padding-top:23px" class="img" src="' + img_src + '"/><p align="left" style="padding-left:26px">' + "%244".toLocaleString() +'</p><input class="form_menu" id="srcName" type="text" value="' + name + '"/><p align="left" style="padding-left:26px">' + "%245".toLocaleString() + '</p><table class="btnpre"><tr><td OnClick="btn_browse(\'' + shareType + '\',\'' + escape(sharePath) +'\',' + edit + ',\'' + escape(origpath) + '\')" background="img/button_previous_normal.png">' + "%237".toLocaleString() + '</td></tr></table><table class="btnnex"><tr><td OnClick="addMedia(\'' + escape(name) + '\',\'' + shareType + '\',\'' + escape(sharePath) +'\',' + edit + ')" background="img/button_next_save_normal.png">' + "%135".toLocaleString() + '</td></tr></table>');

    return true;
}

function _mouseover(obj) {
    obj.style.backgroundColor = "#025567";
}

function _mouseover2(obj) {
    obj.style.backgroundColor = "#0377e3";
}

function _mouseout(obj) {
    obj.style.backgroundColor = '';
}

function checkip(ip) {
	var regexp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
	if (ip.match(regexp)) {
		return true;
	}

	return false;
}

function setnetshare() {
	var protocol = '';
	var domain_select = document.getElementById("protocolvalue");
	for (var i = 0; i < domain_select.length; ++i) {
		if (domain_select.options[i].selected == true) {
			protocol = domain_select.options[i].value;
			break;
		}
	}
	
	var netshare_search = '', display = '';
	var srvaddr = document.getElementById("server_address").value;
	var username = document.getElementById("user_name").value;
	var userpass = document.getElementById("user_pass").value;
	
	if (protocol == "SMB") {
		var srvdomain = document.getElementById("domain").value;
		
		if (checkip(srvaddr) == false && srvaddr == "" || srvdomain == "") {
			$("#server_error").attr({style:"color:red"});
			$("#server_error").html("%274".toLocaleString());
			$("#identification_error").attr({style:"color:red"});
			$("#identification_error").html('');
			return;
		}
		
		if (username == "" && userpass == "")
		{
			netshare_search = 'smb://' + srvaddr;
		}
		else
		{
			if (username == "" || userpass == "") {
				$("#identification_error").attr({style:"color:red"});
				$("#identification_error").html("%275".toLocaleString());
				$("#server_error").attr({style:"color:red"});
				$("#server_error").html('');
				return;	
			}
			else
			{
				netshare_search = 'smb://' + srvdomain + ';' + username + ':' + userpass + '@' + srvaddr;
			}
		}
		
		display = 'smb://' + srvaddr;
	} else {
		display = 'nfs://' + srvaddr;
		netshare_search = display;
	}
	
	showdiv();
	
	vidonme.rpc.request({
		'context': this,
		'method': 'VidOnMe.AddNetDirectory',
		'params': {
			"directory": netshare_search
		},
		'success': function(data) {
			hidediv();
			if (data && data.result.ret == true) {
				btn_browse(gtype, escape(netshare_search), gedit, escape(netshare_search));
			} else {
				alert(data.result.err);
			}
		}
	});
}

function handle_inputs() {
	var protocol = '';
	var domain_select = document.getElementById("protocolvalue");
	for (var i = 0; i < domain_select.length; ++i) {
		if (domain_select.options[i].selected == true) {
			protocol = domain_select.options[i].value;
			break;
		}
	}
	
	var domain = document.getElementById("domain");
	var user_name = document.getElementById("user_name");
	var user_pass = document.getElementById("user_pass");
	
	if (protocol == "NFS") {
		domain.disabled = true;
		user_name.disabled = true;
		user_pass.disabled = true;
	} else if (protocol == "SMB") {
		domain.disabled = false;
		user_name.disabled = false;
		user_pass.disabled = false;	
	}
	
	$("#server_address").focus();
}

function btn_addnetshare(host, edit) {
	dialogClose();

	var dialogTitle = "%267".toLocaleString();
	var netshare = $("#dialog-form");
	netshare.html('');
	
	netshare.dialog({
		//autoOpen: true,
		title: dialogTitle,
		height: 430,
		width: 480,
		//draggable: false,
		resizable: false,
		position: 'center',
		modal: true
	});
	
	netshare.append('<div class="netshare" id="addsamba"><table class="netsharetable"><tr><td class="td1">Protocol</td><td class="td2" id="protocol"><select class="protoselect" id="protocolvalue" onchange="handle_inputs()"><option value="SMB">Windows Network (SMB)<option value="NFS">Network Filesystem (NFS)</td></tr></select></table></div>');
	$(".smaba").resize(function() {
		$(".netshare").css("top", ($(window).height() - $(".netshare").height()) / 2 + "px");
		$(".netshare").css("left", ($(window).width() - $(".netshare").width()) / 2 + "px");
	});
	
	$(".netshare").append('<table class="netsharetable"><tr><td class="td1">' + "%272".toLocaleString() + '</td><td class="td2" id="server_error"></td></tr><tr><td class="td1">' + "%268".toLocaleString() + '</td><td class="td2"><input class="netshareinput" id="server_address" type="text" value=' + host + '></td></tr><tr><td class="td1">' + "%269".toLocaleString() + '</td><td class="td2"><input class="netshareinput" id="domain" type="text" value="WORKGROUP"></td></tr></table>');
	
	$(".netshare").append('<table class="netsharetable"><tr><td class="td1">' + "%273".toLocaleString() + '</td><td class="td2" id="identification_error"></td></tr><tr><td class="td1">' + "%270".toLocaleString() + '</td><td class="td2"><input class="netshareinput" id="user_name" type="text"></td></tr><tr><td class="td1">' + "%271".toLocaleString() + '</td><td td="td2"><input class="netshareinput" id="user_pass" type="password"></td></tr></table>');
	
	$(".netshare").append('<table class="netsharecancel"><tr><td OnClick="dialogClose()" background="img/button_previous_normal.png">' + "%114".toLocaleString() + '</td></tr></table><table class="netshareconfirm"><tr><td OnClick="setnetshare()" background="img/button_next_save_normal.png">' + "%115".toLocaleString() + '</td></tr></table>');
	
	if (true == edit) {
		$("#user_name").focus();
	} else {
		$("#server_address").focus();
	}
}

function handleUrl(url, withproto, withshare) {
    var proto = '', name = '', localpathnoproto = '', pos = 0, posslash = 0;

    var index = url.indexOf("://");
    if (index > 0) {
        if (url.substr(0, index + 3) == "smb://") {
            proto = "smb://";

            localpathnoproto = url.substr(proto.length);
            var varpos = localpathnoproto.indexOf("@");
            if (varpos == -1) {
                varpos = localpathnoproto.indexOf(";");
            }

			pos = (varpos <= -1 ? 0 : varpos + 1);
        } else if (url.substr(0, index + 3) == "nfs://") {
			proto = "nfs://";

			pos = 0; // nfs is simpler than smb
			localpathnoproto = url.substr(proto.length);
        } else {
			return url;
		}

        posslash = localpathnoproto.indexOf("/", pos);

		if (posslash <= -1 || withshare) {
			name = localpathnoproto.substr(pos);
		} else {
			name = localpathnoproto.substr(pos, posslash - pos);
		}
    } else {
        name = url;
    }

    return withproto ? proto + name : name;
}

function btn_browse(type, path, edit, origpath) {
	dialogClose();
	var bsrname = gbrowser + "";
	var dialogTitle = '';
	type = gtype;
	origpath = unescape(origpath);
	gsharePath = path;
	var protocol = '';

    switch (type) {
        case 'movie':
            dialogTitle = "%161".toLocaleString();
        break;
        case 'tvshow':
            dialogTitle = "%162".toLocaleString();
        break;
        case 'video':
            dialogTitle = "%230".toLocaleString();
        break;
        case 'photo':
            dialogTitle = "%164".toLocaleString();
        break;
        default:
            dialogTitle = "%229".toLocaleString();
    }
	
    var add = $("#dialog-form");
    add.html('');
    add.dialog({
        //	autoOpen: true,
        title: dialogTitle,
        height: 580,
        width: 690,
        //draggable: false,
        resizable: false,
        position: 'center',
        modal: true
    });

    path = unescape(path);
    path = removeslashAtEnd(path);

    add.append('<div class="path"></div>');
    $(".path").append('<p align="left">' + "%236".toLocaleString() + '</p>');
    $(".path").append('<div class="srcpath" style="padding-left:50px"><input type="text" id="srcPath" class="" /></div>');
    if (type == "movie") {
        $(".path").append('<p align="left"></p><p align="left">' + "%240".toLocaleString() + '</p>');
    } else if (type == "tvshow") {
        $(".path").append('<p align="left"></p><p align="left">' + "%241".toLocaleString() + '</p>');
    } else if (type == "video") {
        $(".path").append('<p align="left"></p><p align="left">' + "%242".toLocaleString() + '</p>');
    } else if (type == "photo") {
        $(".path").append('<p align="left"></p><p align="left">' + "%243".toLocaleString() + '</p>');
    } else {
        $(".path").append('<p align="left"></p><p align="left">' + "%239".toLocaleString() + '</p>');
    }
    $(".path").append('<div class="browse1"><table id="tab1"></tale></div>');
    $(".path").append('<div class="browse2"><table id="tab2"></tale></div>');

    vidonme.rpc.request({
        'context': this,
        'method': 'VidOnMe.GetDirectory',
        'params': {
            "mask": "/",
            "directory": ""
        },
        'success': function(data) {
            $.each($(data.result.filelist), jQuery.proxy(function(i, item) {
                var str = removeslashAtEnd(item.path);
                var drivetype = item.drivetype;

                var name = '';
                if (str.length > 50) {
                    name = str.substring(0, 50) + "......" + str.substring(str.length - 10, str.length);
                } else {
                    name = str;
                }

                var drivetypename = '';
                switch (drivetype) {
                    case 1:
                        drivetypename = "%249".toLocaleString();
                    break;
                    case 4:
                        drivetypename = "%251".toLocaleString();
                    break;
                    case 6:
                        drivetypename = "%250".toLocaleString();
                    break;
                    default:
                        drivetypename = "other";
                }

                if (name.match("Desktop")) {
                    drivetypename = "";
                }

                var localpath = str;
                name = handleUrl(localpath, true, true);

				if (!bsrname.match("msie")) {
                    localpath = item.path.replace(/\\/g, '\\\\');
                    document.getElementById("tab1").innerHTML += '<tr><td onmouseover="_mouseover2(this)" onmouseout="_mouseout(this)" onClick="btn_browse(\'' +  type + '\',\'' + escape(localpath) + '\',' + edit + ',\'' + escape(name) + '\')" title=' + name + '>' + drivetypename + ' ' + name + '</td></tr>';
                } else {
                    var row = document.getElementById('tab1').insertRow();

                    var col = row.insertCell();
                    col.title = name;
                    col.innerText = drivetypename + ' ' + name;
                    col.onclick = function() {
                        btn_browse(type, escape(localpath), edit, escape(name));
                    };
                }
            }, this));
			
			if (!bsrname.match("msie")) {
				var note = "%267".toLocaleString();
				document.getElementById('tab1').innerHTML += '<tr><td onmouseover="_mouseover2(this)" onmouseout="_mouseout(this)" onClick="btn_browse(\'' + type + '\',\'' + "smb://" + '\',' + edit + ',\'' + "" + '\')">Windows Network (SMB)</td></tr><tr><td onmouseover="_mouseover2(this)" onmouseout="_mouseout(this)" onClick="btn_browse(\'' + type + '\',\'' + "nfs://" + '\',' + edit + ',\'' + "" + '\')">Network Filesystem (NFS)</td></tr><tr><td onmouseover="_mouseover2(this)" onmouseout="_mouseout(this)" onClick="btn_addnetshare(\'' + "" + '\',' + false + ')">' + note + '</td></tr>';	
			} else {	
				var row = document.getElementById('tab1').insertRow();
				
				var col = row.insertCell();
				col.innerText = "Windows Network (SMB)";
				col.onclick = function() {
				    btn_browse(type, "smb://", edit, "");
				};
				
				row = document.getElementById("tab1").insertRow();
				
				var col = row.insertCell();
				col.innerText = "Network Filesystem (NFS)";
				col.onclick = function() {
				    btn_browse(type, "nfs://", edit, "");
				};
				
				row = document.getElementById("tab1").insertRow();
				
				var col = row.insertCell();
				col.innerText = "%267".toLocaleString();
				col.onclick = function() {
					btn_addnetshare("", false);
				};
			}
        }
    });

    showdiv();
    vidonme.rpc.request({
        'context': this,
        'method': 'VidOnMe.GetDirectory',
        'params': {
            "mask": "/",
            "directory": path
        },
        'success': function (data) {
            hidediv();
            var is_smb = path.indexOf("smb://") >= 0;
            var is_nfs = path.indexOf("nfs://") >= 0;

            if (data && data.result.ret == false) {
				var err = data.result.err;
				
				if (err == "Access is denied") {
                	alert("%276".toLocaleString());
				} else if (err == "Unknown user name or bad password") {
                	alert("%277".toLocaleString());
				} else if (err == "Network path not found") {
                	alert("%278".toLocaleString());
				} else {
					alert(err);
				}

                if (is_smb || is_nfs) {
					if (err == "Access is denied" ||
						err == "Unknown user name or bad password") {
                    		btn_addnetshare(handleUrl(path, false, false), true);
					}
                }

                return;
            }

            if (path != "") {
                var arg = '';
				
				if (origpath != path) {
					var temp = handleUrl(path, true, true);
					if (origpath != temp) {
						arg = getParentPath(path);
					}
				}

                if (arg.match('\'')) {
                    arg = arg.replace(/\'/g, '\\\''); // handle "'" in path, TODO: merge into another func
                }

                if (arg != "") {
                    if (!bsrname.match("msie")) {
                        document.getElementById("tab2").innerHTML = '<tr><td  onmouseover="_mouseover(this)" onmouseout="_mouseout(this)" class="back" onClick="btn_browse(\'' + type + '\',\'' + escape(arg) + '\',' + edit + ',\'' + escape(origpath) + '\')">back</td></tr>';
                    } else {
                        var row = document.getElementById('tab2').insertRow();
                        var col = row.insertCell();
                        col.innerText = "back";

                        col.onclick = function () {
                            btn_browse(type, escape(arg), edit, escape(origpath));
                        };

                        col.style.margin = "5px 0";
                        col.style.width = "312px";
                        col.style.paddingLeft = "40px";
                        col.style.background = "url(img/back.png) no-repeat 5px 8px";
                        col.onmouseover = function () {
                            col.style.backgroundColor = "#025567";
                        }
                        col.onmouseout = function () {
                            col.style.backgroundColor = '';
                        }
                    }
                }

                $.each($(data.result.filelist), jQuery.proxy(function (i, item) {
                    var str = item.title;

                    var name = '';
                    if (str.length > 50) {
                        name = str.substring(0, 50) + "......" + str.substring(str.length - 10, str.length);
                    } else {
                        name = str;
                    }

                    arg = item.path;
                    if (!bsrname.match("msie")) {
                        if (!arg.match("/")) {
                            arg = arg.replace(/\\/g, '\\\\');
                        }

                        if (arg.match('\'')) {
                            arg = arg.replace(/\'/g, '\\\'');
                        }

                        document.getElementById("tab2").innerHTML += '<tr><td class="file" onmouseover="_mouseover(this)" onmouseout="_mouseout(this)" onClick="btn_browse(\'' + type + '\',\'' + escape(arg) + '\',' + edit + ',\'' + escape(origpath) + '\')" title=' + str + '>' + name + '</td></tr>';
                    } else {
                        if (arg.match('\'')) {
                            arg = arg.replace(/\'/g, '\\\'');
                        }

                        var row = document.getElementById('tab2').insertRow();

                        var col = row.insertCell();
                        col.title = str;
                        col.innerText = name;
                        col.onclick = function () {
                            btn_browse(type, escape(arg), edit, escape(origpath));
                        };
                        col.style.margin = "5px 0";
                        col.style.width = "312px";
                        col.style.paddingLeft = "40px";
                        col.style.background = "url(img/file.png) no-repeat 5px 8px";
                        col.onmouseover = function () {
                            col.style.backgroundColor = "#025567";
                        }
                        col.onmouseout = function () {
                            col.style.backgroundColor = '';
                        }
                    }
                }, this));
            }

            path = path.replace(/\\\\/g, '\\');
            var display = handleUrl(path, true, true);
            document.getElementById("srcPath").value = display;

            if (document.getElementById("srcPath").value == "") {
                $("#dialog-form").append('<table class="btnpre"><tr><td OnClick="btn_add(\'' + "" + '\',\'' + type + '\',\'' + escape(path) + '\',' + edit + ',\'' + origpath + '\')" background="img/button_previous_normal.png">' + "%237".toLocaleString() + '</td></tr></table><table class="btnnexdisabled"><tr><td OnClick="" background="img/button_next_save_normal.png">' + "%238".toLocaleString() + '</td></tr></table>');
            } else {
                $("#dialog-form").append('<table class="btnpre"><tr><td OnClick="btn_add(\'' + "" + '\',\'' + type + '\',\'' + escape(path) + '\',' + edit + ',\'' + origpath + '\')" background="img/button_previous_normal.png">' + "%237".toLocaleString() + '</td></tr></table><table class="btnnex"><tr><td OnClick="btn_save(\'' + type + '\',\'' + escape(path) + '\',' + edit + ',\'' + origpath + '\')" background="img/button_next_save_normal.png">' + "%238".toLocaleString() + '</td></tr></table>');
            }
        }
    });
}

function settype(id) {
    if (gselected) {
        var localid = gselected.id;
		switch(localid) {
        case 'img0':
            gselected.src = "img/auto_01.png";
            break;
        case 'img1':
            gselected.src = "img/movie_01.png";
            break;
        case 'img2':
            gselected.src = "img/tvshow_01.png";
            break;
        case 'img3':
            gselected.src = "img/video_01.png";
            break;
        case 'img4':
            gselected.src = "img/photo_01.png";
        }
    }

    switch (id) {
    case 'a1':
        gtype = "movie";
        document.getElementById("img1").src = "img/movie_03.png";
        gselected = document.getElementById("img1");
	    break;
    case 'a2':
        gtype = "tvshow";
        document.getElementById("img2").src = "img/tvshow_03.png";
        gselected = document.getElementById("img2");
	    break;
    case 'a3':
        gtype = "video";
        document.getElementById("img3").src = "img/video_03.png";
        gselected = document.getElementById("img3");
	    break;
    case 'a4':
        gtype = "photo";
        document.getElementById("img4").src = "img/photo_03.png";
        gselected = document.getElementById("img4");
	    break;
    case 'a0':
    default:
        gtype = "auto";
        document.getElementById("img0").src = "img/auto_03.png";
        gselected = document.getElementById("img0");
    }
}

function btn_add(shareName, shareType, sharePath, edit, origpath) { // origpath is set in btn_browse when clicking the items in left table
    if (edit == true){
		 goldPath = sharePath;
         goldName = shareName;
		 if (goldType == '') {
             goldType = shareType;
         }
    }
	
    gshareName = shareName;
    gshareType = shareType;
    gsharePath = sharePath;
    gedit = edit;
    var dialogTitle = "%228".toLocaleString();
	
    shareName = unescape(shareName);
    sharePath = unescape(sharePath);
    var add = $("#dialog-form");
    add.html('');
    add.dialog({
        //	autoOpen: true,
        title: dialogTitle,
        height: 580,
        width: 690,
        //draggable: false,
        resizable: false,
        position: 'center',
        modal: true
    });
	
    add.append('<div class="add"></div>');
	$(".add").append('<p style="height:23px"></p>');
	
    var content = '';
    var bsrname = gbrowser + "";
    var mouse = '';
    var typediv = '';
	var typename = new Array("%229".toLocaleString(),"%161".toLocaleString(),"%162".toLocaleString(),"%230".toLocaleString(),"%164".toLocaleString());
	
	for (var i = 0; i < 5; i++) {
        typediv = $('<div id=' + "div" + i + '></div>');
        if (edit == false) {
            mouse = '<a id=' + "a" + i + ' ' + 'OnClick="settype(this.id)">';
        } else {
            mouse = '<a id=' + "a" + i + '>';
        }
        if (i == 0) {
            mouse += '<img id=' + "img" + i + ' ' +'class="img" src="img/auto_01.png"/>';
        }
        if (i == 1) {
            mouse += '<img id=' + "img" + i + ' ' +'class="img" src="img/movie_01.png"/>';
        }
        if (i == 2) {
            mouse += '<img id=' + "img" + i + ' ' +'class="img" src="img/tvshow_01.png"/>';
        }
        if (i == 3) {
            mouse += '<img id=' + "img" + i + ' ' +'class="img" src="img/video_01.png"/>';
        }
        if (i == 4) {
            mouse += '<img id=' + "img" + i + ' ' +'class="img" src="img/photo_01.png"/>';
        }
        mouse += '<p id=' + "p" + i + ' ' + 'class="Album_name2">' + typename[i] + '</p></a>';
        var t = typediv.addClass("type").html(mouse);
		
        if (edit == false) {
            t.hover(function(e) {
                var localid = '';
                if (gselected) {
                    localid = gselected.id;
                }
                $(this).children(".Album_menu").show();
                if (e.target.id == "div0" || e.target.id == "p0" || e.target.id == "a0") {
                    if (!bsrname.match("msie")) {
                        document.getElementById("Note").innerHTML = '<tr><td>' + "%231".toLocaleString() + '</td></tr>';
                    } else {
                        document.getElementById("Note").rows[0].cells[0].innerText = "%231".toLocaleString();
                    }
                    if (localid != "img0") {
                        document.getElementById("img0").src = "img/auto_02.png";
                    }
                } else if (e.target.id == "div1" || e.target.id == "p1" || e.target.id == "a1") {
                    if (!bsrname.match("msie")) {
                        document.getElementById("Note").innerHTML = '<tr><td>' + "%232".toLocaleString() + '</td></tr>';
                    } else {
                        document.getElementById("Note").rows[0].cells[0].innerText = "%232".toLocaleString();
                    }
                    if (localid != "img1") {
                        document.getElementById("img1").src = "img/movie_02.png";
                    }
                } else if (e.target.id == "div2" || e.target.id == "p2" || e.target.id == "a2") {
                    if (!bsrname.match("msie")) {
                        document.getElementById("Note").innerHTML = '<tr><td>' + "%233".toLocaleString() + '</td></tr>';
                    } else {
                        document.getElementById("Note").rows[0].cells[0].innerText = "%233".toLocaleString();
                    }
                    if (localid != "img2") {
                        document.getElementById("img2").src = "img/tvshow_02.png";
                    }
                } else if (e.target.id == "div3" || e.target.id == "p3" || e.target.id == "a3") {
                    if (!bsrname.match("msie")) {
                        document.getElementById("Note").innerHTML = '<tr><td>' + "%234".toLocaleString() + '</td></tr>';
                    } else {
                        document.getElementById("Note").rows[0].cells[0].innerText = "%234".toLocaleString();
                    }
                    if (localid != "img3") {
                        document.getElementById("img3").src = "img/video_02.png";
                    }
                } else if (e.target.id == "div4" || e.target.id == "p4" || e.target.id == "a4") {
                    if (!bsrname.match("msie")) {
                        document.getElementById("Note").innerHTML = '<tr><td>' + "%235".toLocaleString() + '</td></tr>';
                    } else {
                        document.getElementById("Note").rows[0].cells[0].innerText = "%235".toLocaleString();
                    }
                    if (localid != "img4") {
                        document.getElementById("img4").src = "img/photo_02.png";
                    }
                } else {
                    if (!bsrname.match("msie")) {
                        document.getElementById("Note").innerHTML = '';
                    } else {
                        document.getElementById("Note").rows[0].cells[0].innerText = "";
                    }
                }
            }, function() {
                var localid = '';
                if (gselected) {
                    localid = gselected.id;
                }
                switch(this.id) {
                case 'div0':
                    if (localid != "img0") {
                        document.getElementById("img0").src = "img/auto_01.png";
                    }
                break;
                case 'div1':
                    if (localid != "img1") {
                        document.getElementById("img1").src = "img/movie_01.png";
                    }
                break;
                case 'div2':
                    if (localid != "img2") {
                        document.getElementById("img2").src = "img/tvshow_01.png";
                    }
                break;
                case 'div3':
                    if (localid != "img3") {
                        document.getElementById("img3").src = "img/video_01.png";
                    }
                break;
                case 'div4':
                    if (localid != "img4") {
                        document.getElementById("img4").src = "img/photo_01.png";
                    }
                }
            });
        }
        $(".add").append(typediv);
    }

    $(".add").append('<p style="height:21px"></p>');
    $(".add").append('<hr/>');
    $(".add").append('<table class="note" id="Note" align="left"><tr><td>' + content + '</td></tr></table><table class="btnx"><tr><td OnClick="btn_browse(\'' + shareType + '\',\'' + escape(sharePath) + '\',' + edit + ',\'' + escape(origpath) + '\')" background="img/button_01_normal.png">' + "%238".toLocaleString() + '</td></tr></table>');

    var id = '';
    switch (shareType) {
        case 'movie':
            id = "a1";
            content = "%232".toLocaleString();
            break;
        case 'tvshow':
            id = "a2";
            content = "%233".toLocaleString();
            break;
        case 'video':
            id = "a3";
            content = "%234".toLocaleString();
            break;
        case 'photo':
            id = "a4";
            content = "%235".toLocaleString();
            break;
        case 'auto':
        default:
            id = "a0";
            content = "%231".toLocaleString();
    }
	
    settype(id);
	
    if (!bsrname.match("msie")) {
        document.getElementById("Note").innerHTML = '<tr><td>' + content + '</td></tr>';
    } else {
        document.getElementById("Note").rows[0].cells[0].innerText = content;
    }
}

function dialogClose() {
    $("#dialog-form").dialog("close");
}

//添加媒体 
function addMedia(addName, addType, addPath, edit) {
    var name2 = document.getElementById("srcName").value;
    if (name2 == addName) {
        addName = unescape(addName);
    } else {
        addName = unescape(name2);
    }

    addPath = unescape(addPath);
	
    var oldName = unescape(goldName);
    var oldPath = unescape(goldPath);

    var paths = '';
    if (addName == "") {
        if (addName.match("/")) {
            paths = addPath.split("/");
        } else {
            paths = addPath.split("\\");
        }
        addName = paths[paths.length - 1].toString();
    }
  
	if(edit == true) {
		//更新
		vidonme.rpc.request({
			'context': this,
			'method': 'VidOnMe.UpdateShare',
			'params': {
				"oldname": oldName,
				"oldpath": oldPath,
				"oldtype": goldType,
				"name": addName,
				"path": addPath,
				"type": addType
			},
			'success': function(data) {
				$("#dialog-form").dialog("close");
				MediaLibrary.prototype.mediaManagerOpen();
				//gaddEdit = 1;
			}
		});
	} else if(edit == false){
		//添加
		vidonme.rpc.request({
			'context': this,
			'method': 'VidOnMe.AddPathToLibrary',
			'params': {
				"path": addPath,
				"LibraryId": 1
			},
			'success': function(data) {
				$("#dialog-form").dialog("close");
				//alert("添加成功");
				MediaLibrary.prototype.mediaManagerOpen();
				gaddEdit = 1;
			
			}
		});
		vidonme.rpc.request({
			'context': this,
			'method': 'VidOnMe.StartScan',
			'params': {
				"LibraryId": 1
			},
			'success': function(data) {
				$("#dialog-form").dialog("close");
				//alert("添加成功");
				MediaLibrary.prototype.mediaManagerOpen();
				gaddEdit = 1;
			
			}
		});
	} else {
		alert("Invalid parameters!");	
	}
	
	var language = '';
	var scraperSetting = '';
	vidonme.rpc.request({
		'context': this,
		'method': 'VidOnMe.GetSystemSetting',
		'params': {
			"key": "library.defaultlanguageforscraper"
		
		},
		'success': function(data) {
			language = data.result.val + "";
			scraperSetting = "<settings><setting id=\"language\" value=" + language + " /></settings>";
		}
	});
}

var gtype = ''; //媒体类型
var goldPath = '';
var goldName = '';
var goldType = '';
var gselected = null;
var gbrowser = '';
var gshareName = '';
var gshareType = '';
var gsharePath = '';
var gedit = false;

//删除、刷新、编辑按钮的隐藏与显示
function onShow(li) {
    $(li).find("span").show();
}
function onHide(li) {
    $(li).find("span").hide();
}


