var fbEmotion = {
    start: function (){
        log.debug("FB reaction to all posts is running........");
        var fbEmotion = this;
        chrome.storage.sync.get({
            "google": "post",
            "google_time": "1.0",
            "facebook": "post",
            "facebook_time": "1.0",
            "twitter_time": "0.8",
            "numberOfScroll": 0,
            'facebook-reaction-type': 2
        }, function(cfgData) {
            log.debug(cfgData);
            Utils.addRunningBackgroundColor();
            var scrollTimes = Number(cfgData["numberOfScroll"]) + 1;
            var timerPerClick = Number(cfgData["facebook_time"]) * 1000 * 2;
            // var emotionType = cfgData['fb_emotion'];
            var emotionType = Number(cfgData['facebook-reaction-type']);
            fbEmotion.main(scrollTimes, timerPerClick, emotionType );
        });
    },

    main: function( scrollTimes, timerPerClick, emotionType ) {
        var fbEmotion = this;
        log.debug('scrollTimes ' + scrollTimes + " ; timerPerClick : " + timerPerClick);
        Utils.loadMoreByScroll(null, scrollTimes).then(function(response) {
            log.debug('Like post  Done load more page');
            var buttons = $(POST_SELECTOR).filter(function(index) {
                var button = $(this);
                return !button.hasClass("UFIReactionLink");
            });
            log.debug('Like post  Number of buttons ' + buttons.length);
            fbEmotion.hoverAndClickOnButton(buttons, emotionType, timerPerClick, 0).then(function(done) {
                Utils.sendNumberToActionButton(0);
                Utils.removeRunningBackgroundColor();
            });
        });
    },

    hoverAndClickOnButton : function(buttons, emotionType, time, number, taskAfterButtonClick) {
        var fbEmotion = this;
        var d = $.Deferred();
        var promise = d.promise();
        $.each(buttons, function(index, button) {
            promise = promise.then(function(number) {
                number = number === undefined ? 0 : number;
                return fbEmotion.triggerHoverOnElement( button, emotionType, time, number, taskAfterButtonClick);
            });
        });
        d.resolve();
        return promise;
    },

    triggerHoverOnElement: function ( button, emotionType, time, number, taskAfterButtonClick){
        var fbEmotion = this;
        var d = $.Deferred();
        var promise = d.promise();
        Utils.fireEvent( button, 'mouseover');
        window.setTimeout(() => {
            var emotionBtn = fbEmotion.getEmotionButton(emotionType);
            log.debug("Show emotion bar, now let click on button. Time for click : "+ time);
            Utils.clickOnButton( emotionBtn, time, number, taskAfterButtonClick).then(function(number){
                window.setTimeout(() => {
                    Utils.fireEvent( button, 'mouseout');
                    window.setTimeout(() => {
                        d.resolve( number );
                    }, Utils.getRandom(500,1000));
                }, Utils.getRandom(500, 1000) );
            });
        }, 1000 + Utils.getRandom(1, 1000));
        return promise;
    },

    getEmotionButton : function (emotionType){
        var fbEmotion = this;
        var selector = "div.uiContextualLayerParent > div.uiLayer div[role='presentation'] > div[role='toolbar'] > span._iuw";
        var buttons = $( selector );
        var btnIndex = emotionType - 1;
        var button = btnIndex >= buttons.length ? buttons[1] : buttons [btnIndex];
        log.debug('Emotion button : ', button);
        return button;
    }
}

fbEmotion.start();
