LOGGER('Send friend request');
LOGGER_CATEGORY = "Add friends";
var MAX_FRIEND_REQUESTS = 100;
chrome.storage.sync.get({
	"google": "post",
	"google_time":"1.0",
	"facebook": "post",
	"facebook_time":"1.0",
	"twitter_time":"0.8",
	"numberOfScroll":0
  }, function(cfgData) {
  	LOGGER(cfgData);
  	addRunningBackgroundColor();
  	var scrollTimes = Number(cfgData["numberOfScroll"]);
  	if(scrollTimes == 0){
  		scrollTimes = 10;
  	}  
  	var timerPerClick = Number(cfgData["facebook_time"]) * 1000 * 2;
  	main(scrollTimes, timerPerClick);	
});

function main(scrollTimes, timerPerClick){
	// if(DEBUG) {
	// 	debugger;
	// }
	LOGGER('scrollTimes '+ scrollTimes + " ; timerPerClick : "+ timerPerClick);
	if(checkLoadMoreAble()){
		loadMoreByScroll(null,scrollTimes).then(function(response){
			LOGGER('Done load more page');	
			var buttons = $("li .FriendRequestAdd");
			LOGGER('Number of buttons '+ buttons.length);	
			clickButtonListOneByOne(buttons,timerPerClick,0,closeSuggestFriendPopUp).then(function(done){
				sendNumberToActionButton(0);
				removeRunningBackgroundColor();
			});	
		});
	}else if(isFriendsOfFriend()){
		loadMoreByScroll(null,scrollTimes).then(function(response){
			LOGGER('isFriendsOfFriend Done load more page');	
			var buttons = $("button.FriendRequestAdd.addButton");
			LOGGER('isFriendsOfFriend Number of buttons '+ buttons.length);	
			clickButtonListOneByOne(buttons,timerPerClick,0,closeSuggestFriendPopUp).then(function(done){
				sendNumberToActionButton(0);
				removeRunningBackgroundColor();
			});	
		});
	}else if(checkGroupMememer()){
		var loadMoreSelector = "a[href*='/ajax/browser/list/group_members/']";
		frLoadMoreByScrollWithSelectorCondition(loadMoreSelector, scrollTimes).then(function(response){
			var buttons = $("button.FriendRequestAdd.addButton");
			LOGGER('Number of buttons '+ buttons.length);
			clickButtonListOneByOne(buttons,timerPerClick,0,closeSuggestFriendPopUp).then(function(response){
				sendNumberToActionButton(0);
				removeRunningBackgroundColor();
				LOGGER("Finished find friend on Post");
			});	
		});
	}else{
		var dialogBox = $("div[role='dialog'] ul[id*='reaction_profile_browser'");
		if(dialogBox.length > 0 ){
			var buttons = dialogBox.find(".FriendButton > button.FriendRequestAdd");
			LOGGER('Number of buttons '+ buttons.length);
			clickButtonListOneByOne(buttons,timerPerClick,0,closeSuggestFriendPopUp).then(function(response){
				sendNumberToActionButton(0);
				removeRunningBackgroundColor();
				LOGGER("Finished find friend on Post");
			});	
		}else{
			var buttonCssSelector = 'div#rightCol div.clearfix.ego_unit button';
			var sendRequestOnHomePageButtons = $(buttonCssSelector);
			if(sendRequestOnHomePageButtons.length > 0){
				clickOnXpathButtonTill(buttonCssSelector,timerPerClick + 2000,MAX_FRIEND_REQUESTS).then(function(response){
					sendNumberToActionButton(0);
					removeRunningBackgroundColor();
					LOGGER("Finished find of left panel");
				});
			}else{
				var buttons = $("button.FriendRequestAdd.addButton");
				LOGGER('Number of buttons '+ buttons.length);
				clickButtonListOneByOne(buttons,timerPerClick,0,closeSuggestFriendPopUp).then(function(response){
					sendNumberToActionButton(0);
					removeRunningBackgroundColor();
					LOGGER("Finished find friend on Post");
				});	
			}
		}
	}
}

function closeSuggestFriendPopUp(){
	var button = $('a.layerCancel.selected');
	if(button.length > 0){
		if(button[0]){
			button[0].click();
		}		
	}
	LOGGER("Tried to close popup if existed");
}

function checkLoadMoreAble() {
    var links = ["https://www.facebook.com/?sk=ff",
        "https://www.facebook.com/friends/requests/?fcref=jwl",
        "https://www.facebook.com/find-friends/browser/?ref=psa"];
    var fullUrl = getFullUrl();
    return checkLinkInLinks(fullUrl, links);
}

function checkGroupMememer(){
	var fullUrl = getFullUrl();
	return (fullUrl.indexOf("members") > -1 && fullUrl.indexOf("groups") > -1);
}

function frLoadMoreByScrollWithSelectorCondition(selectorCondition, scrollTimes){
	var d = $.Deferred();
	return frScrollToBottomConditionWrapper(d,1,selectorCondition , scrollTimes);
}

function isFriendsOfFriend(){
	var friendsLink = getAllVisible($("#pagelet_timeline_medley_friends"));
	return friendsLink.length > 0;
}

function frScrollToBottomConditionWrapper(d,times,conditionSelector , scrollTimes){
	if((scrollTimes == times) || (times === 50)){
		LOGGER("Stop scrollToBottomConditionWrapper, cause it reach the maximum.");
		d.resolve();
		return d.promise();
	}
	LOGGER("Load more by click loadMoreElement  "+ times);
	times ++;
	frScrollToBottomCondition( conditionSelector).then(function(resolve){
		frScrollToBottomConditionWrapper(d,times,conditionSelector , scrollTimes);
	},function(reject){
		d.resolve();
	});
	return d.promise();
}

/*
* This medthod for scrolling util find nothing more of conditionSelector
* Example:
* scrollbarSelector = button container
* conditionSelector = button
* The method will stop if it find no more button after scroll.
*/
function frScrollToBottomCondition(conditionSelector){
	var d = $.Deferred();
	var loadMoreElement = $(conditionSelector);
	if(loadMoreElement.length > 0){
		loadMoreElement[0].click();
	}else{
		d.reject();
		return d.promise();
	}
	window.setTimeout(function(){
		d.resolve();
	}, 4000 +  getRandom(1,1000));
	return d.promise();
}