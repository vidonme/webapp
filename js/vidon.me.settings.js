/**
 * Created by junwei.zhao on 2015/4/20.
 */
var SettingService = function() {
    this.init();
    return true;
};

var eSettingType = {
    serverState: "serverState",
    essentialInfo: "essentialInfo",
    mediaLibrary: "mediaLibrary",
    transcoding: "transcoding",
    update: "update"
};

function HandleVersion(versionIn) {
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
        $("#btnSetting").click(jQuery.proxy(this.serverSettingOpen, this));
        $("#btnSaveState").click(function() {
            saveServerName();
        });
        $("#btnSaveEssentialInfo").click(function() {
            settingSave(eSettingType.essentialInfo);
        });
        $("#btnSaveMediaLibrary").click(function() {
            settingSave(eSettingType.mediaLibrary);
        });
        $("#btnSaveTranscode").click(function() {
            settingSave(eSettingType.transcoding);
        });
        $("#btnSaveMediaLibrary").click(function() {
            settingSave(eSettingType.mediaLibrary);
        });

        $("#btnSaveAutoUpgrade").click(function() {
            saveUpdateInfo();
        });
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
        $('.contentContainer').hide();
        var libraryContainer = '';

        vidonme.rpc.request({
            'context': this,
            'method': 'VidOnMe.GetSystemSettingForAll',
            'params': [],
            'success': function(data) {

                if (data && data.result && data.result.settings) {

                    settingInfo = data.result.settings;

                    vidonme.rpc.request({
                        'context': this,
                        'method': 'VidOnMe.GetServerName',
                        'params': [],
                        'success': function(data) {
                            if (data && data.result.ret) {
                                genericName = data.result.name;
                                // info(eSettingType.serverState)
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
                                info(eSettingType.serverState);
                                info(eSettingType.essentialInfo);
                                info(eSettingType.mediaLibrary);
                                info(eSettingType.transcoding);
                                info(eSettingType.update);
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

    //  serverName = '',
    language1 = '', //WEB语言
        genericAutoStart = '', //是否开机自动启动
        discoveryBonjour = '', //本助协议
        discoveryDns = '', //DNS
        // webServicePort = '',  //web端口号
        accountAccount = '', //Web管理登陆用户名
        accountPassword = '', //Web管理登陆密码
        webServer = '',
        dlna = '',
        libAutoUpdate = '',
        libAutoUpdateTimeSpan = '',
        servicesWebonlyLocal = '',
        cupMaxUsage = '',
        tempFilePath = '',
        defaultScraperLanguage = '',
        defaultSubtitleShowMode = '',
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

    //genericName = serverInfo.serverName;
    serverIp = serverInfo.serverip;
    genericVersion = HandleVersion(serverInfo.srvversion);

    $('#server_setting').append(rightInfo);
    if (infoType == eSettingType.serverState) {

        $("#txtServerName").val(genericName.toLocaleString());
        $("#lblServerIP").html(serverIp);
        $("#lblServerVersion").html(genericVersion);
        showTable();

        timer = window.setInterval(function() {
            showTable(tableDiv);
        }, 6000);

    } else if (infoType == eSettingType.essentialInfo) {
        clearInterval(timer); //停止定时器

        var liArray = $("#ulWebLanguage li");
        var defaultLanguage = liArray["0"].getAttribute("cus_value"); //liArray["0"].attributes["0"].value;
        //设置一个默认值
        $("#selectWebLanguage").attr("cus_value", defaultLanguage);
        $("#selectWebLanguage").html(liArray[0].val);
        for (var i = 0; i < liArray.length; i++) {
            if ((liArray[i] == "English" && language1 == "") || liArray[i] == language1) {
                $("#selectWebLanguage").attr("cus_value", language1);
                $("#selectWebLanguage").html(liArray[i].val);
            }
        }

        if (genericAutoStart == "true") {
            $("#autostart span:first").addClass("checkbox selected");
        } else {
            $("#autostart span:first").addClass("checkbox");
        }
        if (servicesWebonlyLocal == true) {
            $("#onlyloaclhost span:first").addClass("checkbox selected");
        } else {
            $("#onlyloaclhost span:first").addClass("checkbox");
        }
    } else if (infoType == "trackSubtitle") {
        //音轨字幕语言设置
        clearInterval(timer); //停止定时器

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

        if (servicesWebonlyLocal == true) {
            document.getElementById("WebonlyLocal").checked = true;
        }

    } else if (infoType == eSettingType.update) {
        initUpdateParam();
    } else if (infoType == eSettingType.transcoding) {
        clearInterval(timer);

        vidonme.rpc.request({
            'context': this,
            'method': 'VidOnMe.CheckTranscodeOption',
            'params': [],
            'success': function(data) {
                if (data && data.result) {
                    var support = data.result.hardCodecSupport;

                    if (support == true) {
                        $("#hardCodecSupport").addClass("able");
                    } else {
                        $("#hardCodecSupport").addClass("disable");
                    }
                }
            }
        });
    } else if (infoType == eSettingType.mediaLibrary) {
        clearInterval(timer); //停止定时器

        var liArray = $("#ulUpdateFrequency li");
        $("#updateFrequency").innerText = "";
        for (var i = 0; i < liArray.length; i++) {
            if (liArray[i].getAttribute("cus_value") == libAutoUpdateTimeSpan) {
                $("#updateFrequency").attr("cus_value", liArray[i].getAttribute("cus_value"));
                $("#updateFrequency b").html(liArray[i].innerText);
            }
        }

        liArray = $("#ulSubLanguage li");
        $("#subLanguage").innerText = "";
        for (var i = 0; i < liArray.length; i++) {
            if (liArray[i].getAttribute("cus_value") == defaultScraperLanguage) {
                $("#subLanguage").attr("cus_value", liArray[i].getAttribute("cus_value"));
                $("#subLanguage b").html(liArray[i].innerText);
            }
        }
    }
}

//服务器设置保存信息
function settingSave(actionType) {
    var reloadPage = '';
    if (actionType == "essentialInfo") {

        var autoStart = $("#autostart span:first").hasClass("checkbox selected");
        //var index = languageId.selectedIndex;

        var language = $("#selectWebLanguage").attr("cus_value");
        //      if (genericName == '') {
        //          if (language == "Chinese (Simple)") {
        //              genericName = "威动服务器";
        //          } else if ( language == "Chinese (Traditional)") {
        //              genericName = "威動伺服器";
        //          } else {
        //              genericName = "VidOn Server";
        //          }
        //      }

        var webonlyLocal = $("#onlyloaclhost span:first").hasClass("checkbox selected");
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
                var str = '';
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
    } else if (actionType == eSettingType.mediaLibrary) {
        reloadPage = true;
        var libUpdateTime = $("#updateFrequency").attr("cus_value");
        var scraperLanguage = $("#subLanguage").attr("cus_value");

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
                            //   mediaLibDiv.innerHTML = "%210".toLocaleString();
                            alert("time out")
                        }, 1000);
                    }
                }
            }
        });
    } else if (actionType == eSettingType.transcoding) {
        reloadPage = true;
        var openTransCode = $("#opendecoding").hasClass("checkbox selected");
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
    } else if (actionType == "trackSubtitle") {
        reloadPage = true;
        var track_launguage = document.getElementById("trackLaunguage").value;
        var subtitle_language = document.getElementById("subtitleLaunguage").value;
    } else if (actionType == "network") {
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
        //  autoOpen: true,
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

                },
                this));

            path1 = path1.replace(/\\\\/g, '\\');
            //path2=path2.replace(/\\\\/g,'\\');
            document.getElementById("srcPath").value = path1;

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
    var selectLanguage = document.getElementById("selectWebLanguage");
    if (selectLanguage != null) {
        for (var i = 0; i < selectLanguage.options.length; i++) {
            if (selectLanguage.options[i].selected == true) {
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
        vidonme.rpc.request({
            'context': this,
            'method': 'VidOnMe.Upgrade_GetState',
            'params': [],
            'success': function(data1) {
                if (data1 && data1.result.state == "download") {
                    clearInterval(downloadTimer); //停止定时器

                    upgradeState = 3;
                    upgrade(false);

                } else if (data1 && data1.result.state == "downloadfin") {
                    upgradeState = 6;
                    upgrade(false);
                } else if (data1 && data1.result.state == "downloadfailed") {
                    upgradeState = 5;
                    upgrade();
                } else if (data1 && data1.result.state == "checkversionfailed") {
                    upgradeState = 5;
                    upgrade(false);
                } else if (data1 && data1.result.state == "install") {
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

                        upgradeState = 1;
                    }

                } else if (data1 && data1.result.state == "downloadcancel") {
                    upgradeState = 0;
                    upgrade();
                }
            }
        });
    } else if (upgradeState == 1) {
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
                                }
                            }
                        });
                    }, 2000);
                } else {
                    upgradeState = 5;

                }
            }
        });
    } else if (upgradeState == 2) {} else if (upgradeState == 3) {
        clearInterval(downloadTimer); //停止定时器
        var updateDiv = document.getElementById("updateMessage");
        var progressDiv = document.getElementById("updateProgressBar");
        var pDiv = document.getElementById("updateProgressP");
        var cDiv = document.getElementById("updateProgressC");
        var msgDiv = document.getElementById("msg");
        var newVersion = document.getElementById("newVersion");

        vidonme.rpc.request({
            'context': this,
            'method': 'VidOnMe.Upgrade_GetState',
            'params': [],
            'success': function(data1) {

                data1.result.newversion = HandleVersion(data1.result.newversion);
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
                        //                  updateDiv.innerHTML = "";
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
                    }
                }
            });

        }, 2000);
    } else if (upgradeState == 4 || upgradeState == 6) {
        var updateDiv = document.getElementById("updateMessage");
        var versionDiv = document.getElementById("version");
        downloadTimer = window.setInterval(function() {
            vidonme.rpc.request({
                'context': this,
                'method': 'VidOnMe.Upgrade_GetState',
                'params': [],
                'success': function(data1) {
                    if (data1 && data1.result.state == "installfin" || data1.result.state == "checkversionfin") {
                        clearInterval(downloadTimer); //停止定时器
                        //                    versionDiv.innerHTML = genericName + ": V" + data1.result.currversion;
                        //                    updateDiv.innerHTML = "%198".toLocaleString();
                        upgradeState = 7;

                    }

                    if (data1 && data1.result.state == "installfailed") {
                        clearInterval(downloadTimer); //停止定时器
                        upgradeState = 5;

                    }
                }
            });
        }, 30000);
    } else if (upgradeState == 5) {

    } else if (upgradeState == 7) {}
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
                'success': function(data) {}
            });
            vidonme.rpc.request({
                'context': this,
                'method': 'VidOnMe.SetSystemSetting',
                'params': {
                    "key": "generic.daytime",
                    "val": updateDaytime
                },
                'success': function(data) {}
            });
            vidonme.rpc.request({
                'context': this,
                'method': 'VidOnMe.SetSystemSetting',
                'params': {
                    "key": "generic.weekday",
                    "val": updateWeekday1
                },
                'success': function(data) {}
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
    } catch (err) {}
}

function updateChange() {
    var updateAuto = document.getElementById("autoUpdateSelect").value;
    if (updateAuto == "false") {
        document.getElementById("updateSet").style.display = "none";

    } else {
        document.getElementById("updateSet").style.display = "";
    }
}

function showTable() {
    $("#tblClienlist tr:gt(0)").remove(); //清除表格内容
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
                        name = unescape(name);
                        if (name.length > 30) {
                            name = name.substring(0, 30) + "...";
                        }
                        var newRow = "<tr><td class='col1'>" + name + "</td><td class='col1'>" + ip + "</td><td>" + state + "</td></tr>";
                        $("#tblClienlist tr:last").after(newRow);
                    },
                    this));
            } else {
                //没有客户端连接
            }
        }
    });
}

function saveServerName() {
    var name = $("#txtServerName").val();
    $('#txtServerName').focus();

    if (name == '') {
        if (this.language == "Chinese (Simple)") {
            name = "威动服务器";
        } else if (language == "Chinese (Traditional)") {
            name = "威動伺服器";
        } else {
            name = "VidOn Server";
        }

        name = genericName;
        $('#txtServerName').attr('value', name);
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
            if (data.result.ret) {
                alert("%156".toLocaleString());
            } else {
                alert("Save faild".toLocaleString());
            }

        }
    });
}


function showUpgradeStatus(status) {
    $("#versionNew").attr("style", "display:none");
    $("#versionFindNew").attr("style", "display:none");
    $("#versionDown").attr("style", "display:none");
    $("#versionDownFail").attr("style", "display:none");
    $("#versionInstall").attr("style", "display:none");

    if (upgradeState == 0) {

    } else if (upgradeState == 1) {
        // have new version
        /*
        data1.result.newversion = HandleVersion(data1.result.newversion);
        data1.result.changes = data1.result.changes.replace(/\r\n/g, "<br//>");
        genericNewVersion = data1.result.newversion;

        <p><span trans_value="index_149">威动服务器: </span><span>v2.0.0.1稳定版</span></p>
        <p><span trans_value="index_143">发现新版本:</span><span>v3.0.0.1</span></p>
        <ul id="">
          <li>修改中文环境下升级失败问题</li>
          <li>修复下载资源到移动端失败问题</li>
        </ul>
        */
        $("#versionFindNew #curVersion").text(genericVersion);
        $("#versionFindNew #newVersion").text(genericNewVersion);
        showdiv("#versionFindNew");
    } else if (upgradeState == 2) {
        //already latest version
        /*
        <div  class="versionnew" id="versionNew" style="display:none">
        <p><span trans_value="index_149">威动服务器: </span><span>v2.0.0.1稳定版</span></p>
        <p  trans_value="index_142">当前已是最新版</p>
        </div>
        */

        $("#versionNew #curVersion").text(genericVersion);
        showdiv("#versionNew");
    } else if (upgradeState == 3) {
        //downloading
        /*
        cDiv.style.width = parseInt(data1.result.progress) * 4 + "px";
        msgDiv.innerHTML = parseInt(data1.result.progress) + "%";

        data1.result.newversion = HandleVersion(data1.result.newversion);
        newVersion.innerHTML = data1.result.newversion;


        <div  class="versiondown" id="versionDown"  style="display:none">
          <p><span trans_value="index_149">威动服务器: </span><span>v2.0.0.1稳定版</span></p>
          <p><span trans_value="index_143">发现新版本:</span><span>v3.0.0.1</span></p>
          <div class="progreessbarblock">
            <p  trans_value="index_145">正在下载</p>
            <div class="progress">
              <div class="progress-bar" style="width:40%"></div>
            </div>
            <P>40%</p>
          </div>
          <div class="clr"></div>
          <p trans_value="index_146">升级中请不要退出程序</p>
        </div>
        */

        $("#versionDown #curVersion").text(genericVersion);
        $("#versionDown #newVersion").text(genericNewVersion);
        $("#versionDown .progress-bar").attr("style", "width:" + downloadProcess + "%");
        $("#versionDown #percent").text(downloadProcess + "%");

        showdiv("#versionDown");
    } else if (upgradeState == 4) {
        // download finish

    } else if (upgradeState == 5) {
        // download failed
        $("#versionDownFail #curVersion").text(genericVersion);
        $("#versionDownFail #newVersion").text(genericNewVersion);
        showdiv("#versionDownFail");
    } else if (upgradeState == 6) {
        // installing

        $("#versionInstall #curVersion").text(genericVersion);
        $("#versionInstall #newVersion").text(genericNewVersion);
        showdiv("#versionInstall");
    } else if (upgradeState == 7) {
        // install finish
    } else if (upgradeState == 8) {
        // cancel
        $("#versionDownFail #curVersion").text(genericVersion);
        $("#versionDownFail #newVersion").text(genericNewVersion);
        showdiv("#versionDownFail");
    } else if (upgradeState == 9) {
        // install failed
        $("#versionDownFail #curVersion").text(genericVersion);
        $("#versionDownFail #newVersion").text(genericNewVersion);
        showdiv("#versionDownFail");
    } else {

    }

}

function initUpdateParam() {
    if (updateAuto == "true") {
        $(".autoupgrade").removeClass("disable");
        $(".autoupgrade .dropdown").removeClass("disable");

        $("#upgradeDate a").attr("cus_value", 0);
        $("#upgradeDate a b").html($.i18n.prop('index_96'));

        $("#upgradeDate ul li").each(function() {
            var _this = $(this);
            var cusValue = $(this).attr("cus_value");
            var str = $(this).html();
            if (cusValue == updateWeekday) {
                $("#upgradeDate a").attr("cus_value", cusValue);
                $("#upgradeDate a b").html(str);
            }
        });

        $("#upgradeTime a").attr("cus_value", 0);
        $("#upgradeTime a b").html($.i18n.prop('index_96'));

        $("#upgradeTime ul li").each(function() {
            var _this = $(this);
            var cusValue = $(this).attr("cus_value");
            var str = $(this).html();
            if (cusValue == updateDaytime) {
                $("#upgradeTime a").attr("cus_value", cusValue);
                $("#upgradeTime a b").html(str);
            }
        });
    } else {
        $(".autoupgrade").addClass("disable");
        $(".autoupgrade .dropdown").addClass("disable");
    }
}

function saveUpdateInfo() {
    try {
        var updateAuto = $("#autoUpdate span:first").hasClass("checkbox selected");
        var updateWeekday1 = $("#upgradeDate a").attr("cus_value");
        var updateDaytime = $("#upgradeTime a").attr("cus_value");

        vidonme.rpc.request({
            'context': this,
            'method': 'VidOnMe.SetSystemSetting',
            'params': {
                "key": "generic.autoupgrade",
                "val": updateAuto
            },
            'success': function(data) {}
        });
        vidonme.rpc.request({
            'context': this,
            'method': 'VidOnMe.SetSystemSetting',
            'params': {
                "key": "generic.daytime",
                "val": updateDaytime
            },
            'success': function(data) {}
        });
        vidonme.rpc.request({
            'context': this,
            'method': 'VidOnMe.SetSystemSetting',
            'params': {
                "key": "generic.weekday",
                "val": updateWeekday1
            },
            'success': function(data) {}
        });
    } catch (err) {}
}

function startUpgrade(download) {
    if (upgradeState == 1 && download != "true") {
        upgradeState = 0;
        rightInfo.html('');
        upgrade(false);
        return;
    }

    if (upgradeState == 0) {
        vidonme.rpc.request({
            'context': this,
            'method': 'VidOnMe.Upgrade_GetState',
            'params': [],
            'success': function(data1) {
                if (data1 && data1.result.state == "download") {
                    clearInterval(downloadTimer); //停止定时器

                    upgradeState = 3;
                    upgrade(false);

                } else if (data1 && data1.result.state == "downloadfin") {
                    upgradeState = 6;
                    upgrade(false);
                } else if (data1 && data1.result.state == "downloadfailed") {
                    upgradeState = 5;
                    upgrade();
                } else if (data1 && data1.result.state == "checkversionfailed") {
                    upgradeState = 5;
                    upgrade(false);
                } else if (data1 && data1.result.state == "install") {
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
                        upgradeState = 2;
                        showUpgradeStatus();
                    } else {
                        upgradeState = 1;
                        showUpgradeStatus();
                    }

                } else if (data1 && data1.result.state == "downloadcancel") {
                    upgradeState = 8;
                    showUpgradeStatus();
                }
            }
        });
    } else if (upgradeState == 1) {
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

                        }
                    });

                    downloadTimer = window.setInterval(function() {
                        vidonme.rpc.request({
                            'context': this,
                            'method': 'VidOnMe.Upgrade_GetState',
                            'params': [],
                            'success': function(data1) {
                                showUpgradeStatus(1);

                                if (data1 && data1.result.state == "downloadfin") {
                                    clearInterval(downloadTimer); //停止定时器
                                    upgradeState = 4;
                                    showUpgradeStatus();

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
                                    showUpgradeStatus();
                                }
                            }
                        });
                    }, 2000);
                } else {
                    upgradeState = 5;
                    showUpgradeStatus();
                }
            }
        });
    } else if (upgradeState == 2) {
        showUpgradeStatus();
    } else if (upgradeState == 3) {
        clearInterval(downloadTimer); //停止定时器
        showUpgradeStatus();

        vidonme.rpc.request({
            'context': this,
            'method': 'VidOnMe.Upgrade_GetState',
            'params': [],
            'success': function(data1) {

                genericNewVersion = HandleVersion(data1.result.newversion);
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
                        upgradeState = 8;
                        showUpgradeStatus();
                        return;
                    }

                    downloadProcess = parseInt(data1.result.progress);

                    if (data1 && data1.result.state == "downloadfin") {
                        clearInterval(downloadTimer); //停止定时器
                        upgradeState = 4;
                        showUpgradeStatus();
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
                        showUpgradeStatus();
                    }
                }
            });

        }, 2000);
    } else if (upgradeState == 4 || upgradeState == 6) {
        showUpgradeStatus();
        downloadTimer = window.setInterval(function() {
            vidonme.rpc.request({
                'context': this,
                'method': 'VidOnMe.Upgrade_GetState',
                'params': [],
                'success': function(data1) {
                    if (data1 && data1.result.state == "installfin" || data1.result.state == "checkversionfin") {
                        clearInterval(downloadTimer); //停止定时器
                        upgradeState = 7;
                        showUpgradeStatus();
                    }

                    if (data1 && data1.result.state == "installfailed") {
                        clearInterval(downloadTimer); //停止定时器
                        upgradeState = 9;
                        showUpgradeStatus();
                    }
                }
            });
        }, 30000);
    } else if (upgradeState == 5) {
        showUpgradeStatus();

    } else if (upgradeState == 7) {
        showUpgradeStatus();
    }
}

function showSettingPage(pageIndex) {
    if (pageIndex == 0) {

    } else if (pageIndex == 1) {

    } else if (pageIndex == 2) {

    } else if (pageIndex == 3) {

    } else if (pageIndex == 4) {
        startUpgrade();
        showUpgradeStatus();
    }
}

var settingInfo = ''; //设置信息
var serverInfo = ''; //服务器参数
var rightInfo = $('<div></div>');
rightInfo.addClass('main');
var timer = ''; //定时器
var downloadTimer = '';
var genericVersion = '1234'; //服务器名称、服务器版本
var genericNewVersion = '4567';
var updateAuto = '',
    updateWeekday = '',
    updateDaytime = '';
var hasCommitUpdate = true;
var upgradeState = 0; //0未检查更新 1 有新版本  2没有新版本  3正在下载新版本 4 下载成功 5 下载失败  6 正在安装 7安装成功 8取消升级 9 安装失败
var Language = '';
var genericName = '';
var downloadProcess = 60;