<<<<<<< HEAD
getDataFromServer("/api/pedigree/myPedigreeUserInfo", null, function (res) {
    if (res.code == "SUCCESS") {
        let user = res.result;
        if (user) {
            $("img").attr("src", imgBase + user.headImg+"_crop_42x42");
            localStorage.setItem(user.userId + "jiapuInfo", JSON.stringify(user));
            getDataFromServer("/api/pedigree/myPedigreeInfo", null, function (res) {
                if (res.code == "SUCCESS") {
=======
getDataFromServer("/api/pedigree/myPedigreeUserInfo",null,function (res) {
    if (res.code == "SUCCESS") {
        let user = res.result;
        if (user) {
            $("img").attr("src", imgBase+ user.headImg);
            localStorage.setItem(user.userId+"jiapuInfo",JSON.stringify(user));
            getDataFromServer("/api/pedigree/myPedigreeInfo",null,function (res) {
                if (res.code == "SUCCESS"){
>>>>>>> ac23a54e09fa706088c679ff5ad1d38c73666e91
                    let jiapu = res.result;
                    if (jiapu) {
                        $("#submit").val("编辑家谱");
                        $("#submit").click(function () {
<<<<<<< HEAD
                            window.location.href = "editship.html?pedigreeId=" + jiapu.pedigreeId;
                        })
                    } else {
=======
                            window.location.href = "editship.html?pedigreeId="+jiapu.pedigreeId;
                        })
                    }else {
>>>>>>> ac23a54e09fa706088c679ff5ad1d38c73666e91
                        $("#submit").click(function () {
                            var user = JSON.parse(localStorage.getItem("userInfo"));
                            window.location.href = "chuangjianjiapu.html"
                        })
                    }
                }
<<<<<<< HEAD
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
            let list = res.result.content;
            if (list && list.length > 0) {
                var record = "";
                for (let item of list) {
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
=======
            },function (error) {
                alert(error);
            });
        }else {
            $("#submit").click(function () {
                alert("请先完善个人信息");
            })
        }
    }else{
        window.location.href="login.html"
    }
},function (error) {
    alert(error);
});

function jiapuInfo(id){
    window.location.href = "editship.html?pedigreeId="+id;
}
function more(){
    window.location.href = "more.html";
}
getDataFromServer("/api/pedigree/myJoinlist",{currentPage:1,limit:2},function (res) {
    if (res.code == "SUCCESS") {
        let  list = res.result.content;
        if (list && list.length > 0) {
            var record ="";
            for (let item of list) {
              record +='<li class="mui-table-view-cell mui-media" onclick="jiapuInfo('+item.pedigreeId+')">' +
                    '<div class="jiapu mui-h3">' +
                    '<span class="jiapu-xing">'+item.surname +'</span>' +
                    '</div>' +
                    '<div class="jiapu mui-h4">' +
                    '<span class="jiapu-addr">'+item.city+item.county +'</span>' +
                    '</div>' +
                    '<div class="jiapu mui-h4">' +
                    '<span class="shu">'+item.nickname +'</span>创' +
                    '<span class="shu">|</span>' +
                    '<span>'+item.personNumber +'</span>人</div>' +
                    '</li>';
            }
            // if (res.totalElements > 2 ){
>>>>>>> ac23a54e09fa706088c679ff5ad1d38c73666e91
                record += '<li class="mui-table-view-cell mui-media" onclick="more()">' +
                    '<a id="icon-more" style="text-align: center;">' +
                    '<span class="mui-icon mui-icon-more-filled"></span>' +
                    '</a>' +
                    '</li>'
<<<<<<< HEAD
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
=======
            // }
            $("ul").append(record)
        }else {
            $("ul").append('<li class="mui-table-view-cell mui-media"><div class="mui-h3 jiapu">你还没有加入家谱</div></li>')
        }
    }
},function (error) {
    alert(error);
});
>>>>>>> ac23a54e09fa706088c679ff5ad1d38c73666e91
