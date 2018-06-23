
//loading
;(function(){
    Object.defineProperties(useCommon , {
        loading:{
            set:function(sts){
                var loadingEle = $('.ms-loading-window');
                if(!loadingEle.showEasyWindow)return false;
                if(sts){
                    loadingEle.showEasyWindow(null , 1);
                }
                else{
                    loadingEle.showEasyWindow('hide');
                }
            }
        }
    });
    var ajax = $.ajax;
    $.ajax = function(options , a , b){
        var success = options.success;
        options.success = function(data , a , b){
            if(data && (data.baseCode === 'PleaseLogin' || data.code == 401)){
                WY.trigger('login');
                return false;
            }
            success && success(data , a , b);
        };
        ajax(options , a , b);
    };
    window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
                window.setTimeout(callback, 1000 / 60);
            };
    })();
})();
//显示遮罩
useCommon.backHideWindow = function(options){
    options = options || {};
    if(!options.type || options.type == 'show'){
        var div = $('<div>').addClass('show-window-back show-back-hide-window');
        $('body').append(div);
        if(options.handler){
            div.click(options.handler);
        }
        div.css({
            zIndex:options.content.css('zIndex')?(options.content.css('zIndex') - 1):1000
        });
        return div;
    }else{
        var hideEle;
        if(options.backHideWindow){
            hideEle = options.backHideWindow;
            options.backHideWindow.remove();
        }
        else hideEle = $('.show-back-hide-window');
        hideEle.hide(1,function(){
            $(this).remove();
        });
    }
};
//显示简易弹窗
useCommon.showEasyWindow = function(options){
    var content = $(options.content);
    var handler = function(){
        if(options.done)options.done();
        $(options.content).css({
            left:-9999
        });
        useCommon.backHideWindow({
            type:'hide',
            backHideWindow:content[0].backHideWindow,
            delay:options.delay
        });
    };
    if(options.type == 'hide'){
        return handler();
    }
    content.show().css({
        left:0
    });
    content[0].backHideWindow = useCommon.backHideWindow({
        content:content
    });
    content.find('.close-this-window-btn').click(function(){
        handler();
        return false;
    });
    var hasMainAble = !!content.find('.main').length;
    if(hasMainAble){
        content.find('.main').click(function(){return false;});
    }
    content.click(function(e){
        if(!options.hideAble){
            if(hasMainAble || e.target == this){
                handler();
            }
        }
    });
};
$.fn.showEasyWindow = function(type , hideAble , done){
    return this.each(function(){
        useCommon.showEasyWindow({
            content:this,
            type:type,
            hideAble:hideAble,
            done:done
        })
    });
};
(function(){
    var toastTimer;
    useCommon.toast = function(text , delay , call){
        var $toastWindow = $('.wy-toast-window');
        $toastWindow.show();
        $toastWindow.find('.text').text(text);
        if(isNaN(delay) || delay <=0)delay = 1500;
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function(){
            $toastWindow.hide();
            if(call)call();
        } , delay);
    };
    var alertBackHide;
    useCommon.alert = function(options){
        if(typeof options == 'string'){
            options = {
                content:options
            };
        }
        var $alertWindow = $('.ms-alert-window');
        if(typeof options.content == 'string')options.content = options.content.slice(0 , 100);
        $alertWindow.find('.ms-alert-content').html(options.content);
        $alertWindow.show().css({
            left:0
        });
        var $alertMain = $alertWindow.find('.ms-alert-main');
        alertBackHide = alertBackHide || useCommon.backHideWindow({
                content:$alertWindow
        });
        $alertWindow.find('.ms-alert-submit-btn').unbind('click').click(function(){
            if(options.done)if(options.done() === false)return false;
            setTimeout(function(){
                $alertWindow.css({
                    left:-9999
                });
            });
            useCommon.backHideWindow({
                type:'hide',
                backHideWindow:alertBackHide
            });
            alertBackHide = null;
        });

    };
    //
   useCommon.prompt = function(options){
       var $alertWindow = $('.ms-prompt-window');
       $alertWindow.find('.prompt-title').text(options.title);
       $alertWindow.find('.prompt-input').val(options.value || '');
       $alertWindow.show().css({
           left:0
       });
       alertBackHide = alertBackHide || useCommon.backHideWindow({
               content:$alertWindow
           });
       $alertWindow.find('.ms-prompt-submit-btn').unbind('click').click(function(){
           if(options.done)if(options.done($alertWindow.find('.prompt-input').val()) === false)return false;
           setTimeout(function(){
               $alertWindow.css({
                   left:-9999
               });
           });
           useCommon.backHideWindow({
               type:'hide',
               backHideWindow:alertBackHide
           });
           alertBackHide = null;
       });
    };
    //
   useCommon.confirm = function(options){
       var $alertWindow = $('.ms-confirm-window');
       $alertWindow.find('.confirm-title').text(options.title);
       $alertWindow.show().css({
           left:0
       });
       alertBackHide = alertBackHide || useCommon.backHideWindow({
               content:$alertWindow
           });
       $alertWindow.find('.ms-confirm-submit-btn').unbind('click').click(function(){
           if(options.done)if(options.done() === false)return false;
           setTimeout(function(){
               $alertWindow.css({
                   left:-9999
               });
           });
           useCommon.backHideWindow({
               type:'hide',
               backHideWindow:alertBackHide
           });
           alertBackHide = null;
       });
    };
})();

//获取元素内容
$.fn.__getValue = function(options){
    var _this = $(this[0]);
    if(_this.is('input,select,option')){
        return _this.val().trim();
    }
    if(_this.is('textarea')){
        return _this.val();
    }
    return _this.text();
};
//将form内容 转为json
$.fn.__serializeJSON = function(options){
    var o = {};
    options = $.extend({
        name : 'name',
        ignore : ''
    } , options);
    $(this).find('[' + options.name + ']').not(options.ignore).not('[type=file],button,[type=button]').each(function(){
        if((($(this).is('[type=checkbox]') || $(this).is('[type=radio]')) && !this.checked) || !$(this).attr(options.name)){
            return;
        }
        var val = $(this).__getValue();
        //过滤emoji表情  有BUG  弃用
        //val = val.replace(/ud83c[udc00-udfff]|ud83d[udc00-udfff]|[u2000-u2fff]/g,'');
        $.setArrayValue( o ,$(this).attr(options.name) , val);
    });
    return o;
};
$.fn. __formData = function(data , name , ignore){
    name = name || 'name';
    ignore = ignore || [];
    if(data)for(var key in data){
        if(ignore.indexOf(data[key]) != -1)continue;
        this.find('[' + name + '="' + key + '"]').__setValue(data[key]);
    }
    return this;
};
$.setArrayValue = function (obj , key,val) {
    if(obj[key]){
        if(Array.isArray(obj[key]))obj[key].push(val);
        else obj[key] = [obj[key],val];
    }else obj[key] = val;
};
(function(){
    function setRadioValue(ele , val){
        var name = ele.attr('name');
        ele.prop('checked' ,false);
        if(!val)return;
        ele.filter('[value="' + val + '"]').prop('checked' ,true);
    }
    function setCheckboxValue(ele , val , split){
        var name = ele.attr('name');
        ele.prop('checked' ,false);
        if(!val) return;
        if(typeof val == 'string') val = val.split(split || ',');
        $.each(val ,function(i , o){
            ele.filter('[value="' + o + '"]').prop('checked' ,true);
        });
    }
    function setSelectValue(ele , val){
        var __val = [].slice.call(ele.children().map(function(){return $(this).val()}));
        if(__val.indexOf(val) != -1){
            ele.val(val);
        }else{
            ele.get(0).selectedIndex = 0;
        }
    }
    $.fn.__setValue = function(val , split){
        return this.each(function(){
            if(!this)return;
            if(typeof val == 'number')val += '';
            if(val == null)val = '';
            var _this = $(this);
            if(_this.is('img'))return _this.attr('src' , val);
            else if(_this.is('[type=radio]')) return setRadioValue(_this , val);
            else if(_this.is('[type=checkbox]')) return setCheckboxValue(_this , val , split);
            else if(_this.is('select')) return setSelectValue(_this , val);
            else if(_this.is('input,textarea')){
                return _this.val(val);
            }
            _this.text(val);
        });
    };
})();
$.fn.getSelectedText = function(){
    if(!this.is('select'))return '';
    var val = $(this).val();
    if(!val)return '';
    return this.find(':selected').text();
};

$.fn.dataTablePage = function(options){
    options.page -= 0;
    options.page = options.page || 1;
    options.allPage -= 0;
    return this.each(function(){
        if(!options.allPage){
            return $(this).hide();
        }
        $(this).show();
        var $this = $(this).addClass('clearfix text-center').html('');
        $this.append('<span class="pull-left ml-10">共'+options.allNumber+'条数据,第'+options.page+'/'+options.allPage+'页</span>');
        var $fist = $('<button disabled class="btn btn-sm mr-10">').text('first').attr('num',1);
        var $last = $('<button disabled class="btn btn-sm mr-10">').text('last').attr('num',options.allPage);
        var $prev = $('<button disabled class="btn btn-sm mr-10">').text('prev').attr('num',options.page - 1);
        var $next = $('<button disabled class="btn btn-sm mr-10">').text('next').attr('num',options.page + 1);
        $this.append($fist)
            .append($prev);
        var min=1,max=options.allPage;
        if(options.allPage > 5){
            if(options.page > 3){
                $this.append($('<span class="more">...</span>'));
                min = options.page - 2;
                max = Math.min(max , options.page + 2)
            }
            if(options.allPage - 5 < options.page){
                min = options.allPage - 5;
                max = options.allPage;
            }
        }

        for(var i = min ; i <= max ; i ++ ){
            var $number = $('<btn class="btn btn-xs btn-default mr-5"></btn>').text(i).attr('num' , i);
            $this.append($number);
            if(i == options.page){
                $number.addClass('active btn-primary');
            }
        }
        if(max < options.allPage){
            $this.append($('<span class="more">...</span>'));
        }
        $this.append($next)
            .append($last);
        if(options.page > 1){
            $fist.prop('disabled' , false);
            $prev.prop('disabled' , false);
        }
        if(options.page < options.allPage){
            $next.prop('disabled' , false);
            $last.prop('disabled' , false);
        }
        $this.find('.btn').click(function(){
            if($(this).hasClass('active'))return false;
            if(options.done)options.done($(this).attr('num') - 0);
            return false;
        });
    })
};
/**
 * 将以base64的图片url数据转换为Blob
 * @param urlData
 *            用url方式表示的base64图片数据
 */
useCommon.convertBase64UrlToBlob = function (urlData , type){
    var bytes=window.atob(urlData.split(',')[1]);        //去掉url的头，并转换为byte
    //处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }
    return new Blob( [ab] , {type : type});
};

useCommon.uuid = function() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}
/**
 * 字符串转JSON
 *
 */
useCommon.parseJSON = function (str){
    try{
        str = str.replace(/\n|\r\n|\n\r/g,function(){return '<br>'});
        return JSON.parse(str);
    }catch(e){
        return {};
    }
};

/*
 * 日期格式化
 * */
useCommon.parseDate = function(date , format){
    format = format || 'Y-m-d H:i:s';//默认转换格式
    if(!(date instanceof Date)){
        if(date - 0){
            date -= 0;
        }
        date = new Date(date);
    }
    if(date == 'Invalid Date')return '';
    var time = {};
    time.Y = date.getFullYear();
    time.y = (time.Y + '').slice(2);
    time.m = this.stringPadStart(date.getMonth() + 1 , 2 , '0');
    time.d = this.stringPadStart(date.getDate() , 2 , '0');
    time.D = '星期' + '日一二三四五六'[date.getDay()];
    time.H = this.stringPadStart(date.getHours() , 2 ,'0');
    time.h = this.stringPadStart(time.H%12 , 2 , '0');
    time.i = this.stringPadStart(date.getMinutes() , 2 , '0');
    time.s = this.stringPadStart(date.getSeconds(), 2 ,0);
    time.w = this.stringPadStart(date.getMilliseconds(),3 ,0);
    time.a = time.H >= 12 ?'下午':'上午';
    return format.replace(/./g,function(a){
        return time[a] || a;
    });
};
/*
 * 获取对象的值 或者执行方法获取值
 * */
useCommon.getKeyValue = function(obj , key){
    if(typeof obj[key] == 'function'){
        return obj[key].apply(obj , [].slice.call(arguments , 2));
    }else return obj[key];
};
/*
 *在前补全字符串
 * */
useCommon.stringPadStart = function(str , len , split){
    if(str == null)str = '';
    str += '';
    if(str.length > len)return str;
    var _len = len - str.length;
    return Array(_len + 1).join(split).slice(0 , _len) + str;
};
/*
 *在后补全字符串
 * */
useCommon.stringPadEnd = function(str , len , split){
    if(str == null)str = '';
    str += '';
    if(str.length > len)return str;
    var _len = len - str.length;
    return  str + Array(_len + 1).join(split).slice(0 , _len);
};
//sha256加密
useCommon.SHA256 = function(s){
    var chrsz = 8;
    var hexcase = 0;
    function safe_add (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    }
    function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
    function R (X, n) { return ( X >>> n ); }
    function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
    function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
    function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
    function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
    function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
    function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }
    function core_sha256 (m, l) {
        var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
        var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
        var W = new Array(64);
        var a, b, c, d, e, f, g, h, i, j;
        var T1, T2;
        m[l >> 5] |= 0x80 << (24 - l % 32);
        m[((l + 64 >> 9) << 4) + 15] = l;
        for ( var i = 0; i<m.length; i+=16 ) {
            a = HASH[0];
            b = HASH[1];
            c = HASH[2];
            d = HASH[3];
            e = HASH[4];
            f = HASH[5];
            g = HASH[6];
            h = HASH[7];
            for ( var j = 0; j<64; j++) {
                if (j < 16) W[j] = m[j + i];
                else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
                T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
                T2 = safe_add(Sigma0256(a), Maj(a, b, c));
                h = g;
                g = f;
                f = e;
                e = safe_add(d, T1);
                d = c;
                c = b;
                b = a;
                a = safe_add(T1, T2);
            }
            HASH[0] = safe_add(a, HASH[0]);
            HASH[1] = safe_add(b, HASH[1]);
            HASH[2] = safe_add(c, HASH[2]);
            HASH[3] = safe_add(d, HASH[3]);
            HASH[4] = safe_add(e, HASH[4]);
            HASH[5] = safe_add(f, HASH[5]);
            HASH[6] = safe_add(g, HASH[6]);
            HASH[7] = safe_add(h, HASH[7]);
        }
        return HASH;
    }
    function str2binb (str) {
        var bin = Array();
        var mask = (1 << chrsz) - 1;
        for(var i = 0; i < str.length * chrsz; i += chrsz) {
            bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
        }
        return bin;
    }
    function Utf8Encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    }
    function binb2hex (binarray) {
        var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for(var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
                hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8 )) & 0xF);
        }
        return str;
    }
    s = Utf8Encode(s);
    return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
};
useCommon.parse = function(data){
    try{
        return JSON.parse(data);
    }catch (e){
        try{
            return eval('('+data+')');
        }catch (e){
            return data;
        }
    }
};
useCommon.stringify = function(data){
    try{
        return JSON.stringify(data) + '';
    }catch (e){
        return data + '';
    }
};

useCommon.serialize = function(data){
    var str = '';
    for(var key in data){
        var o = data[key];
        if(o != null){
            if(str)str+='&';
            str += key + '=' + encodeURIComponent(o);
        }
    }
    return str;
};
useCommon.concatImgUrl = function(url){
    if(!url)return url;
    if(/^http/.test(url))return url;
    return resJson.apiImgUrl + url;
};
useCommon.addUrlParam = function(url , param){
    if(typeof param == 'object'){
        param = useCommon.serialize(param);
    }
    url += /\?/.test(url)?'&':'?';
    return url += param;
};
useCommon.showPwStr = function(str){
    str = str || '';
    return str.slice(0,3)+'***'+str.slice(-3);
};
useCommon.getHrefData = function(url){
    if(url.indexOf('?')>=0)url = url.split('?')[1];
    var rt = {};
    url.split('&').forEach(function(a){
        var index = a.indexOf('=');
        rt[a.substr(0,index)] = decodeURIComponent(a.substr(index+1));
    });
    return rt;
};
useCommon.numberToCn = function(number){
    return (number+'').split('').reverse().map(function(a , i){
        return a!=0 && ('一二三四五六七八九'[a-1] + (i?'十':'')) || ''
    }).reverse().join('');
};
useCommon.sumTime = function(time , format){
    format = format || 'dhis';
    var timeData = {
        d:'',
        s:'',
        h:'',
        i:''
    };
    time = Math.floor(time / 1000);
    var more;
    if(more = time % 60 ){
        timeData.s = more + '秒';
        time -= more;
    }
    time /= 60;
    if(more = time % 60 ){
        timeData.i = more + '分';
        time -= more;
    }
    time /= 60;
    if(more = time % 24 ){
        timeData.h = more + '小时';
        time -= more;
    }
    time /= 24;
    if(time > 1){
        timeData.d = time + '天';
    }
    return format.replace(/./g , function(a){
        return timeData[a];
    });
};
window.WY = {};
(function(){
    var handlers = {};
    var readyHandler = {};
    WY.ready = function(type ,func , done){
        var handler = readyHandler[type] = readyHandler[type] || {};
        if(typeof func == 'function'){
            WY.bind('ready-' + type , func);
            if(handler.isReady){
                func && func(handler.data, handler.done);
                return false;
            }
        }else{
            handler.data = func;
            handler.done = done;
            handler.isReady = true;
            WY.trigger('ready-' + type , handler.data , handler.done);
            if(handler.once){
                handler.once.forEach(function(a){
                    try{
                        a(handler.data , handler.done);
                    }catch (e){
                        console.error(e);
                    }
                })
                handler.once = [];
            }
        }
    };
    WY.readyOnce = function(type ,func){
        var handler = readyHandler[type] = readyHandler[type] || {};
        if(typeof func == 'function'){
            if(handler.isReady){
                func && func(handler.data , handler.done);
                return false;
            }else{
                handler.once = handler.once || [];
                handler.once.push(func);
            }
        }
    };
    WY.bind = function(event , func){
        console.log('bind --' +event );
        if(func){
            var handler = handlers[event] = handlers[event] || [];
            if(handler.indexOf(func) >= 0){
                return false;
            }
            handler.push(func);
        }
    };
    WY.unbind = function(event , func){
        if(func){
            var handler = handlers[event];
            if(handler){
                var index = handler.indexOf(func);
                if(index >= 0){
                    handler.splice(index , 1);
                }
            }

        }else{
            handlers[event] = [];
        }
    };
    WY.trigger = function(event , data , options){
        console.log('trigger --' +event );
        var handler = handlers[event];
        var nextStatus;
        handler && handler.forEach(function(a){
            try{
                if(a(data , options) === false)nextStatus = false;
            }catch (e){
                console.error(e);
            }
        });
        if(nextStatus === false)return false;
        if(event.indexOf('.') > 0){
            WY.trigger(event.replace(/\.\w+$/,'') , data , options);
        }
    };

    var eventHandler = ['click','change'];
    eventHandler.forEach(function(o){
        $(document).on(o , '[wy-'+o+']' , function(){
            WY.trigger($(this).attr('wy-'+o));
        });
    });

})();

WY.toggleActive = function($ele){
    $ele.children().click(function(){
        if($(this).hasClass('active'))return false;
        WY.trigger('active-item',$(this));
        $(this).addClass('active').siblings().removeClass('active');
    });
};
$(function(){
    $('.wy-toggle-active').each(function(){
        WY.toggleActive($(this));
    });
});
;(function(){
    var $modalLoadingWindow;
    WY.bind('modal-handler' , function(content , options){
        content.find('[modal-handler]').each(function(){
            var handler = $(this).attr('modal-handler');
            var $content = $(this);
            handler.split(',').forEach(function(one){
                WY.trigger('modal-handler-'+one, $content , options);
            });

        });
    });
    $.modalLoading = function(content , options){
        $modalLoadingWindow = $modalLoadingWindow || $('.modal-loading-window');
        $modalLoadingWindow.find('.modal-content').html('').append(content).removeClass('back-none');
        if(options.backNone){
            $modalLoadingWindow.find('.modal-content').addClass('back-none');
        }
        WY.trigger('modal-handler' , $modalLoadingWindow,options);
        var $content  = $modalLoadingWindow.find('.modal-content').children();
        WY.trigger('modal-load',$content , options);
        if(!options.notModal){
            $modalLoadingWindow.modal();
        }
        else return $modalLoadingWindow;
        return $content;
    };
    $.modalLoadingView = function(url , call , options){
        if(!/^\//.test(url))url = '/common/view?view=' + url;
        if(options == null){
            options = {}
        }else if(options == true){
            options = {
               sts:1
            }
        }
        $.get(url , function(content){
            var $html;
            if(!options.sts){
                $html = $.modalLoading(content , options);
            }else{
                $html = content;
            }
            if(call)call($html);
        });
    };
    $.modalLoadingHide = function(){
        $modalLoadingWindow.modal('hide');
    };
    $(function(){
        var modalLoad;
        var options;
        var $this;
        function load(){
            $.modalLoadingView(modalLoad, function(content){

            },options);
        }
        $('body').on('click','[modal-load]' , function(){
            $this = $(this);
            modalLoad = $this.attr('modal-load');
            options = useCommon.parse($this.attr('modal-options'));
            load();
            return false;
        });
    });
})();
$(document).on('click' , '.img-code-btn' , function () {
   $(this).attr('src' , '/captcha?_='+Date.now());
   $($(this).attr('show-code-input')).val('');
});
WY.createOne = function(type , data , i){
    var o = data;
    switch (type){
        case 'news':
            var $list = $('<div type="'+data.type+'" code="'+data.industryDynamicId+'" class="pt-20 pb-20 pl-200 pr-20 position-relative data-list">');
            $list.append('<img onerror="this.src=\'\'" ' +
            'class="show-detail-btn cursor-pointer height-100 width-180 back-204 position-absolute mt-20 ml-20 top-0 left-0" ' +
            'src="'+WY.getNewsImg(data.picUrl)+'">');
            $list.append('<div class="pl-15">' +
            '<div class="fz-18 lh-30 height-30 write-ellipsis show-detail-btn cursor-pointer ">'+data.title+'</div>' +
            '<div class="height-40 color-666 lh-20 write-ellipsis-2">'+data.contenJx+'</div>' +
            '<div class="height-30 lh-30 text-right">'+useCommon.parseDate(data.rowAddTime,'Y-m-d')+'</div>' +
            '</div>');
            return $list;
        case 'other-news':
            var $list = $('<div type="'+data.type+'" code="'+data.industryDynamicId+'"  class="data-list pt-10 pb-10 pl-130 border-b-204 height-111 back-238 position-relative">');
            $list.append('<img onerror="this.src=\'\'" ' +
            'class="show-detail-btn cursor-pointer height-90 width-130 back-204 position-absolute mt-10 top-0 left-0" ' +
            'src="'+WY.getNewsImg(data.picUrl)+'">');
            $list.append('<div class="pl-10">' +
            '<div class="fz-18 lh-30 height-30 write-ellipsis show-detail-btn cursor-pointer" title="'+data.title+'">'+data.title+'</div>' +
            '<div class=" height-40 color-204 lh-20 write-ellipsis-2 mt-10">'+data.contenJx+'</div>' +
            '</div>');
            return $list;
        case 'three-news':
            var $list = $('<div type="'+data.type+'" code="'+data.industryDynamicId+'"  class="data-list pt-10 pb-10 pl-10 border-b-204 height-90 back-238 position-relative">');
            $list.append('<div class="pl-10">' +
            '<div class="fz-18 lh-30 height-30 write-ellipsis show-detail-btn cursor-pointer" title="'+data.title+'">'+data.title+'</div>' +
            '<div class=" height-20 color-204 lh-20 write-ellipsis mt-10">'+data.contenJx+'</div>' +
            '</div>');
            return $list;
        case 'memorial':
            var hrefStr = data.joinType == 'password' && !WY.isMe(data.userId)?
                ('url="/venue?id='+data.memorialId+'" code="'+data.memorialId+'" class="need-put-password cursor-pointer"'):
                ('href="/venue?id='+data.memorialId+'" target="_blank"');
            var $item = $('<div class="data-list width-240 height-180 pt-10 pb-10 pl-5 pr-5 back-white mb-10 inline-block">');
            if(((i+1)%3))$item.addClass('mr-10');
            $item.append('<div class="fz-16 height-40 lh-40">'+data.memorialName+'</div>');
            $item.append('<div class="clearfix height-100">' +
            '<a '+hrefStr+'>' +
            '<img src="'+useCommon.concatImgUrl(data.headImg)+'" ' +
            'class="height-100-100 width-75 pull-left" alt="">' +
            '</a>' +
            '<div class="pull-right width-145 flex-column color-666 height-100-100">' +
            '<div class="width-100-100 fz-12">馆号：'+data.memorialId+'</div>' +
            '<div class="width-100-100 fz-12">祭拜数：'+data.worshipCount+'</div>' +
            '<div class="width-100-100 fz-12">馆主：'+data.nickname+'</div>' +
            '<div class="width-100-100 fz-12">建馆时间：'+useCommon.parseDate(data.rowAddTime,'Y-m-d')+'</div>' +
            '</div>' +
            '</div>');
            return $item;
        case 'friend':
            var $list = $('<div class="data-list mt-10 pl-50 pt-10 pb-10 back-white position-relative">');
            if((i+1)%4)$list.addClass('mr-10');
            $list.append('<img src="'+WY.getHeadImg(data.headImg)+'" class="left-0 top-0 mt-30 ml-10 position-absolute width-40 height-40 border-red-100">');
            $list.append('<div class="width-115 flex-column pl-10">' +
            '<div class="width-100-100 text-left">ID:'+(data.userId )+'</div>' +
            '<div class="width-100-100 text-left write-ellipsis">昵称:<span title="'+(data.nickname || data.userName)+'">'+(data.nickname || data.userName)+'</span></div>' +
            '<div class="width-100-100 text-left">性别:'+(data.gender  || '无')+'</div>' +
            '</div>');
            return $list;
        case 'my-friend':
            var $list = $('<div class="data-list width-260 mt-10 border-eee back-white position-relative">');
            if((i+1)%3)$list.addClass('mr-10');
            $list.append('<div class="pt-10 pl-10 pr-10 border-b-eee color-666 fz-12">' +
                '<div class="friend-header">' +
                    '<img src="'+WY.getHeadImg(data.headImg)+'" class="ico-35">' +
                    '<div class="width-60-100 text-left">' +
                        '<div class="color-blue-2 fz-18 lh-20 height-20 write-ellipsis">'+(data.nickname || data.userName)+'</div>' +
                        '<div class="lh-15 height-15">用户ID:'+data.userId+'</div>' +
                    '</div>' +
                    '<div class="text-right">称呼:<a code="'+data.friendRecordId+'" class="color-blue-1 add-remark-btn cursor-pointer">'+(data.remarks?data.remarks:'添加')+'</a></div>' +
                '</div>'+
                '<div class="width-100-100 text-left lh-20 height-20">生日:'+(data.birthDay?(useCommon.parseDate(data.birthDay,'Y-m-d')):'' )+'</div>' +
                '<div class="width-100-100 text-left lh-20 height-20">家乡:'+(data.jxProvince || '')+(data.jxCity || '')+(data.jxCounty || '')+'</div>' +
                '<div class="width-100-100 text-left lh-20 height-20">居住地:'+(data.xjProvince || '')+(data.xjCity || '')+(data.xjCounty || '')+'</div>' +
                '</div>');
            $list.append('<div class="friend-footer pl-10 pr-10 pt-5 pb-5">' +
            '</div>');
            return $list;
        case 'genealogy-item':
            return $('<div class="width-150 height-202">' +
            '<img src="/images/genealogy/head-img.png" class="width-100-100 height-100-100" alt=""/>' +
            '<div class="position-absolute width-40 pl-15 pr-15 top-0 right-0 break-all " style="line-height: 15px;margin-top: 24px;margin-right: 11px;">'+data.genealogyName+'</div>' +
            '</div>');
        case 'genealogy':
            var $list = $('<div class="data-list inline-block width-240 pt-20 mb-10">');
            if((i+1)%3)$list.addClass('mr-10');
            var $item = WY.createOne('genealogy-item' , data , i);
            $list.append($('<a target="_blank" href="/genealogy/detail?id='+data.genealogyId+'">').append($item.addClass('margin-auto position-relative color-333')));
            $list.append('<div class="width-150 margin-auto"><span class="fz-20 inline-block text-bottom">['+data.surname+']</span><span class="inline-block text-bottom"">'+data.genealogyName+'</span></div>');
            return $list;
        case 'album':
            var $list = $('<div class="data-list inline-block width-250 height-230 position-relative mb-20 z-index-1">');
            if((i+1)%3)$list.addClass('mr-30');
            $list.append('<div class="back-white border-204 width-240 height-220 position-absolute right-0 bottom-0"></div>');
            $list.append('<div class="back-white border-204 width-240 height-220 position-absolute right-0 top-0 mt-5 mr-5 z-index-1"></div>');
            $list.append('<div class="back-white border-204 width-240 height-220 position-absolute left-0 top-0 z-index-100 pt-10 pl-10 pr-10">' +
            '<img class="width-100-100 height-140 border-none show-info-img cursor-pointer" code="'+(data.albumId || data.memorialId) +'" src="'+(useCommon.concatImgUrl(data.headFile && data.headFile.fileFormat=='img'&& data.headFile.filePath || ''))+'" alt=""/>' +
            '<div class="pt-20 fz-16 pl-10">'+(data.albumName || data.memorialName)+'('+data.countPic +') '+
            (data.type == 'album'?'<div class="div-btn color-blue-2 edit-album-btn inline-block" val="'+data.albumName+'" code="'+data.albumId+'">修改</div><div class="div-btn color-999 del-album-btn inline-block" code="'+data.albumId+'">删除</div>':'')+
            '</div>' +
            '</div>');
            return $list;
    }
};
WY.enum = {
    getName:function(code , val , realSts){
        var data = this.data[code];
        var rt = data && data[val];
        if(!realSts)rt = rt || val;
        return rt;
    },
    getData:function(code){
        return this.data[code] || {};
    },
    data:{
        memorialType:{
            personal:'个人',
            celebrity:'名人',
        }
    }
};
WY.getFileUrl = function(file , call){
    var url;
    try{
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(e){
            url = this.result;
            next();
        }
    }catch(e){
        try{
            if(window.URL){
                url = URL.createObjectURL(file);
            }else{
                url = webkitURL.createObjectURL(file);
            }
        }catch (e){

        }
        next();
    }
    function next(){
        call && call(url);
    }
}
$(function(){
    var $userInfo  = $('.user-login-info');
    function setUserInfo(){
        var userInfo = sessionJson.userInfo;
        $userInfo.children().hide();
        $userInfo.find('img').attr('src' , (userInfo.headImg));
        $userInfo.find('.show-user-name').text(userInfo.nickname);
        $userInfo.children().last().show();
    }
    $userInfo.children().last().on('mouseenter' , function(){
        WY.popover({
            //template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>',
            content:'<div>' +
            '<div class="hover-back-gray pl-20 pr-20"><a class="color-blue-2 inline-block height-30 lh-30" href="/user#detail" target="_blank">个人资料</a></div>' +
            '<div class="hover-back-gray pl-20 pr-20"><a class="color-blue-2  inline-block height-30 lh-30" href="/user" target="_blank">个人中心</a></div>' +
            '<div class="hover-back-gray pl-20 pr-20"><a class="color-blue-2  inline-block height-30 lh-30" href="/login/out">退出</a></div>' +
            '</div>',
            className:'back-333',
            container:this,
            placement:'bottom',
            done:function($pop){
                $pop.find('a').click(function(e){
                    e.stopPropagation();
                })
            }
        });
    });
    $userInfo.children().last().on('click',function(){
        return false;
    });
    WY.ready('loginSuccess',setUserInfo);
    $('body').on('click','.popover',function(e){
        return false;
    });
    $userInfo.children().last().click(function(){
        return false;
    })
    $('body').on('click',function(e){
        $('.popover').hide();
    });
    $('.head-search-btn').click(function(){
        location.href = '/search?key='+$(this).prev().val();
    });
});
;(function(){
    var demoImg = '/images/photo/demo.jpg';
    WY.getHeadImg = function(url){
        if(!url || demoImg == url)return demoImg;
        return useCommon.concatImgUrl(url);
    };
    WY.getNewsImg = function(src){
        var demo = '/images/404.png';
        var ignore = ['http://cdn.tsingming.com/img/wm.jpg'];
        if(ignore.indexOf(src) != -1)return demo;
        return useCommon.concatImgUrl(src);
    };
    WY.bind('img-load',function(url){
       var img = new Image();
        img.src = useCommon.concatImgUrl(url);
    });
})();
$(function(){
    $('input').attr('autocomplete','off');
    $(document).on('change','[set-name]',function(){
        $($(this).attr('set-name')).val($(this).val() && $(this).find(':selected').text() || '');
    });
    $('body').on('change' , '[check-all]',function(e , f){
        var $checkOne = $('[check-one="'+$(this).attr('check-all')+'"]');
        $checkOne.prop('checked',$(this).prop('checked'));
    });
    $('body').on('change' , '[check-one]',function(e){
        var checkName = $(this).attr('check-one');
        var $checkAll = $('[check-all="'+checkName+'"]');
        $checkAll.prop('checked',!$('[check-one="'+checkName+'"]:not(:checked)').length);
    });
    $(document).on('click' , '.img-code-btn',function(e){
        $(this).attr('src' , '/captcha?_'+Date.now());
    });
    $(document).on('click' , '.to-back-btn',function(e){
        history.back();
    });
});
window.resetImgUrl = function(url){
    url += '';
    return url.replace(/^http(s)?:/,'')
};
var hrefData = useCommon.getHrefData(location.search.slice(1));
window.onerror = function(err , url , line){

    try{
        errorLog({
            err:err,
            url:url ,
            line : line
        });
    }catch(e){

    }
};
window.errorLog = function(data){
    console.error(data);
    $.ajax({
        url:'common/log',
        notLog:true,
        data:data
    })
};
// md5
!function(a){"use strict";function b(a,b){var c=(65535&a)+(65535&b),d=(a>>16)+(b>>16)+(c>>16);return d<<16|65535&c}function c(a,b){return a<<b|a>>>32-b}function d(a,d,e,f,g,h){return b(c(b(b(d,a),b(f,h)),g),e)}function e(a,b,c,e,f,g,h){return d(b&c|~b&e,a,b,f,g,h)}function f(a,b,c,e,f,g,h){return d(b&e|c&~e,a,b,f,g,h)}function g(a,b,c,e,f,g,h){return d(b^c^e,a,b,f,g,h)}function h(a,b,c,e,f,g,h){return d(c^(b|~e),a,b,f,g,h)}function i(a,c){a[c>>5]|=128<<c%32,a[(c+64>>>9<<4)+14]=c;var d,i,j,k,l,m=1732584193,n=-271733879,o=-1732584194,p=271733878;for(d=0;d<a.length;d+=16)i=m,j=n,k=o,l=p,m=e(m,n,o,p,a[d],7,-680876936),p=e(p,m,n,o,a[d+1],12,-389564586),o=e(o,p,m,n,a[d+2],17,606105819),n=e(n,o,p,m,a[d+3],22,-1044525330),m=e(m,n,o,p,a[d+4],7,-176418897),p=e(p,m,n,o,a[d+5],12,1200080426),o=e(o,p,m,n,a[d+6],17,-1473231341),n=e(n,o,p,m,a[d+7],22,-45705983),m=e(m,n,o,p,a[d+8],7,1770035416),p=e(p,m,n,o,a[d+9],12,-1958414417),o=e(o,p,m,n,a[d+10],17,-42063),n=e(n,o,p,m,a[d+11],22,-1990404162),m=e(m,n,o,p,a[d+12],7,1804603682),p=e(p,m,n,o,a[d+13],12,-40341101),o=e(o,p,m,n,a[d+14],17,-1502002290),n=e(n,o,p,m,a[d+15],22,1236535329),m=f(m,n,o,p,a[d+1],5,-165796510),p=f(p,m,n,o,a[d+6],9,-1069501632),o=f(o,p,m,n,a[d+11],14,643717713),n=f(n,o,p,m,a[d],20,-373897302),m=f(m,n,o,p,a[d+5],5,-701558691),p=f(p,m,n,o,a[d+10],9,38016083),o=f(o,p,m,n,a[d+15],14,-660478335),n=f(n,o,p,m,a[d+4],20,-405537848),m=f(m,n,o,p,a[d+9],5,568446438),p=f(p,m,n,o,a[d+14],9,-1019803690),o=f(o,p,m,n,a[d+3],14,-187363961),n=f(n,o,p,m,a[d+8],20,1163531501),m=f(m,n,o,p,a[d+13],5,-1444681467),p=f(p,m,n,o,a[d+2],9,-51403784),o=f(o,p,m,n,a[d+7],14,1735328473),n=f(n,o,p,m,a[d+12],20,-1926607734),m=g(m,n,o,p,a[d+5],4,-378558),p=g(p,m,n,o,a[d+8],11,-2022574463),o=g(o,p,m,n,a[d+11],16,1839030562),n=g(n,o,p,m,a[d+14],23,-35309556),m=g(m,n,o,p,a[d+1],4,-1530992060),p=g(p,m,n,o,a[d+4],11,1272893353),o=g(o,p,m,n,a[d+7],16,-155497632),n=g(n,o,p,m,a[d+10],23,-1094730640),m=g(m,n,o,p,a[d+13],4,681279174),p=g(p,m,n,o,a[d],11,-358537222),o=g(o,p,m,n,a[d+3],16,-722521979),n=g(n,o,p,m,a[d+6],23,76029189),m=g(m,n,o,p,a[d+9],4,-640364487),p=g(p,m,n,o,a[d+12],11,-421815835),o=g(o,p,m,n,a[d+15],16,530742520),n=g(n,o,p,m,a[d+2],23,-995338651),m=h(m,n,o,p,a[d],6,-198630844),p=h(p,m,n,o,a[d+7],10,1126891415),o=h(o,p,m,n,a[d+14],15,-1416354905),n=h(n,o,p,m,a[d+5],21,-57434055),m=h(m,n,o,p,a[d+12],6,1700485571),p=h(p,m,n,o,a[d+3],10,-1894986606),o=h(o,p,m,n,a[d+10],15,-1051523),n=h(n,o,p,m,a[d+1],21,-2054922799),m=h(m,n,o,p,a[d+8],6,1873313359),p=h(p,m,n,o,a[d+15],10,-30611744),o=h(o,p,m,n,a[d+6],15,-1560198380),n=h(n,o,p,m,a[d+13],21,1309151649),m=h(m,n,o,p,a[d+4],6,-145523070),p=h(p,m,n,o,a[d+11],10,-1120210379),o=h(o,p,m,n,a[d+2],15,718787259),n=h(n,o,p,m,a[d+9],21,-343485551),m=b(m,i),n=b(n,j),o=b(o,k),p=b(p,l);return[m,n,o,p]}function j(a){var b,c="";for(b=0;b<32*a.length;b+=8)c+=String.fromCharCode(a[b>>5]>>>b%32&255);return c}function k(a){var b,c=[];for(c[(a.length>>2)-1]=void 0,b=0;b<c.length;b+=1)c[b]=0;for(b=0;b<8*a.length;b+=8)c[b>>5]|=(255&a.charCodeAt(b/8))<<b%32;return c}function l(a){return j(i(k(a),8*a.length))}function m(a,b){var c,d,e=k(a),f=[],g=[];for(f[15]=g[15]=void 0,e.length>16&&(e=i(e,8*a.length)),c=0;16>c;c+=1)f[c]=909522486^e[c],g[c]=1549556828^e[c];return d=i(f.concat(k(b)),512+8*b.length),j(i(g.concat(d),640))}function n(a){var b,c,d="0123456789abcdef",e="";for(c=0;c<a.length;c+=1)b=a.charCodeAt(c),e+=d.charAt(b>>>4&15)+d.charAt(15&b);return e}function o(a){return unescape(encodeURIComponent(a))}function p(a){return l(o(a))}function q(a){return n(p(a))}function r(a,b){return m(o(a),o(b))}function s(a,b){return n(r(a,b))}function t(a,b,c){return b?c?r(b,a):s(b,a):c?p(a):q(a)}"function"==typeof define&&define.amd?define(function(){return t}):a.md5=t}(this);
$(document).on('input' , '[show-text-number]' , function(){
    var $ele = $($(this).attr('show-text-number'));
    $ele.text($(this).attr('maxlength') - $(this).val().length);
});
$(document).on('change' , ':radio' , function(){
    $(':radio').each(function(){
        $(this).closest('.radio')[this.checked?'addClass':'removeClass']('checked');
    });
});
;(function(){
    WY.ready('loginSuccess',function(){
        localStorage.loginTime = Date.now();
        $('.login-success-show').show().css({
            visibility:'visible'
        });
    });
    $(function(){
        if(sessionJson.userInfo){
            if(!localStorage.loginTime || Date.now() - localStorage.loginTime > 20 * 60 * 1000){
                WY.trigger('login-flush',{
                    done:function(userInfo){
                        if(userInfo){
                            WY.ready('loginSuccess' , resetUserInfo(userInfo));
                        }
                    }
                });
            }
            else WY.ready('loginSuccess' , resetUserInfo(sessionJson.userInfo));
        }
    });
    function resetUserInfo(userInfo){
        sessionJson.userInfo = userInfo;
        userInfo.nickname = userInfo.nickname || userInfo.userName;
        userInfo.headImg = WY.getHeadImg(userInfo.headImg);
        userInfo.memberName = ({
            UniversalMember:'普通会员',
            SilverMember:'白银会员',
            GoldMember:'黄金会员',
            DiamondMember:'钻石会员'
        })[userInfo.memberKey];
        return userInfo;
    }
    WY.bind('login' , function(data , call){
        $.modalLoadingView('window/login/login' , function(){

        },{
            done:call
        })
    });
    $(document).on('click' , '.need-login-handler' , function(){
        var href = $(this).attr('href');
        var target = $(this).attr('target');
        if(sessionJson.userInfo)return;
        WY.trigger('login' ,{}, function(){
            location.href = href;
        });
        return false;
    });
    WY.bind('modal-handler-login' , function($content , options){
        $content.find('.submit-btn').click(function(){
            var data = $content.__serializeJSON();
            var valid = useValidate.login.validator(data , 'login');
            if(!valid.valid){
                useCommon.toast(valid.message);
                return false;
            }
            data.password = useCommon.SHA256(data.password);
            $.post('/login',data,function(a){
                if(a.code == 0){
                    WY.ready('loginSuccess' ,resetUserInfo(a.data));
                    if(options.done && options.done() === false)return false;
                    $.modalLoadingHide();
                }else{
                    useCommon.toast(a.message);
                }
            });
        });
    });
    WY.bind('modal-handler-login-reg' , function($content,options){
        $.sms({
            content:$content
        });
        $content.find('.submit-btn').click(function(){
            var data = $content.__serializeJSON();
            var valid = useValidate.login.validator(data , 'reg');
            if(!valid.valid){
                useCommon.toast(valid.message);
                return false;
            }
            data.password = useCommon.SHA256(data.password);
            $.post('/login/reg',data,function(a){
                if(a.code == 0){
                    WY.ready('loginSuccess' , resetUserInfo(a.data));
                    if(options.done && options.done() === false)return false;
                    $.modalLoadingHide();
                }else{
                    useCommon.toast(a.message);
                }
            });
        });
    });
    WY.bind('modal-handler-login-reset' , function($content , options){
        $.sms({
            content:$content
        });
        $content.find('.submit-btn').click(function(){
            var data = $content.__serializeJSON();
            var valid = useValidate.login.validator(data , 'reg');
            if(!valid.valid){
                useCommon.toast(valid.message);
                return false;
            }
            data.password = useCommon.SHA256(data.password);
            $.post('/login/reset',data,function(a){
                if(a.code == 0){
                    if(options.done && options.done() === false)return false;
                    useCommon.toast('重置密码成功，立即登录');
                    $.modalLoadingView('window/login/login');
                }else{
                    useCommon.toast(a.message);
                }
            });
        });
    });
    WY.bind('login-flush',function(options){
        $.get('/user/info/detail',function(a){
            if(a.code == 0){
                WY.ready('loginSuccess' , resetUserInfo(a.data));
                options && options.done && options.done(sessionJson.userInfo);
            }else{
                options && options.done && options.done();
            }
        })
    });
    WY.bind('flush-user-info',function(call){
        $.get('/user/info/detail',function(a){
            if(a.code == 0){
                WY.ready('loginSuccess',resetUserInfo(a.data));
            }
            call && call();
        })
    });
})();
$(function(){
});
;(function(){
    var className = 'null-message-notice';
    $.fn.showNullMessage = function(message){
        return this.each(function(){
            var $message = $(this).find('.' + className);
            if(!$message[0]){
                $message = $('<div>').addClass(className);
                $(this).append($message);
            }
            $message.html(message || '暂无记录');
        });
    };
    $.fn.hideNullMessage = function(){
        return this.each(function(){
            $(this).find('.' + className).remove();
        })
    };
    var $backWindow;
    $.showWhiteBackWindow = function(){
        $backWindow = $backWindow || $('.back-hide-window');
        $backWindow.show();
    };
    $.hideWhiteBackWindow = function(){
        if($backWindow)$backWindow.hide();
    };


    function loading(options){
        this.init(options);
    }
    loading.prototype = {
        init:function(options){
            this.options = options || {};
            this.moveTypes = ['leftEle' , 'rightLeft'];
            this.ele = (this.createElement());
            this.moveCount = 0;
            this.start();
        },
        start:function(){
            this.doMove(1);
        },
        doMove:function(start){
            var _this = this;
            this[this.moveTypes[this.moveCount]].move(function(){
                _this.doMove();
            } , start);
            this.moveCount = 1 - this.moveCount;
        },
        createElement:function(){
            var $div = $('<div>').addClass('ball-animate-loading');
            var left = this.leftEle = this.makeBall({
                startLeft:40,
                endLeft:0,
                showLeft:0
            });
            var $center = $('<div class="ball">');
            var right = this.rightLeft = this.makeBall({
                startLeft:60,
                endLeft:100
            });
            $div.append(left.ele).append($center).append(right.ele);
            return $div;
        },
        makeBall:function(data){
            return new ball(data);
        }
    };
    function ball(options){
        this.init(options);
    }
    ball.prototype = {
        init:function(options){
            this.options = options;
            this.startLeft = options.startLeft;
            this.endLeft = options.endLeft;
            this.showLeft = options.showLeft == null?options.startLeft:options.showLeft;
            this.ele = this.createBall();
            this.ele.css({
                left:this.showLeft
            })
        },
        createBall:function(){
            return $('<div class="ball position-absolute">');
        },
        move:function(call , start){
            var _this = this;
            if(start){
                _this.moveEnd(call);
            }
            else this.moveStart(function(){
                _this.moveEnd(call);
            })
        },
        moveStart:function(call){
            var _this = this;
            this.ele.animate({
                left:this.endLeft
            } , this.options.delay || 500 ,'linear', function(){
                if(call)call();
            });
        },
        moveEnd:function(call){
            var _this = this;
            this.ele.animate({
                left:this.startLeft
            } , this.options.delay || 500 ,'linear', function(){
                if(call)call();
            });
        }
    };
    $.fn.showLoadingMessage = function(){
        return this.addClass('text-center').each(function(){
            if(this.loadMessage){
                this.loadMessage.ele.remove();
            }
            this.loadMessage = new loading();
            $(this).append(this.loadMessage.ele);
        });
    };
    $.fn.hideLoadingMessage = function(){
        return this.each(function(){
            if(this.loadMessage)this.loadMessage.ele.remove();
            delete this.loadMessage;
        });
    };
})();
$(document).on('click','.need-put-password',function(){
    var url = $(this).attr('url');
    var memorialId = $(this).attr('code');
    var type = $(this).attr('type');
    function accessPassword(){
        $.post('/venue/password/access',{
            id:memorialId
        },function(a){
            if(a.code == 0){
                if(a.data == true){
                    location.href = url;
                }else{
                    putPassword();
                }
            }else{
                useCommon.toast(a.message);
            }
        });
    }
    function putPassword(){
        WY.prompt({
            title:'访问需要密码',
            placeholder:$(this).attr('password-placeholder') || '请输入访问密码',
            done:function(val){
                if(val)$.post('/venue/password/check',{
                    password:val,
                    id:memorialId
                },function(a){
                    if(a.code == 0){
                        location.href = url;
                    }else{
                        useCommon.toast(a.message);
                    }
                });
            }
        })
    }
    accessPassword();

    return false;
});
WY.bind('recharge' , function(){
    WY.confirm({
        content:'立即充值',
        done:function(){
            open('/user#recharge');
        }
    });
});
$.fn.showScroll = function(options){
    options = options || {};
    var step = 50;
    function move($ele , sts){
        var _step = typeof sts == 'number'?sts:(sts?-step:step);
        var $move = $ele.children().first();
        var marginTop = parseInt($move.css('marginTop')) || 0;
        marginTop += _step;
        moveTo($ele , marginTop);
    }
    function moveTo($ele , marginTop){
        var maxHeight = 0;
        var $move = $ele.children().first();
        var autoTop = parseFloat($move.css('marginTop'));
        if(autoTop == marginTop){
            if(marginTop < 0)options.scrollBottom && options.scrollBottom($move);
            else options.scrollTop && options.scrollTop($move);
            return false;
        }
        $ele.children().each(function(){
            maxHeight += $(this).outerHeight();
        });
        var height = $ele.height();
        if(maxHeight <= height)return false;
        if(marginTop > 0){
            options.scrollTop && options.scrollTop($move);
            marginTop = 0;
        }else if(marginTop < height - maxHeight){
            options.scrollBottom && options.scrollBottom($move);
            marginTop = height - maxHeight;
        }
        $move.css({
            marginTop:marginTop
        });
    }
    return this.each(function(){
        $(this).bind('mousewheel' , function(e){
            move($(this) , e.originalEvent.wheelDelta < 0);
            return false;
        });
        $(this).bind('DOMMouseScroll' , function(e){
            move($(this) , e.originalEvent.wheelDelta > 0);
            return false;
        });
        if(options.notMove)return false;
        var isMouseDown = false,pageY,autoTop;
       $(this).bind('mousedown' , function(e){
           $(this).css({
               cursor:'move'
           });
           autoTop = parseFloat($(this).children().first().css('marginTop'));
           isMouseDown = true;
           pageY = e.pageY;
           return false;
       });
       $(this).bind('mouseleave mouseup' , function(e){
           isMouseDown = false;
           $(this).css({
               cursor:'auto'
           });
           return false;
       });
       $(this).bind('mousemove' , function(e){
            if(isMouseDown)moveTo($(this) ,autoTop + e.pageY-pageY);
            return false;
       });
       $(this).bind('scroll' , function(e){
            e.stopPropagation();
       });

    });
};
WY.bind('modal-handler-scroll' , function($ele){
    $ele.showScroll();
});
WY.isMe = function(userId){
    return sessionJson.userInfo && sessionJson.userInfo.userId == userId;
}

WY.validate = {
  checkYunBi:function(money , call){
      if(!sessionJson.userInfo){
         WY.trigger('login' , null , call);
         return false;
      }
      if(sessionJson.userInfo.cloudBi < money){
         WY.trigger('recharge');
         return false;
      }
  }
};
(function(){
    var confirmWindow,confirmCb;
    WY.confirm = function(options){
        confirmCb = options.done;
        if(!confirmWindow){
            confirmWindow = $('.wy-confirm-window');
            confirmWindow.on('click' , '.submit-btn',function(){
                if(confirmCb && confirmCb() === false)return false;
                confirmWindow.hide();
            });
            confirmWindow.on('click' , '.close-btn',function(){
                confirmWindow.hide();
            });
        }
        confirmWindow.find('.title').text(options.title || '提示');
        confirmWindow.find('.text-content').text(options.content || '提示');
        confirmWindow.show();
    };
    var promptWindow,promptCb;
    WY.prompt = function(options){
        promptCb = options.done;
        if(!promptWindow){
            promptWindow = $('.wy-prompt-window');
            promptWindow.on('click' , '.submit-btn',function(){
                if(promptCb && promptCb(promptWindow.find('input').val()) === false)return false;
                promptWindow.hide();
            });
            promptWindow.on('click' , '.close-btn',function(){
                promptWindow.hide();
            });
        }
        promptWindow.find('.title').text(options.title || '提示');
        promptWindow.find('input').val(options.content || '').attr('placeholder',options.placeholder || '')[0].focus();
        promptWindow.show();
    };
    var $popover;
    WY.popover = function(options){
        $popover = $popover || $('.wy-popover');
        var container = $(options.container);
        var offset = container.offset();
        var top = offset.top + container.height();
        var left = offset.left;
        var $pop = container[0].popover = container[0].popover || $popover.clone();
        $pop.appendTo('body');
        $pop.css({
            top:top,
            left:left,
        });
        $pop.find('.popover-content').html(options.content);
        $pop.addClass(options.placement);
        $pop.addClass(options.className);
        $pop.show();
        $pop.click(function(){
            return false;
        });
        options.done && options.done($pop);
    };
    $(document).click(function(){
        $('.popover').hide();
    });
    var $loadingWindow;
    WY.loading = function(sts){
        $loadingWindow = $loadingWindow || $('.wy-loading-window');
        $loadingWindow[sts?'show':'hide']();
    }
})();

WY.ready('loginSuccess' , function(userInfo){
    localStorage.cloudBi = userInfo.cloudBi;
    WY.ready('yunbi',userInfo.cloudBi);
});
WY.bind('yunbi-change' , function(yunbi){
    var cloudBi = localStorage.cloudBi - 0 + yunbi;
    localStorage.cloudBi = cloudBi;
    WY.ready('yunbi',cloudBi);
});
$(function(){
    var cloudBi = sessionJson.userInfo && (localStorage.cloudBi || sessionJson.userInfo.cloudBi) || 0;
    localStorage.cloudBi = cloudBi;
    WY.ready('yunbi' , cloudBi);
});
(function(){
	var validator = {
		required:{
			method:function(val){
				return val !== '' && val != null;
			},
			message:function(key){
				return key + ' is required';
			}
		},
		max:{
			method:function(val , param){
				return val - 0 <= param;
			},
			message:function(key , param){
				return key + ' 不能大于' + param;
			}
		},
		min:{
			method:function(val , param){
				return val - 0 >= param;
			},
			message:function(key , param){
				return key + ' 不能小于' + param;
			}
		},
		moreThen:{
			method:function(val , param){
				return val - 0 > param;
			},
			message:function(key , param){
				return key + ' 不能小于' + param;
			}
		},
		isInt:{
			method:function(val){
				return /^(\-)?\d+$/.test(val);
			},
			message:function(key, param , val){
				return key + ' 必须是整数 but ' + val;
			}
		},
		isMoney:{
			method:function(val){
				return /^\d+(\.\d{1,2})?$/.test(val);
			},
			message:function(key , param , val){
				return key + ' 必须是有效金额 but ' + val;
			}
		},
		length:{
			method:function(val , param){
				return val.length == param;
			},
			message:function(key , param){
				return key + '  length is ' + param;
			}
		},
		maxlength:{
			method:function(val , param){
				return val.length <= param;
			},
			message:function(key , param){
				return key + '  is too long , maxlength is ' + param;
			}
		},
		minlength:{
			method:function(val , param){
				return val.length >= param;
			},
			message:function(key , param){
				return key + '  is too short , minlength is ' + param;
			}
		},
		lengthRange:{
			method:function(val , param){
				if(!param.splice)param = param.split(',');
				return val.length >= param[0] && val.length <= param[1];
			},
			message:function(key , param){
				if(!param.splice)param = param.split(',');
				return key + '  is between  ' + param[0] + ' and ' + param[1];
			}
		},
		isPhone:{
			method:function(val){
				return /^1(3|4|5|7|8)(\d{9})$/.test(val);
			},
			message:function(key , param , val){
				return key + '需要正确的手机号格式 but ' + val;
			}
		},
		isDate:{
			method:function(val){
				if(val - 0 )val -= 0;
				return new Date(val) != 'Invalid Date';
			},
			message:function(key , param , val){
				return key + '必须可转化为日期 but ' + val;
			}
		},
		inArray:{
			method:function(val , param){
				if(param.constructor  != [].constructor ){
					param += '';
					param = param.split(',');
				}
				return param.indexOf(val) >= 0;
			},
			message:function(key , param , val){
				return '请输入正确的枚举值';
			}
		},
		forInData:{
			method:function(val , param){
				if(param){
					return val in param;
				}
			},
			message:function(key , param , val){
				return '请输入正确的枚举值';
			}
		},
		regExp:{
			method:function(val , param){
				return param.test(val);
			},
			message:function(key , param , val){
				return '请输入正确的格式';
			}
		},
		chinese:{
			method:function(val){
				return /^[\u4E00-\u9FA5\uf900-\ufa2d]+(\·)?[\u4E00-\u9FA5\uf900-\ufa2d]+$/g.test(val);
			},
			message:function(){
				return '请输入正确的中文';
			}
		},
		isAllName:{
			method:function(val){
				return /^[\u4E00-\u9FA5\uf900-\ufa2d\w]+$/g.test(val);
			},
			message:function(){
				return '不允许特殊字符';
			}
		},
		isEnAndNum:{
			method:function(val){
				return /^[a-zA-Z0-9]+$/g.test(val);
			},
			message:function(){
				return '只允许英文字母和数字';
			}
		},
		isEqual:{
			method:function(val, param){
				return val == param;
			},
			message:function(val, param){
				return val + ' 与 ' + param + '不相同';
			}

		},
		isNotEqual:{
			method:function(val, param){
				return val != param;
			},
			message:function(val, param){
				return val + ' 与 ' + param + '不能相同';
			}

		},
		isCityCode:{
			method:function(val, param){
				for(var i = 0,len = useCommon.citySelectData.length;i < len; i++){
					if(useCommon.citySelectData[i].code == val){
						return true;
					}
				}
			},
			message:function(val, param){
				return '非法的省市区编码';
			}

		},
		isIdCard:{
			method:function(val , param , ele){
				var CheckIdCard={
					//Wi 加权因子 Xi 余数0~10对应的校验码 Pi省份代码
					Wi:[7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2],
					Xi:[1,0,"X",9,8,7,6,5,4,3,2],
					Pi:[11,12,13,14,15,21,22,23,31,32,33,34,35,36,37,41,42,43,44,45,46,50,51,52,53,54,61,62,63,64,65,71,81,82,91],
					//检验18位身份证号码出生日期是否有效
					//parseFloat过滤前导零，年份必需大于等于1900且小于等于当前年份，用Date()对象判断日期是否有效。
					brithday18:function(sIdCard){
						var year=parseFloat(sIdCard.substr(6,4));
						var month=parseFloat(sIdCard.substr(10,2));
						var day=parseFloat(sIdCard.substr(12,2));
						var checkDay=new Date(year,month-1,day);
						var nowDay=new Date();
						if (1900<=year && year<=nowDay.getFullYear() && month==(checkDay.getMonth()+1) && day==checkDay.getDate()) {
							return true;
						}
					},
					//检验校验码是否有效
					validate:function(sIdCard){
						var aIdCard=sIdCard.split("");
						var sum=0;
						for (var i = 0; i < CheckIdCard.Wi.length; i++) {
							sum+=CheckIdCard.Wi[i]*aIdCard[i]; //线性加权求和
						}
						var index=sum%11;//求模，可能为0~10,可求对应的校验码是否于身份证的校验码匹配
						if (CheckIdCard.Xi[index]==aIdCard[17].toUpperCase()) {
							return true;
						}
					},
					//检验输入的省份编码是否有效
					province:function(sIdCard){
						var p2=sIdCard.substr(0,2);
						for (var i = 0; i < CheckIdCard.Pi.length; i++) {
							if(CheckIdCard.Pi[i]==p2){
								return true;
							}
						}
					}
				};
				return /^\d{17}(\d|X|x)$/.test(val) && CheckIdCard.province(val)&&CheckIdCard.validate(val) || false;
			},
			message:function(val , param , ele){
				return '请输入正确的身份证号';
			}
		}
	};
	function validate(type , key , val , param){
		if(type in validator){
			if(!validator[type].method(val , param)){
				return validator[type].message(key , param , val);
			}
		}
	}
	/*
	 * 用于验证参数有效性
	 * */
	useValidate.validator = function(rules , params){
		var message;
		for(var key in rules){
			var sts = true;
			var rule = rules[key];
			if(rule.required){
				if(message = validate('required', key , params[key])){
					message = rule.requiredMessage || rule.message || message;
					break;
				}
			}
			if(validator.required.method(params[key])){
				delete rule.required;
				for(var type in rule){
					if(message = validate(type , key , params[key] , rule[type])){
						message = rule[type + 'Message'] || rule.message || message;
						sts = false;
						break;
					}
				}
			}
			if(!sts)break;
		}
		return {valid:!message,message:message};
	};
})();
useValidate.login = {
    validator:function(data , type){
        if(type == 'login'){
            var valid = useValidate.validator({
                userName:{
                    required:1,
                    isPhone:1,
                    requiredMessage:'请输入登录账号',
                    isPhoneMessage:'请输入有效手机号'
                },
                password:{
                    required:1,
                    lengthRange:[6,18],
                    requiredMessage:'请输入登录密码',
                    lengthRangeMessage:'登录密码为6-18位'
                }
            },data);
        }else if(type == 'reg'){
            var valid = useValidate.validator({
                userName:{
                    required:1,
                    isPhone:1,
                    requiredMessage:'请输入手机号',
                    isPhoneMessage:'请输入有效手机号'
                },
                sendCode:{
                    required:true,
                    length:6,
                    requiredMessage:'请输入短信验证码',
                    lengthMessage:'请输入6位的短信验证码',
                },
                password:{
                    required:1,
                    lengthRange:[6,18],
                    requiredMessage:'请输入密码',
                    lengthRangeMessage:'密码长度6-18',
                }
            },data);
        }else if(type == 'sms'){
            var valid = useValidate.validator({
                imgCode:{
                    required:true,
                    length:5,
                    requiredMessage:'请输入图片验证码',
                    lengthMessage:'请输入5位的图片验证码',
                },
                userName:{
                    required:1,
                    isPhone:1,
                    requiredMessage:'请输入手机号',
                    isPhoneMessage:'请输入有效手机号'
                }
            },data);
        }
        return valid;
    }
};