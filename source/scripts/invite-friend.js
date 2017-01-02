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
  	addRunningBackgroundColor();
  	if(isEventPage()){
  		inviteFriendEvent(timerPerClick, scrollTimes);
  	}else if(isFanPage()){
  		inviteFriendPage(timerPerClick, scrollTimes);
  	}else{
  		alert("This function only work on Event or Page");
  	}
});
function inviteFriendEvent(timerPerClick, scrollTimes){
	LOGGER('Invite friend request to Event page');
	if(checkLoadMoreAbleEventPage()){
		var scrollSelector = "div.uiScrollableAreaGripper";
		var buttonSelector = "a[aria-checked=\"false\"][role=\"checkbox\"]";
		if(checkFormIsOpen()){
			var scrollContainerElement = $('div.uiScrollableArea').filter(function(item){ return $(this).find('a[role="checkbox"]').length > 0});
			var containterElement = scrollContainerElement.find("div.uiScrollableAreaTrack");
			if(containterElement){
				containterElement.removeClass('invisible_elem');
				containterElement.css({'opacity':1});
			}
			inviteLoadMoreByScrollWithSelectorCondition(scrollContainerElement,scrollSelector,buttonSelector).then(function(response){
				LOGGER('Done load more page');
				var checkAllButton = scrollContainerElement.find("div.rfloat a");
				if(checkAllButton.length > 0){
					var allButtons = scrollContainerElement.find("a[role=\"checkbox\"]");
					var unselectedButtons = scrollContainerElement.find(buttonSelector);
					if(allButtons.length < unselectedButtons.length * 2){
						checkAllButton[0].click();
					}
					sendInvitation(timerPerClick);
				}else{
					var buttons = getAllVisible(scrollContainerElement.find(buttonSelector));
					LOGGER('Number of buttons '+ buttons.length);	
					clickButtonListOneByOne(buttons,timerPerClick,0).then(function(done){
						sendNumberToActionButton(0);
						sendInvitation(timerPerClick);
					});
				}
					
			});
		}else{
			var buttonCssSelector = 'a[role="button"][ajaxify^="/ajax/events/invite/suggestions/"]';
			clickOnXpathButtonTill(buttonCssSelector,timerPerClick + 1000,100).then(function(response){
				sendNumberToActionButton(0);
				removeRunningBackgroundColor();
				LOGGER("Finished find from left panel");
			});
		}
	}else{
		alert("Please goto your Event page");
	}
}
function inviteFriendPage(timerPerClick, scrollTimes){
	LOGGER('Invite friend request');
	//debugger;	
	var inviteFriendButton = document.querySelectorAll("a[role='button'][href^='/ajax/choose/?type=fan_page&'] > div")[0];
	var POPUP_SELECTOR = 'input.inputtext.autofocus.textInput';
	clickOnButton(inviteFriendButton, 1000, -1).then(function(response){
		waitForElementToDisplay(POPUP_SELECTOR).then(function(response){
			setTimeout(function(){
				if(  checkInviteOnPageDisplayed()){
					var scrollSelector = ".fbProfileBrowserResult.scrollable.hideSummary";
					var buttonSelector = "a.uiButton";
					loadMoreByScrollWithSelectorCondition(scrollSelector,buttonSelector).then(function(response){
						LOGGER('Done load more page');	
						var buttons = $(buttonSelector).filter(function(index){
							return $(this).is(":visible");
						});
						LOGGER('Number of buttons '+ buttons.length);	
						clickButtonListOneByOne(buttons,timerPerClick,0).then(function(done){
							removeRunningBackgroundColor();
							sendNumberToActionButton(0);
						});	
					});
				}else{
					alert("Please open your fan page.");
				}
			},5000);
		});	
	});	
};

function checkInviteOnPageDisplayed() {
 	var form = $('form[action*="ajax/pages/invite/"]');
 	return form.is(":visible");
}
function sendInvitation(timerPerClick){
	setTimeout(function(){
		var sendInvitationBtn = getAllVisible($('#inviter > table .uiOverlayFooterButtons > button.layerConfirm'));
		if(sendInvitationBtn.length > 0){
			sendInvitationBtn[0].click();
		}
	},timerPerClick);
}
function checkFormIsOpen(){
	var formSelector = "form[action^=\"/ajax/events/permalink/invite.php\"]";
	var formSelectorObject  = $(formSelector);
	return formSelectorObject.length > 0 && formSelectorObject.is(":visible");
}

function checkLoadMoreAbleEventPage() {
	if(getFullUrl().indexOf("www.facebook.com/events/") > -1){
		return true;
	}
	return false;
}
function isEventPage(){
	return getFullUrl().indexOf("/events/") > -1;
}
function isFanPage(){
	return $("#pages_manager_top_bar_container").length > 0;
}
function inviteLoadMoreByScrollWithSelectorCondition(parentElement,scrollSelector,selectorCondition){
	var d = $.Deferred();
	return inviteScrollToBottomConditionWrapper(parentElement,scrollSelector,d,1,selectorCondition);
}

function inviteScrollToBottomConditionWrapper(parentElement,scrollbarSelector,d,times,conditionSelector){
	if(times == 30){
		LOGGER("Stop scrollToBottomConditionWrapper, cause it reach the maximum.");
		d.resolve();
		return d.promise();
	}
	LOGGER("Load more by scroll  "+ times);
	times ++;
	inviteScrollToBottomCondition(parentElement,scrollbarSelector , conditionSelector).then(function(resolve){
		inviteScrollToBottomConditionWrapper(parentElement,scrollbarSelector,d,times,conditionSelector);
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
function inviteScrollToBottomCondition(parentElement,scrollbarSelector, conditionSelector){
	var d = $.Deferred();
	var currentElements = parentElement.find(conditionSelector);
	if(scrollbarSelector){
		var element = parentElement.find(scrollbarSelector).get(0);
		if(!element){
			d.reject();
		}
		var uiScrollableAreaWrapper = parentElement.find("div.uiScrollableAreaWrap.scrollable");
		var scrollerElement = parentElement.find("div.uiScrollableAreaBody");
		var newHeight = Number(scrollerElement.height()) + Number(uiScrollableAreaWrapper.height()) * getRandom(1,5);
	    uiScrollableAreaWrapper.scrollTop(newHeight);
	}else{
		window.scrollTo(0,document.body.scrollHeight);
	}
	window.setTimeout(function(){
		var elementsAfterScroll  = parentElement.find(conditionSelector);
		if(elementsAfterScroll.length > currentElements.length){
			LOGGER("Number of element increase from "+currentElements.length + " to " + elementsAfterScroll.length);
			d.resolve();		
		}else{
			LOGGER("Number of element not change, Stop scroll");
			d.reject();
		}
	}, 4000 +  getRandom(1,1000));
	return d.promise();
}