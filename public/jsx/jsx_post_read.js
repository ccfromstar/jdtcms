var openid = "";
var readdocid = "";

var R_content = React.createClass({
	cancleDoc:function(){
		history.go(-1);
	},
	componentDidMount:function(){
		var o = this;
		var $modal = $('#my-modal-loading');
		$modal.modal();

		readdocid = GetQueryString("id");
		openid = GetQueryString("openid");
		$.ajax({
			type: "post",
			url: hosts + "/post/getPostById",
			data: {
				id:readdocid
			},
			success: function(data) {
				$("#_title").html(data[0].title);
				$("title").html(data[0].title);
				var s_date = data[0].created_at + "_str";
				s_date = s_date.substring(0,10);
				$("#_date").html(s_date + " 建定工程");
				$("#_post").html(data[0].post);
				$("#read_count").html(data[0].read_count);
				$("#like_count").html(data[0].like_count);
				//修复图片，表格太宽的问题
				$(".post-main").find("img").css("max-width","100%");
				$(".post-main").find("table").css("width","100%");
				$modal.modal('close');
			}
		});
		$("#thumbs").bind("click",function(){
			if(!openid){
				alert("请在微信中打开");return false;
			}
			$.ajax({
				type: "post",
				url: hosts + "/post/setPost",
				data: {
					id:readdocid,
					openid:openid
				},
				success: function(data) {
					if(data == "300"){
						var like_count = Number($("#like_count").html());
						$("#like_count").html(like_count+1);
					}else{
						alert("不能重复点赞");
					}
				}
			});
		});
			/*微信jssdk配置部分*/
			wx.config({
				debug: false,
				appId: GetQueryString("appId"),
				timestamp: GetQueryString("timestamp"),
				nonceStr: GetQueryString("nonceStr"),
				signature: GetQueryString("signature"),
				jsApiList: [
					'checkJsApi',
					'onMenuShareTimeline',
					'onMenuShareAppMessage',
					'onMenuShareQQ',
					'onMenuShareWeibo',
					'onMenuShareQZone',
					'hideMenuItems',
					'showMenuItems',
					'hideAllNonBaseMenuItem',
					'showAllNonBaseMenuItem',
					'translateVoice',
					'startRecord',
					'stopRecord',
					'onVoiceRecordEnd',
					'playVoice',
					'onVoicePlayEnd',
					'pauseVoice',
					'stopVoice',
					'uploadVoice',
					'downloadVoice',
					'chooseImage',
					'previewImage',
					'uploadImage',
					'downloadImage',
					'getNetworkType',
					'openLocation',
					'getLocation',
					'hideOptionMenu',
					'showOptionMenu',
					'closeWindow',
					'scanQRCode',
					'chooseWXPay',
					'openProductSpecificView',
					'addCard',
					'chooseCard',
					'openCard'
				]
			});
			wx.error(function(res) {
				alert(res.errMsg);
			});
			wx.ready(function() {
				wx.onMenuShareAppMessage({
					title: '关于邮轮产品的投票',
					desc: '一年一度的邮轮旅游季又来了，陈叔叔需要您的宝贵意见！',
					link: 'http://www.4000191177.com/weixin_js',
					imgUrl: 'http://www.4000191177.com/img/f20140823172412133878.jpg',
					trigger: function(res) {
						// 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
						alert('用户点击发送给朋友');
					},
					success: function(res) {
						alert('已分享');
					},
					cancel: function(res) {
						alert('已取消');
					},
					fail: function(res) {
						alert(JSON.stringify(res));
					}
				});
				wx.onMenuShareTimeline({
					title: '关于邮轮产品的投票',
					desc: '一年一度的邮轮旅游季又来了，陈叔叔需要您的宝贵意见！',
					link: 'http://www.4000191177.com/weixin_js',
					imgUrl: 'http://www.4000191177.com/img/f20140823172412133878.jpg',
					trigger: function(res) {
						// 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回
						alert('用户点击发送给朋友');
					},
					success: function(res) {
						alert('已分享');
						//alert("恭喜您分享成功！陈叔叔根据您的投票为您推荐了一个合适的产品！");
						//window.location = 'http://wap.huiyoulun.com/detail/1539';
						share = 1;
					},
					cancel: function(res) {
						alert('已取消');
					},
					fail: function(res) {
						alert(JSON.stringify(res));
					}
				});
			});
	},
	render:function(){
		return(
			<div className="am-g am-g-fixed blog-g-fixed">
				<div className="am-u-md-12">
					<article className="post-main">
						<h3 id="_title" className="am-article-title"></h3>
						<h4 id="_date" className="am-article-meta blog-meta"></h4>
						<div className="am-g">
							<div id="_post" className="am-u-sm-12">
								
							</div>
						</div>
						<div id="post_info">
							阅读 <span id="read_count"></span><span id='thumbs' className="am-icon-thumbs-o-up"></span>   <span id="like_count"></span>
						</div>
					</article>
				</div>
			</div>
		);
	}
});

/*
 * 数据加载组件
 * */
var R_loading = React.createClass({
	render:function(){
		return(
			<div className="am-modal am-modal-loading am-modal-no-btn" tabIndex="-1" id="my-modal-loading">
				<div className="am-modal-dialog">
					<div className="am-modal-hd">数据加载中...</div>
					<div className="am-modal-bd">
						<span className="am-icon-spinner am-icon-spin"></span>
					</div>
				</div>
			</div>
		);
	}
});