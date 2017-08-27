var MAX_LOAD_MORE_COMMENT = 20;
chrome.storage.sync.get({
    "google": "post",
    "google_time": "1.0",
    "facebook": "post",
    "facebook_time": "1.0",
    "twitter_time": "0.8",
    "numberOfScroll": 0
}, function(cfgData) {
    log.debug(cfgData);
    var scrollTimes = 1;
    var timerPerClick = Number(cfgData["facebook_time"]) * 1000 * 2;
    main(scrollTimes, timerPerClick);
    addRunningBackgroundColor();
});

function main(scrollTimes, timerPerClick) {
    log.debug('scrollTimes ' + scrollTimes + " ; timerPerClick : " + timerPerClick);
    loadMoreByScroll(null, scrollTimes).then(function(response) {
        log.debug('Done load more by scroll');
        var moreCommentSelecor = "a[role='button'][class='UFIPagerLink'],a[role='button'][class='UFICommentLink']";
        loadMoreByElement(moreCommentSelecor, MAX_LOAD_MORE_COMMENT).then(function() {
            log.debug('Done load more by click on button');
            var replyButtons = $("a[class='UFIReplyLink'][role='button']");
            log.debug('Number of buttons ' + replyButtons.length);
            var timerPerClick = 500;
            if (replyButtons.length > 0) {
                clickButtonListOneByOne(replyButtons, timerPerClick, 0).then(function(done) {
                    sendNumberToActionButton(0);
                    removeRunningBackgroundColor();
                });
            } else {
                removeRunningBackgroundColor();
            }
        });
    });
}