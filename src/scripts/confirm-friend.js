chrome.storage.sync.get({
    "google": "post",
    "google_time": "1.0",
    "facebook": "post",
    "facebook_time": "1.0",
    "twitter_time": "0.8",
    "numberOfScroll": 0
}, function(cfgData) {
    log.debug(cfgData);
    addRunningBackgroundColor();
    var scrollTimes = Number(cfgData["numberOfScroll"]);
    var timerPerClick = Number(cfgData["facebook_time"]) * 1000 * 2;
    main(timerPerClick, scrollTimes);
});

function main(timerPerClick, scrollTimes) {
    log.debug('Accept friend request');
    if (checkLoadMoreAble()) {
        loadMoreByElement('a[class~="uiMorePagerPrimary"][rel="async"]', 10).then(function(response) {
            log.debug('Done load more page');
            var buttons = $(".ruResponseButtons > button").filter(function(index) {
                return $(this).is(":visible");
            });
            log.debug('Number of buttons ' + buttons.length);
            clickButtonListOneByOne(buttons, timerPerClick, 0).then(function(response) {
                sendNumberToActionButton(0);
                removeRunningBackgroundColor();
                log.debug("Finished find of left panel");
            });
        });
    } else {
        var buttons = $("div#fbRequestsList_wrapper button[name=\"actions[accept]\"]").filter(function(index) {
            return $(this).is(":visible");
        });
        log.debug('Number of buttons ' + buttons.length);
        clickButtonListOneByOne(buttons, timerPerClick, 0).then(function(response) {
            sendNumberToActionButton(0);
            removeRunningBackgroundColor();
            log.debug("Finished find of left panel");
        });
    }
};

function checkLoadMoreAble() {
    var links = ["https://www.facebook.com/?sk=ff",
        "https://www.facebook.com/friends/requests/?fcref=jwl",
        "https://www.facebook.com/find-friends/browser/?ref=psa"
    ];
    var fullUrl = getFullUrl();
    return checkLinkInLinks(fullUrl, links);
}