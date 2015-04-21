 /*
  * vidon.me.mainpage.js
  * 2015-04-09
  * display movies, tvshows, etc.
  *
  */

function JsonObject() {
}

function Limits(start, end) {
	this.start = start;
	this.end = end;
	return this;
}

var Sort = function() {
	this.init();
}

Sort.prototype = {
	init: function() {
		this.ignorearticle = false;
		this.order = "descending";
		this.method = "dateadded";
	},
	byDateAdded: function (descending) {
		this.method = "dateadded";
		this.order = descending? "descending": "ascending";
		return this;
	},
	byModifiedTime: function (descending) {
		this.method = "modifiedtime";
		this.order = descending? "descending": "ascending";
		return this;
	},
	byDate: function (descending) { // photo
		this.method = "date";
		this.order = descending? "descending": "ascending";
		return this;
	},
	byLabel: function (descending) { // video
		this.method = "label";
		this.order = descending? "descending": "ascending";
		return this;
	},
	byTitle: function (descending) {
		this.method = "title";
		this.order = descending? "descending": "ascending";
		return this;
	}
}

var FilterItem = function() {}
var Filter = function() {
	this.init();
}

Filter.prototype = {
	init: function() {
	},
	byCountry: function (value) {
		return this.by("country", value);
	},
	byYear: function (value) {
		return this.by("year", value);
	},
	byGenre: function (value) {
		return this.by("genre", value);
	},
	by: function (field, value) {
		if (!!!value) {
			for (var item in this.and) {
				if (item.field == field) {
					this.and.pop(item);
					break;
				}
			}
	
			if (this.and.length == 0) {
				delete this.and;
			}
		} else {
			if (!!!this.and) {
				this.and = new Array();
			}
	
			for (var item in this.and) {
				if (item.field == field) {
					item.value = value;
					break;
				}
			}
	
			var item = new FilterItem();
			item.field = field;
			item.operator = "contains";
			item.value = value;
			this.and.push(item);
		}
	
		return this;
	}
}

function RefreshMediaLibrary(type) {
	if (!!!type) {
		return;	
	}
	
	vidonme.rpc.request({
		'context': this,
		'method': 'VidOnMe.GetLibraries',
		'params': {
			'type': type
		},
		'success': function(data) {
			if (data && data.result) {
				var libraryId = -1;
				
				for (var i = 0; i < data.result.libraries.length; ++i) {
					if (data.result.libraries[i].type == type) {
						libraryId = data.result.libraries[i].LibraryId;
						break;
					}
				}
				
				if (libraryId > 0) {
					vidonme.rpc.request({
						'context': this,
						'method': 'VidOnMe.StartScan',
						'params': {
							'LibraryId': libraryId
						},
						'success': function(data) {
							getScraperStatus();
						}
					});
				}
			}
		}
	});
}

function PreDisplay(obj) {
	if (global_count_timer > 0) {
		clearInterval(global_count_timer);
	}

	try {
		$(".posterList .mCSB_container").html('');
		$('#mediatype').html('');
		$('#backtotv').attr({style:"display:none"});
		
		$('.movies').removeClass('selected');
		$('.tvshows').removeClass('selected');
		$('.video').removeClass('selected');
		$('.photo').removeClass('selected');
		//$('#teleplay').removeClass('selected');
		//$('#home_video').removeClass('selected');
		//$('#images').removeClass('selected');
		//$('#movie').removeClass('selected');
		
		obj.parent().addClass('selected');

		var count = 0;
		var id = obj.attr("id");
		if (id == "movie") {
			/*
			global_count_timer = setInterval(function() {
				count = $(".posterList .box").length;
				$('#mediatype').html('Movies' + ' ' + '(<span>' + count + '</span>)'); //TODO: localization
			}, 200);
			*/
			FreshMediasCount();
			
			$('#fresh').attr('onclick', 'RefreshMediaLibrary("commercial")');
		} else if (id == "teleplay") {
			/*
			global_count_timer = setInterval(function() {
				count = $(".posterList .box").length;
				$('#mediatype').html('Tvshows' + ' ' + '(<span>' + count + '</span>)');
			}, 200);
			*/
			FreshMediasCount();

			$('#fresh').attr('onclick', 'RefreshMediaLibrary("commercial")');
		} else if (id == "home_video") {
			/*
			global_count_timer = setInterval(function() {
				count = $(".posterList .box").length;
				$('#mediatype').html('Videos' + ' ' + '(<span>' + count + '</span>)');
			}, 200);
			*/
			FreshMediasCount();

			$('#fresh').attr('onclick', 'RefreshMediaLibrary("personal")');
		} else if (id == "images") {
			/*
			global_count_timer = setInterval(function() {
				count = $(".posterList .box").length;
				$('#mediatype').html('Images' + ' ' + '(<span>' + count + '</span>)');
			}, 200);
			*/
			FreshMediasCount();

			$('#fresh').attr('onclick', 'RefreshMediaLibrary("personal")');
		} else {
			;	
		}
	} catch (err) {
		
	}
}

function SafePreHandleHtml(obj, class_name, id) {
	var alloc_obj;
	
	if (obj.length == 0) {
		alloc_obj = $('<div class=' + class_name + '></div>');
		if (id.length > 0) {
			alloc_obj.attr('id', id);
		}
	} else {
		alloc_obj = obj;
		alloc_obj.html('');
	}
	
	return alloc_obj;
}

function GetEpisodeDetails(idtvshow, name, season) {
	$(".posterList .mCSB_container").html('');
	$(".movie").removeClass("teleplay");
	$('#mediatype').html('');
	$('.posterMenubtn').hide();
	$('#backtotv').attr('onclick', 'GetTvshowDetails(' + idtvshow + ')');
	$('#backtotv').text(name);

	try {
		SafePreHandleHtml($('#teleplaytop'), 'teleplaytop', 'teleplaytop');
		var teleplaylist = SafePreHandleHtml($('#teleplaylist'), 'teleplaylist', 'teleplaylist');
		
		vidonme.rpc.request({
			'context': this,
			'method': 'VideoLibrary.GetEpisodes',
			'params': {
				'idtvshow': idtvshow
			},
			'success': function(data) {
				if (data && data.result) {
					var index = -1;
					for (var i = 0; i < data.result.seasons.length; ++i) {
						if (data.result.seasons[i].iseason == season) {
							index = i;
							break;	
						}
					}
					
					if (index == -1) {
						return;	
					} else {
						var episodes = data.result.seasons[index].episodes;
						for (var i = 0; i < episodes.length; ++i) {
							var episode = episodes[i].episode;
							var poster  = global_image_url + encodeURI(episodes[i].thumbnail);
							
							var box = $('<div class="box"></div>');
							var pic = $('<div class="pic"></div>');
							
							//var content = '<div class="img fillet10" onclick="showdiv(\'.addNoPlay\', 1)"><div class="imgteleplaydetailsbg"></div><img class="fillet10" src="' + poster + '"/></div><p class="imgname">' + episode + '</p>';//" width="209" height="319" 
							var content = '<div class="img fillet10" onclick="showdiv(\'.addNoPlay\', 1)" style="background-image:url(' + poster +  '); "><div class="imgbg"></div></div><p class="imgname">' + episode + '</p>';
							pic.append(content);
							box.append(pic);
							
							$(".posterList .mCSB_container").append(box);
							//teleplaylist.append(box);
						}
						
						FreshMediasCount();
						//$('#pl').append(teleplaylist);
						
					}
				}
			}
		});
	} catch (err) {
		alert(err);
	}
}

function GetEpisodes(idtvshow, title) {
	vidonme.rpc.request({
		'context': this,
		'method': 'VideoLibrary.GetEpisodes',
		'params': {
			'idtvshow': idtvshow
		},
		'success': function(data) {
			if (data && data.result) {
				var teleplaylist = SafePreHandleHtml($('#teleplaylist'), 'teleplaylist', 'teleplaylist');
				$('#backtotv').text('Tvshow');
				
				for (var i = 0; i < data.result.seasons.length; ++i) {
					var box = $('<div class="box"></div>');
					var pic = $('<div class="pic"></div>');
					
					var season  = data.result.seasons[i].iseason; 
					var poster  = global_image_url + encodeURI(data.result.seasons[i].episodes[0].thumbnail);
					//var content = '<div class="img fillet10" onclick="GetEpisodeDetails(' + idtvshow + ',\'' + title + '\',' + season + ')"><div class="imgteleplaylistbg"></div><img class="fillet10" src="' + poster + '"/></div><p class="imgname">Season' + ' ' + season + '</p>';//" width="209" height="319" 
					var content = '<div class="img fillet10" onclick="GetEpisodeDetails(' + idtvshow + ',\'' + title + '\',' + season + ')" style="background-image:url(' + poster +  '); "></div><p class="imgname">Season' + ' ' + season + '</p>';
					pic.append(content);
					box.append(pic);
					
					$(".posterList .mCSB_container").append(box);
					//teleplaylist.append(box);
				}
				
				FreshMediasCount();
				//$('#pl').append(teleplaylist);
			}
		}
	});
}

function GetTvshowSeasons(idtvshow, title, rating, thumbnail, genre, cast, plot) {
	if (global_count_timer > 0) {
		clearInterval(global_count_timer);
	}
		
	try {
		$('.posterMenubtn').hide();
		$('#backtotv').attr({style:"float:left;display:''"});
		$('#backtotv').attr('onclick', "GetTvshows()");
		
		var topdiv   = $('<div class="teleplayTop" id="teleplaytop"></div>');
		var leftdiv  = $('<div class="left fillet10"></div>');
		var rightdiv = $('<div class="right"></div>');
		
		if (rating.length == 0) {
			rating = 0;
		}
		
		var ratingvalue = $('<div class="ratingvalue" style="width:' + rating * 10 + '%;"></div>');
		var ratingblock = $('<div class="ratingblock"></div>');
		
		ratingblock.append(ratingvalue);
		
		var ratingnum= $('<div class="ratingnum">' + rating + '</div>');
		
		var rating   = $('<div class="rating"></div>');
		var detail   = $('<div class="detail"></div>');
		
		var genre_p      = '<p>Genre: ';
		for (var i = 0; i < genre.length; ++i) {
			if (i != genre.length - 1) {
				genre_p += genre[i] + ', ';
			} else {
				genre_p += genre[i];
			}
		}
		
		genre_p += '</p>';
		
		var cast_p       = '<p>Cast: ';
		
		for (var i = 0; i < cast.name.length; ++i) {
			if (i != cast.name.length - 1) {
				cast_p += cast.name[i] + ', ';
			} else {
				cast_p += cast.name[i];
			}
		}
		
		cast_p += '</p>';
		
		var plot_p       = '<p>Plot: ' + plot + '</p>';
		
		detail.append(genre_p);
		detail.append(cast_p);
		detail.append(plot_p);
		
		rating.append(ratingblock);
		rating.append(ratingnum);
		
		var clrdiv   = $('<div class="clr"></div>');
		
		var leftimge  = '<img class="fillet10 mCS_img_loaded" src="' + thumbnail + '"width="209" height="305"/>';
		var righttitle = '<h3>' + title + '</h3>';
		
		leftdiv.append(leftimge);
		rightdiv.append(righttitle);
		rightdiv.append(rating);
		rightdiv.append(detail);
		
		topdiv.append(leftdiv);
		topdiv.append(rightdiv);
		topdiv.append(clrdiv);
		
		$(".posterList .mCSB_container").append(topdiv);
		//$('#pl').append(topdiv);
		
		GetEpisodes(idtvshow, title);
	} catch (err) {
		
	}
}

function GetTvshowDetails(idtvshow) {
	PreDisplay($('#teleplay'));
	$('.posterMenubtn').hide();
	
	vidonme.rpc.request({
		'context': this,
		'method': 'VideoLibrary.GetTvShowDetails',
		'params': {
			'idtvshow': idtvshow
		},
		'success': function(data) {
			if (data && data.result) {
				var poster  = global_image_url + encodeURI(data.result.tvshowdetails.thumbnail);
				var plot    = data.result.tvshowdetails.plot;
				var year    = data.result.tvshowdetails.year;
				var title   = data.result.tvshowdetails.title;
				var rating  = data.result.tvshowdetails.rating;

				var cast = new Array();
				cast.name = new Array();
				cast.role = new Array();
				cast.thumbnail = new Array();
				
				for (var i = 0; i < data.result.tvshowdetails.cast.length; ++i) {
					cast.name.push(data.result.tvshowdetails.cast[i].name);
					cast.role.push(data.result.tvshowdetails.cast[i].role);
					cast.thumbnail.push(global_image_url + data.result.tvshowdetails.cast[i].thumbnail);
				}
				
				var genre = new Array();
				for (var i = 0; i < data.result.tvshowdetails.genre.length; ++i) {
					genre.push(data.result.tvshowdetails.genre[i]);
				}
				
				GetTvshowSeasons(idtvshow, title, rating, poster, genre, cast, plot);
			}
		}
	});
}

function __GetMovies(start, end, state) {
	$("#siderbar dd").eq(0).addClass("selected");
	$(".movie").removeClass("teleplay");
	var __start = arguments[0] ? start : 0;
	var __end   = arguments[1] ? end : 20;
	
	var obj = new JsonObject();
	obj.limits = new Limits(__start, __end);
	obj.sort = (new Sort()).byDateAdded();
	// obj.filter = (new Filter()).byCountry("United States of America");
	obj.properties = new Array();
	
	obj.properties.push("file");
	obj.properties.push("year");
	obj.properties.push("thumbnail");
	obj.properties.push("runtime");
	obj.properties.push("title");
	
	$('.posterMenubtn').show();
		
	vidonme.rpc.request({
		'context': this,
		'method': 'VideoLibrary.GetMovies',
		'params': obj,
		'success': function(data) {
			if (data && data.result) {
				if (data.result.limits.end != -1) {
					// check is in Movie show page
					if ( g_selected_type != 'movie' ) {
						return;
					}

					for (var i = 0; i < data.result.limits.end - data.result.limits.start; ++i) {
						var poster  = global_image_url + encodeURI(data.result.movies[i].thumbnail);
						var name    = data.result.movies[i].title;

						var box = $('<div class="box"></div>');
						var pic = $('<div class="pic"></div>');						
						
						//var content = '<div class="img fillet10" onclick="showdiv(\'.addNoPlay\', 1)"><div class="imgmoviebg"></div><img class="fillet10" src="' + poster + '"/><div class="imgbg"></div></div><p class="imgname">' + name + '</p>';// width="209" height="319" 
						var content = '<div class="img fillet10" onclick="showdiv(\'.addNoPlay\', 1)" style="background-image:url(' + poster +  '); "><div class="imgbg"></div></div><p class="imgname">' + name + '</p>';
						//var content = '<div class="img fillet10" onclick="showdiv(\'.addNoPlay\', 1)"><img class="fillet10" src="' + poster + '"/><div class="imgbg"></div></div><p class="imgname">' + name + '</p>';
						pic.append(content);
						box.append(pic);
						//$('#pl').append(box);
						$(".posterList .mCSB_container").append(box);
					}

					FreshMediasCount();

					if ( data.result.limits.total > data.result.limits.end ) {
						__GetMovies( data.result.limits.end+1, data.result.limits.total, 'finish' );
					}
				}
			}
		}
	});
}

function __GetTvshows(start, end, state) {
	$(".movie").addClass("teleplay");
	var __start = arguments[0] ? start : 0;
	var __end   = arguments[1] ? end : 20;
	
	var obj = new JsonObject();
	obj.limits = new Limits(__start, __end);
	obj.sort = (new Sort()).byDateAdded();
	
	obj.properties = new Array();
	obj.properties.push("file");
	obj.properties.push("plot");
	obj.properties.push("thumbnail");
	obj.properties.push("title");
	obj.properties.push("year");
	obj.properties.push("season");
	obj.properties.push("episode");
	
	vidonme.rpc.request({
		'context': this,
		'method': 'VideoLibrary.GetTVShows',
		'params': obj,
		'success': function(data) {
			if (data && data.result) {
				if (data.result.limits.end == -1) {
					/*
					if ('finish' == state) {
						clearInterval(global_media_timer);
					} else {
						return;	
					}
					*/
				} else {
					if ( g_selected_type != 'tvshow' ) {
						return;
					}

					for (var i = 0; i < data.result.limits.end - data.result.limits.start; ++i) {
						var idtvshow = data.result.tvshows[i].idtvshow; 
						var poster  = global_image_url + encodeURI(data.result.tvshows[i].thumbnail);
						var name    = data.result.tvshows[i].title;
						
						var box = $('<div class="box"></div>');
						var pic = $('<div class="pic"></div>');
						$('.posterMenubtn').show();
						
						//var content = '<div class="img fillet10" onclick="GetTvshowDetails(' + idtvshow + ')"><div class="imgteleplaybg"></div><img class="fillet10" src="' + poster + '"/></div><p class="imgname">' + name + '</p>';//width="209" height="319" 
						var content = '<div class="img fillet10" onclick="GetTvshowDetails(' + idtvshow + ')" style="background-image:url(' + poster +  '); "><div class="imgbg"></div></div><p class="imgname">' + name + '</p>';
						
						pic.append(content);
						box.append(pic);
						$(".posterList .mCSB_container").append(box);
					}

					FreshMediasCount();

					if ( data.result.limits.total > data.result.limits.end ) {
						__GetTvshows( data.result.limits.end+1, data.result.limits.total, 'finish' );
					}
				}
			}
		}
	});
}

function __GetPrivVideos(start, end, state) {
	$(".movie").removeClass("teleplay");
	var __start = arguments[0] ? start : 0;
	var __end   = arguments[1] ? end : 20;
	
	var obj = new JsonObject();
	obj.limits = new Limits(__start, __end);
	obj.sort = (new Sort()).byDateAdded();
	
	obj.properties = new Array();
	obj.properties.push("file");
	obj.properties.push("thumbnail");
	obj.properties.push("title");
	
	vidonme.rpc.request({
		'context': this,
		'method': 'VideoLibrary.GetPrivVideos',
		'params': obj,
		'success': function(data) {
			if (data && data.result) {
				if (data.result.limits.end == -1) {
					/*
					if ('finish' == state) {
						clearInterval(global_media_timer);
					} else {
						return;	
					}
					*/
				} else {
					if ( g_selected_type != 'video' ) {
						return;
					}

					for (var i = 0; i < data.result.limits.end - data.result.limits.start; ++i) {
						var box = $('<div class="box"></div>');
						var pic = $('<div class="pic"></div>');
						
						var poster  = global_image_url + encodeURI(data.result.privvideos[i].thumbnail);
						var name    = data.result.privvideos[i].title;
						//var content = '<div class="img fillet10" onclick="showdiv(\'.addNoPlay\', 1)"><div class="imgmoviebg"></div><img class="fillet10" src="' + poster + '"/></div><p class="imgname">' + name + '</p>';//width="209" height="319" 
						var content = '<div class="img fillet10" onclick="showdiv(\'.addNoPlay\', 1)" style="background-image:url(' + poster +  '); "><div class="imgbg"></div></div><p class="imgname">' + name + '</p>';
						pic.append(content);
						box.append(pic);
						$(".posterList .mCSB_container").append(box);
					}

					FreshMediasCount();
					
					if ( data.result.limits.total > data.result.limits.end ) {
						__GetPrivVideos( data.result.limits.end+1, data.result.limits.total, 'finish' );
					}
				}
			}
		}
	});
}

function ShowPictureDiv(url) {
	$(".vidoncover").show();
	$(".vidoncover").css('height', $(document).height());
	$("body", "html").css({
		height: "100%",
		width: "100%"
    	});

	var date = new Date();
	var img = new Image();
	img.src = url + '?temp_id=' + date.getTime();
	img.onload = function(){
		var img_w = img.width;
		var img_h = img.height;
		
		if (img_w > $(window).width() || img_h > $(window).height()) {
			if ((img_w/img_h) > ($(window).width()/$(window).height())) {
				var img_x_scale = $(window).width() * 90 / 100 / img.width;

				img.width = img.width * img_x_scale;
				img.height = img.height * img_x_scale;
			} else if ((img_w/img_h) < ($(window).width()/$(window).height())) {
				var img_y_scale = $(window).height() * 90 / 100 / img.height;
				
				img.width = img.width * img_y_scale;
				img.height = img.height * img_y_scale;
			} else {
				img.width = img.width * $(window).width() * 90 / 100;
				img.height = img.height * $(window).height() * 90 / 100;
			}
		}
		
		$(".loadimg").css("width", img.width + "px");
		$(".loadimg").css("height", img.height + "px");
		
		//$(".loadimg").css("background-image", 'url(' + '"' + url + '"' + ')');
		$("#realimg").attr({style:'width:' + img.width + 'px;height:' + img.height + 'px;'});
		$("#realimg").attr('src', img.src);
	
		if ($.browser.msie && ($.browser.version == "6.0") && !$.support.style) {
				$(".loadimg").css("top", ($(window).height() - $(".loadimg").height()) / 2 + $(window).scrollTop() + "px");
				$(".closeimg").css("top", ($(window).height() - $(".loadimg").height()) / 2 + $(window).scrollTop() + "px");
		} else {
			$(".loadimg").css("top", ($(window).height() - $(".loadimg").height()) / 2 + $(window).scrollTop() + "px");
			$(".closeimg").css("top", ($(window).height() - $(".loadimg").height()) / 2 + $(window).scrollTop() + "px");
		}

		$(".loadimg").css("left", ($(window).width() - $(".loadimg").width()) / 2 + "px");
		$(".loadimg").fadeIn("slow");
		
		$(".closeimg").css("left", ($(window).width() - $(".loadimg").width()) / 2 + $(".loadimg").width() - $(".closeimg").width() + "px");
		$(".closeimg").fadeIn("slow");
		$(".closeimg").attr("onclick", "HidePictureDiv()");
		
		$(".loadimg").show();
		$(".closeimg").show();
 	}

	$(window).resize(function() {
		$(".loadimg").css("top", ($(window).height() - $(".loadimg").height()) / 2 + "px");
		$(".loadimg").css("left", ($(window).width() - $(".loadimg").width()) / 2 + "px");
		
		$(".closeimg").css("top", ($(window).height() - $(".closeimg").height()) / 2 + "px");
		$(".closeimg").css("left", ($(window).width() - $(".closeimg").width()) / 2 + "px");
	});
}

function HidePictureDiv() {
	$(".vidoncover").hide();
	$(".loadimg").hide();
	$(".closeimg").hide();
}

function ShowPicture(url) {
	url = unescape(url);
	ShowPictureDiv(url);
}

function GetMediaInformation(mediatype, reset) {
	var start = 0;
	if ( reset == true ) {
		start = 0;
	}
	else{
		start = $(".posterList .box").length;
	}

	var end   = start + 100;
	var state = "finish";

	$('.photoblock').hide();
	
	if ('movie' == mediatype) {
		$(".posterMenu").show();
		__GetMovies(start, end, state);
	} else if ('tvshow' == mediatype) {
		$(".posterMenu").show();
		__GetTvshows(start, end, state);
	} else if ('video' == mediatype) {
		$(".posterMenu").show();
		__GetPrivVideos(start, end, state);
	} else if ('image' == mediatype) {
		$(".posterMenu").hide();
		$('.photoblock').show();
	} else {
		alert("Bad parameter");
		//clearInterval(global_media_timer);
	}
}

function GetMovies() {
	g_selected_type = 'movie';
	PreDisplay($('#movie'));
	GetMediaInformation('movie', true);
}

function GetTvshows() {
	/*
	if (global_media_timer > 0) {
		clearInterval(global_media_timer);
	};*/
	
	g_selected_type = 'tvshow';
	PreDisplay($('#teleplay'));
	GetMediaInformation('tvshow', true);
	
	/*
	global_media_timer = setInterval(function(){
		
	},
	200);*/
}

function GetPrivVideos() {
	g_selected_type = 'video';
	PreDisplay($('#home_video'));
	GetMediaInformation('video', true)
}

function GetPictures() {
	g_selected_type = 'image';
	PreDisplay($('#images'));
	GetMediaInformation('image', true);
}

function FreshMedias(){
	//GetMediaInformation(g_selected_type, false);

	
	if (g_selected_type == 'movie') {
		GetMovies();
	}
	else if (g_selected_type == 'tvshow') {
		GetTvshows();
	}
	else if (g_selected_type == 'video') {
		GetPrivVideos();
	}
	else if (g_selected_type == 'image') {
		GetPictures();
	}
	else{

	}
}

function FreshMediasCount(){
	count = $(".posterList .box").length;
	var str;
	if (g_selected_type == 'movie') {
		str = $.i18n.prop('Movies_Count')
		str = str.format( count );
	}
	else if (g_selected_type == 'tvshow') {
		str = $.i18n.prop('TVShows_Count')
		str = str.format( count );
	}
	else if (g_selected_type == 'video') {
		str = $.i18n.prop('Videos_Count')
		str = str.format( count );
	}
	else if (g_selected_type == 'image') {
		str = $.i18n.prop('Images_Count')
		str = str.format( count );
	}
	else{

	}

	$('#mediatype').html(str);
}

window.onload = function() {
	GetMovies();
	RefreshMediaLibrary("commercial");
	
	vidonme.rpc.request({
		        'context': this,
		        'method': 'VidOnMe.IsWizzardEnabled',
		        'params': {},
		        'success': function(data) {
					if( data ){
						if( data.result.ret == true ){
							location.assign("guide.html");
							window.location="guide.html";
							location.href="guide.html";
						}
					}
			    }
	    });
}

var global_image_url = 'http://localhost:32080/image/';
var global_count_timer = -1;
var g_selected_type = "movie";