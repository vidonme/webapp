function getBrowserInfo()
{
	var agent = navigator.userAgent.toLowerCase() ;
	
	var regStr_ie = /msie [\d.]+;/gi ;
	var regStr_ff = /firefox\/[\d.]+/gi
	var regStr_chrome = /chrome\/[\d.]+/gi ;
	var regStr_saf = /safari\/[\d.]+/gi ;
	//IE
	if(agent.indexOf("msie") > 0)
	{
		return agent.match(regStr_ie) ;
	}
	
	//firefox
	if(agent.indexOf("firefox") > 0)
	{
		return agent.match(regStr_ff) ;
	}
	
	//Chrome
	if(agent.indexOf("chrome") > 0)
	{
		return agent.match(regStr_chrome) ;
	}
	
	//Safari
	if(agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0)
	{
		return agent.match(regStr_saf) ;
	}
	
    return ["unknown"];
}

(function (document) {
    "use strict";
    var browserinfo = getBrowserInfo() + "";
    var i,
        script,
        debug = false, /* Set to true to disable cached javascript */
        version = (debug ? Math.random() : '2.1.0'),
        scripts;
    if (browserinfo.match("msie"))
        scripts = [
			"js/jquery-1.8.2.min.js",
			"js/json2.js",
			"js/jquery-ui.js",
			//    "js/iscroll.js",
			"js/vidon.me.core.js",
			"js/vidon.me.rpc.js",
			"js/vidon.me.utils.js",
			"js/MediaLibrary.js",
			"js/SettingService.js",
			"js/AppsDownload.js",
			"js/BackupMedia.js",
			"js/promotion.js",
			"js/UserCenter.js",
			"js/vidon.me.init.js",
			//    "js/NowPlayingManager.js",
			"js/localizations.js",
			"js/jquery.md5.js"
        ];
    else
        scripts = [
			"js/jquery-1.8.2.min.js",
			"js/json2.js",
			"js/jquery-ui.js",
			"js/iscroll-min.js",
			//    "js/iscroll.js",
			"js/vidon.me.core.js",
			"js/vidon.me.rpc.js",
			"js/vidon.me.utils.js",
			"js/MediaLibrary.js",
			"js/SettingService.js",
			"js/AppsDownload.js",
			"js/BackupMedia.js",
			"js/promotion.js",
			"js/UserCenter.js",
			"js/vidon.me.init.js",
			//    "js/NowPlayingManager.js",
			"js/localizations.js",
			"js/jquery.md5.js"
        ];

    for (i = 0; i < scripts.length; i += 1) {
        script = '<script type="text/javascript" src="';
        script += scripts[i] + '?' + version;
        script += '"><\/script>';
        document.write(script);
    }
   
}(window.document));

