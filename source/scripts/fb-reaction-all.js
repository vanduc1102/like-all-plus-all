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
        var fbEmotion = this;
        log.debug('scrollTimes ' + scrollTimes + " ; timerPerClick : " + timerPerClick);
        loadMoreByScroll(null, scrollTimes).then(function(response) {
            log.debug('Done load more by scroll');
            var moreCommentSelecor = "a[role='button'][class='UFIPagerLink']";
            loadMoreByElement(moreCommentSelecor, MAX_LOAD_MORE_COMMENT).then(function() {
                log.debug('Done load more by click on button');
                var buttons = $("a[role='button'][aria-pressed='false'],a[role='button'][data-ft='{\"tn\":\">\"}']");
                log.debug('Number of buttons ' + buttons.length);
                fbEmotion.hoverAndClickOnButton(buttons, emotionType, timerPerClick, 0).then(function(done) {
                    sendNumberToActionButton(0);
                    removeRunningBackgroundColor();
                });
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
        fireEvent( button, 'mouseover');
        window.setTimeout(() => {
            var emotionBtn = fbEmotion.getEmotionButton(emotionType);
            log.debug("Show emotion bar, now let click on button. Time for click : "+ time);
            clickOnButton( emotionBtn, time, number, taskAfterButtonClick).then(function(number){
                window.setTimeout(() => {
                    fireEvent( button, 'mouseout');
                    window.setTimeout(() => {
                        d.resolve( number );
                    }, getRandom(500,1000));
                },getRandom(500, 1000) );
            });
        }, 1000 + getRandom(1, 1000));
        return promise;
    },

    getEmotionButton : function (emotionType){
        var fbEmotion = this;
        var selector = "div.uiContextualLayerParent > div.uiLayer div[role='presentation'] > div[role='toolbar'] > span._iuw";
        var buttons = $( selector );
        var button = buttons[ fbEmotion.getIndexOrder(emotionType) ];
        log.debug('Emotion button : ', button);
        return button;
    },

    getIndexOrder : function ( emotionType ){
        var index = 0;
        switch( emotionType ){
            case 'like':
                index = 0;
                break;
            case 'love':
                index = 1;
                break;
            case 'haha':
                index = 2;
                break;
            case 'wow':
                index = 3;
                break;
            case 'sad':
                index = 4;
                break;
            case 'angry':
                index = 5;
                break;
        }
        return index;
    }
}

fbEmotion.start();
