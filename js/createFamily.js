$(function () {
    var urlBase = 'http://api.yunji128.com/homage';
    var imgBase = 'http://img.yunji128.com/';

    function upload(img, file, form) {
        img.click(function () {
            file.click()
        });
        file.change(function () {
            // getSize($(this)[0],img[0])
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
                        img.attr("src", imgBase + data.result.path);
                    } else {
                        console.log(data.message);
                    }
                }
            });
        })
    }
    upload($("#img"), $("#file"), $("#jiapuImg"));
    upload($("#jiapu-tt-img"), $("#jiapu-tt-file"), $("#totem"));
    // 	
    var _getParam = function (obj, param) {
        return obj[param] || '';
    };
    var cityPicker3 = new mui.PopPicker({
        layer: 3
    });
    cityPicker3.setData(city);
    var showCityPickerButton = $("#showCityPicker3")[0];
    var cityResult3 = $("#cityResult3");
    cityResult3[0].addEventListener('tap', function (event) {
        cityPicker3.show(function (items) {
            console.log(items)
            cityResult3.val(_getParam(items[0], 'text') + " " + _getParam(
                items[1], 'text') + " " + _getParam(items[2], 'text'));
            //返回 false 可以阻止选择框的关闭
            //return false;
        });
    }, false);
    $(".mui-switch").click(function () {
        var active = $(this).hasClass("mui-active");
        if (!active) {
            $("#password").css('visibility', 'hidden');
			accessPwd = false;
        } else {
			accessPwd = true;
            $("#password").css('visibility', 'visible');
        }
    })
var accessPwd = true;
    $("#create").click(function () {
        var data = {
			"flagPwd":accessPwd,
            "accessPwd": $(".accessPwd").val(),
            "ancestralHall": $(".ancestralHall").val(),
            "church": $(".church").val(),
            "province": "string",
            "city": "string",
            "county": "string",
            "gen": $(".gen").val(),
            "houseRules": $(".houseRules").val(),
            "musicBook": $(".musicBook").val(),
            "surname": $(".surname").val(),
            "totem": $(".totem").attr("src").replace(imgBase,""),
            "zuxun": $(".zuxun").val(),
            "accessPwd":$("#password input").val()
        }
        var addr = $("#cityResult3").val();
        if (addr.length > 0) {
            addr = addr.split(" ")
            data.province = addr[0];
            data.city = addr[1];
            data.county = addr[2];
			postDataToServer("/api/pedigree/add",JSON.stringify(data),function(res){
				if(res.code == "SUCCESS"){
				    localStorage.setItem("jiapu",JSON.stringify(res.result));
					window.location.href="editship.html?pedigreeId="+res.result.pedigreeId;
				}else{
					alert(res.message)
				}
			},function(error){console.log(error)})
        }else{
			alert("请填写祖籍！")
		}
    })

})

