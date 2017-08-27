var urlOrigin = window.location.origin;
var fullUrl = window.location.href;
log.debug('Content script running........... : ' + urlOrigin);

function contentScriptMainExecute(isClickedActionBtn) {
    getStorageSync({
        "google": "post",
        "google_time": "1.0",
        "facebook": "post",
        "facebook_time": "1.0",
        "twitter_time": "0.8",
        "numberOfScroll": 0
    }, function(cfgData) {
        log.debug(cfgData);
        if (isClickedActionBtn) {
            addRunningBackgroundColor();
        }
        if (isIncomeon()) {
            var time = parseFloat(cfgData['twitter_time']) * 1000;
            var scroll = Number(cfgData['numberOfScroll']) + 1;
            executeIncomeonLike(time, scroll);
            sendAnalytic("incomeon");
            return;
        }
        if (cfgData['numberOfScroll'] > 1 && isScrollAble() && isClickedActionBtn) {
            autoScrollToBottom(cfgData);
        } else {
            if (isFacebook() && cfgData['facebook'] == 'both') {
                loadAllComment(cfgData);
            } else {
                executeLike(cfgData);
            }
        }

    });

    function loadAllComment(cfgData) {
        if (isFacebook() && cfgData['facebook'] == 'both') {
            var moreComments = $("a[role='button'][class='UFIPagerLink']");

            function loadMoreComment(comments, intervalTime) {
                if (comments.length <= 0) {
                    log.debug("Finished load more comments");
                    window.setTimeout(function() {
                        log.debug("executeLike after waiting 2 seconds");
                        executeLike(cfgData);
                    }, 2000);
                    return;
                }
                comments[0].click();

                window.setTimeout(function() {
                    loadMoreComment(comments.splice(1), intervalTime);
                }, intervalTime + getRandom(1, 1000));
            }
            loadMoreComment(moreComments, 2000);
        }

    }

    function autoScrollToBottom(cfgData) {
        var i = 0;
        var scrollInterval = window.setInterval(function() {
            if (i == cfgData['numberOfScroll']) {
                clearInterval(scrollInterval);
                if (isFacebook() && cfgData['facebook'] == 'both') {
                    loadAllComment(cfgData);
                } else {
                    executeLike(cfgData);
                }
            } else {
                log.debug("Scroll to bottom : " + i);
                window.scrollTo(0, document.body.scrollHeight);
            }
            i++;
        }, 4000 + getRandom(1, 1000));
    }

    function executeLike(cfgData) {
        var time = 0;
        var sad_posts = [];
        if (isGooglePlus()) {
            time = parseFloat(cfgData['google_time']) * 1000;
            switch (cfgData['google']) {
                case 'post':
                    sad_posts = $("div[role='button'][aria-pressed='false']");
                    sendAnalytic("googleplus-post");
                    break;
                case 'comment':
                    sad_posts = $("button[role='button'][aria-pressed='false'][jscontroller]");
                    sendAnalytic("googleplus-comment");
                    break;
                case 'both':
                    sad_posts = $("div[id^=po-][aria-pressed='false'],button[role='button'][aria-pressed='false'][jscontroller]");
                    sendAnalytic("googleplus-both");
                    break;
                default:
                    break;
            };
        }

        if (isFacebook()) {
            time = parseFloat(cfgData['facebook_time']) * 1000;
            switch (cfgData['facebook']) {
                case 'post':
                    sad_posts = $("a[role='button'][aria-pressed='false']").filter(function(index) {
                        return !$(this).hasClass("UFIReactionLink");
                    });
                    log.debug('Like all post : ' + sad_posts.length);
                    sendAnalytic("facebook-post");
                    break;
                case 'comment':
                    sad_posts = $("a[data-testid='ufi_comment_like_link'][aria-pressed='false'],a[data-testid='fb-ufi-likelink'][aria-pressed='false'],a[class='UFIReactionLink'][data-ft='{\"tn\":\">\"}']");
                    log.debug('Like all comment : ' + sad_posts.length);
                    sendAnalytic("facebook-comment");
                    break;
                case 'both':
                    sad_posts = $("a[role='button'][aria-pressed='false'],a[role='button'][data-ft='{\"tn\":\">\"}']");
                    log.debug('Facebook all post and comment : ' + sad_posts.length);
                    sendAnalytic("facebook-both");
                    break;
                default:
                    break;
            };
        }

        if (isTwitter()) {
            time = parseFloat(cfgData['twitter_time']) * 1000;
            sad_posts = $("button[class^='ProfileTweet-actionButton js-actionButton js-actionFavorite']").filter(function(index) {
                return $(this).css("display") == 'inline-block';
            });
            sendAnalytic("twitter");
        }

        if (isInstagram()) {
            sendAnalytic("instagram");
            time = parseFloat(cfgData['twitter_time']) * 1000;
            sad_posts = $("a[role='button']").filter(function(index) {
                var likeElement = $(this).find("span");
                return (likeElement && (likeElement.hasClass("whiteoutSpriteHeartOpen") ||
                    likeElement.hasClass("coreSpriteHeartOpen")) || likeElement.hasClass('coreSpriteLikeHeartOpen'));
            });
        }

        if (isLinkedin()) {
            sendAnalytic("linkedin");
            time = parseFloat(cfgData['twitter_time']) * 1000;
            sad_posts = $("button.button.like").filter(function(index) {
                var button = $(this);
                return !button.hasClass("active");
            });
        }

        if (isTumblr()) {
            sendAnalytic("tumblr");
            time = parseFloat(cfgData['twitter_time']) * 1000;
            sad_posts = $("div.post-control-icon.like").filter(function(index) {
                var classAttr = $(this).attr('class');
                return classAttr.indexOf("liked") < 0;
            });
        }

        if (isYoutube()) {
            sendAnalytic("like_youtube");
            time = parseFloat(cfgData['twitter_time']) * 1000;
            sad_posts = $("button.yt-uix-button.sprite-like").filter(function(index) {
                return !$(this).attr('data-action-on');
            });
        }

        if (isReddit()) {
            sendAnalytic("like_redit");
            time = parseFloat(cfgData['twitter_time']) * 1000;
            sad_posts = $("div.arrow.up");
        }


        var happy = createHappyButtons(sad_posts);

        log.debug("Number of posts and comments : " + sad_posts.length);
        // Select only the Like buttons.
        // Convert the sad NodeList to a happy Array.
        var numberOfLikes = sad_posts.length;
        sendNumberToActionButton(numberOfLikes);

        log.debug(time);

        if (isLinkedInPeopleYouMayKnow()) {
            time = 1000 * 2;
            makeConnection(time, 0);
        } else {
            happyFn(happy, time);
        }
    };
}

function createHappyButtons(sad_posts) {
    var array = []
    for (var i = 0; i < sad_posts.length; i++) {
        array.push(sad_posts[i]);
    }
    return array;
}

function isScrollAble() {
    return fullUrl.indexOf("https://www.linkedin.com/mynetwork/") == -1;
}

function getAllInviteButtonOnPage() {
    var originButtons = $('a[href^="/people/invite?"]').filter(function(index) {
        var classAttr = $(this).attr('class');
        return classAttr && classAttr.indexOf("invite-sent") < 0;
    });
    return createHappyButtons(originButtons);
}

function happyFn(happy, intervalTime) {
    if (happy.length <= 0) {
        removeRunningBackgroundColor();
        return;
    }

    if (isGooglePlus() && isNewGooglePlus()) {
        triggerClickEvent(happy[0]);
    } else {
        // The root of everything.
        log.debug("sent a like : " + happy.length);
        if (CLICK_BUTTON) {
            happy[0].click();
        }
    }

    if (happy.length > 0) {
        //console.log('Send request : '+ (happy.length - 1));
        sendNumberToActionButton(happy.length - 1);
    }

    window.setTimeout(function() {
        happyFn(happy.splice(1), intervalTime);
    }, intervalTime + getRandom(1, 1000));
}

// Make connection in LinkedIn
function makeConnection(intervalTime, count) {
    count++;
    var connectionElement = $("ul.people > li:first-child button.button-secondary-medium");
    if (connectionElement.length > 0) {
        connectionElement.click();
        sendNumberToActionButton(count);
    } else {
        sendNumberToActionButton(0);
        return;
    }

    window.setTimeout(function() {
        makeConnection(intervalTime, count);
    }, intervalTime + getRandom(1, 1000));
}

function sendNumberToActionButton(number) {
    chrome.runtime.sendMessage({ count: number }, function(response) {
        //console.log(response);
    });
}

function isFacebook() {
    return urlOrigin.indexOf('facebook') > -1;
}

function isGooglePlus() {
    return urlOrigin.indexOf('plus.google.com') > -1;
}

function isTwitter() {
    return urlOrigin.indexOf('twitter') > -1;
}

function isInstagram() {
    return urlOrigin.indexOf('instagram') > -1;
}

function isYoutube() {
    return urlOrigin.indexOf('youtube.com') > -1;
}

function isLinkedin() {
    return urlOrigin.indexOf('linkedin') > -1;
}

function isLinkedInPeopleYouMayKnow() {
    return fullUrl.indexOf('https://www.linkedin.com/mynetwork/') > -1;
}

function isIncomeon() {
    return fullUrl.indexOf("incomeon.com") > -1;
}

function executeIncomeonLike(timerPerClick, scroll) {
    log.debug_CATEGORY = "executeIncomeonLike";
    log.debug("executeIncomeonLike ,timerPerClick : " + timerPerClick + " ; " + scroll);
    var scrollSelector = "div#post_holder";
    if ($(scrollSelector).length < 1) {
        sendNumberToActionButton(0);
        return;
    }
    loadMoreByScroll(scrollSelector, scroll).then(function(response) {
        log.debug("Finished load more");
        var buttons = $("i.fa.fa-check").filter(function(item) {
            var button = $(this);
            return !button.hasClass('color-green');
        });
        log.debug('Number of buttons ' + buttons.length);
        var warnButtonSelector = "button.confirm";
        clickButtonListOneByOneWithCloseWarning(buttons, timerPerClick, 0, warnButtonSelector).then(function(done) {
            sendNumberToActionButton(0);
        });
    });

}

function clickButtonListOneByOne(buttons, time, number) {
    log.debug("content_script - clickButtonListOneByOne");
    var d = $.Deferred();
    var promise = d.promise();
    $.each(buttons, function(index, button) {
        promise = promise.then(function() {
            return clickOnButton(button, time, number++);
        });
    });
    d.resolve();
    return promise;
}

function clickOnButton(button, time, number) {
    var d = $.Deferred();
    var rand = getRandom(1, 1000);
    setTimeout(function() {
        log.debug("content_script - clickOnButton - button clicked : " + number);
        number++;
        if (CLICK_BUTTON) {
            button.click();
        }
        sendNumberToActionButton(number);
        d.resolve(number);
    }, time + rand);
    return d.promise();
}

function getRandom(min, max) {
    return Math.floor(Math.random() * max) + min;
}

function loadNextPage(number) {
    log.debug("content_script - loadNextPage");
    var d = $.Deferred();
    var nextPageElement = $('a[class^="page-link"][href^="/vsearch"][rel^="next"]').get(0);
    if (nextPageElement) {
        setTimeout(function() {
            nextPageElement.click();
        }, 1000);

        setTimeout(function() {
            console.log("loaded next page ");
            d.resolve(number);
        }, 5000);
    } else {
        if (number == 999) {
            alert("Please stop, Grasp all lose all!");
        }
        d.reject(true);
    }
    return d.promise();
}

function isTumblr() {
    return urlOrigin.indexOf('tumblr.com') > -1;
}

function isReddit() {
    return urlOrigin.indexOf('.reddit.com') > -1;
}

function isNewGooglePlus() {
    var body = $("body.Td");
    return (body.length == 0);
}

function triggerClickEvent(node) {
    Utils.fireEvent(node, "mousedown");
    Utils.fireEvent(node, "mouseup");
}
