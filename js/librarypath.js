	var reqDriveCnt = 0;
	var g_lastDrivejqXhr = {};
	var reqFolderCnt = 0;
	var g_lastFolderjqXhr = {};	


	$(function() {
		$("#btnAddLibPathOK").click(function() {
			var path = $("#addSrcPath").val();
			if (!path) return;
			commitAddOneLibPath();
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

		$(".addPath .popDisk").mCustomScrollbar({
			//scrollButtons:{enable:true},
			autoHideScrollbar: true,
		});

		$("#listpathblock").mCustomScrollbar({
			//scrollButtons:{enable:true},
			autoHideScrollbar: true,
		});
	})
	
	function ShowPageTitleLibraryPath(type){
			
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
			ShowPageTitleLibraryPath(type);
			ShowDriveList();
			//ShowPageAddOnePath('', '');
	}	

	//打开添加网络路径DIV
	function ShowPageAddNetShare(host) {
		var title = "";

		$("#txtNetShareDomain").val("WORKGROUP");
		showdiv(".addNetwork", 3);
		title = $.i18n.prop('index_28');;
		$("#popAddNetworkH3").text(title);
		//document.getElementById("txtNetShareSrcName").focus(); 
		$("#txtNetShareSrcName")[0].focus();
	}

	function checkNetShare(protocol, srvaddr, srvdomain, username, userpass) {
		var langua = "";
		if (!srvaddr) {
			langua = $.i18n.prop('NetShare_IP_Null');
			alert(langua);
			return false;
		}

		if (checkip(srvaddr) == false) {
			langua = $.i18n.prop('NetShare_IP_Illegal');
			alert(langua);
			return false;
		}

		if (!srvdomain) {
			langua = $.i18n.prop('NetShare_Domin_Null');
			alert(langua);
			return false;
		}

		if (protocol == "Windows Network (SMB)") {
			if ((!username && userpass) || (username && !userpass)) {
				langua = $.i18n.prop('NetShare_UserPwd_Null');
				alert(langua);
				return false;
			}
		}

		return true;
	}

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

	function cbAddNetDrive(data, netpath) {
		//alert(netpath);
		if (!checkResponse(data)) return;
		ShowDriveList();
		ShowFolderList(escape(netpath), escape(netpath));
	}


	
	//==================添加一个LibPath Div======================			
	function ShowPageAddOnePath(path, drive) {
		$("#popDiskblock").html("");
		$("#listpath").html("");
		var html = '<img src="images/movie/refresh.gif" width="32" height="32"  style=" margin:142px 0px 0px 157px;"/>';
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
		
		var html = '<img src="images/movie/refresh.gif" width="32" height="32"  style=" margin:142px 0px 0px 157px;"/>';
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
		
		var html = '<img src="images/movie/refresh.gif" width="32" height="32"  style=" margin:142px 0px 0px 157px;"/>';		
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
			langua = $.i18n.prop('index_21_3');
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