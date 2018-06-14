function addSomme(user, parent,direct) {
    $(".mui-control-content").removeClass("mui-active").eq(0).addClass("mui-active");
    history.pushState("", document.title, "#add")
    showBox(true)
    $("#img").attr("src","../img/boy.jpg");
    $("#another").attr("src","../img/girl.jpg");
    $("input[type=text]").val("");
	$("input[type=file]").val("");
    $("input[type=radio]").removeAttr('checked');
    $("input[name=sex][value=男]").prop("checked", "checked");
    $("input[name=survivalMode][value=活]").prop("checked", "checked");
    submitBtnClick("/api/pedigreePerson/add", parent, user.id, true,direct);
}

function showSomeOne(user) {
    history.pushState("", document.title, "#show");
    showBox(false, user)
    initUserInfo(user.data)
    $("input").attr("disabled","disabled");
    $(".mui-bar").hide();
}

function initUserInfo(user) {
    $(".mui-control-content").removeClass("mui-active").eq(0).addClass("mui-active");
    for (var item in user) {
        var input = $("input[name=" + item + "]")
        var type = input.attr("type");
        if (type == "text") {
            $("input[name=" + item + "]").val(user[item]);
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
        cityPicker3.dispose();
    }
}

function showBox(type, user) {
    var btn = type ? "添加" : "编辑";
    $("input[type=submit]").val(btn);
    $(".show-canvas-content").hide();
    $("#edit").show();
    initEditBox(user)
}
window.addEventListener("popstate", function () {
    if (sessionStorage.getItem("reload")){
        sessionStorage.removeItem("reload");
        window.location.reload();
    }else {
        showJiapu()
    }
});

function editSomeOne(user, parent) {
    if (user) {
        history.pushState("", document.title, "#edit")
        showBox(false, user)
        initUserInfo(user.data)
        submitBtnClick("/api/pedigreePerson/edit", parent, user.data.pedigreePersonId, false);
    }
}

function submitBtnClick(api, parent, own, type,direct) {
    $("input").removeAttr("disabled");
    $(".mui-bar").show();
    $("#submit").click(function () {
        mui(this).button('loading');
        setTimeout(function() {
            mui(this).button('reset');
        }.bind(this), 2000);
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
                alert("保存成功");
                sessionStorage.setItem("reload","reload")
                history.back();
            } else if(res.code == "PleaseLogin") {
                location.href = "login.html"
            }else {
                alert(res.message)
            }
            console.log(res)
        }, function (error) {
            console.log(error)
        });
    })
}


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
                //layer.alert('添加出现异常', {icon: 5});
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
var cityPicker2, cityPicker3, dtpicker, dtpicker2;
