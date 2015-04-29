 /*
  * librarypath.js
  * 2015-04-15
  * library path operation,including adding,deleting,listing,and display, etc.
  * include two div:addonelibpath,add netshare path.
  */
  
	var reqDriveCnt = 0;
	var g_lastDrivejqXhr = {};
	var reqFolderCnt = 0;
	var g_lastFolderjqXhr = {};
	var refreshgif = '<img src="images/movie/refresh.gif" width="32" height="32"  style=" margin:142px 0px 0px 157px;"/>';
	var g_netPathForCheck;

	$(function() {
		$("#btnAddLibPathOK").click(function() {
			var path = $("#addSrcPath").val();
			if (!path) return;
			commitAddOneLibPath();//调用页面填写
		})
		
		$("#addSrcPath").bind("propertychange input",function(){
				var path = $("#addSrcPath").val();
				if (!path){
						$("#btnAddLibPathOK").addClass("btn-disable").removeClass("btn-blue");
				}else{	
						$("#btnAddLibPathOK").removeClass("btn-disable").addClass("btn-blue");
				}
		})

		$("#btnAddNetworkOK").click(function() {
				commitAddNetShare();
		})

		$("#btnAddNetPathOK").click(function() {
				commitNetPathInfo(g_netPathForCheck);
		})

		$(".addPath .popDisk").mCustomScrollbar({
				autoHideScrollbar: true,
		});

		$("#listpathblock").mCustomScrollbar({
				autoHideScrollbar: true,
		});
	})
	
	
	//==================添加一个LibPath Div======================	
	//DIV Title设定			
	function SetPageTitle_LibraryPath(type){
			
			if (type == "commercial") {
				title = $.i18n.prop('index_17');
				$("#popAddPathH3").text(title);
				title = $.i18n.prop('index_19');
				$("#popAddPathP").text(title);
				
			} else {
				title = $.i18n.prop('index_18');
				$("#popAddPathH3").text(title);
				title = $.i18n.prop('index_20');
				$("#popAddPathP").text(title);				
			}
	}
	
	function AccessPageLibraryPath(type){
			SetPageTitle_LibraryPath(type);
			ShowDriveList();
			//ShowPageAddOnePath('', '');
	}	
	
	function ShowPageAddOnePath(path, drive) {
		$("#popDiskblock").html("");
		$("#listpath").html("");
		var html = refreshgif;
		$("#popDiskblock").append(html);
		if (path) {
			$("#listpath").append(html);
			$("#btnAddLibPathOK").removeClass("btn-disable").addClass("btn-blue");
		}
		
		if (reqCnt != 0) {
			if (g_lastjqXhr && g_lastjqXhr.readyState != 4) {
				g_lastjqXhr.abort();
			}
		}

		g_lastjqXhr = RequestDriveDirectory(path, drive);
		reqCnt++;
	}

	function ShowDriveList(){
		$("#popDiskblock").html("");
		
		var html = refreshgif;
		$("#popDiskblock").append(html);
		
		if (reqDriveCnt != 0) {
			if (g_lastDrivejqXhr && g_lastDrivejqXhr.readyState != 4) {
				g_lastDrivejqXhr.abort();
			}
		}

		g_lastDrivejqXhr = RequestDriveList();
		reqDriveCnt++;			
	}

	function cbHandleDiskList(data) {
		var itemhtml = "";
		var langua = "";
		
		reqDriveCnt--;
		if (!checkResponse(data))
			return;

		$("#popDiskblock").html("");

		$.each($(data.result.filelist), jQuery.proxy(function(i, item) {
			var strpath = removeslashAtEnd(item.path);
			var drivetype = getdrivetypename(item.drivetype);
			var displaypath = handleUrl(strpath, true, true);

			strpath = item.path.replace(/\\/g, '\\\\');
			itemhtml = '<li onClick="ShowFolderList(\'' + escape(strpath) + '\',\'' + escape(displaypath) + '\')" title="' + displaypath + '">' + drivetype + ' ' + displaypath + '</li>';
			$("#popDiskblock").append(itemhtml);
		}, this));


		//alert(html);
		langua = $.i18n.prop('index_22');
		html = '<li title="' + langua + '" onClick="ShowFolderList(\'' + "smb://" + '\',\'' + "" + '\')">' + langua + '</li>';
		$("#popDiskblock").append(html);

		langua = $.i18n.prop('index_23');
		html = '<li title="' + langua + '" onClick="ShowFolderList(\'' + "nfs://" + '\',\'' + "" + '\')">' + langua + '</li>';
		$("#popDiskblock").append(html);

		var note = $.i18n.prop('index_24');
		html = '<li class="addNwPath" title="' + note + '" onClick="ShowPageAddNetShare(\'' + "" + '\')">' + note + '</li>';
		$("#popDiskblock").append(html);

	}
	
	function ShowFolderList(path,drive){
		$("#listpath").html("");
		
		var html = refreshgif;		
		if (path) {
			$("#listpath").append(html);
			$("#btnAddLibPathOK").removeClass("btn-disable").addClass("btn-blue");
		}
		
		if (reqFolderCnt != 0) {
			if (g_lastFolderjqXhr && g_lastFolderjqXhr.readyState != 4) {
				g_lastFolderjqXhr.abort();
			}
		}

		g_lastFolderjqXhr = RequestFolderList(path, drive);
		reqFolderCnt++;		
	}		

	function cbHandleFolderlist(data, path, drive) {
		var parentpath = '';
		var langua = "";
		var html = "";
		var display = "";

		reqFolderCnt--;
		//alert(reqCnt);

		$("#listpath").html("");

		if (!checkResponse(data))
			return;

		if (path == "")
			return;

		if ((drive != path) && (drive != handleUrl(path, true, true))) {
			parentpath = getParentPath(path);
		}

		if (parentpath.match('\'')) {
			parentpath = parentpath.replace(/\'/g, '\\\''); // handle "'" in path, TODO: merge into another func
		}

		//向上
		if (parentpath != "") {
			//alert("parentpath 1=" + parentpath);
			langua = $.i18n.prop('index_181');
			html = '<div class="back"> <a onClick="ShowFolderList(\'' + escape(parentpath) + '\',\'' + escape(drive) + '\')">' + langua + '</a> </div>';
			$("#listpath").append(html);
		}

		$.each($(data.result.filelist), jQuery.proxy(function(i, item) {
			var itempath = item.path;

			if (!itempath.match("/")) {
				itempath = itempath.replace(/\\/g, '\\\\');
			}

			if (itempath.match('\'')) {
				itempath = itempath.replace(/\'/g, '\\\'');
			}

			//alert("folderpath 2=" + itempath);              
			html = '<div class="folder"> <a onClick="ShowFolderList(\'' + escape(itempath) + '\',\'' + escape(drive) + '\')" title="' + item.title + '">' + item.title + '</a> </div>';
			$("#listpath").append(html);
		}, this));

		display = path.replace(/\\\\/g, '\\');
		display = handleUrl(display, true, true);
		$("#addSrcPath").val(display);
	}	

	//==================网络路径Div======================		
	//打开DIV页面	
	function ShowPageAddNetShare(host) {
			var title = "";
	
			$("#txtNetShareDomain").val("WORKGROUP");
			showdiv(".addNetwork", 3);
			title = $.i18n.prop('index_28');;
			$("#popAddNetworkH3").text(title);
			//document.getElementById("txtNetShareSrcName").focus(); 
			$("#txtNetShareSrcName")[0].focus();
	}

	//页面提交前参数检查
	function checkNetShare(protocol, srvaddr, srvdomain, username, userpass) {
		var langua = "";
		if (!srvaddr) {
			langua = $.i18n.prop('index_184');
			alert(langua);
			return false;
		}

		if (checkip(srvaddr) == false) {
			langua = $.i18n.prop('index_185');
			alert(langua);
			return false;
		}

		if (!srvdomain) {
			langua = $.i18n.prop('index_186');
			alert(langua);
			return false;
		}

		if (protocol == "Windows Network (SMB)") {
			if ((!username && userpass) || (username && !userpass)) {
				langua = $.i18n.prop('index_175');
				alert(langua);
				return false;
			}
		}

		return true;
	}

	//添加网络路径提交。
	function commitAddNetShare() {
		var protocol = $("#txtNetSharePtl").val();
		var srvaddr = $("#txtNetShareSrcName").val();
		var srvdomain = $("#txtNetShareDomain").val();
		var username = $("#txtNetShareUserName").val();
		var userpass = $("#txtNetSharePwd").val();
		var netshare_search = '';
		var display = '';

		if (!checkNetShare(protocol, srvaddr, srvdomain, username, userpass)) return;

		if (protocol == "Windows Network (SMB)") {
			if (!username || !userpass) {
				netshare_search = 'smb://' + srvaddr;
			} else {
				netshare_search = 'smb://' + srvdomain + ';' + username + ':' + userpass + '@' + srvaddr;
			}

			display = 'smb://' + srvaddr;
		} else {
			display = 'nfs://' + srvaddr;
			netshare_search = display;
		}

		//alert("netsearch="+netshare_search+",display="+display);
		RequestAddNetDrive(netshare_search);
		$("#addSrcPath").val(display);
		close_box('.addNetwork', 3);
	}

	//页面提交后显示处理
	function cbAddNetDrive(data, netpath) {
		//alert(netpath);
		if (!checkResponse(data)) return;
		ShowDriveList();
		ShowFolderList(escape(netpath), escape(netpath));
	}


	// get address path user name and password
	function commitNetPathInfo(path) {
		var srvdomain = $("#txtNetPathDomain").val();
		var username = $("#txtNetPathUserName").val();
		var userpass = $("#txtNetPathPwd").val();

		//alert("netsearch="+netshare_search+",display="+display);
		RequestNetPathInfo(path, srvdomain, username, userpass);
		$("#addSrcPath").val(path);
		close_box('.addNetwork', 3);
	}

	function ShowPageAddNetPath(path) {
		g_netPathForCheck = path;

		var title = "";

		$("#txtNetPathDomain").val("WORKGROUP");
		showdiv(".addNetPath", 3);
		title = $.i18n.prop('index_28');;
		$("#popAddNetPathH3").text(title);
		//document.getElementById("txtNetShareSrcName").focus(); 
		$("#txtNetPathUserName")[0].focus();
	}


	
