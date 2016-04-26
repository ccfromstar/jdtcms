var openid = "";
var readdocid = "";

var R_content = React.createClass({displayName: "R_content",
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
		/*记录用户阅读操作*/

	},
	setLike:function(){
		$.ajax({
			type: "post",
			url: hosts + "/post/setPost",
			data: {
				id:readdocid,
				openid:openid
			},
			success: function(data) {
				
			}
		});
	},
	render:function(){
		return(
			React.createElement("div", {className: "am-g am-g-fixed blog-g-fixed"}, 
				React.createElement("div", {className: "am-u-md-12"}, 
					React.createElement("article", {className: "post-main"}, 
						React.createElement("h3", {id: "_title", className: "am-article-title"}), 
						React.createElement("h4", {id: "_date", className: "am-article-meta blog-meta"}), 
						React.createElement("div", {className: "am-g"}, 
							React.createElement("div", {id: "_post", className: "am-u-sm-12"}
								
							)
						), 
						React.createElement("div", {id: "post_info"}, 
							"阅读 ", React.createElement("span", {id: "read_count"}), React.createElement("span", {onClick: this.setLike.bind(this), id: "thumbs", className: "am-icon-thumbs-o-up"}), "   ", React.createElement("span", {id: "like_count"})
						)
					)
				)
			)
		);
	}
});

/*
 * 数据加载组件
 * */
var R_loading = React.createClass({displayName: "R_loading",
	render:function(){
		return(
			React.createElement("div", {className: "am-modal am-modal-loading am-modal-no-btn", tabIndex: "-1", id: "my-modal-loading"}, 
				React.createElement("div", {className: "am-modal-dialog"}, 
					React.createElement("div", {className: "am-modal-hd"}, "数据加载中..."), 
					React.createElement("div", {className: "am-modal-bd"}, 
						React.createElement("span", {className: "am-icon-spinner am-icon-spin"})
					)
				)
			)
		);
	}
});