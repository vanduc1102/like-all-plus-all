LOGGER('Send friend request');
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
	if(checkLoadMoreAble()){
		loadMoreByScroll(null,scrollTimes).then(function(response){
			LOGGER('Done load more page');	
			var buttons = $("li .FriendRequestAdd").filter(function(index){
				var btn = $(this);
				return !btn.hasClass('hidden_elem') && btn.is(":visible");
			});
			LOGGER('Number of buttons '+ buttons.length);	
			clickButtonListOneByOne(buttons,timerPerClick,0).then(function(done){
				sendNumberToActionButton(0);
			});	
		});
	}else if(isFriendsOfFriend()){
		loadMoreByScroll(null,scrollTimes).then(function(response){
			LOGGER('isFriendsOfFriend Done load more page');	
			var buttons = getAllVisible($("button.FriendRequestAdd.addButton"));
			LOGGER('isFriendsOfFriend Number of buttons '+ buttons.length);	
			clickButtonListOneByOne(buttons,timerPerClick,0).then(function(done){
				sendNumberToActionButton(0);
			});	
		});
	}else{
		var dialogBox = $("div[role='dialog'] ul[id*='reaction_profile_browser'").filter(function(index){
			return $(this).is(":visible");
		});
		if(dialogBox.length > 0 ){
			var buttons = dialogBox.find(".FriendButton > button.FriendRequestAdd").filter(function(index){
				var btn = $(this);
				return !btn.hasClass('hidden_elem') && btn.is(":visible");
			});
			LOGGER('Number of buttons '+ buttons.length);
			clickButtonListOneByOne(buttons,timerPerClick,0).then(function(response){
				sendNumberToActionButton(0);
				LOGGER("Finished find friend on Post");
			});	
		}else if(checkGroupMememer()){
			var loadMoreSelector = "a[href*='/ajax/browser/list/group_members/']";
			frLoadMoreByScrollWithSelectorCondition(loadMoreSelector).then(function(response){
					var buttons = $("button.FriendRequestAdd.addButton").filter(function(index){
						return  $(this).is(":visible");
					});
					LOGGER('Number of buttons '+ buttons.length);
					clickButtonListOneByOne(buttons,TIME_PER_CLICK,0).then(function(response){
						sendNumberToActionButton(0);
						LOGGER("Finished find friend on Post");
					});	
			});
		}else{
			var buttonCssSelector = 'div#rightCol div.clearfix.ego_unit button';
			clickOnXpathButtonTill(buttonCssSelector,timerPerClick + 2000,100).then(function(response){
				sendNumberToActionButton(0);
				LOGGER("Finished find of left panel");
			});
		}
	}
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

function frLoadMoreByScrollWithSelectorCondition(selectorCondition){
	var d = $.Deferred();
	return frScrollToBottomConditionWrapper(d,1,selectorCondition);
}

function isFriendsOfFriend(){
	var friendsLink = getAllVisible($("#pagelet_timeline_medley_friends"));
	return friendsLink.length > 0;
}

function frScrollToBottomConditionWrapper(d,times,conditionSelector){
	if(times == 50){
		LOGGER("Stop scrollToBottomConditionWrapper, cause it reach the maximum.");
		d.resolve();
		return d.promise();
	}
	LOGGER("Load more by click loadMoreElement  "+ times);
	times ++;
	frScrollToBottomCondition( conditionSelector).then(function(resolve){
		frScrollToBottomConditionWrapper(d,times,conditionSelector);
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