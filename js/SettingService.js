var SettingService = function() {
    this.init();
    return true;
};

function HandleVersion(versionIn)
{
    if (versionIn.length == 5) {
        var version_tag, version_raw = '';
        var version_split = versionIn.split("");
        for (var i = 0; i < version_split.length - 1; i++) {
            version_raw += version_split[i];
        }
        if (version_split[version_split.length - 1] == "2") {
            version_tag = " Beta";
        } else if (version_split[version_split.length - 1] == "1") {
            version_tag = " Stable";
        } else {
            version_tag = " Alpha";
        }

        version_raw_split = version_raw.split("");
        versionOut = version_raw_split.join(".") + version_tag;
    } else {
        versionOut = "20002";
    }

    return versionOut;
}

SettingService.prototype = {
    init: function() {
        this.bindControls();
    
    },
    bindControls: function() {
        $('#serverSetting').click(jQuery.proxy(this.serverSettingOpen, this));
    },
    resetPage: function() {
        $('#serverSetting').removeClass('selected');
        this.hideOverlay();
    },
    
    hideOverlay: function(event) {
        if (this.activeCover) {
            $(this.activeCover).remove();
            this.activeCover = null;
        }
        $('#overlay').hide();
    },
    
    serverSettingOpen: function() {
        this.resetPage();
        $('#mediaManager').removeClass('selected');
        $('#appsDownload').removeClass('selected');
        $('#backupMedia').removeClass('selected');
        $('#serverSetting').addClass('selected');
		$('#userCenter').removeClass('selected');
        $('.contentContainer').hide();
        var libraryContainer = '';
       
        libraryContainer = $('<div></div>');
        $('#title_tab').html('');
        $('#title_tab').append('<tr><td class="heading">' + "%102".toLocaleString() + '</td><td></td></tr>');
        
        vidonme.rpc.request({
            'context': this,
            'method': 'VidOnMe.GetSystemSettingForAll',
            'params': [],
            'success': function(data) {
				
                if (data && data.result && data.result.settings) {
                    $('#folder_box').html('');
                    document.getElementById('folder_box').style.display = "";
                    $('#server_setting').html('');
                    $('#server_setting').append(libraryContainer);
                    
                    settingInfo = data.result.settings;
                    libraryContainer.append('<div class="siderbar" ><ul><li  onClick="info(\'' + "serverState" + '\')">' + "%116".toLocaleString() + '</li><li class="selected" onClick="info(\'' + "essentialInfo" + '\')">' + "%117".toLocaleString() + '</li><li onClick="info(\'' + "mediaLibrary" + '\')">' + "%118".toLocaleString() + '</li><li onClick="info(\'' + "transcoding" + '\')">' + "%119".toLocaleString() + '</li><li onClick="info(\'' + "update" + '\')">' + "%177".toLocaleString() + '</li></ul></div>').find("li").click(function() {
                        $(this).addClass("selected").siblings().removeClass("selected");
                    });
                    
					vidonme.rpc.request({
						'context': this,
						'method': 'VidOnMe.GetServerName',
						'params': [],
						'success': function(data) {
							if (data && data.result.ret) {
								genericName = data.result.name;
							}
						}
					});
					
                    vidonme.rpc.request({
                        'context': this,
                        'method': 'VidOnMe.GetServerInfo',
                        'params': [],
                        'success': function(data1) {
                            if (data1 && data1.result) {
                                serverInfo = data1.result;
                                info("essentialInfo");
                            }
                        }
                    });
                } else {
                    libraryContainer.html('');
                }
            }
        });
    }
}

function info(infoType) {
    commitUpdateInfo();
    
//	serverName = '',
    language1 = '',  //WEB语言
    genericAutoStart = '',  //是否开机自动启动
    discoveryBonjour = '',  //本助协议
    discoveryDns = '',  //DNS
    // webServicePort = '',  //web端口号
    accountAccount = '',  //Web管理登陆用户名
    accountPassword = '',  //Web管理登陆密码
    webServer = '', 
    dlna = '', 
    libAutoUpdate = '', 
    libAutoUpdateTimeSpan = '', 
    servicesWebonlyLocal = '', 
    cupMaxUsage = '', 
    tempFilePath = '', 
    defaultScraperLanguage = '', 
	defaultSubtitleShowMode='',
    serverIp = '';
    
    for (var i = 0; i < settingInfo.length; i++) {
        switch (settingInfo[i].key) {
//            case "name.value":
//                serverName = settingInfo[i].val;
//                break;
            case "language.default":
                language1 = settingInfo[i].val;
                break;
            case "generic.autostart":
                genericAutoStart = settingInfo[i].val;
                break;
            case "discovery.bonjour":
                discoveryBonjour = settingInfo[i].val;
                break;
            case "discovery.dns":
                discoveryDns = settingInfo[i].val;
                break;
            case "library.defaultlanguageforscraper":
                defaultScraperLanguage = settingInfo[i].val;
                break;
            case "dlna.dlna":
                dlna = settingInfo[i].val;
                break;
            case "transcoder.cpumaxusage":
                cupMaxUsage = settingInfo[i].val;
                break;
            case "transcoder.tempfilepath":
                tempFilePath = settingInfo[i].val;
                break;
            case "library.autoupdatetimespan":
                libAutoUpdateTimeSpan = settingInfo[i].val;
                break;
            case "services.webserver":
                webServer = settingInfo[i].val;
                var jsonWebServer = eval('(' + webServer + ')');
                // webServicePort = jsonWebServer.webserverport;
                accountAccount = jsonWebServer.webserverusername;
                accountPassword = jsonWebServer.webserverpassword;
                servicesWebonlyLocal = jsonWebServer.webonlylocal;
                break;
            case "generic.autoupgrade":
                updateAuto = settingInfo[i].val;
                break;
            case "generic.daytime":
                updateDaytime = settingInfo[i].val;
                break;
            case "generic.weekday":
                updateWeekday = settingInfo[i].val;
                break;
        }
    }
	
//	genericName = serverName;
    serverIp = serverInfo.serverip;
    genericVersion = HandleVersion(serverInfo.srvversion);
    
    $('#server_setting').append(rightInfo);
    if (infoType == "serverState") {
        rightInfo.html('');
        rightInfo.append('<h3>' + "%121".toLocaleString() + '</h3><p class="info">' + "%122".toLocaleString() + ': <input id="servname" class="servname" type="text" value=\'' + genericName + '\'></p><p class="info">' + "%123".toLocaleString() + ': ' + genericVersion + '</p> <p class="info">' + "%124".toLocaleString() + ': ' + serverIp + '</p><p><a style="padding-top:5px; padding-left:20px;" class="btn" OnClick="saveServerName(\'' + language1 + '\',' + true + ')"><span class="btnl">' + "%135".toLocaleString() + '</span><span class="btnr"></span></a></p>');
		$('#servname').focus();
		
        rightInfo.append('<div id="tableId"></div>');
        var tableDiv = document.getElementById("tableId");
	
        showTable(tableDiv);
	 
        timer = window.setInterval(function() { showTable(tableDiv); }, 6000);
    
    } else if (infoType == "essentialInfo") {
        clearInterval(timer); //停止定时器
        rightInfo.html('');
        rightInfo.append('<h3>' + "%133".toLocaleString() + '</h3>');
        rightInfo.append('<p><select class="form_select" id="selectLaunguage"><option value="Chinese (Simple)">中文（简体）<option value="Chinese (Traditional)">繁軆中文<option value="English">English<option value="French">Français<option value="German">Deutsch<option value="Japanese">日本語<option value="Korean">한국어<option value="Portuguese (Brazil)">Português(Brasil)<option value="Spanish">Español<option value="Swedish">Svenska</select></p><p class="form_checkbox"> <input id="WebonlyLocal" type="checkbox"/>' + "&nbsp;" + "%140".toLocaleString() + '</p>' + '<p>' + "%141".toLocaleString() + '</p><p class="form_checkbox"><input id="checkboxStart" type="checkbox" />  ' + "%134".toLocaleString() + '</p>' + ' <a class="btn" OnClick="settingSave(\'' + "essentialInfo" + '\')"><span class="btnl">' + "%135".toLocaleString() + '</span><span class="btnr"></span></a><a class="btn"  OnClick="settingCancle(\'' + "essentialInfo" + '\')"><span class="btnl">' + "%114".toLocaleString() + '</span><span class="btnr"></span></a>').find(".form_select option:even").css("backgroundColor", "#151516");
        var selectLaunage = document.getElementById("selectLaunguage");
        for (var i = 0; i < selectLaunage.options.length; i++) {
            if ((selectLaunage.options[i].value == "English" && language1 == "") || selectLaunage.options[i].value == language1) {
                selectLaunage.options[i].selected = true;
            }
        }
        if (genericAutoStart == "true") {
            document.getElementById("checkboxStart").checked = true;
        } else {
            document.getElementById("checkboxStart").checked = false;
        }
        if (servicesWebonlyLocal == true) {
            document.getElementById("WebonlyLocal").checked = true;
        }
    } else if(infoType=="trackSubtitle"){
		//音轨字幕语言设置
        clearInterval(timer); //停止定时器
        rightInfo.html('');
        rightInfo.append('<h3>' + "首选音轨语言" + '</h3><select class="form_select"  id="trackLaunguage"><option value="zh">中文</option><option value="en">English</option><option value="us">English (US)</option><option value="fr">Français<option value="de">Deutsch<option value="ja">日本語<option value="ko">한국어<option value="pt">Português(Brasil)<option value="es">Español</select><h3>'+"首选字幕语言"+'</h3><select class="form_select"  id="subtitleLaunguage"><option value="zh">中文<option value="en">English<option value="us">English (US)<option value="fr">Français<option value="de">Deutsch<option value="ja">日本語<option value="ko">한국어<option value="pt">Português(Brasil)<option value="es">Español</select>');
        rightInfo.append('<a class="btn" onClick="settingSave(\'' + "trackSubtitle" + '\')"> <span class="btnl">' + "%135".toLocaleString() + '</span><span class="btnr"></span></a>  ' + '<a class="btn" OnClick="settingCancle(\'' + "trackSubtitle" + '\')"><span class="btnl">' + "%114".toLocaleString() + '</span><span class="btnr"></span></a>').find(".form_select option:even").css("backgroundColor", "#151516");
        
        var trackLaunguage = document.getElementById("trackLaunguage");
        for (var i = 0; i < trackLaunguage.options.length; i++) {
            if (trackLaunguage.options[i].value == defaultScraperLanguage) {
                trackLaunguage.options[i].selected = true;
            }
        }
		
		var subtitleLaunguage = document.getElementById("subtitleLaunguage");
        for (var i = 0; i < subtitleLaunguage.options.length; i++) {
            if (subtitleLaunguage.options[i].value == defaultScraperLanguage) {
                subtitleLaunguage.options[i].selected = true;
            }
        }
	} else if (infoType == "network") {
        clearInterval(timer); //停止定时器
        rightInfo.html('');
        rightInfo.append('<p class="form_checkbox"> </p><p class="form_checkbox"> <input id="WebonlyLocal" type="checkbox"/>' + "%140".toLocaleString() + '</p>' + '<p>' + "%141".toLocaleString() + '</p>' + '<h3>' + "%142".toLocaleString() + '</h3>' + '<p>' + "%143".toLocaleString() + '</p>' + '<h3>' + "%144".toLocaleString() + '</h3>' + '<p><input class="form_input" id="webName" type="text" value="' + accountAccount + '" /></p>' + '<h3>' + "%145".toLocaleString() + '</h3>' + '<p><input class="form_input" id="webPassword" type="password" value="' + accountPassword + '"  /></p>' + '<p>' + "%146".toLocaleString() + '</p>' + '<a class="btn" onClick="settingSave(\'' + "network" + '\')"><span class="btnl">' + "%135".toLocaleString() + '</span><span class="btnr"></span></a>   ' + '<a class="btn" OnClick="settingCancle(\'' + "network" + '\')"><span class="btnl">' + "%114".toLocaleString() + '</span><span class="btnr"></span></a>');
        
        if (servicesWebonlyLocal == true) {
            document.getElementById("WebonlyLocal").checked = true;
        }
    
    } else if (infoType == "update") {
        hasCommitUpdate = false;
        upgrade();
    } else if (infoType == "transcoding") {
		clearInterval(timer);
		
		vidonme.rpc.request({
			'context': this,
			'method': 'VidOnMe.CheckTranscodeOption',
			'params': [],
			'success': function(data) {
				if (data && data.result) {
					var support = data.result.hardCodecSupport;
					
					rightInfo.html('');
					rightInfo.append('<h3>' + "%212".toLocaleString() + '</h3><p class="form_checkbox_transcode"><input id="checkboxOpenTranscode" type="checkbox" /> ' + "%213".toLocaleString() + '</p><p>' + "%214".toLocaleString() + '</p>');
					if (support == true) {
						var setup = data.result.hardCodecSetup;
						document.getElementById("checkboxOpenTranscode").checked = setup;
					
						rightInfo.append('<p style="padding-top:5px"><a class="btn" OnClick="settingSave(\'' + "transcoding" + '\')"><span class="btnl">' + "%135".toLocaleString() + '</span><span class="btnr"></span></a><a class="btn"  OnClick="settingCancle(\'' + "transcoding" + '\')"><span class="btnl">' + "%114".toLocaleString() + '</span><span class="btnr"></span></a>').find(".form_selectoption:even").css("backgroundColor", "#151516");
					} else {
						document.getElementById("checkboxOpenTranscode").disabled = true;
					}
				}
			}
		});
	} else if (infoType == "mediaLibrary") {
        clearInterval(timer); //停止定时器
        rightInfo.html('');
        rightInfo.append('<h3>' + "%147".toLocaleString() + '</h3><p><select class="form_select" id="updateTime"><option value="0">' + "%148".toLocaleString() + '<option value="1">' + "%149".toLocaleString() + '<option value="12">' + "%150".toLocaleString() + '<option value="24">' + "%151".toLocaleString() + '<option value="72">' + "%152".toLocaleString() + '</option><option value="168">' + "%153".toLocaleString() + '</option><option value="720">' + "%154".toLocaleString() + '</option></select></p>' + '<p><h3>' + "%155".toLocaleString() + '</h3></p>');
        
        rightInfo.append('<p><select class="form_select"  id="selectMovieLaunguage"><option value="zh">中文</option><option value="en">English</option><option value="us">English (US)</option><option value="fr">Français</option><option value="de">Deutsch</option><option value="ja">日本語</option><option value="ko">한국어</option><option value="pt">Português(Brasil)</option><option value="es">Español</option></select></p><p style="margin-top:15px"></p><div id="mediaLibPrompt"></div> <a class="btn" onClick="settingSave(\'' + "mediaLibrary" + '\')"> <span class="btnl">' + "%135".toLocaleString() + '</span><span class="btnr"></span></a>  ' + '<a class="btn" OnClick="settingCancle(\'' + "mediaLibrary" + '\')"><span class="btnl">' + "%114".toLocaleString() + '</span><span class="btnr"></span></a>').find(".form_select option:even").css("backgroundColor", "#151516");
        
        var selectMovieLaunage = document.getElementById("selectMovieLaunguage");
        for (var i = 0; i < selectMovieLaunage.options.length; i++) {
            if (selectMovieLaunage.options[i].value == defaultScraperLanguage) {
                selectMovieLaunage.options[i].selected = true;
            }
        }
        
        var update = document.getElementById("updateTime");
        for (var i = 0; i < update.options.length; i++) {
            if (update.options[i].value == libAutoUpdateTimeSpan) {
                update.options[i].selected = true;
            }
        }
    }
}

//服务器设置保存信息
function settingSave(actionType) {
    var reloadPage = '';
    if (actionType == "essentialInfo") {
        var languageId = document.getElementById("selectLaunguage");
        var autoStart = document.getElementById("checkboxStart").checked;
        var index = languageId.selectedIndex;
        var language = languageId.options[index].value;
//		if (genericName == '') {
//			if (language == "Chinese (Simple)") {
//				genericName = "威动服务器";
//			} else if ( language == "Chinese (Traditional)") {
//				genericName = "威動伺服器";
//			} else {
//				genericName = "VidOn Server";
//			}
//		}
        
        var webonlyLocal = document.getElementById("WebonlyLocal").checked;
        // var webServicePort = '';
        for (var i = 0; i < settingInfo.length; i++) {
            if (settingInfo[i].key == "language.default") {
                if (language == settingInfo[i].val) {
                    reloadPage = true;
                }
            }
        }
        
        var str = '{\"webonlylocal\":' + webonlyLocal + ',\"webserver\":true,\"webserverpassword\":\"\",\"webserverusername\":\"\"}';
        
        vidonme.rpc.request({
            'context': this,
            'method': 'VidOnMe.SetSystemSetting',
            'params': {
                "key": "services.webserver",
                "val": str
            },
            'success': function(data) {
                var i = '';
            }
        });
        vidonme.rpc.request({
            'context': this,
            'method': 'VidOnMe.SetSystemSetting',
            'params': {
                "key": "generic.autostart",
                "val": autoStart + ""
            },
            'success': function(data) {
            
            }
        });
        vidonme.rpc.request({
            'context': this,
            'method': 'VidOnMe.SetSystemSetting',
            'params': {
                "key": "webonlylocal",
                "val": webonlyLocal + ""
            },
            'success': function(data) {
                var str = '';
            }
        });
        vidonme.rpc.request({
            'context': this,
            'method': 'VidOnMe.SetSystemSetting',
            'params': {
                "key": "language.default",
                "val": language
            },
            'success': function(data) {
            
            }
        });
    } else if (actionType == "mediaLibrary") {
        reloadPage = true;
        var libUpdateTime = document.getElementById("updateTime").value;
        var scraperLanguage = document.getElementById("selectMovieLaunguage").value;
        var mediaLibDiv = document.getElementById("mediaLibPrompt");
        mediaLibDiv.innerHTML = '<img src="/img/loading.gif" style="padding-left:5px;padding-top:15px;padding-right:5px;" />'+"%209".toLocaleString();+'</p>';
        
        if (libUpdateTime == "0") {
            vidonme.rpc.request({
                'context': this,
                'method': 'VidOnMe.SetSystemSetting',
                'params': {
                    "key": "library.autoupdate",
                    "val": false + ""
                },
                'success': function(data) {

                }
            });
        } else {
            vidonme.rpc.request({
                'context': this,
                'method': 'VidOnMe.SetSystemSetting',
                'params': {
                    "key": "library.autoupdate",
                    "val": true + ""
                },
                'success': function(data) {

                }
            });
        }
        
        vidonme.rpc.request({
            'context': this,
            'method': 'VidOnMe.SetSystemSetting',
            'params': {
                "key": "library.autoupdatetimespan",
                "val": libUpdateTime
            },
            'success': function(data) {

            }
        });
        vidonme.rpc.request({
            'context': this,
            'method': 'VidOnMe.SetDefaultLanguageForScraper',
            'params': {
                "language": scraperLanguage
            },
            'success': function(data) {
                if (data && data.result) {
                    if (data.result.ret == true) {
                        window.setTimeout(function() {
                            mediaLibDiv.innerHTML = '';
							
                            vidonme.rpc.request({
                                'context': this,
                                'method': 'VidOnMe.GetSystemSettingForAll',
                                'params': [],
                                'success': function(data) {
                                    if (data && data.result && data.result.settings) {
                                        settingInfo = data.result.settings;
                                    }
                                }
                            });
                        }, 1000);
                    } else {
                        window.setTimeout(function() {
                            mediaLibDiv.innerHTML = "%210".toLocaleString();
                        }, 1000);
                    }
                }
            }
        });
    } else if (actionType == "transcoding") {
        reloadPage = true;
        var openTransCode = document.getElementById("checkboxOpenTranscode").checked;
        vidonme.rpc.request({
            'context': this,
            'method': 'VidOnMe.SetTranscodeOption',
            'params': {
                "config": openTransCode
            },
            'success': function(data) {
                if (data.result.ret) {
                    alert("%156".toLocaleString());
                    info(actionType);
                }
            }
        });    
    }else if(actionType =="trackSubtitle"){
		reloadPage = true;
        var track_launguage = document.getElementById("trackLaunguage").value;
        var subtitle_language = document.getElementById("subtitleLaunguage").value;
	}else if (actionType == "network") {
        reloadPage = true;
        var accountAccount = document.getElementById("webName").value;
        var accountPassword = document.getElementById("webPassword").value;
        var webonlyLocal = document.getElementById("WebonlyLocal").checked;
        var str = '';
        str = '{"webonlylocal":' + webonlyLocal + ',"webserver":true,"webserverpassword":"' + accountPassword + '","webserverusername":"' + accountAccount + '"}';
        
        vidonme.rpc.request({
            'context': this,
            'method': 'VidOnMe.SetSystemSetting',
            'params': {
                "key": "services.webserver",
                "val": str
            },
            'success': function(data) {
                var i = '';
            }
        });    
    }

    if (actionType != "mediaLibrary" && actionType != "transcoding") {
        alert("%156".toLocaleString());
        vidonme.rpc.request({
            'context': this,
            'method': 'VidOnMe.GetSystemSettingForAll',
            'params': [],
            'success': function(data) {
                if (data && data.result && data.result.settings) {
                    settingInfo = data.result.settings;
                }

                vidonme.rpc.request({
                    'context': this,
                    'method': 'VidOnMe.GetServerInfo',
                    'params': [],
                    'success': function(data1) {
                        if (data1 && data1.result) {
                            serverInfo = data1.result;
                            if (reloadPage != true) {
                                document.location.reload();
                            } else {
                                info(actionType);
                            }
                        
                        }
                    }
                });
            }
        });
    }
}

//服务器设置取消操作
function settingCancle(actionType) {
    if (actionType == "essentialInfo") {
        alert("%157".toLocaleString());
    } else if (actionType == "network") {
        alert("%158".toLocaleString());
    }
    info(actionType);
}

function getFilePath(p) {
    var add = $("#dialog-form");
    add.dialog({
        //	autoOpen: true,
        title: "%168".toLocaleString(),
        height: 315,
        width: 607,
        //draggable: false,
        position: 'center',
        modal: true
    });
    add.dialog("open");
    scanFilePath("");
}


//递归获取文件路径 
function scanFilePath(path1) {
    
    var add = $("#dialog-form");
    add.html('');
    add.append('<div class="path">');
    $(".path").append('<div class="srcpath"><input type="text" id="srcPath" class="" /></div>');
    $(".path").append('<ul  class="pathul">');
    //$(".path").append('<ul  id="wrapper" class="pathul">');
    vidonme.rpc.request({
        'context': this,
        'method': 'VidOnMe.GetDirectory',
        'params': {
            "mask": "/",
            "directory": path1
        },
        'success': function(data) {
            
            if (path1 != "") {
                var path = '';
                var strs = path1.split("\\");
                for (var i = 0; i < strs.length - 3; i++) {
                    path = path + strs[i] + "\\\\";
                }
                
                $(".path ul").append('<li class="back" onClick="scanFilePath(\'' + path + '\')">back</li>');
            
            }
            $.each($(data.result.filelist), jQuery.proxy(function(i, item) {
                var strs = item.path.split("\\");
                var str = strs[strs.length - 2].toString();
                var path = path1 + str + "\\\\";
                path = path.replace(/\\/g, '\\\\');
                
                var name = '';
                if (str.length > 50) {
                    name = str.substring(0, 50) + "......" + str.substring(str.length - 10, str.length)
                
                } else {
                    name = str;
                }
                
                $(".path ul").append('<li onClick="scanFilePath(\'' + path + '\')" title=' + str + '>' + name + '</li>');
            }, 
            this));
            
            path1 = path1.replace(/\\\\/g, '\\');
            //path2=path2.replace(/\\\\/g,'\\');
            document.getElementById("srcPath").value = path1;
            $(".path").append('<p class="btnp"> <a class="btn" onClick=setFilePath(\'' + "" + '\') ><span class="btnl">' + "%114".toLocaleString() + '</span><span class="btnr"></span></a><a class="btn" onClick=setFilePath(\'' + escape(path1) + '\')><span class="btnl">' + "%115".toLocaleString() + '</span><span class="btnr"></span></a></p>');
        
        }
    });
}

function setFilePath(filePath) {
    if (filePath != "") {
        filePath = unescape(filePath);
        document.getElementById("temporaryFilesPath").value = filePath;
    }
    
    $("#dialog-form").dialog("close");

}

function upgrade(download) {
	var selectLanguage = document.getElementById("selectLaunguage");
	if (selectLanguage != null) {
		for (var i = 0; i < selectLanguage.options.length; i++) {
		if (selectLanguage.options[i].selected == true){
				Language = selectLanguage.options[i].value;
				break;
			}
		}
	}
	rightInfo.html('');
    if (upgradeState == 1 && download != "true") {
        upgradeState = 0;
        rightInfo.html('');
        upgrade(false);
        return;
    }
    
    rightInfo.html('');
    rightInfo.append('<h3>' + "%178".toLocaleString() + '</h3><div style="float:left"><select class="form_select_short" id="autoUpdateSelect" onchange="updateChange()" ><option value="true">' + "%179".toLocaleString() + '</option><option value="false">' + "%180".toLocaleString() + '</option></select></div><div id="updateSet" style="float:left;margin-left:40px;">' + "%181".toLocaleString() + '<select class="form_select_short" id="autoUpdateWeekdaySelect" style="margin-left:20px;margin-right:20px;"><option value="0">' + "%182".toLocaleString() + '</option><option value="1">' + "%183".toLocaleString() + '</option><option value="2">' + "%184".toLocaleString() + '</option><option value="3">' + "%185".toLocaleString() + '</option><option value="4">' + "%186".toLocaleString() + '</option><option value="5">' + "%187".toLocaleString() + '</option><option value="6">' + "%188".toLocaleString() + '</option><option value="7">' + "%189".toLocaleString() + '</option></select>' + "%201".toLocaleString() + '<select class="form_select_short" id="autoUpdateDaytimeSelect" style="margin-left:20px;"><option value="0">0:00</option><option value="1">1:00</option><option value="2">2:00</option><option value="3">3:00</option><option value="4">4:00</option><option value="5">5:00</option><option value="6">6:00</option><option value="7">7:00</option><option value="8">8:00</option><option value="9">9:00</option><option value="10">10:00</option><option value="11">11:00</option><option value="12">12:00</option><option value="13">13:00</option><option value="14">14:00</option><option value="15">15:00</option><option value="16">16:00</option><option value="17">17:00</option><option value="18">18:00</option><option value="19">19:00</option><option value="20">20:00</option><option value="21">21:00</option><option value="22">22:00</option><option value="23">23:00</option></select></div><div  style="clear:both";></div><h3>' + "%190".toLocaleString() + '</h3>');
    rightInfo.append('<h4 id="version">' + genericName + ': V' + genericVersion + '</h4>');	
    var updateAutoId = document.getElementById("autoUpdateSelect");
    var updateWeekdayId = document.getElementById("autoUpdateWeekdaySelect");
    var updateDaytimeId = document.getElementById("autoUpdateDaytimeSelect");
    for (var i = 0; i < updateAutoId.options.length; i++) {
        if (updateAutoId.options[i].value == updateAuto) {
            updateAutoId.options[i].selected = true;
        }
    }
    
    for (var i = 0; i < updateWeekdayId.options.length; i++) {
        if (updateWeekdayId.options[i].value == updateWeekday) {
            updateWeekdayId.options[i].selected = true;
        }
    }
    
    for (var i = 0; i < updateDaytimeId.options.length; i++) {
        if (updateDaytimeId.options[i].value == updateDaytime) {
            updateDaytimeId.options[i].selected = true;
        }
    }
    
    updateChange();
    
    
    if (upgradeState == 0) {
        rightInfo.append('<div id="waitTips">' + "%191".toLocaleString() + '</div>').find(".form_select option:even").css("backgroundColor", "#151516");
        
        vidonme.rpc.request({
            'context': this,
            'method': 'VidOnMe.Upgrade_GetState',
            'params': [],
            'success': function(data1) {
                if (data1 && data1.result.state == "download") {
                    clearInterval(downloadTimer); //停止定时器
                    
                    upgradeState = 3;
                    upgrade(false);
                
                } 
                else if (data1 && data1.result.state == "downloadfin") {
                    upgradeState = 6;
                    upgrade(false);
                } else if (data1 && data1.result.state == "downloadfailed") {
                    upgradeState = 5;
                    upgrade();
                } 
                else if (data1 && data1.result.state == "checkversionfailed") {
                    upgradeState = 5;
                    upgrade(false);
                } 
                else if (data1 && data1.result.state == "install") {
                    upgradeState = 6;
                    upgrade(false);
                } else if (data1 && data1.result.state == "installfin") {
                    upgradeState = 7;
                    upgrade(false);
                } else if (data1 && data1.result.state == "installfailed") {
                    upgradeState = 5;
                    upgrade(false);
                } else if (data1 && data1.result.state == "checkversionfin") {
                    var waitTips = document.getElementById("waitTips");
                    clearInterval(downloadTimer); //停止定时器
                    if (data1.result.checkresult == "alreadynewversion") {
                        waitTips.innerHTML = '<div><p>' + "%192".toLocaleString() + '</p></div>';
                        upgradeState = 2;
                    } else {
                        data1.result.newversion = HandleVersion(data1.result.newversion);
                        data1.result.changes = data1.result.changes.replace(/\r\n/g, "<br//>");
                        genericNewVersion = data1.result.newversion;

                        waitTips.innerHTML = '<h4>' + "%193".toLocaleString() + genericNewVersion + '</h4><h4>' + data1.result.changes + '</h4><p><a class="renew" href="#" onclick=upgrade(\'' + "true" + '\') id="update"> ' + '</a></p><a class="btn" onClick="upgrade(\'' + "true" + '\')"> <span class="btnl">' + "%194".toLocaleString() + '</span><span class="btnr"></span></a>';
                        
                        upgradeState = 1;
                    }

                } else if (data1 && data1.result.state == "downloadcancel") {
                    upgradeState = 0;
                    upgrade();
                }
            }
        });
    } else if (upgradeState == 1) {
        rightInfo.append('<h4>' + "%193".toLocaleString() + '<span id="newVersion">' + genericNewVersion + '</span></h4><div id="updateMessage"><h4>' + "%195".toLocaleString() + '</h4><p><div id="updateProgressBar" style="float:left;margin-right:10px"><div id="updateProgressP"><div id="updateProgressC"></div></div></div><div id="msg" style="margin-top:2px"></div></p><h4>' + "%196".toLocaleString() + '</h4></div>').find(".form_select option:even").css("backgroundColor", "#151516");
        var updateDiv = document.getElementById("updateMessage");
        var progressDiv = document.getElementById("updateProgressBar");
        var pDiv = document.getElementById("updateProgressP");
        var cDiv = document.getElementById("updateProgressC");
        var msgDiv = document.getElementById("msg");
        var newVersion = document.getElementById("newVersion");
        pDiv.style.border = "1px solid #ffffff";
        cDiv.style.backgroundColor = '#00a0ff';
        pDiv.style.height = cDiv.style.height = 15 + "px";
        pDiv.style.width = pDiv.style.width = 400 + "px";
        cDiv.style.width = "0px";
        msgDiv.style.height = 20 + "px"
        commitUpdateInfo();
        
        vidonme.rpc.request({
            'context': this,
            'method': 'VidOnMe.Upgrade_Download',
            'params': [],
            'success': function(data) {
                if (data && data.result.ret == true) {
                    upgradeState = 3;
                    vidonme.rpc.request({
                        'context': this,
                        'method': 'VidOnMe.Upgrade_GetState',
                        'params': [],
                        'success': function(data1) {
                            data1.result.newversion = HandleVersion(data1.result.newversion);
                            
                            cDiv.style.width = parseInt(data1.result.progress) * 4 + "px";
                            msgDiv.innerHTML = parseInt(data1.result.progress) + "%";
                            newVersion.innerHTML = data1.result.newversion;
                        }
                    });
                    
                    downloadTimer = window.setInterval(function() {
                        vidonme.rpc.request({
                            'context': this,
                            'method': 'VidOnMe.Upgrade_GetState',
                            'params': [],
                            'success': function(data1) {
                                cDiv.style.width = parseInt(data1.result.progress) * 4 + "px";
                                msgDiv.innerHTML = parseInt(data1.result.progress) + "%";
						
                                data1.result.newversion = HandleVersion(data1.result.newversion);
                                newVersion.innerHTML = data1.result.newversion;

                                if (data1 && data1.result.state == "downloadfin") {
                                    updateDiv.innerHTML = "%197".toLocaleString();
                                    clearInterval(downloadTimer); //停止定时器
                                    upgradeState = 4;
                                    vidonme.rpc.request({
                                        'context': this,
                                        'method': 'VidOnMe.Upgrade_Install',
                                        'params': [],
                                        'success': function(data) {
                                            if (data && data.result.ret == true) {
                                                upgradeState == 6;
                                                upgrade(false);
                                            
                                            }
                                        }
                                    });
                                }
                                if (data1 && data1.result.state == "downloadfailed") {
                                    clearInterval(downloadTimer); //停止定时器
                                    upgradeState = 5;
                                    updateDiv.innerHTML = "%199".toLocaleString() + "<h4>" + "%200".toLocaleString() + "</h4><h4><a href='http://www.vidon.me/download/VidOnServer.exe'>http://www.vidon.me/download/VidOnServer.exe</h4></a>";
                                }
                            }
                        });
                    }, 2000);
                } else {
                    upgradeState = 5;
                    updateDiv.innerHTML = "%199".toLocaleString() + "<h4>" + "%200".toLocaleString() + "</h4><h4><a href='http://www.vidon.me/download/VidOnServer.exe'>http://www.vidon.me/download/VidOnServer.exe</h4></a>";
                
                }
            }
        });
    } else if (upgradeState == 2) {
        rightInfo.append('<div><p>' + "%192".toLocaleString() + '</p></div>').find(".form_select option:even").css("backgroundColor", "#151516");
    } else if (upgradeState == 3) {
        clearInterval(downloadTimer); //停止定时器
        rightInfo.append('<h4>' + "%193".toLocaleString() + '<span id="newVersion"></span></h4><div id="updateMessage"><h4>' + "%195".toLocaleString() + '</h4><p><div id="updateProgressBar" style="float:left;margin-right:10px"><div id="updateProgressP"><div id="updateProgressC"></div></div></div><div id="msg" style="margin-top:2px"></div></p><h4>' + "%196".toLocaleString() + '</h4></div>').find(".form_select option:even").css("backgroundColor", "#151516");
        var updateDiv = document.getElementById("updateMessage");
        var progressDiv = document.getElementById("updateProgressBar");
        var pDiv = document.getElementById("updateProgressP");
        var cDiv = document.getElementById("updateProgressC");
        var msgDiv = document.getElementById("msg");
        var newVersion = document.getElementById("newVersion");
        pDiv.style.border = "1px solid #ffffff";
        cDiv.style.backgroundColor = '#00a0ff';
        pDiv.style.height = cDiv.style.height = 15 + "px";
        pDiv.style.width = pDiv.style.width = 400 + "px";
        cDiv.style.width = "0px";
        msgDiv.style.height = 20 + "px";
        
        vidonme.rpc.request({
            'context': this,
            'method': 'VidOnMe.Upgrade_GetState',
            'params': [],
            'success': function(data1) {
                cDiv.style.width = parseInt(data1.result.progress) * 4 + "px";
                msgDiv.innerHTML = parseInt(data1.result.progress) + "%";

                data1.result.newversion = HandleVersion(data1.result.newversion);
                newVersion.innerHTML = data1.result.newversion;
            }
        });
        
        downloadTimer = window.setInterval(function() {
            
            vidonme.rpc.request({
                'context': this,
                'method': 'VidOnMe.Upgrade_GetState',
                'params': [],
                'success': function(data1) {
                    
                    if (data1 && data1.result.state == "downloadcancel") {
                        clearInterval(downloadTimer); //停止定时器
                        upgradeState = 0;
                        updateDiv.innerHTML = "";
                        return;
                    }
                    
                    cDiv.style.width = parseInt(data1.result.progress) * 4 + "px";
                    msgDiv.innerHTML = parseInt(data1.result.progress) + "%";
                    if (data1 && data1.result.state == "downloadfin") {
                        clearInterval(downloadTimer); //停止定时器
                        upgradeState = 4;
                        vidonme.rpc.request({
                            'context': this,
                            'method': 'VidOnMe.Upgrade_Install',
                            'params': [],
                            'success': function(data) {
                                if (data && data.result.ret == true) {
                                    upgradeState == 6;
                                    upgrade(false);
                                } 
                            }
                        });
                    }
                    if (data1 && data1.result.state == "downloadfailed") {
                        clearInterval(downloadTimer); //停止定时器
                        upgradeState = 5;
                        updateDiv.innerHTML = "%199".toLocaleString() + "<h4>" + "%200".toLocaleString() + "</h4><h4><a href='http://www.vidon.me/download/VidOnServer.exe'>http://www.vidon.me/download/VidOnServer.exe</h4></a>";
                    }
                }
            });
        
        }, 2000);
    } else if (upgradeState == 4 || upgradeState == 6) {
        rightInfo.append('<div id="updateMessage"><h4>' + "%195".toLocaleString() + '</h4><p><div id="updateProgressBar" style="float:left;margin-right:10px"><div id="updateProgressP"><div id="updateProgressC"></div></div></div><div id="msg" style="margin-top:2px"></div></p><h4>' + "%196".toLocaleString() + '</h4></div>').find(".form_select option:even").css("backgroundColor", "#151516");
        var updateDiv = document.getElementById("updateMessage");
        var versionDiv = document.getElementById("version");
        updateDiv.innerHTML = "%197".toLocaleString();
        //		 clearInterval(downloadTimer); //停止定时器
        downloadTimer = window.setInterval(function() {
            vidonme.rpc.request({
                'context': this,
                'method': 'VidOnMe.Upgrade_GetState',
                'params': [],
                'success': function(data1) {
                    if (data1 && data1.result.state == "installfin" || data1.result.state == "checkversionfin") {
                        clearInterval(downloadTimer); //停止定时器
                        versionDiv.innerHTML = genericName + ": V" + data1.result.currversion;
                        updateDiv.innerHTML = "%198".toLocaleString();
                        upgradeState = 7;
                    
                    }
                    
                    if (data1 && data1.result.state == "installfailed") {
                        clearInterval(downloadTimer); //停止定时器
                        updateDiv.innerHTML = "%199".toLocaleString() + "<h4>" + "%200".toLocaleString() + "</h4><h4><a href='http://www.vidon.me/download/VidOnServer.exe'>http://www.vidon.me/download/VidOnServer.exe</h4></a>";
                        upgradeState = 5;
                    
                    }
                }
            });
        }, 30000);
    } else if (upgradeState == 5) {
        rightInfo.append("%199".toLocaleString() + "<h4>" + "%200".toLocaleString() + "</h4><h4><a href='http://www.vidon.me/download/VidOnServer.exe'>http://www.vidon.me/download/VidOnServer.exe</h4></a>").find(".form_select option:even").css("backgroundColor", "#151516");
    
    } else if (upgradeState == 7) {
        rightInfo.append('<div>' + "%198".toLocaleString() + '</div>').find(".form_select option:even").css("backgroundColor", "#151516");
    }
}

function commitUpdateInfo() {
    try {
        if (hasCommitUpdate == false) {
            var updateAuto = document.getElementById("autoUpdateSelect").value;
            var updateWeekday1 = document.getElementById("autoUpdateWeekdaySelect").value;
            var updateDaytime = document.getElementById("autoUpdateDaytimeSelect").value;
            
            
            vidonme.rpc.request({
                'context': this,
                'method': 'VidOnMe.SetSystemSetting',
                'params': {
                    "key": "generic.autoupgrade",
                    "val": updateAuto
                },
                'success': function(data) {
                }
            });
            vidonme.rpc.request({
                'context': this,
                'method': 'VidOnMe.SetSystemSetting',
                'params': {
                    "key": "generic.daytime",
                    "val": updateDaytime
                },
                'success': function(data) {
                }
            });
            vidonme.rpc.request({
                'context': this,
                'method': 'VidOnMe.SetSystemSetting',
                'params': {
                    "key": "generic.weekday",
                    "val": updateWeekday1
                },
                'success': function(data) {
                }
            });
			
            hasCommitUpdate = true;
            
            vidonme.rpc.request({
                'context': this,
                'method': 'VidOnMe.GetSystemSettingForAll',
                'params': [],
                'success': function(data) {
                    if (data && data.result && data.result.settings) {
                        settingInfo = data.result.settings;
                    }
                }
            });
        
        }
    } catch (err) {
    }
}

function updateChange() {
    var updateAuto = document.getElementById("autoUpdateSelect").value;
    if (updateAuto == "false") {
        document.getElementById("updateSet").style.display = "none";
    
    } else {
        document.getElementById("updateSet").style.display = "";
    }
}

function showTable(tableDiv){
	 var tables = '<h3>' + "%126".toLocaleString() + '</h3><p class="info">' + "%127".toLocaleString() + '</p><table ><tr class="tr1"> <td class="tr1 td1">' + "%202".toLocaleString() + '</td><td class="tr1 td2">' + "%203".toLocaleString() + '</td><td class="tr1 td3">' + "%204".toLocaleString() + '</td></tr>';
	 vidonme.rpc.request({
            'context': this,
            'method': 'VidOnMe.GetAllClients',
            'params': [],
            'success': function(data) {
                
                if (data && data.result && data.result.ret) {
                   
                    $.each($(data.result.clientlist), jQuery.proxy(function(i, item) {
                        var name = item.clientname;
                        var ip = item.clientip;
                        var state = item.state;
                        var file = '';
                        if (state == "connected") {
                            file = "%208".toLocaleString();
                        } else {
                            file = item.playvideo;
                            if (file.length > 50) {
                                file = file.substring(0, 50) + "...";
                            }
                            file = "%205".toLocaleString() + file;
                        }
                        name = unescape(name);
                        
                        if (name.length > 30) {
                            name = name.substring(0, 30) + "...";
                        }
                        
                        tables = tables + '<tr class="tr2"> <td class="tr2 td1">' + name + '</td> <td class="tr2 td2">' + ip + '</td> <td class="tr2 td3">' + file + '</td></tr>';
                    
                    }, 
                    this));                       
				  // tableDiv.innerHTML = tables+ '</table>';      
                }else{
					// tableDiv.innerHTML = '';
				}
				
                tableDiv.innerHTML = tables+ '</table>';
            }
        });
}

function saveServerName(language, modify) {
	var name = $('#servname').attr('value');

	$('#servname').focus();
	
	if (name == '') {
//		if (language == "Chinese (Simple)") {
//			name = "威动服务器";
//		} else if ( language == "Chinese (Traditional)") {
//			name = "威動伺服器";
//		} else {
//			name = "VidOn Server";
//		}
	
		name = genericName;
		$('#servname').attr('value', name);
	} else {
		genericName = name;
	}
	
	vidonme.rpc.request({
		'context': this,
		'method': 'VidOnMe.SetServerName',
		'params': {
			"name": name
		},
		'success': function(data) {
			alert("%156".toLocaleString());
		}
	});
}

var settingInfo = ''; //设置信息
var serverInfo = ''; //服务器参数
var rightInfo = $('<div></div>');
rightInfo.addClass('main');
var timer = ''; //定时器
var downloadTimer = '';
var genericVersion = ''; //服务器名称、服务器版本
var genericNewVersion = '';
var updateAuto = '', updateWeekday = '', updateDaytime = '';
var hasCommitUpdate = true;
var upgradeState = 0; //0未检查更新 1 有新版本  2没有新版本  3正在下载新版本 4 下载成功 5 下载失败、安装失败  6 正在安装 7安装成功 8取消升级 
var Language = '';
var genericName = '';
