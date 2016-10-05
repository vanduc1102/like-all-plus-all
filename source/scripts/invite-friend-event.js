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
	LOGGER('Invite friend request to Event page');
	if(checkLoadMoreAble()){
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
				LOGGER("Finished find from left panel");
			});
		}
	}else{
		alert("Please goto your Event page");
	}
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

function checkLoadMoreAble() {
	var fullUrl = getFullUrl();
	if(fullUrl.indexOf("www.facebook.com/events/") > -1){
		return true;
	}
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