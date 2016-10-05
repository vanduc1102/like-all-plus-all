chrome.storage.sync.get({
	"google": "post",
	"google_time":"1.0",
	"facebook": "post",
	"facebook_time":"1.0",
	"twitter_time":"0.8",
	"numberOfScroll":0
  }, function(cfgData) {
  	LOGGER(cfgData);
  	var scrollTimes = Number(cfgData["numberOfScroll"]); 
  	var timerPerClick = Number(cfgData["facebook_time"]) * 1000 * 2;
  	main(timerPerClick, scrollTimes);	
});
function main(timerPerClick, scrollTimes) {
    LOGGER('Confirm friend request');
    if(checkLoadMoreAble()){
	    loadMoreByElement('a[class~="uiMorePagerPrimary"][rel="async"]', 10).then(function(response) {
	        LOGGER('Done load more page');
	        var buttons = $(".ruResponseButtons > button").filter(function(index){
	        	return $(this).is(":visible");
	        });
	        LOGGER('Number of buttons ' + buttons.length);
	        clickButtonListOneByOne(buttons, timerPerClick, 0).then(function(response){
				sendNumberToActionButton(0);
				LOGGER("Finished find of left panel");
			});
	    });
	}else{
		var buttons = $("div#fbRequestsList_wrapper button[name=\"actions[accept]\"]").filter(function(index){
			return $(this).is(":visible");
		});
	    LOGGER('Number of buttons ' + buttons.length);
	    clickButtonListOneByOne(buttons, timerPerClick, 0).then(function(response){
			sendNumberToActionButton(0);
			LOGGER("Finished find of left panel");
		});
	}
};

function checkLoadMoreAble() {
    var links = ["https://www.facebook.com/?sk=ff",
        "https://www.facebook.com/friends/requests/?fcref=jwl",
        "https://www.facebook.com/find-friends/browser/?ref=psa"];
    var fullUrl = getFullUrl();
    return checkLinkInLinks(fullUrl, links);
}
