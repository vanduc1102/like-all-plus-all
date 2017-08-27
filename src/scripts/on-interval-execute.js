var urlOrigin = window.location.origin;
var fullUrl = window.location.href;
log.debug('Starting interval task ................... :'+ fullUrl);
if(isSupport(fullUrl)){
    contentScriptMainExecute(false);
    sendAnalytic("execute-auto-like");
}else{
    log.debug("Interval task is not supported.");
}