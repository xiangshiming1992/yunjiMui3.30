getDataFromServer("/api/pedigree/myPedigreeUserInfo", null, function (res) {
    if (res.code == "SUCCESS") {
        var user = res.result;
        if (user) {
            $("img").attr("src", imgBase + user.headImg+"_crop_42x42");
            localStorage.setItem(user.userId + "jiapuInfo", JSON.stringify(user));
            getDataFromServer("/api/pedigree/myPedigreeInfo", null, function (res) {
                if (res.code == "SUCCESS") {
                    var jiapu = res.result;
                    if (jiapu) {
                        $("#submit").val("编辑家谱");
                        $("#submit").click(function () {
                            window.location.href = "editship.html?pedigreeId=" + jiapu.pedigreeId;
                        })
                    } else {
                        $("#submit").click(function () {
                            var user = JSON.parse(localStorage.getItem("userInfo"));
                            window.location.href = "chuangjianjiapu.html"
                        })
                    }
                }
            }, function (error) {
                mui.alert(error);
            });
        } else {
            $("#submit").click(function () {
                mui.alert("请先完善个人信息");
            })
        }
    } else {
        window.location.href = "login.html"
    }
}, function (error) {
    mui.alert(error);
});

function jiapuInfo(id) {
    window.location.href = "editship.html?pedigreeId=" + id;
}

function more() {
    window.location.href = "more.html";
}

$("#search").submit(function () {
    $("#shousou").blur()
    var search = $("#shousou").val();
    if (search != shousou){
        shousou = search;
        loadJiapu(shousou)
    }
    return false;
});

function loadJiapu(content) {
    getDataFromServer("/api/pedigree/myJoinlist", {currentPage: 1, limit: 2, content: content}, function (res) {
        if (res.code == "SUCCESS") {
            var list = res.result.content;
            if (list && list.length > 0) {
                var record = "";
                for (var i=0;i<list.length;i++) {
                    var item = list[i];
                    record += '<li class="mui-table-view-cell mui-media" onclick="jiapuInfo(' + item.pedigreeId + ')">' +
                        '<div class="jiapu mui-h3">' +
                        '<span class="jiapu-xing">' + item.surname + '</span>' +
                        '</div>' +
                        '<div class="jiapu mui-h4">' +
                        '<span class="jiapu-addr">' + item.city + item.county + '</span>' +
                        '</div>' +
                        '<div class="jiapu mui-h4">' +
                        '<span class="shu">' + item.nickname + '</span>创' +
                        '<span class="shu">|</span>' +
                        '<span>' + item.personNumber + '</span>人</div>' +
                        '</li>';
                }
                // if (res.totalElements > 2 ){
                record += '<li class="mui-table-view-cell mui-media" onclick="more()">' +
                    '<a id="icon-more" style="text-align: center;">' +
                    '<span class="mui-icon mui-icon-more-filled"></span>' +
                    '</a>' +
                    '</li>'
                // }
                $("#content").html(record)
            } else {
                $("ul").append('<li class="mui-table-view-cell mui-media"><div class="mui-h3 jiapu">你还没有加入家谱</div></li>')
            }
        }
    }, function (error) {
        mui.alert(error);
    });
}
var shousou = null;
loadJiapu(shousou);