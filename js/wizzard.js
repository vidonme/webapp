
		var g_CurLibId = 0;
		var g_IsWizzardFinish = false;

//=================PageInterface============================
		function cbSetLibraryID(data,mediatype){
    		if (data && data.result && data.result.libraries && (data.result.libraries.length>0)) {	        				
            $.each($(data.result.libraries), jQuery.proxy(function(i, item){
            		//alert("i=" + i + ",libID=" + item.LibraryId + ",type=" + item.type + ",name=" + item.name);
 								if(item.type == mediatype){
 										g_CurLibId = item.LibraryId;
 										return;
 								}
    				},
    				this));
    		}
		}
		
			//Wizard页面增加路径
	function commitAddOneLibPath(){
		  var mediapath = $("#addSrcPath").val();
		  close_box('.addPath',2);
			$("#selectedPath").val(mediapath);
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

//===============ServerInterface============================
    function isNeedWizard() {
		    var s = vidonme.rpc.request({
		        'context': this,
		        'method': 'VidOnMe.IsWizzardEnabled',
		        'params': {},
		        'success': function(data) {
		        		//alert("isNeedWizard=" + data.result.ret);
//								if(data.result.ret != "true"){
//										location.assign("index.html");
//										window.location="index.html";
//										location.href="index.html";
//								};
			    	}
	    	});  	
		}
		


		function wizardsetting() {	
				var libID 			= g_CurLibId;
				var mediapath 	= $('#selectedPath').val();		
				alert("libID=" + libID + ",path=" + mediapath);
				
				if (!libID || !mediapath) {
						alert("libID or Path is neccessary!");
						return;
				}          
        
        vidonme.rpc.request({
            'context': this,
            'method': 'VidOnMe.AddPathToLibrary',
            'params': {
                "LibraryId": libID,
                "path": mediapath
            },
            'success': function(data) {
            		//alert("AddPathToLibrary:" + data.result.ret);
            }
        });				

			g_IsWizzardFinish = true;
		    var s = vidonme.rpc.request({
		        'context': this,
		        'method': 'VidOnMe.SetWizzardDisabled',
		        'params': {},
		        'success': function(data) {
		
			    	}
	    	});
		}
		
    function loadPage() {
    		isNeedWizard();
    }

    function FinishWizard() {
				wizardsetting();
				location.assign("index.html");
				window.location="index.html";
				location.href="index.html";
    }
    
		function ClearDiskAndPathLi(){
				$("#popDiskblock").html("");
				$("#listpath").html("");
		}

	$(function(){

		var  slideWidth=$(".slide").width();
		loadProperties();
		
		$("#commVideo").click(function(){
			RequestGetLibraries("commercial");
			})
		
		$("#perMedia").click(function(){
			RequestGetLibraries("personal");
			})	
					
		$(".setUp2btn").click(function(){
			$(".slides").animate({left:-slideWidth},500);
			$(".guideMenu li").eq(2).addClass("selected").siblings().removeClass("selected");
			})
			
		$(".setUp3btn").click(function(){
			if (!g_CurLibId) {
					RequestGetLibraries("commercial");
			}
			$(".slides").animate({left:-2*slideWidth},500);
			$(".guideMenu li").eq(4).addClass("selected").siblings().removeClass("selected");
			})
			
			$("#btnAddLibPathOK").click(function(){
				commitAddOneLibPath();
			})	
		
		$("#btnWzdOK").click(function(){
				FinishWizard();
		})
					
		$("#selectedMedia a").click(function(){
			$(this).addClass("selected").siblings().removeClass("selected");
			var id=$(this).attr('id'); 
			$("#mediaName").val(id);
			})
				
		$(".addPathbtn").click(function(){
				showdiv(".addPath",2);
				var mtype = $("#mediaType").val();
				btn_browse(mtype,'',false,'');
			})
		
		$(".addNwPath").click(function(){
				showdiv(".addNetwork",3);	
		})
			
		$(".addPath .popDisk").mCustomScrollbar({
          //scrollButtons:{enable:true},
		  autoHideScrollbar:true
        });
        
		$(".addPath .popFolder").mCustomScrollbar({
          //scrollButtons:{enable:true},
		  autoHideScrollbar:true,
        });
        
		//下拉菜单
		$(".input_dropdown,.jt").click(function(){ 
			var ul = $(".dropdown ul"); 
			if(ul.css("display")=="none"){ 
				ul.slideDown("fast"); 
			}else{ 
			ul.slideUp("fast"); 
			} 
		}); 
		
		$("#dropdown li").click(function(){ 
		var txt = $(this).text(); 
		$(".input_dropdown").val(txt); 
		
		$("#dropdown ul").hide(); 
		
		}); 
					
		$(".addnetshareOK").click(function(){
				AddNetShare();
				close_box(".addNetwork",3);
		})					
					
		loadPage();				
		
		
	})
	   
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
