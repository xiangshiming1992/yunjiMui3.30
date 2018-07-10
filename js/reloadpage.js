function iPhone() {
    var u = navigator.userAgent, app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    return isiOS == true ? true : false;
}

function reloadPageCondition(condition) {
    if (!condition) {
        return;
    }
    var temp = sessionStorage.getItem(condition);
    if (temp) {
        if (iPhone()) {
            /**
             *ios
             */
            window.addEventListener('pageshow', function (e) {
                // 通过persisted属性判断是否存在 BF Cache
                var temp = sessionStorage.getItem(condition);
                if (e.persisted && temp) {
                    sessionStorage.removeItem(condition);
                    location.reload();
                }
            });
        } else {
            sessionStorage.removeItem(condition);
            location.reload();
        }
    }
}
