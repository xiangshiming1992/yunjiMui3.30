document.write('<script src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js?version=1.1"></script>')
$(document).ready(function(){
				var userInfo = window.localStorage.getItem("userInfo");
				var shareUserId = "";
				if(null != userInfo){
					shareUserId = JSON.parse(userInfo).userId;
				}
        initPage(shareUserId);
    });
    function initPage(shareUserId) {
    	/***用于获得当前连接url用**/
        //alert(window.location.href);
        /***用户点击分享到微信圈后加载接口接口*******/
        $.get("//api.yunji128.com/homage/api/wexin_mp/v_1/config",{"url":window.location.href.split("#")[0]},function(data,status){
            console.log(data.appId+" "+data.timestamp+" "+data.nonceStr+" "+data.signature);
            wx.config({
                debug: false,
                appId: data.appId,
                timestamp:data.timestamp,
                nonceStr:data.nonceStr,
                signature:data.signature,
                jsApiList: [
                    'checkJsApi',
                    'onMenuShareAppMessage',
                    'onMenuShareTimeline',
                    'onMenuShareQQ',
                    'hideOptionMenu',
                ]
            });
            var shareTitle = "一起分享吧！";
            var desc = "分享描述";
            var shareImg = "http://img.yunji128.com/homage/upload/sacrifice/2018/06/75ca75abf4864918b70794d2390d43cc.png";
            var link = "http://wx.yunji128.com/tpl/share.html?shareUserId="+shareUserId;
            
            wx.ready(function(){
            	 /*分享给朋友*/  
		        wx.onMenuShareAppMessage({  
		            title: shareTitle, // 分享标题  
		            desc: desc, // 分享描述  
		            link: link, // 分享链接  
		            imgUrl: shareImg, // 分享图标  
		            type: 'link', // 分享类型,music、video或link，不填默认为link  
		            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空  
		            success: function () {   
		                showMessage("您已分享");  
		            },  
		            cancel: function () {   
		                showMessage('您已取消分享');  
		            }  
		        });
                wx.onMenuShareTimeline({
                    title : shareTitle, // 分享标题
                    link : link, // 分享链接
                    imgUrl : shareImg, // 分享图标
                    success : function() {
                        showMessage("分享成功");
                    },
                    cancel : function() {
                        showMessage("分享取消");
                    }
                });
                wx.onMenuShareQQ({  
		            title: shareTitle, // 分享标题  
		            desc: desc, // 分享描述  
		            link: link, // 分享链接  
		            imgUrl: shareImg, // 分享图标  
		            success: function () {   
		               showMessage("分享成功");
		            },  
		            cancel: function () {   
		              showMessage("分享取消");
		            }  
		        });  
                
                //wx.hideOptionMenu();/***隐藏分享菜单****/
            });
        });
    }