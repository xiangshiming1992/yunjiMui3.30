<<<<<<< HEAD
/**
 * 添加成员
 * @param user
 * @param parent
 * @param direct
 */
function addSomme(user, parent,direct) {
    $(".mui-control-content").removeClass("mui-active").eq(0).addClass("mui-active");
    $(".zuren").addClass("mui-active");
    $(".spouse ").removeClass("mui-active");
    history.pushState("", document.title, "#add");
=======
function addSomme(user, parent,direct) {
    $(".mui-control-content").removeClass("mui-active").eq(0).addClass("mui-active");
    history.pushState("", document.title, "#add")
>>>>>>> ac23a54e09fa706088c679ff5ad1d38c73666e91
    showBox(true)
    $("#img").attr("src","../img/boy.jpg");
    $("#another").attr("src","../img/girl.jpg");
    $("input[type=text]").val("");
	$("input[type=file]").val("");
    $("input[type=radio]").removeAttr('checked');
    $("input[name=sex][value=男]").prop("checked", "checked");
    $("input[name=survivalMode][value=活]").prop("checked", "checked");
<<<<<<< HEAD
    $("input[name=spouseSurvivalMode][value=活]").prop("checked", "checked");
    $("input[name=sex]:checked").change();
    $("input[name=survivalMode]:checked").change();
    $("input[name=spouseSurvivalMode]:checked").change();
    $("#header-edit .mui-title").html("添加族人")
    submitBtnClick("/api/pedigreePerson/add", parent, user.id, true,direct);
}

/**
 * 显示个人信息
 * @param user
 * @param index
 */
function showSomeOne(user,index) {
    history.pushState("", document.title, "#show");
    user =user.data;
    if (index == 0) {
        if (user.name) {
            $(".info-headImg").attr("src",imgBase+ user.headImg + '_crop_172x172');
            $(".info-name").html(user.name);
            $(".info-sex").html(user.sex);
            $(".info-birthDay").html(user.birthDay ? user.birthDay.substr(0,10):'');
            $(".info-memorialId").html(user.memorialId);
            $(".info-phone").html(user.phone);
            $(".info-survivalMode").html(user.survivalMode);
            $(".info-address").html(user.address);
            $(".info-addr").html(user.xjProvince +" " +user.xjCity + " " + user.xjCounty);
            if(user.survivalMode == "活"){
                $(".info-addr-title").html("居住地");
                $(".info-phone-item").show();
            }else{
                $(".info-addr-title").html("墓地");
                $(".info-phone-item").hide();
            }

           hideAll();
            $("#info").show();
        }else {
            mui.alert("没有信息");
        }
    }else {
        if (user.spouseName) {
            $(".info-headImg").attr("src",imgBase+ user.spouseHeadImg + '_crop_172x172');
            $(".info-name").html(user.spouseName);
            $(".info-sex").html(user.sex=="男"?"女":"男");
            $(".info-birthDay").html(user.spouseBirthDay ? user.spouseBirthDay.substr(0,10):'');
            $(".info-memorialId").html(user.spouseMemorialId);
            $(".info-phone").html(user.spousePhone);
            $(".info-survivalMode").html(user.spouseSurvivalMode);
            $(".info-addr").html(user.spouseXjProvince +" " +user.spouseXjCity + " " + user.spouseXjCounty);
            $(".info-address").html(user.spouseAddress);
            if(user.spouseSurvivalMode == "活"){
                $(".info-addr-title").html("居住地");
                $(".info-phone-item").show();
            }else{
                $(".info-addr-title").html("墓地");
                $(".info-phone-item").hide();
            }
            hideAll();
            $("#info").show();
        }else {
            mui.alert("没有信息");
        }
    }
}


/**
 * 显示族谱信息
 */
function showShip() {
    history.pushState("",document.title,"#ship");
    hideAll();
    $("#ship").show();
}
/**
 * 显示族谱信息点击事件
 */
$("#showShip").click(function () {
    showShip();
});

/**
 * 隐藏所有元素
 */
function hideAll() {
    $("#edit").hide();
    $("#info").hide();
    $("#ship").hide();
    $(".show-canvas-content").hide();
    $("#bigOrSmall").hide();
    $(".pushu").hide();
}

/**
 * 初始化编辑表单
 * @param user
 */
=======
    submitBtnClick("/api/pedigreePerson/add", parent, user.id, true,direct);
}

function showSomeOne(user) {
    history.pushState("", document.title, "#show");
    showBox(false, user)
    initUserInfo(user.data)
    $("input").attr("disabled","disabled");
    $(".mui-bar").hide();
}

>>>>>>> ac23a54e09fa706088c679ff5ad1d38c73666e91
function initUserInfo(user) {
    $(".mui-control-content").removeClass("mui-active").eq(0).addClass("mui-active");
    for (var item in user) {
        var input = $("input[name=" + item + "]")
        var type = input.attr("type");
        if (type == "text") {
<<<<<<< HEAD
            if (item == 'birthDay' || item == 'spouseBirthDay') {
                $("input[name=" + item + "]").val(user[item]?user[item].substr(0,10):'');
            }else {
                $("input[name=" + item + "]").val(user[item]);
            }
=======
            $("input[name=" + item + "]").val(user[item]);
>>>>>>> ac23a54e09fa706088c679ff5ad1d38c73666e91
        } else if (type == "radio") {
            $("input[name=" + item + "][value='" + user[item] + "']").prop("checked", "checked");
        }
        if (item == "headImg") {
            input.prev().attr("src", user[item] ? imgBase+ user[item].replace(imgBase,"") :"../img/boy.jpg")
        }
        if (item == "spouseHeadImg") {
            input.prev().attr("src", user[item] ? imgBase+ user[item].replace(imgBase,"") :"../img/girl.jpg")
        }
    }
    $("#cityResult2").val(user.xjProvince + " " + user.xjCity + " " + user.xjCounty);
    $("#cityResult3").val(user.spouseXjProvince + " " + user.spouseXjCity + " " + user.spouseXjCounty);
<<<<<<< HEAD
    $("input[name=sex]:checked").change();
    $("input[name=survivalMode]:checked").change();
    $("input[name=spouseSurvivalMode]:checked").change();
}

/**
 * 初始化表单控件
 * @param user
 */
function initEditBox(user) {
    upload($("#img"), $("#file"), $("#headImg"));
    upload($("#another"), $("#aFile"), $("#aHeadImg"));
    var btns = $(".birth");
    dtpicker = new mui.DtPicker({
        type: "date", //设置日历初始视图模式
        beginDate: new Date(1900, 0, 1), //设置开始日期
        endDate: new Date(2050, 11, 31), //设置结束日期
    })
    if ($("input[name=birthDay]").val().length > 0) {
        dtpicker.setSelectedValue($("input[name=birthDay]").val())
    }
    btns[0].addEventListener('tap', function () {
        dtpicker.show(function (e) {
            console.log(e);
            $(btns[0]).val(e.text)
        })
    });
    dtpicker2 = new mui.DtPicker({
        type: "date", //设置日历初始视图模式
        beginDate: new Date(1900, 0, 1), //设置开始日期
        endDate: new Date(2050, 11, 31), //设置结束日期
    });
    btns[1].addEventListener('tap', function () {
        dtpicker2.show(function (e) {
            console.log(e);
            $(btns[1]).val(e.text)
        })
    });
    var _getParam = function (obj, param) {
        return obj[param] || '';
    };
    cityPicker3 = new mui.PopPicker({
        layer: 3
    });
    cityPicker3.setData(city);
    var cityResult3 = $("#cityResult3");
    cityResult3.click(function () {
        cityPicker3.show(function (items) {
            cityResult3.val(_getParam(items[0], 'text') + " " + _getParam(items[1], 'text') + " " +
                _getParam(items[2], 'text'));
            cityResult3.next().val(items[0].text)
            cityResult3.next().next().val(items[1].text)
            cityResult3.next().next().next().val(items[2].text)
        })
    })
    cityPicker2 = new mui.PopPicker({
        layer: 3
    });
    cityPicker2.setData(city);
    var cityResult2 = $("#cityResult2");
    cityResult2.click(function () {
        cityPicker2.show(function (items) {
            cityResult2.val(_getParam(items[0], 'text') + " " + _getParam(items[1], 'text') + " " +
                _getParam(items[2], 'text'));
            cityResult2.next().val(items[0].text)
            cityResult2.next().next().val(items[1].text)
            cityResult2.next().next().next().val(items[2].text)
        })
    })

    if (user) {
        dtpicker.setSelectedValue($("#myBirth").val())
        dtpicker2.setSelectedValue($("#aBirth").val())
        cityPicker2.pickers[0].setSelectedValue(user.xjProvince);
        setTimeout(function () {
            cityPicker2.pickers[1].setSelectedValue(user.xjCity);
            setTimeout(function () {
                cityPicker2.pickers[2].setSelectedValue(user.xjCounty);
            }, 10)
        }, 10);
        cityPicker3.pickers[0].setSelectedValue(user.spouseXjProvince);
        setTimeout(function () {
            cityPicker2.pickers[1].setSelectedValue(user.spouseXjCounty);
            setTimeout(function () {
                cityPicker2.pickers[2].setSelectedValue(user.spouseXjCounty);
            }, 10)
        }, 10);
    }
}
/**
 * 现在谱书
 */
$("#download").click(function () {
    var url = $(this).attr("rel");
    if ( /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-\.,@?^=%&:\/~\+#]*[\w\-\@?^=%&\/~\+#])?$/.test(url) ){
        var $eleForm = $("<form method='get' style='display: none'></form>");
        $eleForm.attr("action",url);
        $(document.body).append($eleForm);
        //提交表单，实现下载
        $eleForm.submit();
        $eleForm.remove();
    }else{
        mui.alert("没有上传谱书")
    }
});

/**
 * 显示家谱树
 */
function showJiapu() {
    $("#submit").unbind();
    hideAll();
    $("#bigOrSmall").show();
    $(".pushu").show();
    $(".show-canvas-content").show();
    if (dtpicker && dtpicker.picker) {
        dtpicker.dispose();
    }
    if (dtpicker2 && dtpicker2.picker) {
        dtpicker2.dispose();
    }
    if (cityPicker2 && cityPicker2.parentNode) {
        cityPicker2.dispose();
    }
    if (cityPicker3 && cityPicker3.parentNode) {
=======
}

function showJiapu() {
    $("#submit").unbind();
    $(".show-canvas-content").show();
    $("#edit").hide();
    if (dtpicker && dtpicker.dispose) {
        dtpicker.dispose();
    }
    if (dtpicker2 && dtpicker2.dispose) {
        dtpicker2.dispose();
    }
    if (cityPicker2 && cityPicker2.dispose) {
        cityPicker2.dispose();
    }
    if (cityPicker3 && cityPicker3.dispose) {
>>>>>>> ac23a54e09fa706088c679ff5ad1d38c73666e91
        cityPicker3.dispose();
    }
}

<<<<<<< HEAD
/**
 * 显示添加 / 编辑表单
 * @param type
 * @param user
 */
function showBox(type, user) {
    hideAll();
    var btn = type ? "添加" : "编辑";
    $("input[type=submit]").val(btn);
    $("#edit").show();
    initEditBox(user)
}

/**
 * 后退监听
 */
window.addEventListener("popstate", function () {
    console.log(11)
=======
function showBox(type, user) {
    var btn = type ? "添加" : "编辑";
    $("input[type=submit]").val(btn);
    $(".show-canvas-content").hide();
    $("#edit").show();
    initEditBox(user)
}
window.addEventListener("popstate", function () {
>>>>>>> ac23a54e09fa706088c679ff5ad1d38c73666e91
    if (sessionStorage.getItem("reload")){
        sessionStorage.removeItem("reload");
        window.location.reload();
    }else {
        showJiapu()
    }
});

<<<<<<< HEAD
/**
 * 编辑成员
 * @param user
 * @param parent
 */
function editSomeOne(user, parent) {
    if (user) {
        $("#header-edit .mui-title").html("编辑族人")
        $(".mui-control-content").removeClass("mui-active").eq(0).addClass("mui-active");
        $(".zuren").addClass("mui-active");
        $(".spouse ").removeClass("mui-active");
        history.pushState("", document.title, "#edit");
=======
function editSomeOne(user, parent) {
    if (user) {
        history.pushState("", document.title, "#edit")
>>>>>>> ac23a54e09fa706088c679ff5ad1d38c73666e91
        showBox(false, user)
        initUserInfo(user.data)
        submitBtnClick("/api/pedigreePerson/edit", parent, user.data.pedigreePersonId, false);
    }
}

<<<<<<< HEAD
/**
 * 表单提交
 * @param api
 * @param parent
 * @param own
 * @param type
 * @param direct
 */
=======
>>>>>>> ac23a54e09fa706088c679ff5ad1d38c73666e91
function submitBtnClick(api, parent, own, type,direct) {
    $("input").removeAttr("disabled");
    $(".mui-bar").show();
    $("#submit").click(function () {
        mui(this).button('loading');
        setTimeout(function() {
            mui(this).button('reset');
        }.bind(this), 2000);
<<<<<<< HEAD
        var data = $("#info-form").serializeArray();
        var info = {};
        for (var item of data){
            info[item.name] = item.value;
=======
        var info = {};
        var inputs = $("input[type=text]");
        for (var i = 0; i < inputs.length; i++) {
            var name = $(inputs[i]).attr("name");
            if (name) {
                info[name] = $(inputs[i]).val();
            }
        }
        var inputs = $("input[type=radio]:checked");
        for (var i = 0; i < inputs.length; i++) {
            var name = $(inputs[i]).attr("name");
            info[name] = $(inputs[i]).val();
        }
        delete info.addr;
        delete info.spouseAddr;
        if (info.birthDay) {
            info.birthDay = new Date(info.birthDay).getTime();
        }
        if (info.spouseBirthDay) {
            info.spouseBirthDay = new Date(info.spouseBirthDay).getTime();
>>>>>>> ac23a54e09fa706088c679ff5ad1d38c73666e91
        }
        /*添加或编辑*/
        if (type) {
            info.chouseId = own;
            info.createType = direct
        } else {
            info.pedigreePersonId = own;
        }
        info.pedigreeId = pedigreeId;
        postDataToServer(api, JSON.stringify(info), function (res) {
            if (res.code == "SUCCESS") {
<<<<<<< HEAD
                mui.alert("保存成功");
=======
                alert("保存成功");
>>>>>>> ac23a54e09fa706088c679ff5ad1d38c73666e91
                sessionStorage.setItem("reload","reload")
                history.back();
            } else if(res.code == "PleaseLogin") {
                location.href = "login.html"
            }else {
<<<<<<< HEAD
                mui.alert(res.message)
=======
                alert(res.message)
>>>>>>> ac23a54e09fa706088c679ff5ad1d38c73666e91
            }
            console.log(res)
        }, function (error) {
            console.log(error)
        });
    })
}

<<<<<<< HEAD
/**
 * 上传文件
 * @param img
 * @param file
 * @param form
 */
=======

>>>>>>> ac23a54e09fa706088c679ff5ad1d38c73666e91
function upload(img, file, form) {
    img.unbind()
    img.click(function () {
        file.click()
    });
    file.unbind("change")
    file.change(function () {
        var fileSize = $(this)[0].files[0].size;
        console.log(fileSize)
        var path = $(this).val();
        var jiapuImg = new FormData(form[0]);
        jiapuImg.set("fileSize", fileSize);
        $.ajax({
            type: "POST",
            url: urlBase + "/file/fileUpload",
            data: jiapuImg, //FormId
            processData: false, // 告诉jQuery不要去处理发送的数据
            contentType: false, // 告诉jQuery不要去设置Content-Type请求头
            error: function (request) {
<<<<<<< HEAD
                //layer.mui.alert('添加出现异常', {icon: 5});
=======
                //layer.alert('添加出现异常', {icon: 5});
>>>>>>> ac23a54e09fa706088c679ff5ad1d38c73666e91
            },
            success: function (data) {
                if (data.code == 'SUCCESS') {
                    var imgSrc = imgBase + data.result.path+"_crop_28x28";
                    img.attr("src", imgSrc);
                    img.next().val(data.result.path);
                    file.val('')
                    console.log(img.next())
                } else {
                    console.log(data.message);
                }
            }
        });
    })
}
<<<<<<< HEAD
$("input[name=sex]").change(function () {
    var checked = this.value;
    console.log(checked)
    if(checked == "男"){
       $(".spouse").html("媳妇");
   }else {
       $(".spouse").html("婿");
   }
});
$("input[name=survivalMode]").change(function () {
    var checked = this.value;
    console.log(checked)
    if (checked == "活"){
        $(".survivalMode").html("居住地");
        $("#cityResult2").attr("placeholder","居住地");
        $(".phone").show();
    }else {
        $("#cityResult2").attr("placeholder","墓地");
        $(".survivalMode").html("墓地");
        $(".phone").hide();
    }
});
$("input[name=spouseSurvivalMode]").change(function () {
    var checked = this.value;
    console.log(checked)
    if (checked == "活"){
        $(".spouseSurvivalMode").html("居住地");
        $("#cityResult3").attr("placeholder","居住地");
        $(".spousePhone").show();
    }else {
        $(".spouseSurvivalMode").html("墓地");
        $("#cityResult3").attr("placeholder","墓地");
        $(".spousePhone").hide();
    }
});

=======

function initEditBox(user) {
    upload($("#img"), $("#file"), $("#headImg"));
    upload($("#another"), $("#aFile"), $("#aHeadImg"));
    var btns = $(".birth");
    dtpicker = new mui.DtPicker({
        type: "date", //设置日历初始视图模式 
        beginDate: new Date(1900, 0, 1), //设置开始日期
        endDate: new Date(2050, 11, 31), //设置结束日期
    })
    if ($("input[name=birthDay]").val().length > 0) {
        dtpicker.setSelectedValue($("input[name=birthDay]").val())
    }
    btns[0].addEventListener('tap', function () {
        dtpicker.show(function (e) {
            console.log(e);
            $(btns[0]).val(e.text)
        })
    });
    dtpicker2 = new mui.DtPicker({
        type: "date", //设置日历初始视图模式 
        beginDate: new Date(1900, 0, 1), //设置开始日期
        endDate: new Date(2050, 11, 31), //设置结束日期
    });
    btns[1].addEventListener('tap', function () {
        dtpicker2.show(function (e) {
            console.log(e);
            $(btns[1]).val(e.text)
        })
    });
    var _getParam = function (obj, param) {
        return obj[param] || '';
    };
    cityPicker3 = new mui.PopPicker({
        layer: 3
    });
    cityPicker3.setData(city);
    var cityResult3 = $("#cityResult3");
    cityResult3.click(function () {
        cityPicker3.show(function (items) {
            cityResult3.val(_getParam(items[0], 'text') + " " + _getParam(items[1], 'text') + " " +
                _getParam(items[2], 'text'));
            cityResult3.next().val(items[0].text)
            cityResult3.next().next().val(items[1].text)
            cityResult3.next().next().next().val(items[2].text)
        })
    })
    cityPicker2 = new mui.PopPicker({
        layer: 3
    });
    cityPicker2.setData(city);
    var cityResult2 = $("#cityResult2");
    cityResult2.click(function () {
        cityPicker2.show(function (items) {
            cityResult2.val(_getParam(items[0], 'text') + " " + _getParam(items[1], 'text') + " " +
                _getParam(items[2], 'text'));
            cityResult2.next().val(items[0].text)
            cityResult2.next().next().val(items[1].text)
            cityResult2.next().next().next().val(items[2].text)
        })
    })

    if (user) {
        dtpicker.setSelectedValue($("#myBirth").val())
        dtpicker2.setSelectedValue($("#aBirth").val())
        cityPicker2.pickers[0].setSelectedValue(user.xjProvince);
        setTimeout(function () {
            cityPicker2.pickers[1].setSelectedValue(user.xjCity);
            setTimeout(function () {
                cityPicker2.pickers[2].setSelectedValue(user.xjCounty);
            }, 10)
        }, 10);
        cityPicker3.pickers[0].setSelectedValue(user.spouseXjProvince);
        setTimeout(function () {
            cityPicker2.pickers[1].setSelectedValue(user.spouseXjCounty);
            setTimeout(function () {
                cityPicker2.pickers[2].setSelectedValue(user.spouseXjCounty);
            }, 10)
        }, 10);
    }
}
>>>>>>> ac23a54e09fa706088c679ff5ad1d38c73666e91
var cityPicker2, cityPicker3, dtpicker, dtpicker2;
