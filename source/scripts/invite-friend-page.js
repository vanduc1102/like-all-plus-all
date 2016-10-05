//fbProfileBrowserResult scrollable threeColumns hideSummary
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
function main(timerPerClick, scrollTimes){
	LOGGER('Invite friend request');	
	if(checkLoadMoreAble()){
		var scrollSelector = ".fbProfileBrowserResult.scrollable.hideSummary";
		var buttonSelector = "a.uiButton";
		loadMoreByScrollWithSelectorCondition(scrollSelector,buttonSelector).then(function(response){
			LOGGER('Done load more page');	
			var buttons = $(buttonSelector).filter(function(index){
				return $(this).is(":visible");
			});
			LOGGER('Number of buttons '+ buttons.length);	
			clickButtonListOneByOne(buttons,timerPerClick,0).then(function(done){
				sendNumberToActionButton(0);
			});	
		});
	}else{
		alert("Please goto your fanpage, and open invite friend list");
	}
};

function checkLoadMoreAble() {
 	var form = $('form[action*="ajax/pages/invite/"]');
 	return form.is(":visible");
}