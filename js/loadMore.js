var isLoad = true;
var islast =true;
var page =1;
$(window).scroll(function () {
    if (isLoad || islast) {
        return;
    }
    var scrollTop = $(this).scrollTop();
    var scrollHeight = $(document).height();
    var windowHeight = $(this).height();
    if ((scrollTop + windowHeight == scrollHeight) && !islast) {
        isLoad = true;
        loadMore();
    }
});
function defaultImgUrl(obj) {
    obj.src = defaultImg +'_crop_42x42';
}
function goJiapu(id) {
    window.location.href = "editship.html?pedigreeId="+id;
}
function loadMore() {
    getDataFromServer("/api/pedigree/myJoinlist", {currentPage: page, limit: 20,content:$("input[type=search]").val()}, function (res) {
        if (res.code == "SUCCESS") {
            let list = res.result.content;
            if (list && list.length > 0) {
                var record = "";
                for (let item of list) {
                    record += '<li class="mui-table-view-cell mui-media" onclick="goJiapu('+item.pedigreeId+')">' +
                        '<img onerror="defaultImgUrl(this)" class="mui-media-object mui-pull-left" src="' +imgBase+ item.totem+'_crop_42x42' + '">' +
                        '<div class="mui-media-body">' + item.nickname +
                        '<p>' + item.nickname + '</p>' +
                        '<p class="time">' + item.rowAddTime + '</p>' +
                        '<p class="addr">' + item.province + item.city + item.county + '</p>' +
                        '</div>' +
                        '</li>';
                }
                $("#data").append(record);
                islast = res.result.last;
                isLoad = false;
            }
            page++;
        }else {
            alert(res.message)
        }
    }, function (error) {
        console.log(JSON.stringify(error));
    });
}
loadMore();