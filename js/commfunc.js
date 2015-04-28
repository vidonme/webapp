		function getBrowserInfo() {
			var agent = navigator.userAgent.toLowerCase();

			var regStr_ie = /msie [\d.]+;/gi;
			var regStr_ff = /firefox\/[\d.]+/gi
			var regStr_chrome = /chrome\/[\d.]+/gi;
			var regStr_saf = /safari\/[\d.]+/gi;
			//IE
			if (agent.indexOf("msie") > 0) {
				return agent.match(regStr_ie);
			}

			//firefox
			if (agent.indexOf("firefox") > 0) {
				return agent.match(regStr_ff);
			}

			//Chrome
			if (agent.indexOf("chrome") > 0) {
				return agent.match(regStr_chrome);
			}

			//Safari
			if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
				return agent.match(regStr_saf);
			}

			return ["unknown"];
		}

		function checkip(ip) {
			var regexp = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
			if (ip.match(regexp)) {
				return true;
			}
			return false;
		}


		function checkResponse(data) {

			var err = "";
			var langua = "";

			if (typeof(data) == "undefined") {
				langua = $.i18n.prop('Server_Response_Err');
				//alert(langua);
				return false;
			}

			if (typeof(data.error) != "undefined") {
				//alert(data.error);
				return false;
			}

			if (data && (data.result.ret == false)) {
				if (typeof(data.result.err_msg) == "undefined") {
					return false;
				}
				
				err = data.result.err_msg;

				if (err == "Access is denied") {
					langua = $.i18n.prop('Server_Response_Err_Access');
					//alert(langua);
				} else if (err == "Unknown user name or bad password") {
					langua = $.i18n.prop('Server_Response_Err_UserPwd');
					//alert(langua);
				} else if (err == "Network path not found") {
					langua = $.i18n.prop('Server_Response_Err_PathErr');
					//alert(langua);
				} else {
					//alert(err);
				}

				return false;
			}

			return true
		}

		function getdrivetypename(drivetype) {
			var drivetypename = "";
			switch (drivetype) {
				case 1:
					drivetypename = $.i18n.prop('index_21');
					break;
				case 4:
					drivetypename = $.i18n.prop('index_182');
					break;
				case 6:
					drivetypename = $.i18n.prop('index_180');
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
			var proto = '',
				name = '',
				localpathnoproto = '',
				pos = 0,
				posslash = 0;

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