
		function showdiv(elem) {
				var box = $("tckuanglayer");
				$(elem).before("<div class='tckuanglayer'></div>");
				$(".tckuanglayer").css('height', $(document).height());
				$("body", "html").css({
					height: "100%",
					width: "100%"
				});
				$("html").css("overflow", "hidden");
				$("body").css("overflow", "hidden");
				if ($.browser.msie && ($.browser.version == "6.0") && !$.support.style) {
					$(elem).css("top", ($(window).height() - $(elem).height()) / 2 + $(window).scrollTop() + "px");
				} else {
					$(elem).css("top", ($(window).height() - $(elem).height()) / 2 + $(window).scrollTop() + "px");
				}
				$(elem).css("left", ($(window).width() - $(elem).width()) / 2 + "px");
				$(elem).fadeIn("slow");
				$(window).resize(function() {
					$(elem).css("top", ($(window).height() - $(elem).height()) / 2 + "px");
					$(elem).css("left", ($(window).width() - $(elem).width()) / 2 + "px");
				});
		}
			
		function showdiv2(elem) {
				var box = $("tckuanglayer2");
				$(elem).before("<div class='tckuanglayer2'></div>");
				$(".tckuanglayer2").css('height', $(document).height());
				$("body", "html").css({
					height: "100%",
					width: "100%"
				});
				$("html").css("overflow", "hidden");
				$("body").css("overflow", "hidden");
				if ($.browser.msie && ($.browser.version == "6.0") && !$.support.style) {
					$(elem).css("top", ($(window).height() - $(elem).height()) / 2 + $(window).scrollTop() + "px");
				} else {
					$(elem).css("top", ($(window).height() - $(elem).height()) / 2 + $(window).scrollTop() + "px");
				}
				$(elem).css("left", ($(window).width() - $(elem).width()) / 2 + "px");
				$(elem).fadeIn("slow");
				$(window).resize(function() {
					$(elem).css("top", ($(window).height() - $(elem).height()) / 2 + "px");
					$(elem).css("left", ($(window).width() - $(elem).width()) / 2 + "px");
				});
		}
			
		function close_box_para(elm) {
				$(".tckuanglayer").remove();
				$(elm).fadeOut();
				$("html").css("overflow", "auto");
				$("body").css("overflow", "auto");
		}
			
		function close_box_para2(elm) {
				$(".tckuanglayer2").remove();
				$(elm).fadeOut();
				$("html").css("overflow", "auto");
				$("body").css("overflow", "auto");
		}
			
		function tab(index){
				var $div_li= $(".tab_title li");
				$div_li.eq(index).addClass("selected").siblings().removeClass("selected");
				$(".tab_content .tab_con").eq(index).show().siblings().hide();
				$div_li.click(function() {
			    	$(this).addClass("selected").siblings().removeClass("selected");
			   		var index = $div_li.index(this);
			    	$(".tab_content .tab_con").eq(index).show().siblings().hide();
				}); 
		}

    function isNeedWizard() {
			
		    var s = vidonme.rpc.request({
		        'context': this,
		        'method': 'VidOnMe.IsWizzardEnsabled',
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
		
//		function handle_inputs() {
//				var protocol 	= $("#txtWzdNetSharePtl").val();	
//				var domain 		= $("#txtWzdNetSharePtl").val();	
//				var user_name = $("#txtWzdNetSharePtl").val();	
//				var user_pass = $("#txtWzdNetSharePtl").val();	
//				
//				if (protocol == "NFS") {
//					domain.disabled = true;
//					user_name.disabled = true;
//					user_pass.disabled = true;
//				} else if (protocol == "SMB") {
//					domain.disabled = false;
//					user_name.disabled = false;
//					user_pass.disabled = false;	
//				}
//				
//				$("#server_address").focus();
//		}
		
			function checkip(ip) {
					var regexp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
					if (ip.match(regexp)) {
						return true;
					}
				
					return false;
			}	
		
		function setnetshare() {
				var protocol 	= $("#txtWzdNetSharePtl").val();	
				var netshare_search = '', display = '';
				var srvaddr 	= $("#txtWzdNetShareAddress").val();	
				var username	= $("#txtWzdNetShareUser").val();	
				var userpass 	= $("#txtWzdNetSharePwd").val();	
				
				if (protocol == "SMB") {
						var srvdomain = $("#txtWzdNetShareDomin").val();
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
				$("#addSrcPath").val(display);
				$("#netSharePath").val(netshare_search);
				close_box_para2(".addNetwork");
				browseNetShare();
		}
		
		function btn_addnetshare(host, edit) {
				//yanggui dialogClose();
//				var dialogTitle = "%267";
//
//				if (true == edit) {
//					$("#user_name").focus();
//				} else {
//					$("#server_address").focus();
//				}
				
				showdiv2(".addNetwork");
				
		}

		function getWzdServername() {
		    var s = vidonme.rpc.request({
		        'context': this,
		        'method': 'VidOnMe.GetServerName',
		        'params': {},
		        'success': function(data) {
		        		//alert(data.result.ret);
								$('#txtWzdServername').val(data.result.name);
			    	}
	    	});
		}
		
		function setLibraryID() {
		    var s = vidonme.rpc.request({
		        'context': this,
		        'method': 'VidOnMe.GetLibraries',
		        'params': {
		        		"type": $('#mediaType').val()
		        },
		        'success': function(data) {
		        		if (data && data.result && data.result.libraries && (data.result.libraries.length>0)) {	        				
				            $.each($(data.result.libraries), jQuery.proxy(function(i, item){
				            		//alert("i=" + i + ",libID=" + item.LibraryId + ",type=" + item.type + ",name=" + item.name);
         								if(item.type == $('#mediaType').val()){
         										$('#wzdLibID').val(item.LibraryId);
         										//alert("set lib id success,libID=" + item.LibraryId);
         										return;
         								}
		        				},
		        				this));
		        		}
		        }
			  }); 
		}

		function wizardsetting() {	
				var srvname 		= $('#txtWzdServername').val();
				var libID 			= $('#wzdLibID').val();
				var mediapath 	= $('#txtWzdPath').val();		
				//alert("srvname=" + srvname + ",libID=" + libID + ",path=" + mediapath);
				
				if (!srvname || !libID || !mediapath) {
						return;
				}          
        
        vidonme.rpc.request({
            'context': this,
            'method': 'VidOnMe.SetServerName',
            'params': {
                "name": srvname
            },
            'success': function(data) {
            		//alert("SetServerName:" + data.result.ret);
            }
        });

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

		    var s = vidonme.rpc.request({
		        'context': this,
		        'method': 'VidOnMe.SetWizzardDisabled',
		        'params': {},
		        'success': function(data) {
		        		//alert("SetWizzardDisabled:" + data.result.ret);
			    	}
	    	});
		}
		
    function loadPage() {
    		isNeedWizard();
        getWzdServername();
    }

    function FinishWizard() {
				wizardsetting();
				location.assign("index.html");
				window.location="index.html";
				location.href="index.html";
    }
    
    function showWzdServerNameDiv(){
				$(".slide").hide();
				$(".setUp1").show();
    }
    
    function showWzdMediaTypeDiv(){
				$(".slide").hide();
				$(".setUp2").show();
    }
    
    function showWzdMediaPathDiv(){
				$(".slide").hide();
				$(".setUp3").show();
    }
    
   
    function getdrivetypename(drivetype,name){
    		var drivetypename = "";
        switch (drivetype) {
            case 1:
                drivetypename = "%249";
            break;
            case 4:
                drivetypename = "%251";
            break;
            case 6:
                drivetypename = "%250";
            break;
            default:
                drivetypename = "other";
        }
                
        return drivetypename;
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
		
		function CloseAddPathDiv(){
				$("#listdrive").html("");
				$("#listpath").html("");
		}
  
		function btn_browse(type, path, edit, origpath) {
			
				CloseAddPathDiv();
				var browser = getBrowserInfo();
				var bsrname = browser + "";
				var dialogTitle = '';
		
				origpath = unescape(origpath);
				gsharePath = path;
				var protocol = '';	
		    path = unescape(path);
		    path = removeslashAtEnd(path);
		    var html = "";
		    
		   // alert("path="+path+" edit="+edit+" origpath="+origpath);
		
		    vidonme.rpc.request({
		        'context': this,
		        'method': 'VidOnMe.GetDirectory',
		        'params': {
		            "mask": "/",
		            "directory": ""
		        },
		        'success': function(data) {
		            $.each($(data.result.filelist), jQuery.proxy(function(i, item) {
		            		var itemhtml = "";
		                var str = removeslashAtEnd(item.path);
		                var drivetype = item.drivetype;
		
		                var name = '';
		                if (str.length > 50) {
		                    name = str.substring(0, 50) + "......" + str.substring(str.length - 10, str.length);
		                } else {
		                    name = str;
		                }
		
		                var drivetypename = getdrivetypename(drivetype);
		                if (name.match("Desktop")) {
		                    drivetypename = "";
		                }
		
		                var localpath = str;
		                name = handleUrl(localpath, true, true);
				            localpath = item.path.replace(/\\/g, '\\\\');
				            itemhtml = '<li onClick="btn_browse(\'' +  type + '\',\'' + escape(localpath) + '\',' + edit + ',\'' + escape(name) + '\')" title=' + name + '>' + drivetypename + ' ' + name + '</li>';
										$("#listdrive").append(itemhtml);
			          }, this));
							
								html = '<li onClick="btn_browse(\'' + type + '\',\'' + "smb://" + '\',' + edit + ',\'' + "" + '\')">Windows Network (SMB)</li>';
								$("#listdrive").append(html);
								
								
								html = '<li onClick="btn_browse(\'' + type + '\',\'' + "nfs://" + '\',' + edit + ',\'' + "" + '\')">Network Filesystem (NFS)</li>';
								$("#listdrive").append(html);
											
								var note = "%s267";					
								html = '<li onClick="btn_addnetshare(\'' + "" + '\',' + false + ')">' + note + '</li>';
								$("#listdrive").append(html);
		        }
		    });
		    
		   	showdiv(".addPath");
		   	
		   	vidonme.rpc.request({
		      'context': this,
		      'method': 'VidOnMe.GetDirectory',
		      'params': {
		          "mask": "/",
		          "directory": path
		      },
		      'success': function (data) {
		          //ClearListPath();
		          //yanggui hidediv();
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
		                  html = '<li onClick="btn_browse(\'' + type + '\',\'' + escape(arg) + '\',' + edit + ',\'' + escape(origpath) + '\')">back</li>';
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
		                  
		                  itemhtml = '<li onClick="btn_browse(\'' + type + '\',\'' + escape(arg) + '\',' + edit + ',\'' + escape(origpath) + '\')" title=' + str + '>' + name + '</li>';
											$("#listpath").append(itemhtml);
		              }, this));
		          }
		
		          path = path.replace(/\\\\/g, '\\');
		          var display = handleUrl(path, true, true);
		          $("#addSrcPath").val(display);
		      }
		  });
		    	
		}

		function browseNetShare(){
				
				var path = $("#netSharePath").val();
				
				vidonme.rpc.request({
						'context': this,
						'method': 'VidOnMe.AddNetDirectory',
						'params': {
							"directory": path
						},
						'success': function(data) {
								if (data && data.result.ret == true) {
									btn_browse("movie", escape(path), false, escape(path));
								} else {
									alert(data.result.err);
								}
							}
				});
				
		}	
  
    
    $(function(){
    		var str=window.location.hash;
				switch(str){
					case '#1':
						showWzdServerNameDiv(); break;
					case '#2':
						showWzdMediaTypeDiv(); break;
					case '#3':
						showWzdMediaPathDiv(); break;
					}
				
				$(".setUp1btn").click(function(){
					//alert("xx1");
					$(".slide").hide();
					$(".setUp1").show();
					})
					
				$(".setUp2btn").click(function(){
					var srvname = $('#txtWzdServername').val();
					if(!srvname){
							return;
					}
					$(".slide").hide();
					$(".setUp2").show();
					})
				$(".setUp3btn").click(function(){
					//alert("xx3");
					setLibraryID();
					$(".slide").hide();
					$(".setUp3").show();
					})
					
				$(".setUpFinbtn").click(function(){
						FinishWizard();
				})
				
				$(".AddPathCancle").click(function(){
					close_box_para(".addPath")
					//$(".addPath").hide();
					//$(".slide").hide();					
					//$(".setUp3").show();
				})
				
			  $(".AddPathOk").click(function(){
			  	var path = $("#addSrcPath").val();
					close_box_para(".addPath")
			  	$("#txtWzdPath").val(path);
					$(".slide").hide();					
					$(".setUp3").show();
				})
					
				$("#selectedMedia a").click(function(){
					//alert("xx4");
					$(this).addClass("selected").siblings().removeClass("selected");
					var id=$(this).attr('id'); 
					$("#mediaType").val(id);
					})
					
				$(".addPathbtn").click(function(){
						//showdiv(".addPath");
						var mtype = $("#mediaType").val();
						btn_browse(mtype,'',false,'');
					})
					
				$(".popAddPathClose").click(function(){
					close_box_para(".addPath");
					})
					
				$(".popAddNetworkClose").click(function(){
					close_box_para2(".addNetwork");
					})
					
				$(".addnetshareOK").click(function(){
					setnetshare();
					})					

				$(".addnetshareCancle").click(function(){
					close_box_para2(".addNetwork");
					})				
					
				$(".popDisk li").click(function(){
					if($(this).hasClass("smb")){
						showdiv2(".addNetwork");
						tab(0);
						}
					if($(this).hasClass("nfs")){
						showdiv2(".addNetwork");
						tab(1);
						}
					})
					
				loadPage();				
		})
    

