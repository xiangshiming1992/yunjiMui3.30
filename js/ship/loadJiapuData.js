$(function () {
    function search(pId, call) {
        for (var i = 0; i < tatolNodes.length; i++) {
            if (tatolNodes[i].id == pId) {
                call(tatolNodes[i].children)
            }
        }
    }

    function getItemById(pId) {
        for (var i = 0; i < tatolNodes.length; i++) {
            if (tatolNodes[i].id == pId) {
                return tatolNodes[i];
            }
        }
    }
    var $showContent = $('.show-canvas-content');
    WY.trigger('modal-handler-mouse-move', $showContent, {});

    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
    pedigreeId = getQueryString("pedigreeId");
    // $.get(urlBase + "/api/pedigreePerson/personListAll", {
    //     pedigreeId: pedigreeId
    // }, function (res) {
    //     console.log(res)
    //
    //     // console.log(p)
    // });
    ajax({
        method:"get",
        url:"/api/pedigreePerson/personListAll",
        params:{pedigreeId:pedigreeId},
        success:function (res) {
            var nodes = res.result;
            maxLength = nodes.length;
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i] == null) {
                    continue
                }
                var node = $.extend({
                    pId: nodes[i].patId,
                    genealogyPersonId: nodes[i].pedigreePersonId,
                    genealogyId: nodes[i].pedigreeId,
                }, nodes[i]);
                var item = getItemById(node.pId) || {
                    id: node.pId,
                    children: [node]
                }
                if (nodes[i].patId == null) {
                    tatolNodes.push(item);
                    nodes[i] = null
                    continue;
                }
                for (var j = i + 1; j < nodes.length; j++) {
                    if (nodes[j] == null) {
                        continue
                    }
                    if (item.id == nodes[j].patId) {
                        var node = $.extend({
                            pId: nodes[j].patId,
                            genealogyPersonId: nodes[j].pedigreePersonId,
                            genealogyId: nodes[j].pedigreeId,
                        }, nodes[j])
                        item.children.push(node)
                        nodes[j] = null;
                    }
                }
                tatolNodes.push(item)
            }
            for (var i = 0; i < tatolNodes.length; i++) {
                var id = tatolNodes[i].id;
                var node = getItemById(id);
                for (var j = 0; j < node.children.length; j++) {
                    var childeId = node.children[j].genealogyPersonId;
                    var childeNodes = getItemById(childeId);
                    if (childeNodes) {
                        node.children[j].childCount = childeNodes.children.length;
                    } else {
                        node.children[j].childCount = null
                    }
                }
            }
            loadData=true;
        },
        async:false
    });
    ajax({
        method:"get",
        url:"/api/pedigree/info",
        params:{pedigreeId:pedigreeId},
        success:function (res) {
            belong = user.userId ==  res.result.userId;
            loadBelong = true;
        },
        async:false
    });
    var count = setInterval(function () {
        if (loadBelong && loadData) {
            var p = getItemById(null);
            if(p){
                WY.genealogy({
                    canvas: $('.show-genealogy-canvas')[0],
                    dataList: p.children,
                    content: $showContent.children(),
                    addBtn: $(),
                    search: search,
                    belong:belong
                })
            }
            clearInterval(count);
        }
    });
});

var loadBelong =false;
var loadData = false;
var tatolNodes = [];
var pedigreeId;
var belong = false;
var user = localStorage.getItem("userInfo");
if (user) {
    user = JSON.parse(user);
}else {
    user ={};
}
var maxLength=0;