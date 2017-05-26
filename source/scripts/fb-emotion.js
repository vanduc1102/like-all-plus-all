var MAX_LOAD_MORE_COMMENT = 1;
var fbEmotion = {
    start: function (){
        var fbEmotion = this;
        chrome.storage.sync.get({
            "google": "post",
            "google_time": "1.0",
            "facebook": "post",
            "facebook_time": "1.0",
            "twitter_time": "0.8",
            "numberOfScroll": 0,
            'fb_emotion':'like'
        }, function(cfgData) {
            log.debug(cfgData);
            addRunningBackgroundColor();
            var scrollTimes = Number(cfgData["numberOfScroll"]) + 1;
            var timerPerClick = Number(cfgData["facebook_time"]) * 1000 * 2;
            // var emotionType = cfgData['fb_emotion'];
            var emotionType = 'love';
            fbEmotion.main(scrollTimes, timerPerClick, emotionType );
        });
    },
    main: function( scrollTimes, timerPerClick, emotionType ) {
        log.debug('scrollTimes ' + scrollTimes + " ; timerPerClick : " + timerPerClick);
        loadMoreByScroll(null, scrollTimes).then(function(response) {
            log.debug('Done load more by scroll');
            var moreCommentSelecor = "a[role='button'][class='UFIPagerLink']";
            loadMoreByElement(moreCommentSelecor, MAX_LOAD_MORE_COMMENT).then(function() {
                log.debug('Done load more by click on button');
                var buttons = $("a[role='button'][aria-pressed='false'],a[role='button'][data-ft='{\"tn\":\">\"}']");
                log.debug('Number of buttons ' + buttons.length);
                hoverAndClickOnButton(buttons, emotionType, timerPerClick, 0).then(function(done) {
                    sendNumberToActionButton(0);
                    removeRunningBackgroundColor();
                });
            });
        });
    }
}

fbEmotion.start();
