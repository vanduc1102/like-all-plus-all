LOGGER('Like all');
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
  	main(scrollTimes, timerPerClick);	
});

function main(scrollTimes, timerPerClick){
	LOGGER('scrollTimes '+ scrollTimes + " ; timerPerClick : "+ timerPerClick);
	loadMoreByScroll(null,scrollTimes).then(function(response){
		LOGGER('isFriendsOfFriend Done load more page');	
		var buttons = getAllVisible($("button.FriendRequestAdd.addButton"));
		LOGGER('isFriendsOfFriend Number of buttons '+ buttons.length);	
		clickButtonListOneByOne(buttons,timerPerClick,0).then(function(done){
			sendNumberToActionButton(0);
		});	
	});	
}