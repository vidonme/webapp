	
	var g_CurLibId										= 0;
	var g_CommercialVideoId						= 1;
	var g_PersonalVideoId							= 2;
	
	var g_CurDeletePathWaitforConfirm = {};		//存已经选中删除的路径li对象	
	var g_CurLibraryType = "commercial";
	
	
	$(function(){
			RequestGetLibraries("all");

		  $("#addCommercialPath").click(function(){
				g_CurLibId = g_CommercialVideoId;
				g_CurLibraryType = "commercial";
				ShowPageManageLibPath(g_CurLibId);
			})
			
			$("#addPermediaPath").click(function(){
				g_CurLibId = g_PersonalVideoId;
				g_CurLibraryType = "personal";
				ShowPageManageLibPath(g_CurLibId);
			})
			
			$("#addPathbtn").click(function(){
				showdiv(".addPath",2);
				btn_browse('movie','',false,'');
			})
			
			$("#btnMngPathOK").click(function(){
				close_box('.addVideo',1);
				RefreshMediaLibrary(g_CurLibraryType);
			})
			
			$("#btnAddLibPathOK").click(function(){
				commitAddOneLibPath();
			})
			
			$("#btnCfmDeletePathOK").click(function(){
				confirmDeletePath();
			})
			
			$("#btnAddNetworkOK").click(function(){
				commitAddNetShare();
			})
			
			//页面删除路径
			$("#selectedPath").delegate('.delete',"click",function(){
					g_CurDeletePathWaitforConfirm = $(this).parent();
					showdiv(".confirmDelete",2);
					$("#deletePath").text($(this).parent().find(".showpath").text());
					//$(this).parent().remove();
			})			
			
	})
	
	function cbSetLibraryID(data,mediatype){
  		if (data && data.result && data.result.libraries && (data.result.libraries.length>0)) {	        				
          $.each($(data.result.libraries), jQuery.proxy(function(i, item){
          		switch (item.type) {
          			case "commercial":
          				 	g_CommercialVideoId = item.LibraryId;
          				 	return;
          			case "personal":
          					g_PersonalVideoId		= item.LibraryId;
          					return;
          			default:
          					rerurn;
          		}
          		
  				},
  				this));
  		}
	}
	
	
	//==================ManageLibraryPath Div======================	
	
	function ShowPageManageLibPath(libid){
			showdiv('.addVideo',1);
			g_CurLibId = libid;
			RequestLibraryPaths(libid);
	}
	
	function cbHandleLibraryPaths(data){
		if (data && data.result.ret == true) {
			$("#selectedPath").html("");
			$.each($(data.result.paths), jQuery.proxy(function(i, item) {
		      var pid 			= item.PathId;
		      var path 			= item.path;
					var itemhtml 	=	'<li index="' + pid + '"><span class="delete"></span><span class="showpath">' + path + '</span></li>'
					$("#selectedPath").append(itemhtml);					
  		}, this));
  	}else {
  		  alert(data.result.err);
		}	
	}
		
	//==================确认删除路径DIV==============================
  function confirmDeletePath(){
			var pid = g_CurDeletePathWaitforConfirm.attr("index");
			var mediapath = g_CurDeletePathWaitforConfirm.text();
			//alert("pid="+pid+",mediapath="+mediapath);
			
			if(pid != "0"){
					RequestDeleteLibraryPath(g_CurLibId,pid)
			}

			g_CurDeletePathWaitforConfirm.remove();
			close_box('.confirmDelete',2);
	}
	
	//==================添加网络Drive Div======================	
		function ShowPageAddNetShare(host, edit) {
				//yanggui dialogClose();
//				var dialogTitle = "%267";
//
//				if (true == edit) {
//					$("#user_name").focus();
//				} else {
//					$("#server_address").focus();
//				}
				
				showdiv(".addNetwork",3);	
		}
		
	
		function commitAddNetShare() {
				var protocol 				= $("#txtNetSharePtl").val();
				var srvaddr 				= $("#txtNetShareSrcName").val();	
				var srvdomain 			= $("#txtNetShareDomain").val();
				var username				= $("#txtNetShareUserName").val();	
				var userpass 				= $("#txtNetSharePwd").val();
				var netshare_search = '';
				var display 				= '';	
				
				if (protocol == "Windows Network (SMB)") {
						if (checkip(srvaddr) == false && srvaddr == "" || srvdomain == "") {
								alert("Null is forbidden");	
								return;
						}
						
						if (username == "" && userpass == "")
						{
							netshare_search = 'smb://' + srvaddr;
						}
						else
						{
							if (username == "" || userpass == "") {
								alert("Null is forbidden");	
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
				
				//alert("netsearch="+netshare_search+",display="+display);
				RequestAddNetDrive(netshare_search);
				$("#addSrcPath").val(display);
				close_box('.addNetwork',3);
		}
		
		function cbAddNetDrive(data,netpath){
				//alert(netpath);
				if (data && data.result.ret == true) {
						btn_browse("movie", escape(netpath), false, escape(netpath));
				} else {
						alert(data.result.err);
				}
		}

	
	//==================添加一个路径 Div======================	
	function ClearDiskAndPathLi(){
				$("#popDiskblock").html("");
				$("#listpath").html("");
	}
	
		//主页增加路径
	function commitAddOneLibPath(){
		  var mediapath = $("#addSrcPath").val();
		  RequestAddLibraryPath(g_CurLibId,mediapath);
			var html = '<li index="0"><span class="delete"></span><span class="showpath">'+ mediapath +'</span></li>'
			$("#selectedPath").append(html);		  
		  close_box('.addPath',2);
	}
	
	
	/*
	function cbHandleDiskList(data) {
			var itemhtml = "";
      var type = '';
      var edit = false;
      var langua = "";	
			
      $.each($(data.result.filelist), jQuery.proxy(function(i, item) {      		

					var drivetypename = getdrivetypename(item.drivetype);
					
					var str 					= removeslashAtEnd(item.path);
          var name 					= '';
          if (str.length > 50) {
              name = str.substring(0, 50) + "......" + str.substring(str.length - 10, str.length);
          } else {
              name = str;
          }
          if (name.match("Desktop")) {
              drivetypename = "";
          }

          var localpath = str;
          name = handleUrl(localpath, true, true);
          localpath = item.path.replace(/\\/g, '\\\\');
          itemhtml = '<li onClick="btn_browse(\'' +  type + '\',\'' + escape(localpath) + '\',' + edit + ',\'' + escape(name) + '\')" title=' + name + '>' + drivetypename + ' ' + name + '</li>';
					$("#popDiskblock").append(itemhtml);
      }, this));
						
			//alert(html);
			langua = $.i18n.prop('Disk_Type_SMB');
			html = '<li onClick="btn_browse(\'' + type + '\',\'' + "smb://" + '\',' + edit + ',\'' + "" + '\')">' + langua + '</li>';
			$("#popDiskblock").append(html);
			
			langua = $.i18n.prop('Disk_Type_NFS');
			html = '<li onClick="btn_browse(\'' + type + '\',\'' + "nfs://" + '\',' + edit + ',\'' + "" + '\')">' + langua + '</li>';
			$("#popDiskblock").append(html);
						
			var note = $.i18n.prop('Add_Shared');					
			html = '<li class="addNwPath" title="Add Network......." onClick="ShowPageAddNetShare(\'' + "" + '\',' + false + ')">' + note + '</li>';
			$("#popDiskblock").append(html);		
		
	}	
	
	function cbHandleFolderlist(data,path,origpath) {
      //ClearListPath();
      $("#listpath").html("");
      var dialogTitle = '';
		  var langua = ""
		
		  origpath = unescape(origpath);
			var protocol = '';	
		  path = unescape(path);
		  path = removeslashAtEnd(path);	
		    
      var is_smb = path.indexOf("smb://") >= 0;
      var is_nfs = path.indexOf("nfs://") >= 0;

  		if (data && data.result.ret == false) {
					var err = data.result.err;
					
					if (err == "Access is denied") {
	                	//alert("%276".toLocaleString());
					} else if (err == "Unknown user name or bad password") {
	                	//alert("%277".toLocaleString());
					} else if (err == "Network path not found") {
	                	//alert("%278".toLocaleString());
					} else {
						alert(err);
					}

          if (is_smb || is_nfs) {
							if (err == "Access is denied" ||
								err == "Unknown user name or bad password") {
		            ShowPageAddNetShare(handleUrl(path, false, false), true);
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
          
          langua = $.i18n.prop('Path_Back_Arrow');
          
          //<div class="back"> <a title="back" href="javascript:;"></a> </div>
          if (arg != "") {
              //html = '<li onClick="btn_browse(\'' + type + '\',\'' + escape(arg) + '\',' + edit + ',\'' + escape(origpath) + '\')">' + langua + '</li>';
							html = '<div class="back"> <a onClick="btn_browse(\'' + type + '\',\'' + escape(arg) + '\',' + edit + ',\'' + escape(origpath) + '\')">' + langua + '</a> </div>';
							$("#listpath").append(html);
          }
          
          $.each($(data.result.filelist), jQuery.proxy(function (i, item) {

              var str = item.title;
              var itemhtml="";

              var name = '';
              if (str.length > 50) {
                  name = str.substring(0, 50) + "......" + str.substring(str.length - 10, str.length);
              } else {
                  name = str;
              }

              arg = item.path;

              if (!arg.match("/")) {
                  arg = arg.replace(/\\/g, '\\\\');
              }

              if (arg.match('\'')) {
                  arg = arg.replace(/\'/g, '\\\'');
              }
              
              //itemhtml = '<li onClick="btn_browse(\'' + type + '\',\'' + escape(arg) + '\',' + edit + ',\'' + escape(origpath) + '\')" title=' + str + '>' + name + '</li>';
							itemhtml = '<div class="folder"> <a onClick="btn_browse(\'' + type + '\',\'' + escape(arg) + '\',' + edit + ',\'' + escape(origpath) + '\')" title=' + str + '>' + name + '</a> </div>';
							
							$("#listpath").append(itemhtml);
							//alert(itemhtml);
          }, this));
      }

      path = path.replace(/\\\\/g, '\\');
      var display = handleUrl(path, true, true);
      $("#addSrcPath").val(display);
  }
  
  */
	
	function loadProperties(){
			jQuery.i18n.properties({//加载资浏览器语言对应的资源文件
					name:'strings', //资源文件名称
					path:'i18n/', //资源文件路径
					mode:'map', //用Map的方式使用资源文件中的值
					callback: function() {//加载成功后设置显示内容
						//用户名
						$('#label_username').html($.i18n.prop('string_movie'));
					    //密码
						$('#label_password').html($.i18n.prop('string_teleplay'));
					    //登录
						$('#button_login').val($.i18n.prop('string_home_video'));
					}
			});
	}
	