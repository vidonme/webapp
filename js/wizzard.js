
		var g_CurLibId = 0;
		var g_CurLibraryType = "";		

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
		
		function cbIsNeedWizard(data,page){
				if(page != "guide.html"){
						return;
				}
				
				if(!checkResponse(data)) return;
				
		    //alert("isNeedWizard=" + data.result.ret);
			/*
				if(data.result.ret != "true"){
						location.assign("index.html");
						window.location	="index.html";
						location.href		="index.html";
				}*/
		}
		
			//Wizard页面增加路径
	function commitAddOneLibPath(){
		  var mediapath = $("#addSrcPath").val();
		  if (!mediapath) return;
		  close_box('.addPath',2);
			$("#selectedPath").val(mediapath);
	}

//===============ServerInterface============================
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

		function wizardsetting() {	
				var libID 			= g_CurLibId;
				var mediapath 	= $('#selectedPath').val();		
				//alert("libID=" + libID + ",path=" + mediapath);
				
				if (!libID || !mediapath) {
						//alert("libID or Path is neccessary!");
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

		    vidonme.rpc.request({
		        'context': this,
		        'method': 'VidOnMe.SetWizzardDisabled',
		        'params': {},
		        'success': function(data) {
		        		//alert("SetWizzardDisabled:" + data.result.ret);
								location.assign("index.html");
								window.location="index.html";
								location.href="index.html";     		
			    	}
	    	});
		}
		
    function loadPage() {
    		//RequestIsNeedWizard("guide.html");
    }

    function FinishWizard() {
				wizardsetting();
    }

	$(function(){

		var  slideWidth=$(".slide").width();
		
		$("#commVideo").click(function(){
				g_CurLibraryType = "commercial";
				RequestGetLibraries("commercial");
		})
		
		$("#perMedia").click(function(){
				g_CurLibraryType = "personal";
				RequestGetLibraries("personal");
		})	
					
		$(".setUp2btn").click(function(){
				$(".slides").animate({left:-slideWidth},500);
				$(".guideMenu li").eq(2).addClass("selected").siblings().removeClass("selected");
		})
			
		$(".setUp3btn").click(function(){
				if (!g_CurLibId) {
						return;
				}
				
				$("#selectedPath").val("");
				$(".slides").animate({left:-2*slideWidth},500);
				$(".guideMenu li").eq(4).addClass("selected").siblings().removeClass("selected");
		})
		
		$("#btnWzdOK").click(function(){
				FinishWizard();
		})		
				
		$("#selectedMedia a").click(function(){
				$(this).addClass("selected").siblings().removeClass("selected");
		})
				
		$(".addPathbtn").click(function(){
				var title = "";
				if(g_CurLibraryType == "commercial"){
						title = $.i18n.prop('index_17');;
						$("#popAddPathH3").text(title);
				}else {
						title = $.i18n.prop('index_18');;
						$("#popAddPathH3").text(title);							
				}					
				
				showdiv(".addPath",2);

				ShowPageAddOnePath('','');			
		})	
					
		loadPage();
	})
