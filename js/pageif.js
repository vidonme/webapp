	var g_CurLibId = 0;
	var g_CommercialVideoId = 1;
	var g_PersonalVideoId = 2;
	var g_CurLibraryType = "commercial";
	var g_FolderCnt = 0;

	var g_CurDeletePathWaitforConfirm = {}; //存已经选中删除的路径li对象				


	$(function() {
		RequestGetLibraries("all");

		$("#addCommercialPath").click(function() {
			g_CurLibId = g_CommercialVideoId;
			g_CurLibraryType = "commercial";
			var title = $.i18n.prop('index_17');
			$("#popaddVideoH3").text(title);
			ShowPageManageLibPath(g_CurLibId);
		})

		$("#addPermediaPath").click(function() {
			g_CurLibId = g_PersonalVideoId;
			g_CurLibraryType = "personal";
			var title = $.i18n.prop('index_18');
			$("#popaddVideoH3").text(title);
			ShowPageManageLibPath(g_CurLibId);
		})

		$("#addPathbtn").click(function() {
			showdiv(".addPath", 2);
			AccessPageLibraryPath(g_CurLibraryType);
		})

		$("#btnMngPathOK").click(function() {
			close_box('.addVideo', 1);
			RefreshMediaLibrary(g_CurLibraryType);
		})

		$("#btnCfmDeletePathOK").click(function() {
			confirmDeletePath();
			$('#selectedPath li').removeClass("even");
			$('#selectedPath li:even').addClass("even");
		})

		//页面删除路径
		$("#selectedPath").delegate('.delete', "click", function() {
			g_CurDeletePathWaitforConfirm = $(this).parent();
			showdiv(".confirmDelete", 2);
			$("#deletePath").text($(this).parent().find(".showpath").text());
			//$(this).parent().remove();
		})

	})

	function cbSetLibraryID(data, mediatype) {
		if (data && data.result && data.result.libraries && (data.result.libraries.length > 0)) {
			$.each($(data.result.libraries), jQuery.proxy(function(i, item) {
					switch (item.type) {
						case "commercial":
							g_CommercialVideoId = item.LibraryId;
							return;
						case "personal":
							g_PersonalVideoId = item.LibraryId;
							return;
						default:
							rerurn;
					}

				},
				this));
		}
	}

	//==================ManageLibraryPath Div======================	

	function ShowPageManageLibPath(libid) {
		showdiv('.addVideo', 1);
		g_CurLibId = libid;
		RequestLibraryPaths(libid);
	}

	function cbHandleLibraryPaths(data) {
		var msg = "";		
		
		if (!checkResponse(data)) return;
		$("#selectedPath").html("");
		
		g_FolderCnt = data.result.paths.length;
		(g_FolderCnt)? (msg = $.i18n.prop('index_51')) : (msg = $.i18n.prop('index_52'));
		$("#addPathbtn").text(msg);

		if(!g_FolderCnt){
				msg = $.i18n.prop('index_16');
				var itemhtml = '<li index="' + 0 + '"><span class="showpath">' + msg + '</span></li>'
				$("#selectedPath").append(itemhtml);
				return;
		}
		
		$.each($(data.result.paths), jQuery.proxy(function(i, item) {
				var pid = item.PathId;
				var path = item.path;
				var itemhtml = '<li index="' + pid + '"><span class="delete"></span><span class="showpath">' + path + '</span></li>'
				$("#selectedPath").append(itemhtml);
				$('#selectedPath li:even').addClass("even");
		}, this));
	}
	
	function cbHandleAddLibraryPath(data){
		if (!checkResponse(data)){
			var errmsg = $.i18n.prop('index_37_1');
			alert(errmsg);
			return;
		}
		
		if (!g_FolderCnt) {
				$("#selectedPath").html("");
		}
		
		var mediapath = $("#addSrcPath").val();
		if (!mediapath) return;	
		var pathid = data.result.PathId;				
		var html = '<li index="' + pathid + '"><span class="delete"></span><span class="showpath">' + mediapath + '</span></li>'
		$("#selectedPath").append(html);
		$('#selectedPath li:even').addClass("even");		
		close_box('.addPath', 2);
	}
	

	//主页增加路径
	function commitAddOneLibPath() {
		var mediapath = $("#addSrcPath").val();
		if (!mediapath) return;
		RequestAddLibraryPath(g_CurLibId, mediapath);
	}

	//==================确认删除路径DIV==============================
	function cbHandleDeleteLibraryPath(data){
			if (data && data.result.ret == true) {
				return;
			} else {
				alert(data.result.err);
			}
	}
	
	function confirmDeletePath() {
		var pid = g_CurDeletePathWaitforConfirm.attr("index");
		var mediapath = g_CurDeletePathWaitforConfirm.text();
		//alert("pid="+pid+",mediapath="+mediapath);

		if (pid != "0") {
			RequestDeleteLibraryPath(g_CurLibId, pid)
		}

		g_CurDeletePathWaitforConfirm.remove();
		close_box('.confirmDelete', 2);
	}