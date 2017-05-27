chrome.storage.sync.get({
    "google": "post",
    "google_time": "1.0",
    "facebook": "post",
    "facebook_time": "1.0",
    "twitter_time": "0.8",
    "numberOfScroll": 0
}, function(cfgData) {
    log.debug(cfgData);
    Utils.addRunningBackgroundColor();
    var scrollTimes = Number(cfgData["numberOfScroll"]) + 1;
    var timerPerClick = Number(cfgData["facebook_time"]) * 1000 * 2;
    main(scrollTimes, timerPerClick);
});

function main(scrollTimes, timerPerClick) {
    log.debug('scrollTimes ' + scrollTimes + " ; timerPerClick : " + timerPerClick);
    Utils.loadMoreByScroll(null, scrollTimes).then(function(response) {
        log.debug('Like post  Done load more page');
        var buttons = $(POST_SELECTOR).filter(function(index) {
            var button = $(this);
            return !button.hasClass("UFIReactionLink");
        });
        log.debug('Like post  Number of buttons ' + buttons.length);
        Utils.clickButtonListOneByOne(buttons, timerPerClick, 0).then(function(done) {
            Utils.sendNumberToActionButton(0);
            Utils.removeRunningBackgroundColor();
        });
    });
}