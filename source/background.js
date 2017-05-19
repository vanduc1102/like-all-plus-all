//The main function.
log.debug("Background is running");
var youtubeURL = "www.youtube.com/watch";
var count = 0;
var currentTab = null;
var _gaq;
chrome.browserAction.onClicked.addListener(function(tab) {
    try {
        executeScripts(null, [
            { file: "libs/jquery.js" },
            { file: "scripts/utils.js" },
            { file: "scripts/content_script.js" },
            { file: "scripts/on-button-action-click.js" }
        ]);
        setBadgeText(tab, '');
        disableButton(tab);
        updateNumberOfUsed();
    } catch (e) {
        console.log('Exception on chrome.browserAction.onClicked');
    }
});

chrome.tabs.onCreated.addListener(function(tab) {
    currentTab = tab;
    log.debug('chrome.tabs.onCreated.addListener tab.id ' + tab.id + ' ; tab.url ' + tab.url);
    disableButton(tab);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    currentTab = tab;
    var url = tab.url;
    log.debug('chrome.tabs.onUpdated.addListener tab.id ' + tab.id + ' ; tab.url ' + tab.url);
    try {
        if (checkEnable(tab.url)) {
            enableButtonIfNoneText(tab);
        } else {
            disableButton(tab);
        }
    } catch (e) {
        log.debug(' Exception on chrome.tabs.onUpdated');
    }
    
    if (url !== undefined && changeInfo.status == "complete" && url.indexOf('youtube') > 0) {
        likeYoutubeVideo(tab.url);
    }
    
});
chrome.runtime.onInstalled.addListener(function(details) {
    log.debug("on Installed");
    //    setStorageNumber("isCloseOptionPage", false);
    chrome.storage.sync.get({
        isCloseOptionPage: false
    }, function(cfgData) {
        log.debug("Option is not opened yet!" + JSON.stringify(cfgData));
        if (!cfgData["isCloseOptionPage"]) {
            log.debug("Option tab is openning");
            openOptionPage();
            setStorageNumber("isCloseOptionPage", true);
        }
    });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    log.debug('receive: ' + request.count + " from tab : " + sender.tab.id + " content script:" + sender.tab.url);
    if (request.isAnalytic) {
        trackButton(request.buttonId);
        return;
    }
    if (request.count || request.count == 0) {
        count = request.count;
        var tab = sender.tab;
        if (count == 0) {
            setBadgeText(tab, getDefaultText(tab));
            enableButton(tab);
        } else {
            setBadgeNumber(tab, request.count);
            disableButton(tab);
        }
    }
});

var CONSTANT = {
    "FACEBOOK": {
        "MENUS": {
            "CONFIRM-FRIEND": "confirm-friend-request",
            "REQUEST-FRIEND": "send-friend-request",
            "LIKE-ALL": "like-all",
            "LIKE-POST": 'like-post',
            "LIKE-COMMENT": 'like-comment',
            "OPEN-COMMENT": 'open-comment',
            "INVITE-FRIEND": "invite-friend",
            "COMMENT": "comment",
            "STOP": "stop",
            "OPTION": "option"
        }
    }
}

function genericOnClick(info, tab) {
    log.debug("Cliked : " + info.menuItemId);
    if (!isFacebook(tab)) {
        log.debug("Context menus support Facebook only.");
        return;
    }
    trackButton(info.menuItemId);
    switch (info.menuItemId) {
        case CONSTANT["FACEBOOK"]["MENUS"]["CONFIRM-FRIEND"]:
            executeScripts(null, [
                { file: "libs/jquery.js" },
                { file: "scripts/utils.js" },
                { file: "scripts/confirm-friend.js" }
            ]);
            updateNumberOfUsed();
            break;
        case CONSTANT["FACEBOOK"]["MENUS"]["REQUEST-FRIEND"]:
            executeScripts(null, [
                { file: "libs/jquery.js" },
                { file: "scripts/utils.js" },
                { file: "scripts/request-friend.js" }
            ]);
            updateNumberOfUsed();
            break;
        case CONSTANT["FACEBOOK"]["MENUS"]["INVITE-FRIEND"]:
            executeScripts(null, [
                { file: "libs/jquery.js" },
                { file: "scripts/utils.js" },
                { file: "scripts/invite-friend.js" }
            ]);
            updateNumberOfUsed();
            break;
        case CONSTANT["FACEBOOK"]["MENUS"]["LIKE-ALL"]:
            executeScripts(null, [
                { file: "libs/jquery.js" },
                { file: "scripts/utils.js" },
                { file: "scripts/like-all.js" }
            ]);
            updateNumberOfUsed();
            break;
        case CONSTANT["FACEBOOK"]["MENUS"]["LIKE-POST"]:
            executeScripts(null, [
                { file: "libs/jquery.js" },
                { file: "scripts/utils.js" },
                { file: "scripts/like-post.js" }
            ]);
            updateNumberOfUsed();
            break;
        case CONSTANT["FACEBOOK"]["MENUS"]["LIKE-COMMENT"]:
            executeScripts(null, [
                { file: "libs/jquery.js" },
                { file: "scripts/utils.js" },
                { file: "scripts/like-comment.js" }
            ]);
            updateNumberOfUsed();
            break;
        case CONSTANT["FACEBOOK"]["MENUS"]["OPEN-COMMENT"]:
            executeScripts(null, [
                { file: "libs/jquery.js" },
                { file: "scripts/utils.js" },
                { file: "scripts/open-comment.js" }
            ]);
            updateNumberOfUsed();
            break;
        case CONSTANT["FACEBOOK"]["MENUS"]["OPTION"]:
            openOptionPage();
            //updateNumberOfUsed();
            break;
        case CONSTANT["FACEBOOK"]["MENUS"]["STOP"]:
            executeScripts(null, [
                { file: "scripts/utils.js" },
                { file: "scripts/stop-reload.js" }
            ]);
            break;
        default:
            break;
    }

}

function createContextMenus() {
    var fbUrlParterns = ["https://*.facebook.com/*", "http://*.facebook.com/*"];
    var rootFbMenu = chrome.contextMenus.create({ id: "facebook-auto", "title": "Facebook Auto", "contexts": ["all"], documentUrlPatterns: fbUrlParterns });
    chrome.contextMenus.onClicked.addListener(genericOnClick);

    // Create a parent item and two children.
    chrome.contextMenus.create({ "id": CONSTANT["FACEBOOK"]["MENUS"]["CONFIRM-FRIEND"], "title": "Accept Friends", "parentId": rootFbMenu, documentUrlPatterns: fbUrlParterns });
    chrome.contextMenus.create({ "id": CONSTANT["FACEBOOK"]["MENUS"]["REQUEST-FRIEND"], "title": "Add Friends", "parentId": rootFbMenu, documentUrlPatterns: fbUrlParterns });
    chrome.contextMenus.create({ "id": "separator1", type: 'separator', "parentId": rootFbMenu, documentUrlPatterns: fbUrlParterns });
    chrome.contextMenus.create({ "id": CONSTANT["FACEBOOK"]["MENUS"]["INVITE-FRIEND"], "title": "Invite Friends", "parentId": rootFbMenu, documentUrlPatterns: fbUrlParterns });
    chrome.contextMenus.create({ "id": "separator2", type: 'separator', "parentId": rootFbMenu, documentUrlPatterns: fbUrlParterns });
    chrome.contextMenus.create({ "id": CONSTANT["FACEBOOK"]["MENUS"]["LIKE-ALL"], "title": "Like all", "parentId": rootFbMenu, documentUrlPatterns: fbUrlParterns });
    chrome.contextMenus.create({ "id": CONSTANT["FACEBOOK"]["MENUS"]["LIKE-POST"], "title": "Like post", "parentId": rootFbMenu, documentUrlPatterns: fbUrlParterns });
    chrome.contextMenus.create({ "id": CONSTANT["FACEBOOK"]["MENUS"]["LIKE-COMMENT"], "title": "Like comment", "parentId": rootFbMenu, documentUrlPatterns: fbUrlParterns });
    chrome.contextMenus.create({ "id": "separator3", type: 'separator', "parentId": rootFbMenu, documentUrlPatterns: fbUrlParterns });
    chrome.contextMenus.create({ "id": CONSTANT["FACEBOOK"]["MENUS"]["OPEN-COMMENT"], "title": "Open comments", "parentId": rootFbMenu, documentUrlPatterns: fbUrlParterns });
    chrome.contextMenus.create({ "id": "separator4", type: 'separator', "parentId": rootFbMenu, documentUrlPatterns: fbUrlParterns });
    chrome.contextMenus.create({ "id": CONSTANT["FACEBOOK"]["MENUS"]["STOP"], "title": "Stop by Reload (F5)", "parentId": rootFbMenu, documentUrlPatterns: fbUrlParterns });
    chrome.contextMenus.create({ "id": CONSTANT["FACEBOOK"]["MENUS"]["OPTION"], "title": "Option", "parentId": rootFbMenu, documentUrlPatterns: fbUrlParterns });
}

createContextMenus();


function setBadgeNumber(tab, count) {
    if (checkEnable(tab.url)) {
        if (count > 999) {
            setBadgeText(tab, '99+');
        } else if (count == 0) {
            setBadgeText(tab, '');
        } else {
            setBadgeText(tab, String(count));
        }
    }
}

function setBadgeText(tab, text) {
    chrome.browserAction.setBadgeText({
        text: text,
        'tabId': tab.id
    });
}

function checkEnable(url) {
    for (idx in urls) {
        if (url.indexOf(urls[idx]) > 0) {
            return true;
        }
    }
    return false;
}

function checkTabIsEnable() {
    if (!currentTab || !currentTab.url) {
        return false;
    }
    var url = currentTab.url;
    return checkEnable(url);

}

function enableButtonIfNoneText(tab) {
    chrome.browserAction.getBadgeText({ "tabId": tab.id }, function(text) {
        log.debug("enableButtonIfNoneText : " + text);
        if (text == '') {
            enableButton(tab);
            setBadgeText(tab, getDefaultText(tab));
        }
    });
}

function enableButton(tab) {
    chrome.browserAction.enable(tab.id);
}

function disableButton(tab) {
    chrome.browserAction.disable(tab.id);
}

function getDefaultText(tab) {
    var url = tab.url;
    // Goole plus
    if (url.indexOf(urls[0]) > -1) {
        return "Plus";
    } else if (isConnect(url)) {
        return "Con.";
    } else {
        return "Like";
    }
}

function isFacebook(tab) {
    if (!tab || !tab.url) {
        return false;
    }
    var url = tab.url;
    if (url.indexOf(urls[1]) > 1) {
        return true;
    }
    return false;
}

function isConnect(currentUrl) {
    var urls = ["https://www.linkedin.com/vsearch/", "https://www.linkedin.com/mynetwork/"];
    var url = urls.find(link => currentUrl.indexOf(link) > -1);
    return url != undefined;
}

function likeYoutubeVideo(url) {
    chrome.storage.sync.get({
        "youtube_like": false
    }, function(cfgData) {
        log.debug(cfgData);
        if (cfgData['youtube_like']) {
            if (url.indexOf(youtubeURL) > -1) {
                log.debug("You are in youtube watch page");
                try {
                    executeScripts(null, [
                        { file: "libs/jquery.js" },
                        { file: "scripts/utils.js" },
                        { file: "scripts/youtube.js" }
                    ]);
                } catch (e) {
                    console.log(' Exception on chrome.browserAction.onClicked');
                }
            } else {
                log.debug("You are in youtube, but not waching page");
            }
        }
    });
}

function setStorageNumber(key, number, callback) {
    var object = {};
    object[key] = number;
    chrome.storage.sync.set(object, function() {
        if (callback) {
            callback();
        }
    });
}

function getStorageNumber(key, callback) {
    var object = {};
    object[key] = 0;
    chrome.storage.sync.get(object, function(item) {
        if (callback) {
            callback(item[key]);
        } else {
            console.log("You can't get value without callback.")
        }
    });
}

function executeScripts(tabId, injectDetailsArray) {
    function createCallback(tabId, injectDetails, innerCallback) {
        return function() {
            chrome.tabs.executeScript(tabId, injectDetails, innerCallback);
        };
    }

    var callback = null;

    for (var i = injectDetailsArray.length - 1; i >= 0; --i)
        callback = createCallback(tabId, injectDetailsArray[i], callback);

    if (callback !== null)
        callback(); // execute outermost function
}

function updateNumberOfUsed() {
    var countNumberFieldName = "count_number";
    getStorageNumber(countNumberFieldName, function(numberOfUsed) {
        var times = Number(numberOfUsed);
        times++;
        setStorageNumber(countNumberFieldName, times);
    });
}

function openOptionPage() {
    chrome.tabs.create({
        url: "options.html"
    });
}

getStorageSync({
    'google_analytic': true,
    'allow-auto-like': false,
    'auto-like-time': 5
}, function(object) {
    log.debug("get system storage : ", object);
    registerGoogleAnalytic(object['google_analytic']);
    handleIntervalTask(object['allow-auto-like'], object['auto-like-time']);
});

//registerGoogleAnalytic('true');

function registerGoogleAnalytic(isAllow) {
    log.debug("isAllowGoogleAnalytic : ", isAllow);
    if (isAllow) {
        _gaq = _gaq || [];
        _gaq.push(['_setAccount', 'UA-83786826-2']);
        _gaq.push(['_trackPageview']);

        var ga = document.createElement('script');
        ga.type = 'text/javascript';
        ga.async = true;
        // ga.src = 'https://ssl.google-analytics.com/u/ga_debug.js';
        ga.src = 'https://ssl.google-analytics.com/ga.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(ga, s);
    }
}

function handleIntervalTask(isEnable, intervalTime) {
    var intervalMinute = Number(intervalTime);
    var intervalTimeInSeconds = intervalMinute * 1000 * 60;
    var IntervalTask;
    log.debug("Interval time in second is set : "+ intervalTimeInSeconds);
    if (isEnable && !IntervalTask) {
        IntervalTask = setInterval(function() {
            log.debug("IntervalTask Execute after " + intervalTimeInSeconds + " seconds.");
            executeScripts(null, [
                { file: "libs/jquery.js" },
                { file: "scripts/supported-url-utils.js" },
                { file: "scripts/utils.js" },
                { file: "scripts/content_script.js" },
                { file: "scripts/on-interval-execute.js" }
            ]);
        }, intervalTimeInSeconds);
    } else {
        if (!isEnable) {
            clearInterval(IntervalTask);
        }
    }
}

function trackButton(id) {
    getStorageSync({
        'google_analytic': true
    }, function(obj) {
        if (obj['google_analytic'] && _gaq) {
            _gaq.push(['_trackEvent', id, 'clicked']);
        }
    });
};