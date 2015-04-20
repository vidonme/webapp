		//API is not REST
		function RequestGetLibraries(mediatype) {
		    var s = vidonme.rpc.request({
		        'context': this,
		        'method': 'VidOnMe.GetLibraries',
		        'params': {
		        		"type": mediatype
		        },
		        'success': function(data) {
								cbSetLibraryID(data,mediatype);
		        }
			  }); 
		}
		
		
		function RequestLibraryPaths(libid){
				//参数判断
				//RequestGetLibraries("commercial");
				
				
				//要改为有回调函数的设计。。。。
				vidonme.rpc.request({
						'context': this,
						'method': 'VidOnMe.GetLibraryDetail',
						'params': {
							"LibraryId": libid
						},
						'success': function(data) {
								cbHandleLibraryPaths(data);
							}
				});
		}
		
   	function RequestAddLibraryPath(libid,mediapath){
  			//参数判断
  			
  			//server交互
        vidonme.rpc.request({
            'context': this,
            'method': 'VidOnMe.AddPathToLibrary',
            'params': {
                "LibraryId": libid,
                "path": mediapath
            },
            'success': function(data) {
            		return data.result.PathId;
            		//alert("AddPathToLibrary:" + data.result.ret);
            }
        });		
  	} 				
  
  	function RequestDeleteLibraryPath(libid,pid){
  			//参数判断
  			//alert("libid=" + libid + ",pid=" + pid);
  			var pathid = Number(pid);
  			//server交互
 				vidonme.rpc.request({
						'context': this,
						'method': 'VidOnMe.DeletePathFromLibrary',
						'params': {
							"LibraryId": libid,
							"PathId": pathid
						},
						'success': function(data) {
								if (data && data.result.ret == true) {
									return;
								} else {
									alert(data.result.err);
								}
							}
				}); 		
  	}
		
		function RequestAddNetDrive(path){
				
				vidonme.rpc.request({
						'context': this,
						'method': 'VidOnMe.AddNetDirectory',
						'params': {
							"directory": path
						},
						'success': function(data) {
								cbAddNetDrive(data,path);
						}
				});
		}

//		function RequestDiskList(type,path,edit,oripath){
//				
//					
//		}
//  	
//		function btn_browse(type, path, edit, origpath) {
//			
//				ClearDiskAndPathLi();
//	    
//		   //alert("path="+path+" edit="+edit+" origpath="+origpath);
//		
//		    vidonme.rpc.request({
//		        'context': this,
//		        'method': 'VidOnMe.GetDirectory',
//		        'params': {
//		            "mask": "/",
//		            "directory": ""
//		        },
//		        'success': function(data) {
//		        		cbHandleDiskList(data);
//		        }
//		    });
//
//		   	showdiv(".addPath",2);
//		   	
//		   	vidonme.rpc.request({
//		      'context': this,
//		      'method': 'VidOnMe.GetDirectory',
//		      'params': {
//		          "mask": "/",
//		          "directory": path
//		      },
//		      'success': function (data) {
//		          cbHandleFolderlist(data,path,origpath);
//		      }
//		  });
//		    	
//		}

		function btn_browse(type, path, edit, origpath) {
			
				ClearDiskAndPathLi();
				var browser = getBrowserInfo();
				var bsrname = browser + "";
				var dialogTitle = '';
				var langua = ""
		
				origpath = unescape(origpath);
				gsharePath = path;
				var protocol = '';	
		    path = unescape(path);
		    path = removeslashAtEnd(path);
		    var html = "";
		    
		   //alert("path="+path+" edit="+edit+" origpath="+origpath);
		
		    vidonme.rpc.request({
		        'context': this,
		        'method': 'VidOnMe.GetDirectory',
		        'params': {
		            "mask": "/",
		            "directory": ""
		        },
		        'success': function(data) {
		            $.each($(data.result.filelist), jQuery.proxy(function(i, item) {
		            		//$("#popDiskblock").html("");
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
										$("#popDiskblock").append(itemhtml);
										//html += itemhtml;
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
		    });
		    
		   	showdiv(".addPath",2);
		   	//alert(path);
		   	
		   	vidonme.rpc.request({
		      'context': this,
		      'method': 'VidOnMe.GetDirectory',
		      'params': {
		          "mask": "/",
		          "directory": path
		      },
		      'success': function (data) {
		          //ClearListPath();
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
		  });
		    	
		}
		

