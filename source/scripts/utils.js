var DEBUG = false;
var CLICK_BUTTON = true;
var LOGGER_CATEGORY;
function LOGGER(p , arguments ){
	if(DEBUG){
		var  jsonArguments = arguments ? JSON.stringify(arguments) : "";
		if(LOGGER_CATEGORY){
			console.log(LOGGER_CATEGORY + " - ",p,jsonArguments);
		}else{
			console.log(p,jsonArguments);
		}
		
	}
}
function clickOnButton(button, time, number, additionalTask){
	var d = $.Deferred();
	// debugger;	
	if(isVisbile(button)){
		var rand = getRandom(1,1000) ;
		setTimeout(function() {
			executeFunction(additionalTask);
			// The root of everything
			number ++;
			LOGGER("button clicked : "+ number);		
			if(CLICK_BUTTON){			
				button.click();
			}		
			sendNumberToActionButton(number);
		    d.resolve(number);
		}, time + rand);
	}else{
		d.resolve(number);
	}
	return d.promise();
}

function executeFunction(varFunc){
	if (typeof varFunc === "function") {
		varFunc();
	}
}

function clickButtonListOneByOne(buttons, time, number, additionalTask) {
  var d = $.Deferred();
  var promise = d.promise();
  $.each(buttons, function(index, button) {
    promise = promise.then(function(number) {
    	number = number === undefined ? 0 : number;
    	return clickOnButton(button, time, number, additionalTask);
    });
  });
  d.resolve();
  return promise;
}

function clickButtonListOneByOneWithCloseWarning(buttons, time, number , warningButtonSelector) {
  var d = $.Deferred();
  var promise = d.promise();
  $.each(buttons, function(index, button) {
    promise = promise.then(function(number) {
    	number = number === undefined ? 0 : number;
		clickOnElementAndWait(warningButtonSelector);
    	return clickOnButton(button, time, number);
    });
  });
  d.resolve();
  return promise;
}
/*
* This method click on cssSelector till expected times.
*/
function loadMoreByElement(cssSelector, expected){
	var d = $.Deferred();
	return clickOnElementTill(cssSelector,d, 1, expected);
}
/*
Function scroll by given selector, 
support scroll by javascript not default browser scroll.
*/
function loadMoreByScroll(cssSelector,expected){
	var d = $.Deferred();
	return scrollWrapper(cssSelector,d,1,expected);
}

function clickOnXpathButtonTill(buttonXpath,time,expected){
	var d = $.Deferred();
	return clickOnXpathButtonRecursive(buttonXpath,d,time, 1,expected);
}

function clickOnElementTill(cssSelector,d, times, expected){
	if(expected != 0 && times == expected){
		d.resolve();
		return d.promise();
	}
	LOGGER("Load more by element  "+ times);
	clickOnElementAndWait(cssSelector).then(function(resolve){
		times ++;
		clickOnElementTill(cssSelector,d, times , expected);
	},function(reason){
		d.resolve();
	});
	return d.promise();
}

function clickOnElementAndWait(cssSelector){
	var d = $.Deferred();
	var elementObject = $(cssSelector).get(0);
	var rand = getRandom(1,1000) ;
	if(elementObject){
		setTimeout(function() {
			elementObject.click();
		}, 1000 + rand);
		
		setTimeout(function() {
			LOGGER("clickOnElementAndWait  ");
		    d.resolve();
		}, 5000 + rand);
	}else{
		d.reject();
	}
	return d.promise();
}

function scrollWrapper(cssSelector,d,times,expected){
	if(!times){
		if(expected == 5){
			d.resolve();
			return d.promise();
		}
	}else if(times == expected){
		d.resolve();
		return d.promise();
	}
	times ++;
	scrollToBottom(cssSelector).then(function(resolve){
		LOGGER("Load more by scroll  "+ times );
		scrollWrapper(cssSelector,d,times,expected);
	});
	return d.promise();
}
function clickOnXpathButtonRecursive(cssSelector, d, time, counter, expected){	
	if(counter == expected){
		d.resolve();
		return d.promise();
	}
	var button = $(cssSelector)[0];
	if(button){
		clickOnButton(button, time, counter).then(function(counter){
			clickOnXpathButtonRecursive(cssSelector, d, time, counter, expected);
		});
	}else{
		d.resolve();
	}
	return d.promise();
}
function scrollToBottom(cssSelector){
	var d = $.Deferred();
	if(cssSelector){
		 var element = $(cssSelector).get(0);
	     element.scrollTop = element.scrollHeight - element.clientHeight;
	}else{
		window.scrollTo(0,document.body.scrollHeight);
	}
	window.setTimeout(function(){
		d.resolve();		
	}, 4000 +  getRandom(1,1000));
	return d.promise();
}
function loadMoreByScrollWithSelectorCondition(scrollSelector,selectorCondition){
	var d = $.Deferred();
	return scrollToBottomConditionWrapper(scrollSelector,d,1,selectorCondition);
}

function scrollToBottomConditionWrapper(scrollbarSelector,d,times,conditionSelector){
	if(times == 50){
		LOGGER("Stop scrollToBottomConditionWrapper, cause it reach the maximum.");
		d.resolve();
		return d.promise();
	}
	LOGGER("Load more by scroll  "+ times );
	times ++;
	scrollToBottomCondition(scrollbarSelector , conditionSelector).then(function(resolve){
		scrollToBottomConditionWrapper(scrollbarSelector,d,times,conditionSelector);
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
function scrollToBottomCondition(scrollbarSelector, conditionSelector){
	var d = $.Deferred();
	var currentElements = $(conditionSelector);
	if(scrollbarSelector){
		var element = getFirstElement(scrollbarSelector);
		if(!element){
			d.reject();
		}else{
	    	element.scrollTop = element.scrollHeight - element.clientHeight;
	    }
	}else{
		window.scrollTo(0,document.body.scrollHeight);
	}
	window.setTimeout(function(){
		var elementsAfterScroll  = $(conditionSelector);
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

function getRandom(min,max){
	return Math.floor(Math.random() * max) + min ;
}

function openPage(url){
	var d = $.Deferred();
	window.location.href = url;
	window.setTimeout(function(){
		d.resolve();		
	}, 4000 +  getRandom(1,1000));
	return d.promise();
}
function waitForElementToDisplay(selector){
	var d = $.Deferred();
	waitForElementToDisplayPromise(selector, d).then(function(response){
		d.resolve();
	});
	return d.promise();
}
function waitForElementToDisplayPromise(selector, d) {	
    if($('form[action*="ajax/pages/invite/"]').is(":visible")) {
    	LOGGER("Finished waiting for selector appear : "+ selector);
        d.resolve();
        return d.promise();
    }else{
	    setTimeout(function() {
	    	LOGGER("Waiting for selector appear : "+ selector);
	        waitForElementToDisplayPromise(selector, d);
	    }, 500);
    }
    return d.promise();    
}

function getFullUrl(){
	return window.location.href;
}

function sendNumberToActionButton(number){
	if(!chrome.runtime){
		return;
	}
	chrome.runtime.sendMessage({count: number}, function(response) {
		//console.log(response);
	});  
}

function checkLinkInLinks(link, links) {
    var len = links.length;
    for(var i = 0 ; i < len;i++)
    {
        if(link.indexOf(links[i]) > -1){
        	return true;
        }
    }
    return false;
}
function xPath(xpth){
	var jpgLinks    = document.evaluate (
	    xpth,
	    document,
	    null,
	    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
	    null
	);
	var numLinks    = jpgLinks.snapshotLength;
	var result = [];
	for (var J = 0;  J < numLinks;  ++J) {
	    var thisLink = jpgLinks.snapshotItem (J);
	    result.push(thisLink);
	}
	return result;
}

function getFirstElement(cssSelector){
	var elements = $(cssSelector).filter(function(index){
		return $(this).is(":visible");
	});
	return elements.get(0);
}

function getAllVisible(elements){
	var visibleElements = elements.filter(function(index){
		return isVisbile(this);
	});
	return visibleElements;
}
function isVisbile(element){
	return $(element).is(":visible");
}

function sendAnalytic(buttonId){
	chrome.runtime.sendMessage({isAnalytic: true,
								buttonId: buttonId}, function(response) {
		//console.log(response);
	});  
}

function setStorageSync(object, callback){
	if(!object || !(object instanceof Object )){
		console.log("Incorrect object key");
		callback(null);
		return;
	}
	chrome.storage.sync.set(object, function() {
		callback(true);		
	});
}
function getStorageSync(object, callback){
	if(!object || !(object instanceof Object )){
		console.log("Incorrect object key");
		callback(null);
		return;
	}
	chrome.storage.sync.get(object, function(storagedObject) {
		callback(storagedObject);		
	});
}

function addRunningBackgroundColor(){
	var bodyElement = $('body');
	if(!bodyElement.hasClass('like-all-plus-all-running')){
		bodyElement.addClass('like-all-plus-all-running');
	}
}

function removeRunningBackgroundColor(){
	setTimeout(function(){
		var bodyElement = $('body');
		bodyElement.removeClass('like-all-plus-all-running');
	},3000);
	
}