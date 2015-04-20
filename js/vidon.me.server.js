
function getLastScraperResult(){
	vidonme.rpc.request({
		'context': this,
		'method': 'VidOnMe.GetLastScraperStatistics',
		'params': {
		},
		'success': function(data) {
			if ( data ) {
				var tips = '<p>' + "The last scraper result is {0}/{0}" + '</p>';
				tips = tips.format( data.result.total.failed_amounts, data.result.total.success_amounts );
				$(".movieTips").html( tips );
				$("#fresh").removeClass("loading");
				//$('#scrapertest').html( tips );

				setTimeout( function(){
					$(".movieTips").hide();
					//$('#scrapertest').hide();
				}, 5000 );
			};
		}
	});
}

var freshScraperStatus = -1;
function getScraperStatus() {
	vidonme.rpc.request({
		'context': this,
		'method': 'VidOnMe.GetCurrentScraperState',
		'params': {
		},
		'success': function(data) {
			if (data) {
				var status = data.result.total.state;

				if ( status == "finish" && freshScraperStatus > 0 ) {
					clearInterval( freshScraperStatus );
					freshScraperStatus = -1;
				}
				else if ( status != "finish" && freshScraperStatus <= 0 ) {
					freshScraperStatus = setInterval( getScraperStatus, 1000 );
					$("#fresh").addClass("loading");
				}
				

				var tips;
				if ( status == "ready" ) {
					tips = '<p>' + "Server is ready for scanning" + '<p>';
				}
				else if ( status == "scanning" ) {
					tips = '<p>' + "Server is scanning" + '<p>';
				}
				else if ( status == "scraping" ) {
					tips = '<p>' + "Server is scraping {0}/{0}" + '<p>';
					tips = tips.format( data.result.total.amounts, data.result.total.finished );
				}
				else if ( status == "finish" ) {
					FreshMedias();
					getLastScraperResult();
				}
				else{

				};

				if ( tips ) {
					$(".movieTips").html( tips );
					$(".movieTips").show();

					//$('#scrapertest').html( tips );
					//$('#scrapertest').show();
				};
			} else {
				alert(data.result.err);
			}
		}
	});
}

String.prototype.format=function()  
{  
  if(arguments.length==0) return this;  
  for(var s=this, i=0; i<arguments.length; i++)  
    s=s.replace(new RegExp("\\{"+i+"\\}","g"), arguments[i]);  
  return s;  
}; 
