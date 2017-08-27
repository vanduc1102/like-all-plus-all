log.debug("Youtube auto like start.");
var ytTimeout = setTimeout(function() {
    var button = $("button.like-button-renderer-like-button-unclicked");
    if (button.hasClass("hid")) {
        log.debug("button is pressed, clearInterval : " + ytTimeout);
        sendAnalytic("youtube-autolike");
        clearTimeout(ytTimeout);
    } else {
        log.debug("Button is not pressed, try to press after 3 second.");
        button.click();
    }
}, 3000);