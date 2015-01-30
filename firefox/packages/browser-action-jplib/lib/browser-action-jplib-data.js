/**
 * (c) 2013 Rob Wu <gwnRob@gmail.com>
 * Released under the MIT license.
 *
 * Auto-generated from "data" dir by build.js
 * Because the Add-on SDK does not support loading assets
 * from the data dir for third-party modules.
 **/

'use strict';

const base64 = require('sdk/base64');

function uri(path) {
    path = (''+path).split(/[#?]/, 1)[0];
    if (!dataFiles[path]) throw new Error('Resource not found: ' + path);
    return dataFiles[path];
}
exports.url = uri;
exports.load = function(path) {
    var fileAsBase64 = uri(path).split(',')[1];
    return base64.decode(fileAsBase64);
};

const dataFiles = {
    "browserActionBadge.html": "data:text/html;base64,PCFET0NUWVBFIGh0bWw+CjwhLS0KICAoYykgMjAxMyBSb2IgV3UgPGd3blJvYkBnbWFpbC5jb20+CiAgSW1wbGVtZW50YXRpb24gb2YgY2hyb21lLmJyb3dzZXJBY3Rpb24gZm9yIEpldHBhY2sgQWRkLW9ucy4KICBEaXN0cmlidXRlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuCi0tPgo8aHRtbD4KPGhlYWQ+CjxtZXRhIGNoYXJzZXQ9InV0Zi04Ij4KPHRpdGxlPkJyb3dzZXIgYWN0aW9uIGJ1dHRvbjwvdGl0bGU+CjxzdHlsZT4KKiB7CiAgICAtbW96LWJveC1zaXppbmc6IGJvcmRlci1ib3g7CiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94Owp9Cmh0bWwsIGJvZHksIGJ1dHRvbiB7CiAgICBkaXNwbGF5OiBibG9jazsKICAgIG1hcmdpbjogMDsKICAgIHBhZGRpbmc6IDA7CiAgICB3aWR0aDogMTAwJTsKICAgIGhlaWdodDogMTAwJTsKfQpidXR0b24gewogICAgLW1vei1hcHBlYXJhbmNlOiB0b29sYmFyYnV0dG9uOwogICAgYm9yZGVyOiBub25lOwogICAgYm9yZGVyLXJhZGl1czogaW5pdGlhbDsKfQpidXR0b246Oi1tb3otZm9jdXMtaW5uZXIgewogICAgYm9yZGVyOiAwOwp9CiNidXR0b24taW1nIHsKICAgIHdpZHRoOiAxOXB4OwogICAgaGVpZ2h0OiAxOXB4OwogICAgbWF4LXdpZHRoOiAxMDAlOwogICAgbWF4LWhlaWdodDogMTAwJTsKICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsKICAgIG1hcmdpbjogYXV0bzsKICAgIHRvcDogMDsKICAgIGxlZnQ6IDA7CiAgICByaWdodDogMDsKICAgIGJvdHRvbTogMDsKfQovKioKICogU3R5bGVzIGNyZWF0ZWQgdXNpbmcgbXkgZXllcyBhbmQgYSBwZWVrIGludG8gYmFkZ2VfdXRpbC5jYwogKi8KI2JhZGdlVGV4dCB7CiAgICBwb3NpdGlvbjogYWJzb2x1dGU7CiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7CiAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlOwogICAgYm90dG9tOiAwcHg7CiAgICByaWdodDogMHB4OwogICAgaGVpZ2h0OiAxMnB4OwogICAgbWF4LXdpZHRoOiAxMDAlOwoKICAgIHBhZGRpbmc6IDAgMXB4OwogICAgcG9pbnRlci1ldmVudHM6IG5vbmU7CgogICAgb3ZlcmZsb3c6IGhpZGRlbjsKICAgIHdoaXRlLXNwYWNlOiBwcmU7CiAgICBmb250LXNpemU6IDkuNXB4OwogICAgZm9udC13ZWlnaHQ6IGJvbGQ7CiAgICBmb250LWZhbWlseTogQXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZjsKICAgIGNvbG9yOiAjRkZGOwoKICAgIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudCgKICAgICAgICB0byBib3R0b20sCiAgICAgICAgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjYyNCkgMCwKICAgICAgICByZ2JhKCAgMCwgICAwLCAgIDAsIDAgICAgKSAxMCUsCiAgICAgICAgcmdiYSggIDAsICAgMCwgICAwLCAwLjI1NSkgOTAlLAogICAgICAgIHJnYmEoICAwLCAgIDAsICAgMCwgMC4zNzcpIDEwMCUKICAgICk7CiAgICBiYWNrZ3JvdW5kLWNsaXA6IHBhZGRpbmctYm94OwogICAgYm9yZGVyLXJhZGl1czogMnB4OwogICAgYm9yZGVyLXN0eWxlOiBzb2xpZDsKICAgIGJvcmRlci13aWR0aDogMXB4OwoKICAgIC8qIG92ZXJyaWRkZW4gYnkgc2NyaXB0ICovCiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjRTAwMDAwOwogICAgYm9yZGVyLWNvbG9yOiAgICAgI0UwMDAwMDsKfQojYmFkZ2VUZXh0OmVtcHR5IHsKICAgIGRpc3BsYXk6IG5vbmU7Cn0KQG1lZGlhIChtYXgtaGVpZ2h0OiAxOXB4KSB7CiAgICAjYmFkZ2VUZXh0IHsKICAgICAgICBoZWlnaHQ6IDExcHg7CiAgICAgICAgcGFkZGluZzogMDsKICAgICAgICBmb250LXNpemU6IDguMnB4OwogICAgICAgIGJvcmRlci1sZWZ0LXdpZHRoOiAwLjVweDsKICAgICAgICBib3JkZXItcmlnaHQtd2lkdGg6IDAuNXB4OwogICAgfQp9Cjwvc3R5bGU+CjwvaGVhZD4KPGJvZHk+CjxidXR0b24+CiAgICA8aW1nIGlkPSJidXR0b24taW1nIiBzcmM9ImRlZmF1bHRfaWNvbi5wbmciPgo8L2J1dHRvbj4KPHNwYW4gaWQ9ImJhZGdlVGV4dCI+PC9zcGFuPgo8L2JvZHk+CjwvaHRtbD4K",
    "browserActionBadge.js": "data:application/javascript;base64,LyoqCiAqIChjKSAyMDEzIFJvYiBXdSA8Z3duUm9iQGdtYWlsLmNvbT4KICogSW1wbGVtZW50YXRpb24gb2YgY2hyb21lLmJyb3dzZXJBY3Rpb24gZm9yIEpldHBhY2sgQWRkLW9ucy4KICogRGlzdHJpYnV0ZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLgogKi8KCi8qanNoaW50IGJyb3dzZXI6dHJ1ZSovCi8qZ2xvYmFscyBzZWxmKi8KJ3VzZSBzdHJpY3QnOwp2YXIgYmFkZ2VUZXh0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JhZGdlVGV4dCcpOwpzZWxmLnBvcnQub24oJ3NldEJhZGdlVGV4dCcsIGZ1bmN0aW9uKHRleHQpIHsKICAgIGJhZGdlVGV4dC50ZXh0Q29udGVudCA9IHRleHQ7CiAgICBiYWRnZVRleHQuc3R5bGUuZGlzcGxheSA9IHRleHQgPyAnJyA6ICdub25lJzsKfSk7CnNlbGYucG9ydC5vbignc2V0QmFkZ2VCYWNrZ3JvdW5kQ29sb3InLCBmdW5jdGlvbihjb2xvckFycmF5KSB7CiAgICAvLyBEZWZhdWx0IGNvbG9yIHdoZW4gZXZlcnkgZGlnaXQgaXMgMAogICAgaWYgKGNvbG9yQXJyYXkuZXZlcnkoZnVuY3Rpb24oZCkgZCA9PT0gMCkpCiAgICAgICAgY29sb3JBcnJheSA9IFsweEVFLCAwLCAwLCAyNTVdOwoKICAgIGNvbG9yQXJyYXlbM10gPSBjb2xvckFycmF5WzNdIC8gMjU1OyAvLyBBbHBoYSBjaGFubmVsIGNvbnZlcnQgWzAsMjU1XSB0byBbMCwxXQogICAgZnVuY3Rpb24gcmdiYSgpICdyZ2JhKCcgKyBjb2xvckFycmF5LmpvaW4oJywnKSArICcpJwoKICAgIGJhZGdlVGV4dC5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSByZ2JhKCk7CgogICAgLy8gRGFya2VuIHRoZSBjb2xvcgogICAgZm9yIChsZXQgaT0wOyBpPDM7ICsraSkgY29sb3JBcnJheVtpXSA9IE1hdGgucm91bmQoY29sb3JBcnJheVtpXSAqIDAuOTUpOwogICAgYmFkZ2VUZXh0LnN0eWxlLmJvcmRlckNvbG9yID0gcmdiYSgpOwp9KTsKc2VsZi5wb3J0Lm9uKCdzZXRJY29uJywgZnVuY3Rpb24odXJsKSB7CiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYnV0dG9uLWltZycpLnNyYyA9IHVybDsKfSk7CgpzZWxmLnBvcnQub24oJ2VuYWJsZWQnLCBmdW5jdGlvbihlbmFibGVkKSB7CiAgICBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xhc3NMaXN0W2VuYWJsZWQ/J3JlbW92ZSc6J2FkZCddKCdkaXNhYmxlZCcpOwogICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYnV0dG9uJykuZGlzYWJsZWQgPSAhZW5hYmxlZDsKfSk7CgpzZWxmLnBvc3RNZXNzYWdlKCcnKTsgLy8gSSBhbSBhbGl2ZSwgcmVxdWVzdCByZW5kZXIgZGF0YQo=",
    "default_icon.png": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAADqElEQVR42r2VbWgUVxSG370zOzuTmcR13SRiU6qJRdKYJsakxtRo22iiElPXgqD+UKyEQJCAHyAEpfjVQGiRQkESgpQSqsViQ2tQREF/RIX+F0pMG1uQBFE0ibvZ7Nzrnlmymf3M0BJfeHYOcw/n7jnn3jOs4Uxt8ZZz6281dn0cbOreIJq66xcCik17FDOXCz1MkTa7Dbeq5ClQvAsCxaY9epiQWJ2kypByZLijT9kjZaTEvwKdm06jb+cV9O68jBMbT+E9XxGtzYs7tkcdY4Dmkl2Qo6kKIQCemf3l7XjfXwZdN7Aoz4uq5XVoqzlKa/NBsWkPjZFB7yJCwOTZ8ecUQtU0MEnCrN71FdOaI2gPFgXgwhE3h34HNd2uOw9u0ppjmMm5ZXAHXP2jHxNTE5jV+PMxfHe9m9Ycw8BTM7y062pafjx2DS4wQAiQCnyFGPz6Hi598YvdL3uGVnbJtTZNGLm56TEMwFZWsumdzSdrH5mVqikgbEwFJ/E/RDEywkwhQNjr/M/YqFW2/6j5epj6Lwbu/ozXr6fwTd9Z1O+rxvmLpyC4CafSJA0H1n6Jvt0/4WTDaeSrvrkM6Ycn8XD8Pmr3VWLg0TUYVTpujAyi58r3cKqLe3/AltIW5BleVK+sw8H17fHYLJYqT0DN11D0yTswigy4JMBYpuPWo0GEw2E4kVdfAkPXoSiKdajWLP8oHpuZVFLOKd2saAU5iMzMwKnsJ1mW3HMldVGqDmgub4FThaaDsOvx6J9zJTUFB5JKuqd6Dy63DiBQEUCex8CO1c3YVhmA7HbDier31mDw7m/gZgQjT4bR1fdVPHbs0FBZbWwrD0DXdLQ1HUF/2684sLEdqqri5cQLdJxpQ9n2EsKynz0fR7JyKw109h7HB9tXYkfHVgzzkXhsRgnGTiqPo6uG1XCS4vHQJLGenReO4eGzByio9ROWffLC8bR3dvEqL5ZtWIrCKj8U3R2PzWJjLfGy2ptu12jkb6g+D8UnLHt4+jFCoZDzi5/uRGZSoH5Xim9D1Wc0e52PNiFSh3cmHWo6nOBHrq2NHZBlGTZlH96zzYSNZIVnwnjy71/4trcrwU+YHGPjT60DNTH5CpOxb2X2z1O6Olc0l6JkU1Gc0sYSNBz6FP1D/Sm+LR3Nlk/l56tR0VJG9vzDO5nCdQWJ1OQj/0Mf9KVaii+9t3zW+gmys2cYEQhaPXw7BCnDoSh4SwzRtWjlM/y2aYppIYAFIhSF9mh9AwL/3gZQhIO7AAAAAElFTkSuQmCC",
    "popup.html": "data:text/html;base64,PCFET0NUWVBFIGh0bWw+CjxodG1sPgo8aGVhZD4KPG1ldGEgY2hhcnNldD0idXRmLTgiPgo8dGl0bGU+PC90aXRsZT4KPC9oZWFkPgo8Ym9keT48L2JvZHk+CjwvaHRtbD4K",
    "popup.js": "data:application/javascript;base64,LyoqCiAqIChjKSAyMDEzIFJvYiBXdSA8Z3duUm9iQGdtYWlsLmNvbT4KICogSW1wbGVtZW50YXRpb24gb2YgY2hyb21lLmJyb3dzZXJBY3Rpb24gZm9yIEpldHBhY2sgQWRkLW9ucy4KICogRGlzdHJpYnV0ZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLgogKi8KCi8qanNoaW50IGJyb3dzZXI6dHJ1ZSovCi8qZ2xvYmFscyBzZWxmKi8KJ3VzZSBzdHJpY3QnOwp2YXIgbGFzdEhlaWdodCA9IDA7CnZhciBsYXN0V2lkdGggPSAwOwpmdW5jdGlvbiB1cGRhdGVQYW5lbERpbWVuc2lvbnMoKSB7CiAgICBsZXQgd3JhcHBlciA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDsKICAgIGxldCBoZWlnaHQgPSB3cmFwcGVyLnNjcm9sbEhlaWdodDsKICAgIGxldCB3aWR0aCA9IHdyYXBwZXIuc2Nyb2xsV2lkdGg7CiAgICBpZiAoaGVpZ2h0ID09PSBsYXN0SGVpZ2h0ICYmIHdpZHRoID09PSBsYXN0V2lkdGgpIHsKICAgICAgICByZXR1cm47CiAgICB9CiAgICBsZXQgZGltZW5zaW9ucyA9IHsKICAgICAgICBoZWlnaHQ6IGhlaWdodCwKICAgICAgICB3aWR0aDogd2lkdGgKICAgIH07CiAgICBzZWxmLnBvcnQuZW1pdCgnZGltZW5zaW9ucycsIGRpbWVuc2lvbnMpOwp9Ci8vIE1vbml0b3IgY29udGVudCBjaGFuZ2VzIGZvciBjYWxjdWxhdGluZyB0aGUgc2Nyb2xsaGVpZ2h0Lgp2YXIgZGVmZXJyZWREaW1lbnNpb25DaGVjazsKdmFyIGxhc3RDaGVja2VkID0gMDsKdmFyIHJvb3RPYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uKCkgewogICAgdmFyIG5vdyA9IERhdGUubm93KCk7CiAgICBjbGVhclRpbWVvdXQoZGVmZXJyZWREaW1lbnNpb25DaGVjayk7CiAgICBpZiAobm93IC0gbGFzdENoZWNrZWQgPiAyMDApIHsKICAgICAgICAvLyBMYXN0IGNoZWNrIHdhcyBvdmVyIDAuMiBzZWNvbmRzIGFnby4gQ2hlY2sgaW1tZWRpYXRlbHkuCiAgICAgICAgdXBkYXRlUGFuZWxEaW1lbnNpb25zKCk7CiAgICB9IGVsc2UgewogICAgICAgIGRlZmVycmVkRGltZW5zaW9uQ2hlY2sgPSBzZXRUaW1lb3V0KHVwZGF0ZVBhbmVsRGltZW5zaW9ucywgMTApOwogICAgfQogICAgbGFzdENoZWNrZWQgPSBub3c7Cn0pOwpyb290T2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsIHsKICAgIGF0dHJpYnV0ZXM6IHRydWUsCiAgICBjaGlsZExpc3Q6IHRydWUsCiAgICBjaGFyYWN0ZXJEYXRhOiB0cnVlLAogICAgc3VidHJlZTogdHJ1ZSwKICAgIGF0dHJpYnV0ZU9sZFZhbHVlOiBmYWxzZSwKICAgIGNoYXJhY3RlckRhdGFPbGRWYWx1ZTogZmFsc2UKfSk7CgppZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PSAnY29tcGxldGUnKSB7CiAgICB1cGRhdGVQYW5lbERpbWVuc2lvbnMoKTsKfSBlbHNlIHsKICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCB1cGRhdGVQYW5lbERpbWVuc2lvbnMpOwp9Cgpjb25zdCBDTE9TRV9UT0tFTiA9ICd3aW5kb3cuY2xvc2UuJyArIE1hdGgucmFuZG9tKCk7Cgpkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKENMT1NFX1RPS0VOLCBmdW5jdGlvbigpIHsKICAgIHNlbGYucG9ydC5lbWl0KCdoaWRlJyk7Cn0pOwpzZWxmLm9uKCdkZXRhY2gnLCBmdW5jdGlvbigpIHsKICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgndW5sb2FkJykpOwp9KTsKCi8vIFdoZW4gd2luZG93LmNsb3NlKCkgaXMgY2FsbGVkLCBoaWRlIHRoZSBwb3B1cC4KZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNldEF0dHJpYnV0ZSgnb25yZXNldCcsCiAgICAgICAgJ2RvY3VtZW50LmRvY3VtZW50RWxlbWVudC5yZW1vdmVBdHRyaWJ1dGUoIm9ucmVzZXQiKTsnICsKICAgICAgICAnd2luZG93LmNsb3NlPWZ1bmN0aW9uKCl7ZG9jdW1lbnQuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoIicgKyBDTE9TRV9UT0tFTiArICciKSk7fTsnCik7CmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5vbnJlc2V0KCk7Cg=="
};