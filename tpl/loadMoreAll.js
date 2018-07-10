var isLoad = true;
var islast = true;
var page = 1;
$(window).scroll(function () {
    if (isLoad || islast) {
        return;
    }
    var scrollTop = $(this).scrollTop();
    var scrollHeight = $(document).height();
    var windowHeight = $(this).height();
    if ((scrollTop + windowHeight == scrollHeight) && !islast) {
        isLoad = true;
        loadMore(shousou);
    }
});

function defaultImgUrl(obj) {
    obj.src = defaultImg + '_crop_42x42';
}

function goJiapu(id) {
	 jiaPuInfo(id);
    
}
//家谱访问处理
function jiaPuInfo(id) {
    $.ajax({
        headers: {
            tokenInfo: window.localStorage.getItem("tokenInfo")
        },
        type: "POST",
        url: urlBase + "/api/pedigree/checkAccess?pedigreeId=" + id,
        data: {},
        dataType: "json",
        success: function (data) {
            if (data.code == 'SUCCESS') {
                if (data.result) {
                   window.location.href = "editship.html?pedigreeId=" + id;
                } else {
                    if (inputPwd = prompt("请输入密码访问")) {
                        jiapuCheckPwd(inputPwd, id);
                    }
                }
            }
            else {
                mui.alert(data.message);
            }
        }
    });
}

function jiapuCheckPwd(pwd, id) {
    $.ajax({
        headers: {
            tokenInfo: window.localStorage.getItem("tokenInfo"),
            userId: 0
        },
        type: "POST",
        url: urlBase + "/api/pedigree/accesscheckPassWorld?password=" + pwd + "&pedigreeId=" + id,
        data: {},
        dataType: "json",
        success: function (data) {
            if (data.code == 'SUCCESS') {
                window.location.href = "editship.html?pedigreeId=" + id + "&password=" + pwd;
            }
            else {
                mui.alert(data.message);
            }
        }
    });
}

function loadMore(content) {
    getDataFromServer("/api/pedigree/list", {currentPage: page, limit: 20, content: content}, function (res) {
        if (res.code == "SUCCESS") {
            var list = res.result.content;
            if (list && list.length > 0) {
                var record = "";
                for (var i=0;i< list.length ; i++) {
                    var item = list[i];
                    record += '<li class="mui-table-view-cell mui-media" onclick="goJiapu(' + item.pedigreeId + ')">' +
                        '<img onerror="defaultImgUrl(this)"  class="mui-media-object mui-pull-left" src="' + imgBase + item.totem + '_crop_42x42' + '">' +
                        '<div class="mui-media-body">' + item.surname  +
                        '氏<p><span class="shu">'+ item.nickname +'</span>创<span class="shu">|</span><span>'+item.personNumber+'</span>人</p>' +
                        '<p class="time">' + item.rowAddTime.substring(0,10) + '</p>' +
                        '<p class="addr">' + item.province +' ' + item.city +' '+ item.county + '</p>' +
                        '</div>' +
                        '</li>';
                }
                if (page ==1){
                    $("#data").html(record)
                }else {
                    $("#data").append(record);
                }
                islast = res.result.last;
                isLoad = false;
            }
            page++;
        } else {
            mui.alert(res.message)
        }
    }, function (error) {
        console.log(JSON.stringify(error));
    });
}