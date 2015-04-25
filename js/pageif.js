	var g_CurLibId = 0;
	var g_CommercialVideoId = 1;
	var g_PersonalVideoId = 2;
	var g_CurLibraryType = "commercial";

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
			var title = "";
			showdiv(".addPath", 2);
			AccessPageLibraryPath(g_CurLibraryType);
		})

		$("#btnMngPathOK").click(function() {
			close_box('.addVideo', 1);
			RefreshMediaLibrary(g_CurLibraryType);
		})

		$("#btnCfmDeletePathOK").click(function() {
			confirmDeletePath();
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
		if (!checkResponse(data)) return;
		$("#selectedPath").html("");
		$.each($(data.result.paths), jQuery.proxy(function(i, item) {
			var pid = item.PathId;
			var path = item.path;
			var itemhtml = '<li index="' + pid + '"><span class="delete"></span><span class="showpath">' + path + '</span></li>'
			$("#selectedPath").append(itemhtml);
			$('#selectedPath li:even').addClass("even");
		}, this));
	}

	//主页增加路径
	function commitAddOneLibPath() {
		var mediapath = $("#addSrcPath").val();
		if (!mediapath) return;
		RequestAddLibraryPath(g_CurLibId, mediapath);
		var html = '<li index="0"><span class="delete"></span><span class="showpath">' + mediapath + '</span></li>'
		$("#selectedPath").append(html);
		close_box('.addPath', 2);
	}

	//==================确认删除路径DIV==============================
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