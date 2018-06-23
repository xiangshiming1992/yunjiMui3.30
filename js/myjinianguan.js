var imgBase = "http://img.yunji128.com/";
var urlBase = 'http://api.yunji128.com/homage';
$.ajax({
    headers: {
        tokenInfo: window.localStorage.getItem("tokenInfo")
    },
    type: "GET",
    url: urlBase + "/api/user/userInfoByMe",
    data: {},
    dataType: "json",
    success: function (data) {
        if (data.code == 'SUCCESS') {
            $("#nickname").html(data.result.nickname);
            $("#headImg").attr("src", imgBase + data.result.headImg);
        }
        else if (data.code == 'PleaseLogin') {
            window.location.href = 'login.html';
        }
        else {
            mui.alert(data.message);
        }
    },
    error: function (message) {

    }
});
$(".editPhone").click(function () {
    window.location.href = "upMemorPhone.html";
});
$(".editPepo").on("tap", function () {
    window.location.href = "reviseLife.html";
});
$(".deletMem").on("tap", function () {
    window.location.href = "delMemorial.html";
});
/*item1*/
$.ajax({
    type: "GET",
    headers: {
        tokenInfo: window.localStorage.getItem("tokenInfo")
    },
    contentType: "application/json",
    dataType: "json",
    url: urlBase + "/api/memorial/mylist?currentPage=1&limit=50&peopleNumber=1", //这里是网址
    success: function (data) {
        var listPersonal = data.result.content;
        addHtml(listPersonal,$("#mpersonal"))
    },
    error: function (message) {
        //mui.alert("读取私人馆列表失败");
    }
});
/*item2*/
$.ajax({
    type: "GET",
    contentType: "application/json",
    dataType: "json",
    headers: {
        tokenInfo: window.localStorage.getItem("tokenInfo")
    },
    url: urlBase + "/api/memorial/mylist?currentPage=1&limit=50&peopleNumber=2", //这里是网址
    success: function (data) {
        var listcelebrity = data.result.content;
        console.log(listcelebrity)
        addHtml(listcelebrity,$("#mcelebrity"))
    },
    error: function (message) {
        //mui.alert("读取公益馆列表失败");
    }
});
/*item3*/
$.ajax({
    type: "GET",
    contentType: "application/json",
    dataType: "json",
    headers: {
        tokenInfo: window.localStorage.getItem("tokenInfo")
    },
    url: urlBase + "/api/memorial/mylist?memorialType=celebrity&currentPage=1&limit=50", //这里是网址
    success: function (data) {
        var listrenqi = data.result.content;
        console.log(listrenqi)
        addHtml(listrenqi,$("#renqi"))
    },
    error: function (message) {
        //mui.alert("读取纪念馆列表失败");
    }
});
function addHtml(list, target) {
    var html = "";
    $.each(list, function () {
        html += '<li class="mui-media list1"><a href="javascript:info(' + this.memorialId + ');"><h4>' + this.memorialName + '</h4>' +
            '<img class="mui-media-object mui-pull-left" src="' + imgBase + this.headImg + '">' +
            '<div class="mui-media-body"><ul class="smallul"><li>馆号：<span>' + this.userId + '</span></li><li>建馆人：<span>' + this.nickname + '</span></li></ul>' +
            '<ul class="smallul"><li>祭拜数：<span>' + this.worshipCount + '</span></li><li>建馆时间：<span>' + this.rowAddTime + '</span></li></ul></div></a><div class="editMem"><a  href="javascript:phnoInfo(' + this.memorialId + ');">相册</a><a href="javascript:pepoleInfo(' + this.memorialId + ');">编辑</a><a  href="javascript:muxiangInfo(' + this.memorialId + ');">墓像</a><a href="javascript:deleteInfo(' + this.memorialId + ');">删除</a></div></li>'
    });
   target.html(html);
}
/*function*/
function info(id) {
    var urlBase = 'http://api.yunji128.com/homage';
    var imgBase = 'http://img.yunji128.com/';
    $.ajax({
        headers: {
            tokenInfo: window.localStorage.getItem("tokenInfo")
        },
        type: "POST",
        url: urlBase + "/api/memorial/checkAccess?memorialId=" + id,
        data: {},
        dataType: "json",
        success: function (data) {
            if (data.code == 'SUCCESS') {
                if (data.result) {
                    window.location.href = "jinianguanDetail.html?memorialId=" + id;
                } else {
                    //
                    mui.alert("请输入密码");
                }
            }
            else {
                mui.alert(data.message);
            }
        },
        error: function (message) {

        }
    });
}
function phnoInfo(id) {
    var urlBase = 'http://api.yunji128.com/homage';
    var imgBase = 'http://img.yunji128.com/';
    $.ajax({
        headers: {
            tokenInfo: window.localStorage.getItem("tokenInfo")
        },
        type: "POST",
        url: urlBase + "/api/memorial/checkAccess?memorialId=" + id,
        data: {},
        dataType: "json",
        success: function (data) {
            if (data.code == 'SUCCESS') {
                if (data.result) {
                    window.location.href = "upMemorPhone.html?memorialId=" + id;
                } else {
                    mui.alert("请输入密码");
                }
            }
            else {
                mui.alert(data.message);
            }
        },
        error: function (message) {
        }
    });
}
function pepoleInfo(id) {
    $.ajax({
        headers: {
            tokenInfo: window.localStorage.getItem("tokenInfo")
        },
        type: "POST",
        url: urlBase + "/api/memorial/checkAccess?memorialId=" + id,
        data: {},
        dataType: "json",
        success: function (data) {
            if (data.code == 'SUCCESS') {
                if (data.result) {
                    window.location.href = "reviseLife.html?memorialId=" + id;
                } else {
                    //
                    mui.alert("请输入密码");
                }
            }
            else {
                mui.alert(data.message);
            }
        },
        error: function (message) {
        }
    });
}
function deleteInfo(id) {
    $.ajax({
        headers: {
            tokenInfo: window.localStorage.getItem("tokenInfo")
        },
        type: "POST",
        url: urlBase + "/api/memorial/checkAccess?memorialId=" + id,
        data: {},
        dataType: "json",
        success: function (data) {
            if (data.code == 'SUCCESS') {
                if (data.result) {
                    window.location.href = "delMemorial.html?memorialId=" + id;
                } else {
                    //
                    mui.alert("请输入密码");
                }
            }
            else {
                mui.alert(data.message);
            }
        },
        error: function (message) {
        }
    });
}
function muxiangInfo(id) {
    $.ajax({
        headers: {
            tokenInfo: window.localStorage.getItem("tokenInfo")
        },
        type: "POST",
        url: urlBase + "/api/memorial/checkAccess?memorialId=" + id,
        data: {},
        dataType: "json",
        success: function (data) {
            if (data.code == 'SUCCESS') {
                if (data.result) {
                    window.location.href = "muxiangInfo.html?memorialId=" + id;
                } else {
                    //
                    mui.alert("请输入密码");
                }
            }
            else {
                mui.alert(data.message);
            }
        },
        error: function (message) {
        }
    });
}