var R_content = React.createClass({displayName: "R_content",
	cancleDoc:function(){
		history.go(-1);
	},
	componentDidMount:function(){
		var o = this;
		var $modal = $('#my-modal-loading');
		$modal.modal();
		var url = window.location.href;
		var arr = url.split("?id=");
		var readdocid = window.sessionStorage.getItem("readdocid");
		$.ajax({
			type: "post",
			url: hosts + "/post/getPostById",
			data: {
				id:readdocid
			},
			success: function(data) {
				$("#_title").html(data[0].title);
				var s_date = data[0].created_at + "_str";
				s_date = s_date.substring(0,10);
				$("#_date").html(s_date + " 建定工程");
				$("#_post").html(data[0].post);
				$modal.modal('close');
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