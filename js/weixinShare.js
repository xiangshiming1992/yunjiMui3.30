document.write('<script src="//res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>')
if(!jQuery) {
	document.write('<script src="https://cdn.bootcss.com/jquery/1.12.4/jquery.js"></script>')
}
document.write('<script src="https://cdn.bootcss.com/clipboard.js/1.7.1/clipboard.js"></script>')
document.write('<script src="../js/copy.js"></script>')

$(document).ready(function() {
	var userInfo = window.localStorage.getItem("userInfo");
	var shareUserId = "";
	if(null != userInfo) {
		shareUserId = JSON.parse(userInfo).userId;
	}
	initPage(shareUserId);
	var inputs = $('<input type="text" value="3D3C7C41RR" style="position: absolute;top: 0;opacity: 0;" readonly="readonly" id="copyTxt"/><div  class="overPay_li_Info_item_btn " id="copyBtn" onclick="copyTxtFun(\'copyBtn\')" data-clipboard-action="copy" data-clipboard-target="#copyTxt"></div>')
	$("body").append(inputs);
	var copy = true;
	jQuery("body").on("click", function(e) {
		if(copy ===true){
			copy=false;
			$("#copyBtn").click()
		}
	});
});

function initPage(shareUserId) {
	/***用于获得当前连接url用**/
	//alert(window.location.href);
	/***用户点击分享到微信圈后加载接口接口*******/
	$.get("//api.yunji128.com/homage/api/wexin_mp/v_1/config", {
		"url": window.location.href.split("#")[0]
	}, function(data, status) {
		console.log(data.appId + " " + data.timestamp + " " + data.nonceStr + " " + data.signature);
		wx.config({
			debug: false,
			appId: data.appId,
			timestamp: data.timestamp,
			nonceStr: data.nonceStr,
			signature: data.signature,
			jsApiList: [
				'checkJsApi',
				'onMenuShareAppMessage',
				'onMenuShareTimeline',
				'onMenuShareQQ',
				'hideOptionMenu',
				'getLocation',
				'openLocation'
			]
		});
		var shareTitle = "一起分享吧！";
		var desc = "分享描述";
		var shareImg = "http://img.yunji128.com/homage/upload/sacrifice/2018/06/75ca75abf4864918b70794d2390d43cc.png";
		var link = "http://wx.yunji128.com/tpl/share.html?shareUserId=" + shareUserId;
		wx.ready(function() {
			/*分享给朋友*/
			wx.onMenuShareAppMessage({
				title: shareTitle, // 分享标题  
				desc: desc, // 分享描述  
				link: link, // 分享链接  
				imgUrl: shareImg, // 分享图标  
				type: 'link', // 分享类型,music、video或link，不填默认为link  
				dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空  
				success: function() {
					showMessage("您已分享");
				},
				cancel: function() {
					showMessage('您已取消分享');
				}
			});
			wx.onMenuShareTimeline({
				title: shareTitle, // 分享标题
				link: link, // 分享链接
				imgUrl: shareImg, // 分享图标
				success: function() {
					showMessage("分享成功");
				},
				cancel: function() {
					showMessage("分享取消");
				}
			});
			wx.onMenuShareQQ({
				title: shareTitle, // 分享标题  
				desc: desc, // 分享描述  
				link: link, // 分享链接  
				imgUrl: shareImg, // 分享图标  
				success: function() {
					showMessage("分享成功");
				},
				cancel: function() {
					showMessage("分享取消");
				}
			});
			//wx.hideOptionMenu();/***隐藏分享菜单****/
		});
	});
}