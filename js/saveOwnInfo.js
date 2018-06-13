$(function () {
    var user = window.localStorage.getItem("userInfo");
    if (user) {
        user = JSON.parse(user);
        user = localStorage.getItem(user.userId + "jiapuInfo");
    }
    if (user) {
        user = JSON.parse(user);
        for (var item in user) {
            var input = $("input[name=" + item + "]")
            var type = input.attr("type");
            if (type == "text") {
                $("input[name=" + item + "]").val(user[item]);
            } else if (type == "radio") {
                $("input[name=" + item + "][value='" + user[item] + "']").prop("checked", "checked");
            }
            if (item == "headImg" || item == "spouseHeadImg") {
                input.prev().attr("src", imgBase+ user[item].replace(imgBase,""))
            }
        }
        $("input[name=addr]").val(user.xjProvince + " " + user.xjCity + " " + user.xjCounty);
        $("input[name=spouseAddr]").val(user.spouseXjProvince + " " + user.spouseXjCity + " " + user.spouseXjCounty);
        // var headImgUrl = imgBase + user.headImg;
        // $("input[name=headImg]").prev().attr("src", headImgUrl);
        // $("input[name=headImg]").val(user.headImg)
        // $("input[name=spouseHeadImg]").prev().attr("src",imgBase +  user.spouseHeadImg);
        // $("input[name=sex][value=" + user.sex + "]").prop("checked", "checked");
    }
    $("input[type=submit]").click(function () {
        var data = $("#info-form").serializeArray();
        var addr = $("input[name=addr]").val().split(" ");
        var spouseAddr = $("input[name=spouseAddr]").val().split(" ");
        var info = {
            "birthDay": $("input[name=birthDay]").val(),
            "headImg": $("input[name=headImg]").val(),
            "name": $("input[name=name]").val(),
            "phone": $("input[name=phone]").val(),
            "remark": $("input[name=birthDay]").val(),
            "sex": $("input[name=sex]:checked").val(),
            "spouseBirthDay": $("input[name=spouseBirthDay]").val(),
            "spouseHeadImg": $("input[name=spouseHeadImg]").val(),
            "spouseName": $("input[name=spouseName]").val(),
            "spousePhone": $("input[name=spousePhone]").val(),
            "spouseXjCity": spouseAddr[1],
            "spouseXjCounty": spouseAddr[2],
            "spouseXjProvince": spouseAddr[0],
            "xjCity": addr[1],
            "xjCounty": addr[2],
            "xjProvince": addr[0]
        };
        if (info.birthDay) {
            info.birthDay = new Date(info.birthDay).getTime();
        }
        if (info.spouseBirthDay) {
            info.spouseBirthDay = new Date(info.spouseBirthDay).getTime();
        }
        console.log(info)
        postDataToServer("/api/pedigree/myPedigreeUserInfoSave", JSON.stringify(info), function (res) {
            if (res.code == "SUCCESS") {
                alert("保存成功")
                history.back();
            } else {
                alert(res.message)
            }
            console.log(res)
        }, function (error) {
            console.log(error)
        });
    })


    function upload(img, file, form) {
        img.click(function () {
            file.click()
        });
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
                        var imgSrc = imgBase + data.result.path+"_crop_42x42";
                        img.attr("src", imgSrc);
                        img.next().val(data.result.path);
                        console.log(img.next())
                    } else {
                        console.log(data.message);
                    }
                }
            });
        })
    }

    upload($("#img"), $("#file"), $("#headImg"));
    upload($("#another"), $("#aFile"), $("#aHeadImg"));
    var btns = $(".birth");
    var dtpicker = new mui.DtPicker({
        type: "date", //设置日历初始视图模式
        beginDate: new Date(1900, 0, 1), //设置开始日期
        endDate: new Date(2050, 12, 31), //设置结束日期
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
    var dtpicke2 = new mui.DtPicker({
        type: "date", //设置日历初始视图模式
        beginDate: new Date(1900, 0, 1), //设置开始日期
        endDate: new Date(2050, 11, 31), //设置结束日期
    });
    btns[1].addEventListener('tap', function () {
        dtpicke2.show(function (e) {
            console.log(e);
            $(btns[1]).val(e.text)
        })
    });
    var _getParam = function (obj, param) {
        return obj[param] || '';
    };
    var cityPicker3 = new mui.PopPicker({
        layer: 3
    });
    cityPicker3.setData(city);
    var cityResult3 = $("#cityResult3");
    cityResult3.click(function () {
        cityPicker3.show(function (items) {
            cityResult3.val(_getParam(items[0], 'text') + " " + _getParam(items[1], 'text') +
                " " + _getParam(items[2], 'text'));
        })
    })
    var cityPicker2 = new mui.PopPicker({
        layer: 3
    });
    cityPicker2.setData(city);
    console.log(user)
    var cityResult2 = $("#cityResult2");
    cityResult2.click(function () {
        cityPicker2.show(function (items) {
            cityResult2.val(_getParam(items[0], 'text') + " " + _getParam(items[1], 'text') +
                " " + _getParam(items[2], 'text'));
        })
    })
    if (user) {
        cityPicker2.pickers[0].setSelectedValue(user.xjProvince);
        setTimeout(function () {
            cityPicker2.pickers[1].setSelectedValue(user.xjCity);
            setTimeout(function () {
                cityPicker2.pickers[2].setSelectedValue(user.xjCounty);
            }, 10)
        }, 10)

        cityPicker3.pickers[0].setSelectedValue(user.jxProvince);
        setTimeout(function () {
            cityPicker3.pickers[1].setSelectedValue(user.jxCity);
            setTimeout(function () {
                cityPicker3.pickers[2].setSelectedValue(user.jxCounty);
            }, 10)
        }, 10);
    }
})
