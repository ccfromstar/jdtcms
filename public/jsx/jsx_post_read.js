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