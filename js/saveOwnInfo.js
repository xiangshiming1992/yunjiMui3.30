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
    }
    $("input[type=submit]").click(function () {
        var data = $("#info-form").serializeArray();
        var info = {};
        for (var item of data){
            info[item.name] = item.value;
        }
        console.log(info)
        postDataToServer("/api/pedigree/myPedigreeUserInfoSave", JSON.stringify(info), function (res) {
            if (res.code == "SUCCESS") {
                mui.alert("保存成功",function () {
                    history.back();
                });
            } else {
                mui.alert(res.message)
            }
            console.log(res)
        }, function (error) {
            console.log(error)
        });
    });
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
                    //layer.mui.alert('添加出现异常', {icon: 5});
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
            cityResult3.val(_getParam(items[0], 'text') + " " + _getParam(items[1], 'text') + " " + _getParam(items[2], 'text'));
            $("input[name=spouseXjProvince]").val(items[0].text)
            $("input[name=spouseXjCity]").val(items[1].text)
            $("input[name=spouseXjCounty]").val(items[2].text)
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
            cityResult2.val(_getParam(items[0], 'text') + " " + _getParam(items[1], 'text') + " " + _getParam(items[2], 'text'));
            $("input[name=xjProvince]").val(items[0].text)
            $("input[name=xjCity]").val(items[1].text)
            $("input[name=xjCounty]").val(items[2].text)
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
