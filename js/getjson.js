		//API is not REST
		function RequestIsNeedWizard(page) {
			var s = vidonme.rpc.request({
				'context': this,
				'method': 'VidOnMe.IsWizzardEnabled',
				'params': {},
				'success': function(data) {
					cbIsNeedWizard(data, page);
				}
			});
		}


		function RequestGetLibraries(mediatype) {
			var s = vidonme.rpc.request({
				'context': this,
				'method': 'VidOnMe.GetLibraries',
				'params': {
					"type": mediatype
				},
				'success': function(data) {
					cbSetLibraryID(data, mediatype);
				}
			});
		}


		function RequestLibraryPaths(libid) {
			if(!libid) return;
			
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

		function RequestAddLibraryPath(libid, mediapath) {
			//参数判断
			if (!libid || !mediapath) return;

			//server交互
			vidonme.rpc.request({
				'context': this,
				'method': 'VidOnMe.AddPathToLibrary',
				'params': {
					"LibraryId": libid,
					"path": mediapath
				},
				'success': function(data) {
					cbHandleAddLibraryPath(data);
				}
			});
		}

		function RequestDeleteLibraryPath(libid, pid) {
			//参数判断
			//alert("libid=" + libid + ",pid=" + pid);
			var pathid = Number(pid);
			if(!pid || !libid) return;
			//server交互
			vidonme.rpc.request({
				'context': this,
				'method': 'VidOnMe.DeletePathFromLibrary',
				'params': {
					"LibraryId": libid,
					"PathId": pathid
				},
				'success': function(data) {
						cbHandleDeleteLibraryPath(data);
				}
			});
		}

		function RequestAddNetDrive(path) {
			if(!path) return;
			
			vidonme.rpc.request({
				'context': this,
				'method': 'VidOnMe.AddNetDirectory',
				'params': {
					"directory": path
				},
				'success': function(data) {
					cbAddNetDrive(data, path);
				}
			});
		}
		
		function RequestDriveList() {

			var lastjqXhr = vidonme.rpc.request({
				'context': this,
				'method': 'VidOnMe.GetDirectory',
				'params': {
					"mask": "/",
					"directory": ""
				},
				'success': function(data) {
					cbHandleDiskList(data);
				}
			});

			return lastjqXhr;
		}	
		
		function RequestFolderList(realpath, drivepath) {		
			drivepath = unescape(drivepath);
			realpath = unescape(realpath);
			realpath = removeslashAtEnd(realpath);
			//alert("realpath="+realpath+", drivepath="+drivepath);

			var lastjqXhr = vidonme.rpc.request({
				'context': this,
				'method': 'VidOnMe.GetDirectory',
				'params': {
					"mask": "/",
					"directory": realpath
				},
				'success': function(data) {
					cbHandleFolderlist(data, realpath, drivepath);
				}
			});

			return lastjqXhr;

		}			
		

		function RequestDriveDirectory(realpath, drivepath) {

			drivepath = unescape(drivepath);
			realpath = unescape(realpath);
			realpath = removeslashAtEnd(realpath);
			//alert("realpath="+realpath+", drivepath="+drivepath);

			vidonme.rpc.request({
				'context': this,
				'method': 'VidOnMe.GetDirectory',
				'params': {
					"mask": "/",
					"directory": ""
				},
				'success': function(data) {
					cbHandleDiskList(data);
				}
			});

			var lastjqXhr = vidonme.rpc.request({
				'context': this,
				'method': 'VidOnMe.GetDirectory',
				'params': {
					"mask": "/",
					"directory": realpath
				},
				'success': function(data) {
					cbHandleFolderlist(data, realpath, drivepath);
				}
			});

			return lastjqXhr;

		}

		function RequestNetPathInfo(path, username, password, domain) {
			if (!path) return;

			vidonme.rpc.request({
				'context': this,
				'method': 'VidOnMe.AddNetDirectoryEx',
				'params': {
					"directory": path,
					"domain" : domain,
					"username" : username,
					"password" : password,
				},
				'success': function(data) {

				}
			});
		}